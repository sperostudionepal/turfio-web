# Subdomain validation

Executed on 2026-10-01 against the uploaded web archive and changed projects.

| Check | Result |
| --- | --- |
| Frontend resolver, URL, request scope and hosting tests | 19 passed |
| Focused backend subdomain + owner email/setup tests | 34 passed |
| Production frontend build | Passed; staff trees are separate dynamic chunks |
| Build manifest user import graph | Passed; no partner/operator/login chunk in the user graph |
| Frontend lint | Passed with 58 existing warnings, zero errors |
| Actual Vite HTTP checks for all four local hostnames | Passed: SPA fallback, public/staff robots, noindex staff headers, API namespace, request headers/cookies and separate Set-Cookie forwarding |
| Full backend suite before last additional shared-resource test | 141 passed, 10 failed |
| Original archive baseline using the same dependencies/test database | 109 passed, the same 10 failed |
| Existing environment files | Byte-for-byte preserved |
| Original Git history/remotes | Preserved; changes committed on feat/multi-subdomain |

The baseline failures are eight booking tests and two public-ID tests. They cover player/staff cancellation expectations, legacy invoice fields on payment/cancellation/manual bookings, and invoice public-ID shape/validation. They were reproduced in the original archive and are outside this minimal subdomain implementation. Assertions were not weakened. Production rate-limit tests were updated to provide valid HTTPS production app URLs rather than retaining the localhost test URL when switching NODE_ENV.

The test MongoDB harness retains replica-set transactions and uses TCP only (--nounixsocket) because this execution environment rejects the default Unix socket. Tests ran using MONGOMS_VERSION=7.0.24. External email delivery is mocked; the new setup tests mock only the external breached-password lookup while retaining real token checks, database changes and session authentication.

Browser UI/end-to-end checks were not completed: no Chromium executable was available and the browser download failed. Google/eSewa live provider flows, real browser cookie isolation, and deployed Vercel headers/robots remain manual/deployment checks in the README guide. Build, source tests and local HTTP checks are not claims that those external flows were verified.

Commit groups:

1. App context: exact hostname mapping, DEV-only fallback override, production config error policy and resolver tests.
2. Routing: lazy per-app trees, canonical legacy redirects, active-session initialization and host guards. Follow-up fixes isolate route helper exports and prevent stale override redirect loops.
3. Links/config: per-app canonical URLs, same-origin browser API, scoped logout, owner emails, payment returns, Brevo links, environment templates and default port 5050. Shared staff operations select the active superadmin session when used in the operator app.
4. Backend CORS/CSRF: exact allowlist, role context, Fetch Metadata, narrow exemptions, independent JWT/database role checks and tests. Owner setup receives a root-path cookie and omits the JWT from JSON; SameSite/Domain are unchanged.
5. Dev/deploy/docs: one Vite server for all hosts, host-aware robots/noindex, hosting tests, build graph check, README setup/DNS/TLS/proxy/manual checklist and durable logout revocation TODO.
