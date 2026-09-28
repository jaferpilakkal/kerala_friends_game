const {chromium,baseUrl,artifact,launchOptions}=require('./test-support.cjs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch(launchOptions),contexts=[],errors=[];
 async function page(name){const c=await browser.newContext({viewport:{width:1440,height:1000},permissions:['microphone']});contexts.push(c);const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(baseUrl);await p.locator('#nameInput').fill(name);await p.waitForFunction(()=>typeof somewhereDiagnostics==='function');return p;}
 const diag=p=>p.evaluate(()=>somewhereDiagnostics());
 async function travel(p,destination){await p.locator('#travel').click();await p.locator(`[data-destination="${destination}"]`).click();await p.waitForFunction(()=>document.querySelector('#travelPanel').hidden);}
 async function phase(p,value){await p.waitForFunction(value=>somewhereDiagnostics().activity?.phase===value,value,{timeout:12000});}
 try{
  const a=await page('Anu');await a.locator('#create').click();await a.waitForFunction(()=>somewhereDiagnostics().room&&document.querySelector('#landing').hidden);const code=(await diag(a)).room;
  const b=await page('Dev');await b.locator('#roomInput').fill(code);await b.locator('#join').click();
  for(const p of [a,b])await p.waitForFunction(()=>somewhereDiagnostics().connected&&somewhereDiagnostics().voice.receiving,null,{timeout:50000});
  await a.locator('#emotes').click();await a.locator('[data-emote="wave"]').click();await b.waitForFunction(()=>somewhereDiagnostics().remote.emote==='wave');console.log('PASS emote delivered and animated');
  await travel(a,'hills');assert.equal((await diag(a)).zone,'The tea hills');
  await b.waitForFunction(()=>somewhereDiagnostics().voice.outOfEarshot);assert.equal((await diag(b)).voice.gain,0);assert((await diag(a)).voice.call);console.log('PASS quick travel and distant voice silence');
  await a.waitForTimeout(1300);await travel(a,'coast');assert.equal((await diag(a)).zone,'The old coast');
  await a.waitForTimeout(1300);await travel(a,'backwaters');await travel(b,'backwaters');
  for(const p of [a,b]){await p.waitForFunction(()=>somewhereDiagnostics().voice.gain>.95);await p.locator('#interact').click();await p.locator('#activityMain').click();}
  await a.locator('#activityMain').filter({hasText:'Start five questions'}).waitFor();await a.locator('#activityMain').click();
  for(let round=0;round<5;round++){
   await phase(a,'question');await phase(b,'question');const first=(await diag(a)).activity,second=(await diag(b)).activity;assert.deepEqual(first.question,second.question);assert.equal(first.correct,null);assert.equal(second.correct,null);
   await a.locator('[data-choice="0"]').click();await b.locator('[data-choice="1"]').click();await phase(a,'reveal');await phase(b,'reveal');
   assert.deepEqual((await diag(a)).activity.scores,(await diag(b)).activity.scores);
   if(round===0){await a.screenshot({path:artifact('social-desktop.png')});}
   await a.locator('#activityMain').click();
  }
  await phase(a,'finished');await phase(b,'finished');console.log('PASS complete shared game, identical scores and results');
  await a.setViewportSize({width:390,height:844});await a.screenshot({path:artifact('social-mobile.png')});
  const panel=await a.locator('#activityPanel').boundingBox();assert(panel.x>=0&&panel.x+panel.width<=390&&panel.y+panel.height<=844);assert(await a.locator('#closeActivity').isVisible());
  await a.locator('#activityMain').click();await phase(b,'question');await b.locator('#closeActivity').click();await a.waitForFunction(()=>somewhereDiagnostics().activity===null);console.log('PASS replay and leaving clears both seats');
  await a.locator('#activityMain').click();await b.locator('#interact').click();await b.locator('#activityMain').click();await a.locator('#activityMain').filter({hasText:'Start five questions'}).waitFor();await a.locator('#activityMain').click();await phase(b,'question');
  await b.locator('#leave').click();await a.waitForFunction(()=>!somewhereDiagnostics().connected&&somewhereDiagnostics().activity===null);console.log('PASS disconnect cancels activity');
  await a.emulateMedia({reducedMotion:'reduce'});await a.locator('#emotes').click();await a.locator('[data-emote="sit"]').click();
  await a.locator('#world').focus();await a.keyboard.down('w');await a.waitForFunction(()=>somewhereDiagnostics().local.emote===null);await a.keyboard.up('w');
  await a.locator('#chatToggle').click();await a.screenshot({path:artifact('social-mobile-chat.png')});
  assert.deepEqual(errors,[]);console.log('SOCIAL TESTS PASSED');
 }catch(e){console.error(e);for(let i=0;i<contexts.length;i++)for(const p of contexts[i].pages()){console.error('STATE',i,JSON.stringify(await diag(p).catch(()=>null)));await p.screenshot({path:artifact(`social-failure-${i}.png`)}).catch(()=>{});}process.exitCode=1;}finally{await browser.close();}
})();
