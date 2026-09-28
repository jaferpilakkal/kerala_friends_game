// Development-only verification. The application itself is entirely index.html.
const { chromium } = require('C:/Users/jafer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const assert = require('assert/strict');
const baseUrl = process.env.TEST_URL || 'http://127.0.0.1:8000/';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
 const errors=[];const contexts=[];
 async function page(mic=true){const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:mic?['microphone']:[]});contexts.push(context);await context.addInitScript(()=>{window.rtcConnections=[];const Original=window.RTCPeerConnection;window.RTCPeerConnection=class extends Original{constructor(...args){super(...args);window.rtcConnections.push(this);}};});if(!mic)await context.addInitScript(()=>{navigator.mediaDevices.getUserMedia=()=>Promise.reject(new DOMException('Permission denied in test','NotAllowedError'));});const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',msg=>{if(msg.type()==='error')console.log('BROWSER ERROR:',msg.text());});await p.goto(baseUrl,{waitUntil:'networkidle'});await p.waitForFunction(()=>typeof somewhereDiagnostics==='function');return p;}
 async function diag(p){return p.evaluate(()=>somewhereDiagnostics());}
 async function connected(p){await p.waitForFunction(()=>somewhereDiagnostics().connected,{timeout:30000});}
 async function move(p,key,ms=1000){await p.locator('#world').focus();await p.keyboard.down(key);await p.waitForTimeout(ms);await p.keyboard.up(key);await p.waitForTimeout(400);}
 async function audio(p){return p.evaluate(async()=>{let bytes=0,packets=0;const states=[];for(const pc of rtcConnections){states.push(pc.connectionState);for(const r of (await pc.getStats()).values())if(r.type==='inbound-rtp'&&r.kind==='audio'){bytes+=r.bytesReceived||0;packets+=r.packetsReceived||0;}}return {bytes,packets,states};});}
 try{
 const a=await page();await a.screenshot({path:'landing-test.png'});await a.locator('#nameInput').fill('Anu');await a.locator('#create').click();await a.waitForFunction(()=>somewhereDiagnostics().room&&document.querySelector('#landing').hidden,{timeout:30000});const room=(await diag(a)).room;console.log('ROOM',room);
 const b=await page();await b.locator('#nameInput').fill('Dev');await b.locator('#roomInput').fill(room);await b.locator('#join').click();await connected(a);await connected(b);console.log('CONNECTED',JSON.stringify([await diag(a),await diag(b)]));
 await move(a,'w');const ad=await diag(a),bd=await diag(b);assert(Math.abs(ad.local.z-19)>1);assert(Math.hypot(ad.local.x-bd.remote.x,ad.local.z-bd.remote.z)<.5);console.log('PASS A movement sync');
 await move(b,'d');const ad2=await diag(a),bd2=await diag(b);assert(Math.abs(bd2.local.x-1.5)>1);assert(Math.hypot(bd2.local.x-ad2.remote.x,bd2.local.z-ad2.remote.z)<.5);console.log('PASS B movement sync');
 await a.locator('#chatInput').fill('Hello from the backwaters');await a.locator('#sendChat').click();await b.getByText('Hello from the backwaters',{exact:false}).waitFor();await b.locator('#chatInput').fill('Meet you at the jetty');await b.locator('#sendChat').click();await a.getByText('Meet you at the jetty',{exact:false}).waitFor();console.log('PASS bidirectional chat');
 await a.waitForFunction(()=>somewhereDiagnostics().voice.receiving,{timeout:30000});await b.waitForFunction(()=>somewhereDiagnostics().voice.receiving,{timeout:30000});await a.waitForTimeout(3500);const auA=await audio(a),auB=await audio(b);console.log('AUDIO',JSON.stringify([auA,auB]));assert(auA.bytes>0&&auB.bytes>0);assert(auA.packets>0&&auB.packets>0);console.log('PASS real bidirectional audio RTP');
 await a.locator('#mic').click();assert((await diag(a)).voice.muted);await a.locator('#mic').click();assert(!(await diag(a)).voice.muted);console.log('PASS mute/unmute');
 await a.screenshot({path:'world-test.png'});
 const c=await page(false);await c.locator('#roomInput').fill(room);await c.locator('#join').click();await c.locator('#landingMessage').filter({hasText:'already has two people'}).waitFor({timeout:30000});console.log('PASS room full');
 await b.locator('#leave').click();await a.waitForFunction(()=>!somewhereDiagnostics().connected);console.log('PASS graceful disconnect');
 await c.locator('#join').click();await connected(c);await connected(a);assert(!(await diag(c)).voice.microphone);await c.locator('#chatInput').fill('No microphone, still here');await c.locator('#sendChat').click();await a.getByText('No microphone, still here',{exact:false}).waitFor();console.log('PASS mic-denied fallback and replacement guest');
 await c.waitForFunction(()=>somewhereDiagnostics().voice.receiving,{timeout:30000});console.log('PASS listen-only guest');
 await c.locator('#leave').click();await c.locator('#roomInput').fill('ZZZZZZ');await c.locator('#join').click();await c.locator('#landingMessage').filter({hasText:/Room not found|Could not connect/}).waitFor({timeout:30000});console.log('PASS missing room');
 await a.setViewportSize({width:390,height:844});await a.screenshot({path:'mobile-test.png'});console.log('DIAGNOSTICS',JSON.stringify(await diag(a)));assert.deepEqual(errors,[]);console.log('ALL TESTS PASSED');
 }catch(e){console.error('TEST FAILED',e);for(let i=0;i<contexts.length;i++)for(const p of contexts[i].pages()){console.error('PAGE',i,await p.locator('body').innerText().catch(()=>''));await p.screenshot({path:`failure-${i}.png`}).catch(()=>{});}process.exitCode=1;}finally{await browser.close();}
})();
