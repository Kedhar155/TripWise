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

All six extras are live: category icons/colors, a teal search banner with popular-city shortcuts, card hover effects/loading skeletons/toasts/footer, current weather and a three-day forecast, day-wise planning, and a trip summary. Search, filters, sorting, saving, day moves, removal, and refresh persistence are verified on the public site. See [PROGRESS.md](PROGRESS.md) for release history, [docs/API.md](docs/API.md) for API details, and [live API checks](docs/extras/release-live-api-tests.md) for all 59 passing production requests.

The deployed application comes from tested commit `7046cd2` on `main`; the deployment notes and screenshots are recorded afterward. Empty day headings stay in this browser; saved places and day assignments stay in Supabase.

## Hosting

The production project is `markan2/tripwise` on Vercel's Hobby plan. Its three hidden production settings are `GEOAPIFY_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SECRET_KEY`, matching the existing app and local environment file. The third setting uses the Supabase secret key name approved during deployment.

The site was deployed with the Vercel CLI. Automatic deployment from GitHub is not connected; future pushes need a separate CLI deployment. Vercel CLI is installed locally without changing the dependency manifest. Its login and project data are under ignored `.vercel/`. `.env.local` is ignored by Git, and `.vercelignore` also excludes all environment files and local login data from uploads.

To repeat production API checks in PowerShell:

```powershell
$env:TEST_BASE_URL='https://tripwise-lime.vercel.app'
$env:TEST_REPORT_PATH='docs/extras/release-live-api-tests.md'
node scripts/test-api.mjs
```

The checks use fresh random test visitors and remove only records created by that run.
