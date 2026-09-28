const {chromium}=require('C:/Users/jafer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
 const p=await browser.newPage({viewport:{width:1100,height:800}});
 try{
  await p.goto('http://127.0.0.1:8000/');await p.locator('#create').click();await p.waitForFunction(()=>document.querySelector('#landing').hidden);await p.locator('#world').focus();
  async function go(x,z){let i=0;for(;i<150;i++){const s=await p.evaluate(()=>somewhereDiagnostics());const vx=x-s.local.x,vz=z-s.local.z;if(Math.hypot(vx,vz)<1.1)break;const dx=vx*Math.cos(.35)-vz*Math.sin(.35),dz=vx*Math.sin(.35)+vz*Math.cos(.35),m=Math.max(Math.abs(dx),Math.abs(dz));const keys=['Shift'];if(Math.abs(dx)>m*.42)keys.push(dx>0?'d':'a');if(Math.abs(dz)>m*.42)keys.push(dz>0?'s':'w');for(const key of keys)await p.keyboard.down(key);await p.waitForTimeout(180);for(const key of keys)await p.keyboard.up(key);}assert(i<150,`Could not walk to ${x},${z}`);console.log('WAYPOINT',x,z);}
  for(const xy of [[1,8],[-10,1],[-23,-12],[-35,-24]])await go(...xy);
  assert.equal((await p.evaluate(()=>somewhereDiagnostics())).zone,'The tea hills');await p.screenshot({path:'tea-hills-test.png'});console.log('PASS walkable tea hills');
  for(const xy of [[-23,-12],[-10,1],[1,8],[12,2],[25,-6],[35,-13]])await go(...xy);
  assert.equal((await p.evaluate(()=>somewhereDiagnostics())).zone,'The old coast');await p.screenshot({path:'old-coast-test.png'});console.log('PASS walkable coastal town');
  await p.setViewportSize({width:390,height:844});await p.screenshot({path:'mobile-test.png'});
  const overlap=await p.evaluate(()=>{const help=document.querySelector('#help').getBoundingClientRect(),session=document.querySelector('.session').getBoundingClientRect();return !(help.bottom<=session.top||help.left>=session.right||help.right<=session.left||help.top>=session.bottom);});assert(!overlap);console.log('PASS mobile controls do not overlap');
  await p.locator('#leave').click();await p.screenshot({path:'mobile-landing-test.png'});console.log('EXPLORATION TESTS PASSED');
 }catch(e){console.error(e);await p.screenshot({path:'exploration-failure.png'});process.exitCode=1;}finally{await browser.close();}
})();
