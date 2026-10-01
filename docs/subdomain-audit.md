# Subdomain audit and approved plan

Audit source: web(20261001-011749).zip. Frontend: React/Vite/React Router, with player/admin/superadmin folders and a universal route tree. Backend: Express/Mongoose, JWT HttpOnly cookies, split player/staff secrets, database staff role enforcement. This implementation was approved with separate host-only sessions, per-host /api proxies, and existing dashboard paths preserved.

| Original gap | Risk | Implementation |
| --- | --- | --- |
| All hosts expose all route trees | High | Host resolver, lazy per-context trees, canonical redirects, unknown-host config page |
| No explicit browser mutation CSRF enforcement | High | Exact Origin/role context and Fetch Metadata checks, narrow tested exemptions |
| Direct shared API would concentrate cookies on one host | High | Browser API requires same-origin path, proxy on every host |
| Owner setup/login emails use user URL | High | Per-app canonical backend URLs |
| Payment return/storage origin mismatch | High | Configurable user URL in both projects; exact matching documented |
| Revocation is in memory and logout-other-sessions is a stub | High | Out of scope; pre-scale TODO documented |
| Missing multi-origin CORS | Medium | Exact prod/dev allowlist, credentialed preflight tests |
| Relative cross-portal links | Medium | Shared URL builder and safe fallback override handling |
| All auth stores initialize everywhere | Medium | Only selected portal initializes |
| Staff code eager in user graph | Medium | Dynamic route imports; build-manifest verification |
| Missing staff crawler isolation | Medium | Host-conditional noindex headers and robots handling |
| Single env URL, hardcoded email links, port mismatch | Medium | Non-secret templates, per-app URLs, port 5050 |

Approved execution groups: app context → routing → links/config → backend CORS/CSRF → dev/deploy docs. Additional explicit requirements: overrides only in DEV; no SameSite/Domain changes; lazy staff trees; noindex/robots handling; exact CSRF exemptions; wrong-host/wrong-role, CORS and resolver tests. Existing real environment files were not edited. Original Git repositories/history were retained; the requested changes were committed on feat/multi-subdomain.

Backend roles remain authoritative; host/origin selection is not permission granting. No claim of an unauthenticated privilege bypass was made from the initial route visibility finding. Live DNS, Google/eSewa account registrations and hosting-provider behavior require the deployment/manual checklist.
