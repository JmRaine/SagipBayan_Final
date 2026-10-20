# SagipBayan

SagipBayan is a disaster information and management system for Jaen, Nueva Ecija. It provides public information, role-based operational tools, relief and donation workflows, evacuation support, incident reporting, water-level monitoring, and mobile access.

## Project structure

- `MyApp/` — Expo / React Native application for web and mobile.
- `MyApp/server/` — Express and MongoDB API.
- `logic2/` — supporting local services and integrations.
- `tests/` — fixtures and supporting test material.

## Local setup

### API

1. Copy `MyApp/server/.env.example` to `MyApp/server/.env`.
2. Set the required database URL and secrets. Do not commit `.env` files.
3. Install and run the API:

```powershell
cd MyApp/server
npm ci
npm start
```

Run the backend regression suite with:

```powershell
npm test
```

### Web application

```powershell
cd MyApp
npm ci
npm run web
```

For a production web export, use:

```powershell
npx expo export --platform web
```

## Security configuration

Production requires `SESSION_SECRET`. Keep `USER_AUTH_TOKEN_SECRET` separate when possible. Account self-service endpoints require the logged-in user's bearer token; role-managed account changes remain restricted to administrators.

The administrator bootstrap endpoint is intentionally disabled unless every `ADMIN_BOOTSTRAP_*` value and `ADMIN_BOOTSTRAP_TOKEN` are set. Treat it as a one-time deployment action and remove or rotate the bootstrap token after use.

YOLO control endpoints require an authenticated DRRMO user. The trusted monitoring agent must send `x-yolo-agent-token` with the value configured as `YOLO_AGENT_TOKEN`; do not expose that value in the mobile or web client.

## Continuous integration

GitHub Actions runs the backend test suite for pushes and pull requests targeting `main` or `fixedfinal` through `.github/workflows/backend-tests.yml`.

## Secret hygiene

If a secret was ever committed, removing the file only protects future commits. Rotate every affected database password, API key, email credential, and session secret in the provider dashboards and then update the deployment environment.