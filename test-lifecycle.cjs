// Real browsers/services, with failure injection at the PeerJS/media boundary.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium, baseUrl, artifact, launchOptions } = require('./test-support.cjs');
const source = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const instrumentation = `<script>
window.testPeers=[];window.testCalls=[];window.testStreams=[];
const OriginalPeer=window.Peer;
window.Peer=class extends OriginalPeer {
  constructor(...args){super(...args);testPeers.push(this);}
  call(...args){const call=super.call(...args);if(call)testCalls.push(call);return call;}
};
const originalMic=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
navigator.mediaDevices.getUserMedia=async options=>{
  const stream=await originalMic(options);testStreams.push(stream);
  if(window.testDelayMic)await new Promise(resolve=>window.testReleaseMic=resolve);
  return stream;
};
</script>`;

(async () => {
  const browser = await chromium.launch(launchOptions);
  const pages = [], errors = [];
  async function page() {
    const context = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1100, height: 800 } });
    const p = await context.newPage(); pages.push(p);
    p.on('pageerror', e => errors.push(e.message));
    // Insert only the test harness between the real CDN libraries and app code.
    await p.route(baseUrl, route => route.fulfill({ contentType: 'text/html', body: source.replace(/<script>\s*'use strict';/, instrumentation + "<script>\n'use strict';") }));
    await p.goto(baseUrl);
    await p.waitForFunction(() => typeof somewhereDiagnostics === 'function');
    return p;
  }
  const diag = p => p.evaluate(() => somewhereDiagnostics());
  const connected = p => p.waitForFunction(() => somewhereDiagnostics().connected, null, { timeout: 50000 });
  const voice = p => p.waitForFunction(() => somewhereDiagnostics().voice.receiving, null, { timeout: 30000 });
  const failCall = p => p.evaluate(() => testCalls.at(-1).emit('error', new Error('Injected media failure')));
  async function tracksMuted(p) {
    assert(await p.evaluate(() => testStreams.at(-1).getAudioTracks().every(t => !t.enabled)));
  }
  try {
    const a = await page(); await a.locator('#create').click();
    await a.waitForFunction(() => document.querySelector('#landing').hidden);
    const room = (await diag(a)).room;
    const b = await page(); await b.locator('#roomInput').fill(room); await b.locator('#join').click();
    await connected(a); await connected(b); await voice(a); await voice(b);

    await failCall(a);
    await a.locator('#retryVoice').waitFor({ state: 'visible' });
    const callsBeforeMute = await a.evaluate(() => testCalls.length);
    await a.locator('#mic').click();
    assert((await diag(a)).voice.muted); await tracksMuted(a);
    assert.equal(await a.evaluate(() => testCalls.length), callsBeforeMute);
    assert(await a.locator('#retryVoice').isVisible());
    await a.locator('#chatInput').fill('Chat survives media failure'); await a.locator('#sendChat').click();
    await b.getByText('Chat survives media failure', { exact: false }).waitFor();
    console.log('PASS failed voice can mute immediately without starting a call; chat survives');

    await a.setViewportSize({ width: 390, height: 844 });
    assert(await a.locator('#retryVoice').evaluate(button => {
      const rect = button.getBoundingClientRect(), panel = button.closest('.chat').getBoundingClientRect();
      return rect.left >= panel.left && rect.right <= panel.right && rect.bottom <= panel.bottom;
    }));
    await a.screenshot({ path: artifact('mobile-voice-retry.png') });
    await a.locator('#retryVoice').click(); await voice(a); await voice(b);
    await tracksMuted(a); assert((await diag(a)).voice.muted);
    assert(await a.locator('#retryVoice').isHidden());
    await a.locator('#mic').click(); assert(!(await diag(a)).voice.muted);
    console.log('PASS explicit retry restores voice, preserves mute, and fits mobile panel');

    await a.evaluate(() => testPeers.at(-1).disconnect());
    assert((await diag(a)).connected);
    if (!(await a.locator('#chatInput').isVisible())) await a.locator('#chatToggle').click();
    await a.locator('#chatInput').fill('Chat survives signaling loss'); await a.locator('#sendChat').click();
    await b.getByText('Chat survives signaling loss', { exact: false }).waitFor();
    await a.waitForFunction(() => testPeers.at(-1).open, null, { timeout: 20000 });
    console.log('PASS signaling reconnect preserves existing data channel');

    await b.evaluate(() => testPeers.at(-1).destroy());
    await b.waitForFunction(() => !somewhereDiagnostics().connected && !somewhereDiagnostics().voice.call);
    assert.equal((await diag(b)).connection.rtc, 'closed');
    assert.equal((await diag(b)).connection.ice, 'closed');
    assert(!(await diag(b)).remote.visible);
    assert(await b.locator('#chatInput').isDisabled()); assert(await b.locator('#retryVoice').isHidden());
    await a.waitForFunction(() => !somewhereDiagnostics().connected);
    await b.locator('#help summary').click(); await b.locator('#reconnect').click();
    await connected(a); await connected(b); await voice(a); await voice(b);
    console.log('PASS peer destruction cleans up data/avatar/voice; guest reconnects');

    await failCall(a); await a.locator('#retryVoice').waitFor({ state: 'visible' });
    const oldCalls = await a.evaluate(() => {
      document.querySelector('#retryVoice').click();document.querySelector('#leave').click();return testCalls.length;
    });
    await a.waitForTimeout(900);
    assert.equal(await a.evaluate(() => testCalls.length), oldCalls);
    assert(!(await diag(a)).connected); assert(!(await diag(a)).voice.call);
    assert(await a.evaluate(() => testStreams.every(s => s.getTracks().every(t => t.readyState === 'ended'))));
    console.log('PASS leaving cancels queued voice retry and stops microphone tracks');

    const c = await page(); await c.evaluate(() => window.testDelayMic = true); await c.locator('#create').click();
    await c.waitForFunction(() => document.querySelector('#landing').hidden && typeof testReleaseMic === 'function');
    await c.locator('#leave').click(); await c.evaluate(() => testReleaseMic());
    await c.waitForFunction(() => testStreams.every(s => s.getTracks().every(t => t.readyState === 'ended')));
    assert(!(await diag(c)).voice.microphone); assert(!(await diag(c)).voice.call);
    console.log('PASS microphone permission resolving after leave releases all tracks');
    assert.deepEqual(errors, []); console.log('LIFECYCLE TESTS PASSED');
  } catch (error) {
    console.error(error); process.exitCode = 1;
    for (const [i, p] of pages.entries()) {
      console.error('PAGE', i, await diag(p).catch(() => null));
      await p.screenshot({ path: artifact(`lifecycle-failure-${i}.png`) }).catch(() => {});
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
