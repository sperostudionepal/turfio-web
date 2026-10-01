# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Multi-subdomain setup

Turfio uses independent user, partner and superadmin hosts with separate host-only cookies and a same-origin `/api` proxy on every host. Existing dashboard paths are preserved. One `npm run dev` frontend server serves `turfio.localhost:5173`, `partner.localhost:5173` and `superadmin.localhost:5173`; plain localhost remains the user fallback.

See [the subdomain guide](docs/subdomains.md) for environment templates, Google/eSewa localhost testing, DNS/TLS/proxy setup, CSRF exemptions, automated checks, the manual test checklist and the durable-revocation pre-scale TODO.
