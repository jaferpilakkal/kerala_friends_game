# Baseline verification — 28 September 2026

These results describe the application **before Stage 1 edits**, at commit `a594065`. They were collected while producing the architecture audit. Synthetic media and same-machine Chrome contexts were used; they are not physical-device or human listening tests.

## Results

| Check | Result | Evidence |
| --- | --- | --- |
| Application / test JavaScript syntax | Passed | Inline script parsed; all three test files passed `node --check` |
| Ordinary two-player browser regression | Passed | [Network baseline log](browser-network-baseline.log) |
| Forced TURN browser regression | Passed; selected relay candidates on both peers | [Relay baseline log](browser-relay-baseline.log) |
| TURN allocation | All four configured endpoints produced candidates: 1, 2, 1, 2 respectively | [TURN allocation log](turn-network-baseline.log) |
| Keyboard exploration | Walked to tea hills and old coast; zone assertions passed | [Exploration log](exploration-network-baseline.log) |
| Mobile-sized layout | Session/help overlap assertion passed at 390 × 844 | [Mobile screenshot](mobile-test.png) |
| Visual inspection | Tea hills and mobile coast screenshots reviewed; coherent palette, tea rows, simple house/avatar silhouettes | [Tea hills](tea-hills-test.png), [coast](old-coast-test.png) |

The full browser suite checked host/guest creation and admission, position synchronization in both directions, bidirectional text, received audio RTP on both sides, mute/unmute, rejecting a third player, graceful departure, replacement guest, microphone-denied text, listen-only audio and an unknown room code.

Ordinary run audio samples: 36,906 / 37,582 received bytes and 618 / 631 packets. Forced-relay run: 45,308 / 45,093 bytes and 745 / 761 packets. The suite asserts selected relay transport shortly after joining, before its audio wait, so its candidate assertion proves data relay selection; relay-only policy is also applied to every later media RTCPeerConnection and those calls received RTP. The missing-room scenario emits an expected PeerJS console error; no uncaught page errors were reported.

TURN UDP results include error 701 lookup messages alongside successful candidates. This does not invalidate successful allocation; it also does not establish that every address family/network path works. TCP/TLS endpoint results recorded no errors.

## Environment and reproduction

- Local source served with Python at `http://127.0.0.1:8765/`.
- Installed Windows Chrome, headless, bundled Playwright 1.62.1; fake microphone input and autoplay bypass.
- Original browser test used `TEST_URL` to select port 8765. The original exploration script was evaluated with only its hard-coded localhost URL replaced in memory; no application/test source changed for baseline collection.
- Tests ran from this evidence directory to avoid overwriting pre-existing screenshots at the repository root. Ordinary and relay browser suites use the same screenshot filenames; exploration subsequently replaced `mobile-test.png` with its coastal view. Logs identify each distinct run.
- Initial sandbox-only runs could not load CDN libraries (`ERR_NETWORK_ACCESS_DENIED`). Those failed logs/screenshots are retained as environmental failures; the network-enabled retries passed. They are not reported as product failures.

## Limits

No Firefox, Edge or Safari integration run; no physical Android/iOS device; no separate Wi-Fi/mobile-data participants; no human audibility/echo check. The mobile screenshot comes from a desktop viewport resize and does not exercise the coarse-pointer D-pad or virtual keyboard. Its chat panel uses about the bottom quarter of the screen, supporting the planned collapsible mobile conversation UI.

No sustained FPS, GPU timing, heap soak, total GPU-memory measurement or cold-start benchmark was captured. Existing diagnostic frame snapshots varied with camera/viewport and are not performance guarantees. Fourteen districts, streaming, public/private instance service, proximity voice and activities did not exist and were not tested.

The live `workers.dev` URL in README was inaccessible through the web lookup tool. No live configuration or deployment parity claim is made. This audit changed no deployment, infrastructure subscription or application source.
