// Checks TURN allocation without allowing a direct connection to hide a broken relay.
// Uses exactly the ICE servers configured in index.html. No addresses are logged.
const { chromium, launchOptions } = require('./test-support.cjs');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, 'index.html'), 'utf8');
const options = Function(`return (${source.match(/const PEER_OPTIONS = (\{[\s\S]*?\n  \});/)[1]})`)();
(async () => {
  const browser = await chromium.launch(launchOptions);
  try {
    const page = await browser.newPage();
    const results = await page.evaluate(async servers => Promise.all(servers.map(server => new Promise(async resolve => {
      const pc = new RTCPeerConnection({iceServers:[server],iceTransportPolicy:'relay'});
      const result = {url:server.urls,relayCandidates:0,errors:[]};
      let finished = false;
      const finish = () => { if(finished)return;finished=true;clearTimeout(timer);pc.close();resolve(result); };
      const timer = setTimeout(finish,20000);
      pc.onicecandidate = e => {if(e.candidate?.type==='relay')result.relayCandidates++;if(!e.candidate)finish();};
      pc.onicecandidateerror = e => result.errors.push({code:e.errorCode,message:e.errorText});
      try {pc.createDataChannel('probe');await pc.setLocalDescription(await pc.createOffer());}
      catch(e){result.errors.push({message:e.message});finish();}
    }))), options.config.iceServers.filter(s=>/^turns?:/.test(s.urls)));
    console.log(JSON.stringify(results,null,2));
    if(!results.some(r=>r.relayCandidates>0))process.exitCode=1;
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
