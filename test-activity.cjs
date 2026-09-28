// Exercise the shipped, DOM-independent rules, including duplicate/stale actions.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {webcrypto} = require('node:crypto');
const html = fs.readFileSync(require('node:path').join(__dirname,'index.html'),'utf8');
const rules = html.split('// === ACTIVITY RULES')[1].split('// === SOCIAL WORLD')[0];
const sandbox = {crypto:webcrypto};
vm.runInNewContext('// '+rules+'\nglobalThis.Manager=ActivityManager;globalThis.quiz=TEA_QUIZ;',sandbox);
let now=1000,changes=0;
const manager = new sandbox.Manager(sandbox.quiz,()=>changes++,()=>now);
const act=(action,actor='host',extra={})=>manager.act({action,game:manager.game?.id,round:manager.game?.index,...extra},actor,true);
assert.equal(manager.act({action:'join'},'host',false),false);
assert(act('join'));assert.equal(act('join'),false);assert.equal(act('start'),false);
assert(act('join','guest'));assert.equal(act('start','guest'),false);assert(act('start'));
const originalId=manager.game.id;
for(let round=0;round<5;round++){
  const q=sandbox.quiz[manager.game.order[round]];
  const before=manager.snapshot('guest');
  assert.equal(before.game.correct,null);assert.equal(before.game.note,'');
  assert.equal(act('answer','host',{choice:99}),false);
  assert.equal(act('answer','host',{choice:q.answer,round:round+1}),false);
  assert.equal(act('answer','host',{choice:q.answer,game:'stale'}),false);
  assert(act('answer','host',{choice:q.answer}));
  assert.equal(act('answer','host',{choice:q.answer}),false);
  assert.equal(manager.snapshot('guest').game.selected,null);
  assert.equal(manager.game.phase,'question');
  if(round===2){now+=25001;assert.equal(act('answer','guest',{choice:q.answer}),false);manager.tick();}
  else assert(act('answer','guest',{choice:(q.answer+1)%3}));
  assert.equal(manager.game.phase,'reveal');assert.equal(manager.snapshot('guest').game.correct,q.answer);
  assert.equal(act('next','guest'),false);assert(act('next'));
}
assert.equal(manager.game.phase,'finished');assert.equal(manager.game.scores.host,5);assert.equal(manager.game.scores.guest,0);
assert(act('start'));assert.equal(manager.game.scores.host,0);assert.equal(manager.game.phase,'question');
assert(act('leave','guest'));assert.equal(manager.game,null);
assert(act('join','guest'));assert.notEqual(manager.game.id,originalId);
// Closing before the join acknowledgement reaches the guest still frees its seat.
assert(manager.act({action:'leave'},'guest',false));assert.equal(manager.game,null);
assert(act('join'));manager.reset();assert.equal(manager.snapshot('guest').game,null);
assert(changes>15);console.log('PASS seating, authority, five rounds, hidden answers, stale/duplicate rejection, timeout, replay, cancellation and reset');
