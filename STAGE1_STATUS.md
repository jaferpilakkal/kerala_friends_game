# Stage 1 — private-room reliability

Started after the architecture audit and the user's instruction to continue. The existing renderer, scenery, two-player cap, PeerJS protocol and hosting model are retained.

## Changes

- The mic button toggles the captured audio tracks even when a media call has failed. A separate Retry voice button reconnects media without changing mute state.
- Remote mute-status updates do not automatically create a new media call. Readiness changes and explicit retries handle call setup.
- Delayed voice retries are canceled on disconnect/leave and guarded by session. Late audio-playback callbacks cannot update a later session's UI.
- Peer destruction clears connection state, remote avatar, chat availability and media. Diagnostics stop reporting an active RTC connection after departure.
- Test scripts share portable Playwright/browser/URL configuration. Screenshots go to timestamped `test-results` folders or `TEST_OUTPUT_DIR`, preserving root screenshots.
- A new lifecycle browser suite injects media failure, signaling loss and peer destruction while exercising the real app and network stack. It checks mute/retry, reconnect, late permission cleanup and the mobile retry layout.

## Verification

Application/test syntax checks passed. Baseline evidence is in [the audit verification report](docs/audit-2026-09-28/VERIFICATION.md).

Verified after the Stage 1 changes:

- `test-browser.cjs` passed with ordinary ICE in `test-results/stage1-browser-final/run.log`.
- `test-browser.cjs` passed with `RELAY_ONLY=1` in `test-results/stage1-relay/run.log`, including relay-candidate checks.
- `test-lifecycle.cjs` passed in `test-results/stage1-lifecycle/run.log`.
- `test-exploration.cjs` passed in `test-results/stage1-exploration-final/run.log`, covering the tea hills, old coast and mobile control overlap.

One test-only fix was made after verification exposed a brittle coastal waypoint: the old exploration script pushed the avatar into scenery near the coast after the district had already been reached. The final waypoint was removed, and the test still asserts that the game enters `The old coast`.

## Remaining Stage 1 gates

Real device/network testing remains necessary: cross-browser media negotiation, physical Android/iOS behavior, separate Wi-Fi/cellular participants and human audibility. Current Cloudflare deployment settings and TURN account quota are not available in the repository; see [deployment status](docs/DEPLOYMENT.md). This batch does not claim those gates have passed or that public rooms/streaming have been implemented.
