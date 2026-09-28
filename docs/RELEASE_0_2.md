# Playable release 0.2

This release adds a shared activity to the existing two-player Kerala world.

## Try it

1. Create a room and invite one friend.
2. Both choose **Travel → Backwater tea shop**.
3. Open **Tea table**, then **Take a seat** on each device.
4. The creator starts the game. Answer five questions, see the shared scores, and play again.
5. Leave the table, try an emote, then travel to the tea hills or old coast.

## Included

- An open tea stall with a counter, kettle, glasses, table and stools.
- Host-owned trivia seating, question order, 25-second deadlines, answers, scores and replay. Duplicate and stale answers are ignored. Leaving or disconnecting clears the activity.
- Reusable wave, sit, dance, laugh, point and greet interactions, synchronized over the existing data channel.
- Travel between three existing destinations. Movement, collision and the original exploration routes remain active.
- Local voice playback is full within 8 world units, fades until 28, and is muted beyond that. The media call remains connected; distance does not create a private channel.
- Collapsible conversation and scrollable activity panels on small screens. Reduced-motion preferences apply to avatar animation.
- The earlier microphone retry and connection cleanup fixes.

## Implementation limits

This is a two-person private-room release. It does not yet implement public rooms, 10–20-player instances, the fourteen-district world, chunk streaming, or a shared environment clock. The architecture and district roadmap describe those next stages. Activity authority currently lives in the host browser; this is a casual friend game, not an anti-cheat service.

The production application remains `index.html`. Both people must reload after deployment because v0.2 uses a new protocol version. Room IDs retain the existing namespace so older clients get a version mismatch instead of silently joining incompatible sessions.

## Checks

Activity rule tests cover seating, authority, hidden answers, duplicate and stale actions, all five rounds, timeout, replay, cancellation before join acknowledgement, and reset. Real Chrome browser tests cover the shared activity, emotes, travel, voice distance and existing room/chat/voice behavior. Test artifacts are kept in ignored `test-results/v0.2-*` directories.

On 28 September 2026, `test-activity.cjs`, `test-browser.cjs`, `test-lifecycle.cjs`, `test-social.cjs` and `test-exploration.cjs` passed. The social test's first pass found mobile chat covering emote controls; the corrected layout passed the full rerun. Desktop and 390 × 844 screenshots were inspected.

Synthetic microphones and local Chrome contexts establish media transport and browser behavior. Physical Android/iOS, different networks and human voice listening remain unverified. Mobile Safari can impose its own volume rules; far-away playback is explicitly muted, but gradual falloff needs a physical-device check.
