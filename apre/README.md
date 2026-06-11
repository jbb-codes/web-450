# APRE - Agent Performance Reporting Engine

A full-stack MEAN application for sales and agent performance reporting.

## Project Structure

```
apre/
├── apre-client/   # Angular 18 frontend
└── apre-server/   # Node/Express REST API
```

## Getting Started

### Server

```bash
cd apre-server
npm install
npm start
```

### Client

```bash
cd apre-client
npm install
ng serve
```

## Documentation

- [API Documentation](API_DOCUMENTATION.md)
- [UI Documentation](UI_DOCUMENTATION.md)

## CI Pipeline

Every push and pull request to `main` automatically runs two jobs in parallel:

- **Server Tests** — runs Jest unit tests in `apre-server`
- **Client Build and Tests** — builds the Angular app and runs Karma tests in `apre-client`

Results are visible under the **Actions** tab on GitHub. A failing job blocks the workflow and indicates the branch is not ready to merge.
