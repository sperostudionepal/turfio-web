# Turfio subdomains

Approved design: separate host-only sessions, per-host `/api` proxies, and existing dashboard paths preserved. The user, partner and superadmin route trees load independently. Partner/operator JavaScript is emitted as separate assets and is not loaded by the user app; this is a performance boundary, not a substitute for API authorization.

## Run locally

Install dependencies with `npm ci` in both `turfio-web` and `turfio-server`. Keep existing `.env` files intact. Templates contain placeholders only. For the frontend, copy `.env.development.example` to a new `.env.development` if that file does not exist, or export the settings in your shell. For the backend, export the template settings alongside your existing secrets. `server.js` loads `.env`; it does not automatically load `.env.development` or `.env.production`.

Start the backend in its directory with `npm run dev` (port 5050). Start the single frontend server in its directory with **`npm run dev`** (port 5173). That one frontend command serves all three hostnames:

| App | Local entry | Preserved dashboard |
| --- | --- | --- |
| Users | http://turfio.localhost:5173/ | Player profile/bookings |
| Partner | http://partner.localhost:5173/ | `/dashboard/*` |
| Superadmin | http://superadmin.localhost:5173/ | `/superadmin/dashboard` |
| User fallback | http://localhost:5173/ | Player profile/bookings |

Both staff roots lead to their dashboard/login. `/login` on a staff host aliases its existing login path. Legacy staff paths on a user host redirect to the configured staff origin. Player routes, payment returns and application tracking on a staff host redirect to the configured user origin. Each destination authenticates independently; a user-host page cannot inspect another host's cookie or transfer that session through a URL. Logout affects only that portal.

If Safari or Windows does not resolve `*.localhost`, add these entries to your hosts file:

```text
127.0.0.1 turfio.localhost partner.localhost superadmin.localhost
```

macOS/Linux: `/etc/hosts`; Windows: `C:\Windows\System32\drivers\etc\hosts` (administrator access required). Alternatively, use the development fallback below. Do not use hyphenated `turfio-localhost` names. In a container that cannot enumerate network interfaces, run `npm run dev -- --host 127.0.0.1`; all three names still reach the same server.

Development-only fallback: `http://localhost:5173/?app=partner` or `?app=superadmin`, or `VITE_APP_CONTEXT`. Production ignores both overrides. If you configure all app base URLs to plain localhost for this fallback, link helpers add the destination's override automatically. These contexts share the localhost cookie jar; they are a development convenience, not a simulation of production host isolation. Unknown production hosts show a configuration error. Explicitly configured production app origins are recognized; custom hosts also require matching hosting/noindex rules.

## Environment settings

| Frontend build setting | Backend setting | Purpose |
| --- | --- | --- |
| `VITE_USER_APP_URL` | `USER_APP_URL` | User links, checkout/payment returns, application tracking |
| `VITE_PARTNER_APP_URL` | `PARTNER_APP_URL` | Owner login/setup links |
| `VITE_SUPERADMIN_APP_URL` | `SUPERADMIN_APP_URL` | Platform portal |
| `VITE_API_URL=/api` | — | Same-origin API proxy; absolute API URLs are rejected |
| `VITE_GOOGLE_CLIENT_ID` | Existing Google client settings | User Google login; provider registrations must match |
| Development-only `VITE_APP_CONTEXT` | — | Fallback-host context override |
| — | `CORS_ALLOWED_ORIGINS` | Optional comma-separated extra **exact** origins; no wildcards |
| — | `PORT=5050` | Backend listener |
| — | `NODE_ENV` | Cookie Secure flag, rate limits, and production origin validation |

Frontend settings are public build values, not secrets. Keep database credentials, JWT secrets, MFA encryption keys, payment secrets and email credentials in existing `.env` files or hosting secrets. Never commit real environment files. Production app URLs must be HTTPS origins without paths, credentials, query strings or fragments. `FRONTEND_URL` remains a legacy fallback for the user URL only; set `USER_APP_URL` explicitly when migrating.

**Payment/Google local testing:** the development templates use `http://localhost:5173` for the user app because Google may reject `*.localhost`. Perform checkout on that configured origin. To test checkout on `turfio.localhost`, set **both** `VITE_USER_APP_URL` and backend `USER_APP_URL` to `http://turfio.localhost:5173`, then restart both servers. The checkout origin and payment return origin must match: sessionStorage and cookies are origin/host scoped. Do not switch between the two user hosts mid-payment. Google OAuth redirect URI and JavaScript origins must match the actual user origin; register the production user origin in Google Cloud. Staff hosts do not initialize Google One Tap.

## API and browser security

Every browser request uses the frontend host's `/api` proxy. Cookie flags remain HttpOnly, `SameSite=Strict`, host-only (no Domain), Secure in production, `Path=/`. Normal player/admin cookies last seven days; superadmin cookies last two hours. Owner token setup also issues a root-path cookie and keeps the session JWT out of JSON.

CORS allows credentials for the three exact HTTPS production origins, and in development/test the three requested `.localhost` origins plus plain localhost. Extra CORS origins do not automatically acquire a portal context; configure the corresponding app URL for a custom portal. Cookie mutations require an exact allowed `Origin`, `X-Role-Context: player|admin|superadmin`, and, when supplied, `Sec-Fetch-Site` of `same-origin` or `same-site`. Missing Fetch Metadata is supported only with the required Origin/header. Cross-site/none metadata is rejected. Requests establishing sessions are checked when browser Origin/Fetch Metadata is present, even before an existing cookie exists.

The exact Origin must match the requested portal. Browser authenticated reads also check Origin/Referer when supplied. Plain localhost is the only multi-context development exception. JWT validation, current database role, account status and resource ownership remain the authorization boundary; Host and X-Role-Context do not grant roles. Server/mobile bearer requests retain their existing transport and role enforcement. No-Origin bearer traffic is not browser cookie authentication.

Only these exact method/path pairs bypass session CSRF checks:

| Exemption | Independent authentication |
| --- | --- |
| `POST /api/payments/verify` | eSewa response signature, merchant, amount/status and transaction verification; cookie identity is not used |
| `POST /api/owner-applications/complete-signup` | Hashed, expiring, one-time signup token; invalid/used tokens fail; an explicitly supplied wrong-portal Origin is rejected |

The frontend `/payment-success` and `/payment-failure` routes are not backend CSRF exemptions. Token verification/tracking GET endpoints are safe-method reads. No wildcard/prefix exemption covers other payment or owner endpoints. Tests exercise valid setup, setup replay, invalid signed payment data, and near-matching paths.

## Production DNS and hosting checklist

- [ ] Point `turfio.com`, `partner.turfio.com` and `superadmin.turfio.com` to the frontend hosting project using the provider's A/ALIAS/CNAME records.
- [ ] Add all three domains to the hosting project. Use TLS for the apex and both staff hosts; a wildcard certificate alone does not cover the apex. Existing backend HSTS includes subdomains.
- [ ] Build with production URL settings. Restart the backend with matching HTTPS app URLs and explicit `NODE_ENV=production`.
- [ ] Serve the SPA fallback for deep links on every host, including `/dashboard/bookings` and `/superadmin/dashboard`.
- [ ] Proxy `/api/*` on **each** host to the same backend. `vercel.json` retains the existing Render upstream; change that destination if the backend deployment moves. Do not use redirects to the backend or an absolute browser API URL.
- [ ] Preserve request Origin, Fetch Metadata, role header and cookies through the proxy. Forward each Set-Cookie separately. Never add a parent Domain or rewrite SameSite flags. Do not cache authenticated API responses.
- [ ] Configure `TRUST_PROXY` only for the actual trusted ingress topology; do not trust arbitrary forwarded Host/IP headers.
- [ ] Apply the host-conditional `X-Robots-Tag: noindex, nofollow` rules in `vercel.json` to both staff hosts, including assets and deep links. `/robots.txt` rewrites to the staff disallow-all file there; user robots/sitemap retain public behavior. If using another provider or custom staff domain, reproduce/update these exact-host rules.
- [ ] Verify Google origins/redirect URIs and eSewa return behavior on the user origin. Verify approved-owner email setup/login URLs on partner.
- [ ] Check deployed headers and cookie behavior in a browser. Static config tests do not verify a provider's live configuration.

## Automated checks

Frontend:

```bash
npm test
npm run lint
npm run build
npm run test:bundle
```

Backend:

```bash
npm test -- --runInBand
```

The backend uses an isolated MongoDB replica set and mocked email delivery; never run test fixtures against production. The harness disables Unix sockets so it works in restricted containers. Where the newest downloaded MongoDB binary is unsupported, use an installed supported test binary or `MONGOMS_VERSION=7.0.24 npm test -- --runInBand`.

## Manual test checklist

- [ ] User host and plain localhost show the public app; staff roots show only the appropriate portal.
- [ ] Login and MFA on each host; refresh a protected deep link and confirm the session restores.
- [ ] Keep all three portals signed in in separate tabs; logout one and confirm the other sessions still work.
- [ ] Try player credentials in staff login and admin credentials in superadmin login; access is denied server-side.
- [ ] Open legacy staff routes on the user host; verify canonical-host redirects preserve safe intended destinations and do not loop.
- [ ] Try a staff API request with a player-origin Origin/header, spoof Host, or an admin JWT placed in a superadmin cookie; expect rejection.
- [ ] Verify cross-app home/portal/list-turf links and emailed tracking/setup/login links use the right configured origin.
- [ ] Complete a valid owner setup, refresh `/dashboard`, then reuse the token; first session works and replay fails.
- [ ] Perform eSewa success/cancel flows from the configured user checkout origin; verify confirmation, storage continuity and signed verification.
- [ ] Inspect cookies: no Domain, HttpOnly, Strict; Secure over production HTTPS; staff cookies absent on sibling hosts.
- [ ] Inspect preflight: exact ACAO, credentials and X-Role-Context permitted. Unlisted/null origins must not receive ACAO.
- [ ] Try cookie mutation without Origin/header or with cross-site Fetch Metadata; expect 403 and no side effect.
- [ ] Confirm staff `X-Robots-Tag` and disallow-all robots response; user robots remain public.
- [ ] On the user host, inspect Network: no PartnerRoutes, SuperadminRoutes or staff login chunk requested.
- [ ] Production `?app=superadmin` has no effect; an unconfigured production hostname shows the configuration error.

## Pre-scale TODO (out of scope)

Replace in-memory JWT logout revocation with a durable shared store/session strategy before running multiple backend instances or relying on restart-resistant revocation. Implement actual revocation for the existing “logout other sessions” endpoint, which currently returns success without doing it. This subdomain change does not solve those existing limitations.
