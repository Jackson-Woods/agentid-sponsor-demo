# Agent ID Prototype

A standalone UX prototype of the Azure Entra Agent ID blade — specifically the **Owners & Sponsors** management experience. Built with React, Fluent UI v9, and Vite.

> **This is a UX prototype with dummy data. It is not connected to any Microsoft services, has no authentication, and cannot interact with real Azure resources.**

## Quick Start

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build     # Produces static output in dist/
npm run preview   # Preview the production build locally
```

### GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on push to `main`. To enable:

1. Go to **Settings → Pages** in your GitHub repo
2. Set source to **GitHub Actions**
3. Push to `main`

## Tech Stack

- [Vite](https://vitejs.dev/) — Build tool
- [React 18](https://react.dev/) — UI framework
- [Fluent UI v9](https://react.fluentui.dev/) — Microsoft design system components
- [React Router](https://reactrouter.com/) — Client-side routing
- TypeScript — Type safety

## Project Structure

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Router + theme provider
├── models/types.ts                   # TypeScript interfaces
├── data/seed.ts                      # Dummy data fixtures
├── services/dataService.ts           # localStorage CRUD
├── components/
│   ├── AppShell/                     # Portal chrome (header, sidebar)
│   ├── PeoplePicker/                 # Mock ObjectPicker dialog
│   └── shared/                       # Reusable widgets
└── pages/
    ├── AgentList/                    # All agents table
    ├── AgentOverview/                # Agent detail with properties card
    └── OwnersAndSponsors/           # Core O&S management page
```
