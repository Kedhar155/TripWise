# TripWise
Travel planner for the AWS Student Builder Group recruitment project at VIT Chennai.

Stack: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui conventions, Supabase, Geoapify. Planned hosting: Vercel.

## Local development
1. Fill the three values in `.env.local` (see `.env.example`). Keep this file private.
2. Run `npm run dev` and open http://localhost:3000.
3. Run `npm run lint`, `npm run typecheck`, and `npm run build` to check the project.

All API credentials will stay on the server. Each browser will receive a random visitor ID stored in localStorage. No login is planned. A visitor ID is not a substitute for authentication for sensitive data.

See PROGRESS.md for completed work and remaining phases. The database table and five API routes are ready as of phase 2; the welcome page will be connected in phase 3. See docs/API.md for request formats and checks.
