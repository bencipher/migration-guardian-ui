# Migration Guardian UI

## Overview

This repository contains the Migration Guardian web interface.

Live: [migration-guardian-ui.vercel.app](https://migration-guardian-ui.vercel.app/)

### Demo access

- Username: `mig_admin`
- Password: `Guardian`

## Tech Stack

- React, TypeScript, and React Router
- Vite
- Tailwind CSS
- Lucide React icons
- Vercel

## Environment Configuration

The frontend uses one public Vite variable:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8001
```

Set it to the Migration Guardian API URL. `VITE_*` values are exposed to the browser, so never place credentials or private tokens here.

## Run Locally

Requires Node.js and npm.

```bash
npm install
npm run typecheck
npm run dev
```

Open the local Vite URL shown in the terminal, normally [http://localhost:5173](http://localhost:5173).

## Deployment

Vercel builds the app with:

```bash
npm run build
```

The build output is `dist`. Configure `VITE_API_BASE_URL` for both Preview and Production. The included `vercel.json` serves the React application for direct client-side routes.

## License

Migration Guardian is released under the [MIT License](LICENSE).

## Author

Built by Oluwafemi Olanrewaju Ebenezer.
