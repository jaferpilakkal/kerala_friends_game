# Somewhere in Kerala

A complete two-player, single-file exploration prototype. **`index.html` is the entire application.** It loads pinned Three.js 0.160.1 and PeerJS 1.5.5 builds from jsDelivr. All scenery, styling, game logic, and networking are in that file. Internet access is required for the libraries and public signaling service.

## How to test in 2 minutes

1. Open a terminal in the folder containing `index.html` and start a static file server:

   ```powershell
   npx --yes serve . -l 8000
   ```

   Or, if you have Python:

   ```powershell
   python -m http.server 8000 --bind 127.0.0.1
   ```

   Use **one** command. This only serves the file; there is no game backend to configure.

2. Open **http://localhost:8000** in Tab A. Enter a name, click **Create Room**, and allow microphone access. The six-character room code appears at the top right. Click it to copy it.
3. Open the same address in Tab B. Enter a different name, paste the code, and click **Join**. Allow the microphone. Both tabs should show **Connected · 2 here** and two avatars near the jetty. The host wears orange; the guest wears blue.
4. Move with **WASD or arrows** in each tab. Switch tabs to see the other avatar move. For simultaneous observation, put the tabs in separate windows side by side; background tabs may throttle rendering. Hold **Shift** to move faster, drag to rotate the camera, and scroll to zoom.
5. Check the voice status. It should read **Voice connected**. If your browser shows **Hear friend**, click it to allow audio playback. **Use headphones** for two tabs on one computer to prevent feedback. Mute one tab's microphone while checking the other direction, then swap. Two separate devices with headphones give the clearest human listening test.
6. Send a message from both chat boxes. Click **Mute mic**, or test with mic access denied in a separate browser profile: movement and text chat still work. Click **Leave** in Tab B; Tab A should show a disconnect message and keep the room open for a replacement guest.

**Do not rely on double-clicking the HTML file for this test.** Some browsers allow local-file microphone access, but file origins, clipboard access, and WebRTC behavior vary. `http://localhost` is a browser-trusted context for microphone access. Ordinary HTTP on a LAN IP is generally **not** trusted for microphones.

## Share with another device

- Serve this exact `index.html` from any static **HTTPS** host. Both people open that page; the creator shares the room code or **Invite link**. Players need no account. The site owner supplies the TURN service credentials used when a direct connection is unavailable.
- Alternatively, send your friend the HTML file and have each computer serve its own copy on localhost. Matching room codes work across machines because signaling uses the public broker, even if the page URLs differ.
- A `localhost` invite link refers to the recipient's own computer; it is not a public share link. The app warns when copying one.
- The host must keep the room tab open. Rooms and messages are temporary, with no persisted history. Only two peers are admitted.

## Controls

| Control | Action |
| --- | --- |
| WASD / arrow keys | Move relative to camera |
| Shift | Move faster |
| Drag the world | Rotate camera |
| Mouse wheel | Zoom |
| Enter | Focus text chat |
| Escape | Return to walking |
| M | Mute / unmute |
| Touch arrows | Move on touch devices |

Follow the pale path northwest to the Munnar-inspired tea hills or northeast to the Kochi-inspired town and Chinese fishing nets. The backwater jetty is south. Terrain is walkable, houses and palm trunks have collision, and the shoreline keeps you on land.

## What is actually connected

- **Signaling:** `new Peer(..., { host: '0.peerjs.com', port: 443, secure: true, path: '/', key: 'peerjs' })`.
- **Movement and text:** a real PeerJS WebRTC data channel, a versioned admission handshake, 12 position updates per second, sequence checks, and exponential position/rotation interpolation. Heartbeats run independently of rendering.
- **Voice:** real `getUserMedia`, `peer.call(stream)`, `call.answer(stream)`, and remote audio playback. A media-state handshake selects one caller and supports listening when one person has no microphone. Permission requests do not block joining or text chat.
- **Room failures:** missing code, full room, signaling timeout, connection loss, and unsupported browser produce visible messages. Guests can use **How to wander → Reconnect**; hosts retain the room when a guest leaves.

The free broker handles discovery/signaling. Networks that prevent direct WebRTC connections need a working TURN relay for movement, chat, and voice. `PEER_OPTIONS.config.iceServers` in `index.html` uses the site owner's Metered TURN credentials, with UDP, TCP, and TLS on port 443. These replace the legacy shared OpenRelay endpoints, which returned zero relay candidates in testing. A passing same-machine or same-Wi-Fi test alone does not verify the TURN fallback.

[Metered's OpenRelay instructions](https://www.metered.ca/tools/openrelay/) explain how to obtain replacement credentials. TURN credentials in this static app are visible to browsers; the provider management API key is not included. Keep the credentials active and monitor their service quota. If only voice fails, text can continue; if the data channel cannot connect, text cannot connect either.

PeerJS API reference: https://peerjs.com/client/api/peer

## Extending the file

The inline code is divided into configuration, world generation, room/data connections, voice, and UI/input sections.

- Add scenery in `buildWorld()` using `house`, `palm`, `boat`, and `fishingNet`.
- Keep `terrainHeight()` deterministic: terrain vertices, props, and avatar feet use the same function.
- Extend `ZONES`, `zoneAt()`, paths, and the minimap together for new regions.
- Change `avatar()` to add a new traveller style.
- Change `PROTOCOL` and `PREFIX` if making an incompatible network version.
- `somewhereDiagnostics()` in the browser console provides read-only connection, position, audio, and draw-count information.

## Verification

`test-browser.cjs` is a development check, **not an application dependency**. Its Playwright path points to the bundled runtime on the development computer; replace that require path with your installed `playwright` package if rerunning elsewhere.

The browser test uses the real CDN builds and public PeerJS broker. It verifies creation/join, movement both ways, text both ways, received audio RTP packets in both directions, mute/unmute, a third-player rejection, disconnect/rejoin, microphone-denied chat fallback, listen-only audio, and an unknown room code. Automated audio input is synthetic; human audibility and echo behavior should also be checked using the checklist above.

To test TURN allocation independently, run `node test-turn.cjs`. It reads the application's configured TURN servers, counts relay candidates, and prints errors without logging addresses or credentials. Zero candidates is a failure.

To prevent direct connections from hiding a broken relay, run the full browser test in PowerShell with:

```powershell
$env:RELAY_ONLY='1'
$env:TEST_URL='https://kerala-friends-game.pjaferparappoor.workers.dev/'
node test-browser.cjs
```

This forces TURN for data and voice, and verifies that both peers selected relay candidates. Remove the `RELAY_ONLY` environment variable to restore the ordinary test. A successful forced-relay test is still followed by a real mobile-data test.

These checks passed in Chrome on the development machine. `test-exploration.cjs` also walked from the jetty to the tea hills and coastal town using keyboard input, verified zone changes, and checked that the mobile session controls and help menu do not overlap. Screenshots alongside the file show the tested views.
