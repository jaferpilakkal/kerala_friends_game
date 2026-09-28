# Migration plan, gates and risks

The requested first deliverable is the [architecture audit](../CURRENT_ARCHITECTURE.md). The phases below are proposed implementation batches. No application rewrite or deployment is included in the audit. Complete and verify one gate before making the next system depend on it.

## K. Migration rules

- Keep the present private two-person experience runnable as the baseline.
- Extract configuration, world builders, player/input, transport, voice and HUD one at a time. Preserve protocol and behavior during extraction; run the existing regression each time networking/lifecycle changes.
- Introduce chunk scopes before multiplying scenery. Introduce PlayerRegistry before public admission. Introduce room authority before shared activity rules.
- Use an explicit runtime mode/feature flag for legacy private, streamed private and new public previews. Do not mix incompatible wire formats. A release keeps compatible client assets or requires reload with a clear message.
- Deploy public changes to preview first with separate room namespaces. Record a release/content version and rollback route. Do not attach an old renderer to new collision/content versions.
- Preserve existing working-tree screenshot changes. New audit evidence is in a separate dated directory.

## L. Implementation phases and exit criteria

Complexity is relative engineering effort including tests: S = contained change; M = several interacting components; L = architecture plus integration; XL = substantial content/device validation. These are not calendar promises; asset authoring and human device/network testing are separate workload.

| Phase | Concrete deliverable | Exit gate | Complexity / dependency |
| --- | --- | --- | --- |
| 1 · Stabilize | Reproducible test runner; mute/retry separation; lifecycle cleanup; reconnect/failure coverage; documented deployment and TURN entitlement | Host/guest flow, both audio directions, denied/pending mic, signal loss, network change, repeated retry, leave/rejoin, room-full and invalid version. Direct and forced TURN pass; human voice check on separate networks | M–L; before networking expansion |
| 2 · Streaming foundation | Scoped chunk builders, resource ownership, district catalog, continuous world coordinate system, route UI and transactional loading | Existing scenery survives extraction; walk across chunk border and fast-travel away/back; failed loads recover at origin; resource counts return to stable baseline | L; phase 1 baseline |
| 3 · District hubs | Fourteen representative district hub scenes and travel nodes; three existing themes reused; landmarks added in small batches | All 14 have hub, social purpose, distinct view, route out; geographic orientation reads correctly; only nearby chunks resident | XL content + M engine; phase 2 |
| 4 · Public social | Worker/Room service, PlayerRegistry, directory leases, public/private capability rules, interactions | 2/4/10 then 20 players with simultaneous joins; cap enforced; owner leaving public room does not close it; private membership hidden; action validation and reconnect snapshots pass | L; phases 1–2 |
| 5 · Proximity voice | Bounded admitted-neighbor calls, falloff, hysteresis, caller election, block/mute and return behavior | Walk near/far/near; no duplicate calls; private-space separation; listener without mic; autoplay restrictions; crowded group limit shown; real phones and relay tested | L; phase 4 |
| 6 · One activity | ActivityManager plus tea-shop trivia, 2–4 seats, invites, spectators, results and replay | Two browsers finish a round; simultaneous seat/answer requests deterministic; disconnect/timeout/late answer/reconnect handled; world remains visible | M–L; phase 4 |
| 7 · Mobile | Joystick, camera gestures, contextual controls, keyboard-aware chat, quality settings | Physical Android Chrome and iOS Safari; portrait/landscape; keyboard/safe-area; move + camera + interact; background/resume and 30-minute session | L; early mobile checks start in phase 1 |
| 8 · Environment | Shared day clock, weather presets, inexpensive rain/mist and reversible event hooks | Two clients agree on phase; effects respect quality/reduced motion; unloaded/expired events leave no resources; rainy mobile frame budget passes | M; phases 2 and 7 |
| 9 · Regional polish | Recognition-focused landmark geometry, local signs, lived-in streets, improved water/vegetation, optional local postcards | Per-district label-free review; local/cultural review; accessible social anchors; no frame/memory regressions | XL content; all previous foundations |
| 10 · Performance | Cold-load, frame/CPU/network traces, 20-user tests, memory travel soak and deployment cost dashboard | Agreed device budgets pass; 30 travel cycles plateau; capped bandwidth/queues; measured service usage; clean recovery under loss/suspension | L; profiling runs throughout |

Phases 4–6 can initially use the three representative hubs; public networking should not require completion of every landmark. Phase 3's fourteen lightweight regions remains an explicit deliverable. Optional later activities and rich events are outside the first playable release.

## Test strategy

### Automated checks

Retain existing Playwright end-to-end scripts and replace machine-specific runtime paths through explicit configuration/package setup in phase 1. Put screenshots/logs in per-run directories. Separate external-service failures from product assertions. Use deterministic local protocol tests for malformed messages, stale sessions, sequence/size/rate validation, activity rules and chunk disposal; use real browser networking for integration.

Add tests where they validate behavior across boundaries: stream/call cleanup after late mic approval; pressing mute during failed voice; simultaneous admission; reconnect snapshot ordering; duplicate action rejection; fast-travel cancellation; stale chunk resolution; reusing shared geometry after a neighboring chunk unloads. Do not add tests that merely mirror implementation details.

### Device/network matrix

| Surface | Required checks | Current audit status |
| --- | --- | --- |
| Same-machine Chrome contexts | Creation/join, movement, chat, synthetic audio RTP, rejection, reconnect/replacement | Ordinary baseline passed; detailed relay/exploration results in verification report |
| Chrome ↔ Firefox / Edge | Handshake, data, media negotiation, autoplay | Not tested |
| Desktop ↔ physical Android Chrome | Wi-Fi ↔ cellular, touch camera/movement, voice, network handoff | Not tested |
| Physical iOS Safari | Permission/autoplay, Web Audio gain, background/resume, landscape, keyboard | Not tested |
| Restricted/direct vs forced TURN | Selected relay candidates and audio stats, credentials expiry, relay loss | Automated evidence only; separate-network human listening still required |
| Streaming / 14 districts | Continuous crossing, fast travel, cancelled load, GPU/resource release | Feature absent; gate for implementation |
| 10–20 clients | Admission, interest filtering, CPU, packet sizes, call limits, activity consistency | Feature absent; gate for implementation |

Use two people with headphones for intelligibility, echo, ducking and distance falloff. Synthetic RTP packets prove transport, not intelligible speech. A mobile viewport proves layout only. Capture named devices/browsers, network RTT/loss and quality tier with every performance report.

## M. Major risks

| Risk | Mitigation / decision point |
| --- | --- |
| Expanding singleton state causes session leaks or calls to the wrong person | Extract adapters first, keyed registries, session generations and cleanup tests |
| Browser-host room lifecycle unsuitable for strangers | New public room coordinator; preserve private adapter through migration |
| 20-person mesh overloads phones/upload or TURN allowance | Bounded symmetric voice graph; explicit crowd limits; measured SFU decision only later |
| Proximity mistaken for private conversation | Separate authorized spaces and media teardown; nearby audio alone is not a privacy boundary |
| Cloudflare configuration/account assumptions | Inspect actual deployment settings before deployment; commit config/migrations; preview isolation; no inferred bindings |
| Free limits reached / existing TURN entitlement unknown | Traffic model, usage metrics, caps, idle suppression, quota handling; approval before paid changes |
| Continuous geography conflicts with disconnected scene swaps | Stable shared world coordinates and neighbor chunks; fast-travel shortcuts on the same catalog graph |
| Religious/tribal/cultural settings become caricatures | Review sourced architecture/signs, local consultation and clearly labeled inspired spaces |
| Activity round diverges or survives with invalid seats | Server-owned reducer, revisions/deadlines, idempotent actions, disconnect grace |
| Low population makes fourteen districts feel empty | Start visitors at a social hub; show coarse live occupancy and invite travel; avoid fake people/counts |

## N. Performance risks

The largest known scaling risks are scene-wide resource residency, separate draw calls for repeated props, high shadow cost, fixed mobile quality, O(N) collision scans, full-mesh media and per-frame network fanout. Reduce cost in that order using measurement, not wholesale engine replacement.

Track current/high-water loaded chunk count, renderer draw calls/triangles, geometry/texture counts, JS heap trend, main-thread/RAF timing, network bytes/messages, queue depth, RTT/loss, voice calls and relay usage. Add GPU timing where supported and record unavailable counters honestly. Test slow downloads and memory pressure during overlapping arrival/origin residency. Never interpret `visible=false` as unloading.

## O. System complexity summary

| System | Complexity | Main unknown |
| --- | --- | --- |
| Two-person stabilization / module extraction | M | Failure paths and mobile lifecycle |
| Chunk streaming / asset ownership | L | GPU disposal and continuous boundaries |
| State map / fourteen hub manifests | M | Geographic layout and travel design |
| Fourteen recognizable authored regions | XL | Art volume and regional accuracy |
| Public rooms / directory / validation | L | Admission, hibernation, quotas and recovery |
| Proximity voice | L | Mobile interoperability and crowded groups |
| Reusable interactions | M | Seat/partner arbitration |
| Activity framework + trivia | M–L | Deadlines, reconnect and shared rules |
| Mobile controls and optimization | L | Real hardware and browser behavior |
| Day/weather/event hooks | M | Mobile effects budget and cleanup |
| Deployment reproducibility / profiling | M–L | Missing current platform configuration |

## Recommended next implementation batch

Start phase 1 with the verified private-room flow. Make mute unconditional on call status, provide a separate voice retry action, unify disconnect cleanup, and add targeted browser regressions for those failure states. Make tests portable and recover the deployed Cloudflare configuration. Keep the room cap at two for that batch. Begin chunk extraction only once the foundation gate is met.
