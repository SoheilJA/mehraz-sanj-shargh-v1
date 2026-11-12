# Mehraz Sanj Sharq — Engineering Heritage Website

Premium static frontend for **شرکت مهندسی نقشه‌برداری مهراز سنج شرق** (Mehraz Sanj
Sharq Engineering & Geomatics Co., Mashhad, Iran). Persian (fa-IR), fully RTL,
built around the company's original brand identity: gold `#d4af37` on deep
charcoal `#1e2229` over warm off-white paper surfaces.

## Stack

- **Vite 6** — dev server & static multi-page build (every `.html` is an entry)
- **Tailwind CSS 3** — design tokens via CSS variables (`src/styles/main.css`)
- **Three.js** — procedural hero scene (tower, terrain contours, survey lines)
- **GSAP + ScrollTrigger** — reveals, process timeline scrub, entrance motion
- **Anime.js** — verified-indicator counters
- **Lenis** — smooth scrolling
- **Lucide** — icon set (local npm package)
- **Vazirmatn** — self-hosted Persian font (`public/fonts`, 5 weights)

No frameworks, no CDN dependencies — everything is bundled/self-hosted.

## Structure

```
index.html                    # Homepage (hero 3D, services, capabilities, projects…)
about.html  equipment.html  contact.html  faq.html  search.html  404.html
services/index.html           # Services archive
services/<slug>.html          # 4 service detail pages
projects/index.html           # Projects archive (client-side filtering)
projects/<slug>.html          # 15 documented project pages
journal/index.html            # Journal archive (search, filters, load-more)
journal/<slug>.html           # 5 article pages
public/                       # fonts, images (optimized site assets), robots, sitemap
src/
  main.js                     # bootstrap: navbar, footer, motion, page module
  styles/main.css             # design system (tokens, components, utilities)
  data/                       # ALL site content (single source of truth)
  components/                 # navbar, footer, cards, marquee, process, forms…
  scenes/hero-scene.js        # Three.js hero composition
  pages/                      # per-page renderers (home, service, project, …)
scripts/
  generate-pages.mjs          # regenerates the 24 detail shells
  generate-sitemap.mjs        # regenerates public/sitemap.xml
```

## Content architecture

All user-facing content lives in `src/data/*.js` (company, navigation,
services, projects, equipment, articles, testimonials, faq). Archives, cards,
detail pages and related-content sections all render from the same modules —
edit data once, it updates everywhere. Detail pages are real static HTML files
(unique `<title>`/meta per page) whose bodies hydrate from the data modules.

**Fidelity rules baked into the data:** every fact (manager, registration
number 95508, phones, address, equipment, 15 project records) comes from the
official catalog at mehrazsanjshargh.ir. No fabricated dates, budgets, clients,
statistics or testimonials — testimonial entries are clearly labeled demo
content (see `src/data/testimonials.js`) to be replaced with approved quotes.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
npm run preview    # serve the production build
```

Regenerate detail shells / sitemap after adding data records:

```bash
node scripts/generate-pages.mjs
node scripts/generate-sitemap.mjs
```

## Notes

- Deployment: any static host — serve the `dist/` folder (no backend needed).
- The contact form validates on the client and then offers real channels
  (mailto/tel); it deliberately does not pretend to send without a backend.
- Map block on the contact page is a stylized placeholder wired to
  `company.map` (lat/lng) in the data module — swap in an embed there.
- `prefers-reduced-motion` is respected: Lenis/GSAP/three animations are
  disabled or reduced to static frames, marquees stop.
