# Deployment status and reproduction

## What is established

On 28 September 2026, the owner confirmed that pushing this repository to GitHub triggers Cloudflare. GitHub's `Workers Builds: kerala-friends-game` check on the existing `main` commit was also verified as successful. The v0.2 release uses that existing integration. Its runtime remains a single `index.html` with no added service bindings.

The root `.assetsignore` allows only `index.html` when the repository root is used as the Wrangler asset directory. It follows Cloudflare's documented [asset ignore format](https://developers.cloudflare.com/workers/static-assets/binding/#ignoring-assets). Test tools and architecture documents remain available in GitHub.

The application runs from a static `index.html` with pinned Three.js/PeerJS CDN scripts. There is no runtime Node dependency or required application build step. `package.json` contains development test tooling only.

README records this deployment URL: [Kerala friends world](https://kerala-friends-game.pjaferparappoor.workers.dev/). The repository does not contain a Worker entry, Wrangler configuration, Pages Functions, Durable Object migrations/bindings, CI workflow or deployment environment variables. Therefore the account, upload process, routes, cache policy and rollback procedure remain unverified. The local `wrangler` command was not found during inspection.

No Cloudflare deployment was changed by the audit or Stage 1 work. Do not infer backend services from the hostname or from the Cloudflare STUN endpoint in the client.

## Local development

From the repository root, serve the app using `python -m http.server 8000 --bind 127.0.0.1`. Open localhost in two browsers/contexts. HTTPS is required for microphone capture from a remote device; localhost is the development exception. The CDN, PeerJS broker and existing TURN service require network access.

Install development checks with `npm ci`, then install the test browser using `npx playwright install chromium`. Run `npm test` with the static server running. See README for optional installed-browser/runtime overrides and relay checks.

## Before the next deployment

For each release, push the tested commit to the existing `main` branch, check its `Workers Builds: kerala-friends-game` result, then verify the live application version. The exact deployment command remains in Cloudflare's integration settings. Before adding a backend, recover those settings and record the bindings, routes and rollback procedure in version control.

Publish an explicit allowlist of application files. With the current single-file app that is `index.html`; development dependencies, tests, screenshots and audit evidence are not production assets. Do not deploy the whole repository indiscriminately.

Existing TURN credentials are distributed in the client by design; their provider management secret must never be included. Confirm quota, entitlement and rotation with the existing provider account. Paid service or plan changes require the approval described in the user brief. Future public-world bindings and migrations are proposals in [target architecture](TARGET_ARCHITECTURE.md), not current deployment requirements.
