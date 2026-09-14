# Migration Guardian UI

The web interface for [Migration Guardian](https://github.com/bencipher/migration-guardian), a PostgreSQL migration-review workflow. It lets an authenticated user test a source connection, upload a migration file, monitor its review, and inspect the resulting safety assessment.

- Live UI: [migration-guardian-ui.vercel.app](https://migration-guardian-ui.vercel.app/)
- Frontend repository: [bencipher/migration-guardian-ui](https://github.com/bencipher/migration-guardian-ui)
- Backend API and Swagger: [migration-guardian.onrender.com/docs](https://migration-guardian.onrender.com/docs)
- Backend technical documentation: [bencipher/migration-guardian](https://github.com/bencipher/migration-guardian)

## Stack

- React 18, TypeScript, and React Router
- Vite 5
- Tailwind CSS
- Lucide React icons
- Vercel static hosting

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL when it starts (normally `http://localhost:5173`).

Other useful commands:

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

## API configuration

The browser client requires one public Vite environment variable:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8001
```

Use the URL of the Migration Guardian API that the UI should call. The local backend is commonly served at `http://127.0.0.1:8001`; the deployed UI uses `https://migration-guardian.onrender.com`.

Create a local `.env` or `.env.local` file with `VITE_API_BASE_URL` before starting Vite. In Vercel, set the same variable for Production and Preview deployments.

`VITE_*` values are bundled into client-side code. Do not put credentials, database URLs, or private tokens in them.

## Review flow

1. Test the supplied source PostgreSQL connection through `POST /api/v1/connections/test`.
2. Select or auto-detect a migration type and upload a `.sql` or `.py` migration through `POST /api/v1/reviews/file`.
3. A successful `202` response supplies a review ID. The UI immediately opens that review’s detail route in its queued state.
4. While the review is `queued` or `processing`, the detail page refreshes `GET /api/v1/reviews/{review_id}` every two seconds until it reaches a terminal state.
5. Completed or failed assessments display their decision, risk, issues, checks, warnings, next steps, and available diagnostics.

The UI also submits public lead forms to `POST /api/v1/waitlist` and `POST /api/v1/contact-requests`.

## Browser cache behavior

Review details and the review-history list are cached in memory and in browser `localStorage`, capped at 50 reviews. This avoids unnecessary refetches when returning to completed or failed reviews, including after a page reload.

Only queued and processing reviews bypass that cache for polling. When a new review is accepted, it is inserted into an already-cached review list; if no list has been loaded, the next visit fetches the authoritative list from the API.

## Deployment

The project deploys as a Vite static application on Vercel:

```bash
npm run build
```

The output directory is `dist`. [vercel.json](./vercel.json) rewrites all routes to `index.html`, so direct loads and refreshes of client-side routes such as `/app` and `/app/reviews/:id` are handled by React Router.

Before a production release, configure `VITE_API_BASE_URL` in Vercel and ensure the backend allows the Vercel site origin through its CORS configuration.

## Scope and security notes

- The frontend sends the source connection value supplied by the user to the configured Migration Guardian API; use a dedicated read-only database role.
- The UI does not execute migrations in the browser.
- API behavior, database isolation, and assessment logic belong to the backend repository linked above.
