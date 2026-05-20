# Shorty — custom URL shortener

A minimal Next.js + Tailwind + Supabase URL shortener with custom short names.

## Stack

- Next.js 14 (App Router, JavaScript)
- Tailwind CSS
- Supabase (Postgres)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Supabase project** at https://supabase.com and run the SQL in [supabase/schema.sql](supabase/schema.sql) using the SQL editor.

3. **Configure env**

   Copy `.env.example` to `.env.local` and fill in:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## How it works

- **Home** ([app/page.jsx](app/page.jsx)) — form for long URL + custom name. Submits to `/api/links`.
- **Create API** ([app/api/links/route.js](app/api/links/route.js)) — validates input, checks uniqueness, inserts row.
- **Redirect** ([app/[shortCode]/page.jsx](app/%5BshortCode%5D/page.jsx)) — looks up `short_code` and redirects to `original_url`, or shows a not-found message.

## Schema

```
links (
  id uuid primary key,
  original_url text,
  short_code text unique,
  created_at timestamptz
)
```
