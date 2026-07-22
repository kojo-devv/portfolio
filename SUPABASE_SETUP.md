# Supabase Setup

This portfolio reads all public content from Supabase. Follow these steps after deploying or running locally.

## 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com).

## 2. Run the database migration

Open the Supabase SQL editor and run:

`supabase/migrations/001_initial_schema.sql`

This creates the content tables, row-level security policies, storage buckets, and seed data.

## 3. Configure environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use your production URL for `NEXT_PUBLIC_SITE_URL` in production.

## 4. Disable public sign-up

In Supabase:

1. Go to **Authentication → Providers → Email**
2. Disable **Enable sign ups**

Only your admin account should exist.

## 5. Create the admin user

In Supabase:

1. Go to **Authentication → Users**
2. Click **Add user**
3. Create your single administrator account

Use that email and password at `/admin/login`.

## 6. Configure auth redirect URLs

In Supabase **Authentication → URL Configuration**, add:

- Site URL: your production domain
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.com/auth/callback`

## 7. Start the app

```bash
npm run dev
```

Public site: `/`

Admin dashboard: `/admin`

## Managing content

Use the admin dashboard to edit:

- Hero copy, buttons, and featured project
- Featured projects, images, order, and publish status
- About section and strength cards
- Contact links
- Copyright text

Changes revalidate the public site automatically. No code changes are required after deployment.
