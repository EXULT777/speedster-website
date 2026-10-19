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
| `site-data.json` | Phone, email, opening hours, license number, reviews, stats and photos. Edited by the [admin panel](#admin-panel) |
| `site.ts`       | Business name, region, footer and CTA copy; builds the phone/email links and hours wording from `site-data.json` |
| `services.ts`   | Service categories and every sub-service (title, summary, icon, URL slug)                       |
| `service-details.ts` | The longer copy on each sub-service page: intro, common situations, how we handle it, steps |
| `brands.ts`     | Vehicle makes on the Car Key Replacement page, each with its own intro and the key types it uses |
| `car-keys.ts`   | Car key page copy, key types, the 4-step process, "what to have ready"                          |
| `areas.ts`      | The four cities: county, intro line, map coordinates                                            |
| `faq.ts`        | Frequently asked questions (also published as FAQ structured data)                              |
| `home.ts`       | Homepage sections                                                                               |
| `pages.ts`      | About, Contact, Privacy Policy and 404 copy (update `lastUpdated` when the policy changes)      |
| `navigation.ts` | Main menu items                                                                                 |

Some sections only appear when they have real data (all in `site-data.json`, easiest to change from `/admin`):

- **License number**: set `licenseNumber` and "TX License #…" appears in the top bar and footer.
- **Reviews**: add entries to `reviews` and a reviews section appears on the homepage. With `googleReviewUrl` set, a "Leave us a review on Google" button appears under it.
- **Stats**: add entries to `stats` and a numbers strip appears on the About page.
- **Photos**: add entries to `photos` (files go in `public/photos/`) and a photo grid appears on the About page.

Leave them empty and those sections stay hidden.

## Admin panel

`/admin` (https://exult777.github.io/speedster-website/admin/) is a private editing page. It isn't linked from the site and search engines are told not to list it. It has:

- **Business**: phone, email, opening hours, license number, total review count, Google review link
- **Reviews**, **Photos** (upload, describe, reorder, delete), **Stats**
- **Leads**: contact-form messages (needs Firebase, below)
- **Clear all**: empties reviews, photos and stats and deletes every lead. Phone, email and hours are kept.

Every "Delete all" asks you to type DELETE.

**How saving works.** The site has no server, so **Save** commits your changes to this repository (`src/content/site-data.json`, plus photo files in `public/photos/`) using your GitHub token. That push triggers the deploy workflow, and the page shows when the new version is live (about 1–2 minutes). Every save is a commit, so anything deleted from reviews, photos or stats can be restored from the repository history. If the data changed in another tab or device since you opened the page, Save stops and asks you to reload, so nothing is overwritten.

**Signing in.** You sign in with a username and password. The first visit to `/admin` shows a one-time setup screen: choose the username and password, and paste a GitHub fine-grained token (made at **GitHub → Settings → Developer settings → Fine-grained tokens** for the `speedster-website` repository only, with **Contents: Read and write** and **Actions: Read-only**). The token is saved in `src/content/admin-vault.json`, encrypted in the browser with the username and password (PBKDF2 + AES-GCM); the password itself is never stored. After the site rebuilds, the username and password are all you need. Change the password on the **Password** tab.

Because the repository is public, the encrypted file is public too, and the password is the only thing protecting it: someone who guesses it can change the website. Use a long, uncommon password. If the token expires or is deleted, sign-in offers **Set up again** to paste a new one. To lock everyone out immediately, delete the token on GitHub.

### Contact-form leads (Firebase)

The repository is public, so leads are never stored in it. They go to a free Google Firebase database instead, which only your account can read. Until this is set up, the Leads tab shows these steps and messages only arrive by email.

1. At [console.firebase.google.com](https://console.firebase.google.com/), create a project (Google Analytics is not needed).
2. **Build → Firestore Database → Create database**, production mode, any US location.
3. **Build → Authentication → Get started → Email/Password**: enable it. Under **Users → Add user**, add `speedsterlock@gmail.com` (set in `src/lib/leads.ts`) with the **same password as your admin login**, so one sign-in opens both. Copy the **User UID** shown in the list.
4. **Firestore Database → Rules**: paste the contents of `firebase/firestore.rules`, replace `PASTE_YOUR_ADMIN_UID_HERE` with your User UID, and **Publish**. These rules let anyone send a message but only your account read or delete them.
5. Optional but recommended: **Authentication → Settings → User actions**, untick **Enable create (sign-up)** so nobody else can make an account.
6. **Project settings → General**: copy the **Web API key** and **Project ID**. (If no Web API key shows, add a Web app there first.)
7. On GitHub: **Settings → Secrets and variables → Actions → Variables**, add `FIREBASE_API_KEY` and `FIREBASE_PROJECT_ID`, then re-run the deploy workflow.

Once it is on, each contact-form message is emailed (when `WEB3FORMS_KEY` is set) **and** saved for `/admin`; the Privacy Policy automatically adds a sentence saying so. The Web API key is meant to be public; the rules are what protect the leads.

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
| `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project that stores contact-form leads for `/admin` (see [Contact-form leads](#contact-form-leads-firebase)). Without them, nothing is stored. |

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
