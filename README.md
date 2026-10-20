# Quest Verse

A social, map-based quest and photo app for Lagos State University (LASU) students. Students complete quests, take photos tied to real places on campus, and build a personal photo vault.

This repository currently has the project setup plus sign-in and a basic profile. Other features are not built yet.

## Stack

- Vite, React and TypeScript (strict mode)
- React Router for pages
- Supabase for accounts, database and photo storage (accounts and profiles are in use)

Other tools (map, 3D, animation) will be added one at a time, each with a reason.

## Run it

1. Install Node.js (the current LTS version; see `.nvmrc`).
2. Install packages: `npm install`
3. Copy `.env.example` to `.env` and fill in your own Supabase values.
4. Start the app: `npm run dev`

## Set up accounts (Supabase)

The app runs without Supabase: pages are open and a notice says accounts are not set up. Once you add the two Supabase values, sign-in switches on and the pages require a signed-in student. Note that Supabase pauses idle free projects, so set it up shortly before you need it.

1. Create a project at supabase.com. Copy the project URL and the anon public key into `.env`.
2. In the Supabase SQL editor, run `supabase/migrations/0001_profiles.sql`. It creates the profiles table, restricts it so each person can only see their own row, and creates a profile automatically at sign-up.
3. Google sign-in: in Google Cloud Console, create an OAuth client of type Web. In Supabase, go to Authentication, then Providers, then Google, and paste the client ID and secret. Add the callback URL that Supabase shows you to the Google client's authorised redirect URIs.
4. In Supabase, go to Authentication, then URL Configuration. Set the site URL, and add `http://localhost:5173` for development.
5. Email links: Supabase's built-in email sender is only for light testing. Before launch, set up your own email sender under Authentication settings.

Google note: an OAuth app left in "Testing" mode in Google Cloud is limited to a small list of test users. Check Google's current rules and publish the app before a public launch.

## Scripts

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the development server          |
| `npm run build`     | Type-check, then build for production |
| `npm run preview`   | Preview the production build          |
| `npm run lint`      | Check the code with ESLint            |
| `npm run format`    | Format all files with Prettier        |
| `npm run typecheck` | Check types without building          |

## Folder map

- `src/app`: app shell and routes
- `src/features`: one folder per feature (auth, quests, camera, vault, map, profile)
- `supabase/migrations`: database setup scripts, run in order
- `src/components`: shared components
- `src/lib`: shared helpers, including the Supabase client
- `src/assets`: images and static files

The `@` alias points to `src`, so `@/lib/supabase` means `src/lib/supabase`.

## Rules

- Never commit secrets. Keys go in `.env`, which is ignored by git.
- One feature per branch.
- Open a pull request for every change, and fill in the checklist.

## Licence

Not decided yet.
v1
