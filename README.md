# Speedster Lock & Key — website

Marketing site for Speedster Lock & Key, a mobile locksmith serving Midland, Odessa, Lubbock, and Amarillo, Texas.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. 3D work uses Three.js with React Three Fiber; scroll motion uses GSAP.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start          # serves the build on http://localhost:3000
```

Other scripts:

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run typecheck` | Type-checks the whole project                         |
| `npm run lint`      | Runs ESLint                                           |
| `npm run brand`     | Rebuilds the logo, favicons and app icons (see below) |

## Edit the content

All copy and business details live in `src/content/`. Pages are generated from these files, so you rarely need to touch a component.

| File            | What's in it                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `site.ts`       | Business name, phone, email, hours, license number, reviews, stats, photos, footer and CTA copy |
| `services.ts`   | Service categories and every sub-service (title, summary, icon, URL slug)                       |
| `service-details.ts` | The longer copy on each sub-service page: intro, common situations, how we handle it, steps |
| `brands.ts`     | Vehicle makes on the Car Key Replacement page, each with its own intro and the key types it uses |
| `car-keys.ts`   | Car key page copy, key types, the 4-step process, "what to have ready"                          |
| `areas.ts`      | The four cities: county, intro line, map coordinates                                            |
| `faq.ts`        | Frequently asked questions (also published as FAQ structured data)                              |
| `home.ts`       | Homepage sections                                                                               |
| `pages.ts`      | About, Contact, Privacy Policy and 404 copy (update `lastUpdated` when the policy changes)      |
| `navigation.ts` | Main menu items                                                                                 |

Some sections only appear when they have real data:

- **License number**: set `licenseNumber` in `site.ts` and "TX License #…" appears in the top bar and footer.
- **Reviews**: add entries to `reviews` (and optionally `googleReviewUrl`) and a reviews section appears on the homepage.
- **Stats**: add entries to `stats` and a numbers strip appears on the About page.
- **Photos**: add entries to `photos` (files go in `public/`) and a photo grid appears on the About page.

Leave them empty and those sections stay hidden.

## Logo and icons

The site logo is `public/brand/logo.png`. It is made from the original artwork in `brand/logo-source.jpg` with every black area turned transparent, so the page background shows through the badge.

To use new artwork, replace `brand/logo-source.jpg` (or pass a path) and rebuild every derived asset:

```bash
npm run brand                        # uses brand/logo-source.jpg
npm run brand -- path/to/new-logo.png
```

This regenerates the logo, `favicon.ico`, the app icons, and the web-manifest icons. Black in the artwork becomes transparent (artwork that is already transparent works too), and the site picks up the new logo's size automatically. The small favicon is cropped from the padlock in the artwork (`MARK_CROP` in `scripts/brand-assets.mjs`), so adjust that crop if the new artwork is laid out differently.

The social-sharing image (`src/app/opengraph-image.tsx`) is generated from the logo at build time.

## Environment variables

Create `.env.local` for local development, or set these in your hosting dashboard:

| Variable                     | Purpose                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | The live site address, e.g. `https://www.example.com`. Used for canonical links, the sitemap and social previews. On Vercel it defaults to the project's production domain. |
| `NEXT_PUBLIC_WEB3FORMS_KEY`  | Access key from [web3forms.com](https://web3forms.com) for the contact form. Without it, the form opens a pre-filled email instead.  |

## Deploy to GitHub Pages

The site is live at https://exult777.github.io/speedster-website/. Every push to `main` rebuilds and publishes it through `.github/workflows/deploy.yml` (progress shows in the repository's **Actions** tab).

- The workflow sets `PAGES_BASE_PATH`, which switches `next.config.ts` to a static export in `out/` served under `/speedster-website`. Without it, `npm run dev` and `npm run build` work as a normal Next.js app.
- To turn on email delivery from the contact form, add a repository secret named `WEB3FORMS_KEY` (**Settings → Secrets and variables → Actions**) and re-run the workflow.
- For a custom domain, add it under **Settings → Pages**, then in the workflow set `PAGES_BASE_PATH` to `""` and `NEXT_PUBLIC_SITE_URL` to the domain.

## Deploy to Vercel

1. Push this folder to a GitHub, GitLab or Bitbucket repository.
2. In Vercel, choose **Add New → Project** and import the repository. The defaults (framework: Next.js, build command `next build`) are correct.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_WEB3FORMS_KEY`.
4. Deploy. After adding a custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy.

Every page is generated as static HTML at build time. The GitHub Pages build fails if a page accidentally becomes dynamic.

## Fonts

Saira and Barlow are loaded through `next/font`. The copies in `assets/fonts/` are used only to draw the social-sharing image and are licensed under the SIL Open Font License (see the `OFL-*.txt` files next to them).
