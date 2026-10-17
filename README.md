# TripWise
Travel planner for the AWS Student Builder Group recruitment project at VIT Chennai.

Live site: [tripwise-lime.vercel.app](https://tripwise-lime.vercel.app)

Public repository: [Kedhar155/TripWise](https://github.com/Kedhar155/TripWise)

Stack: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui conventions, Supabase, Geoapify, Vercel.

## Local development
1. Fill the three values in `.env.local` (see `.env.example`). Keep this file private.
2. Run `npm run dev` and open http://localhost:3000.
3. Run `npm run lint`, `npm run typecheck`, and `npm run build` to check the project.

API credentials stay on the server. Each browser receives a random visitor ID stored in localStorage. Trips are saved in Supabase without login. A visitor ID is not a substitute for authentication for sensitive data.

City search, category filtering, sorting, place details, and saved trips are complete. See [PROGRESS.md](PROGRESS.md) for the phase history, [docs/API.md](docs/API.md) for API details, and [docs/phase-e/API_TESTS.md](docs/phase-e/API_TESTS.md) for the 28 passing production checks.

## Hosting

The production project is `markan2/tripwise` on Vercel's Hobby plan. Its three hidden production settings are `GEOAPIFY_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SECRET_KEY`, matching the existing app and local environment file. The third setting uses the Supabase secret key name approved during deployment.

The site was deployed with the Vercel CLI. Automatic deployment from GitHub is not connected; future pushes need a separate CLI deployment. Vercel CLI is installed locally without changing the dependency manifest. Its login and project data are under ignored `.vercel/`. `.env.local` is ignored by Git, and `.vercelignore` also excludes all environment files and local login data from uploads.

To repeat production API checks in PowerShell:

```powershell
$env:TEST_BASE_URL='https://tripwise-lime.vercel.app'
$env:TEST_REPORT_PATH='docs/phase-e/API_TESTS.md'
node scripts/test-api.mjs
```

The checks use fresh random test visitors and remove only records created by that run.
