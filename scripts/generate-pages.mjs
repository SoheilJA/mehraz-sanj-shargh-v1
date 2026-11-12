/**
 * Generates the static shell pages for services, projects and journal
 * articles. Each page is a real .html file with unique <title>/<meta>
 * (SEO) and a body that renders from the centralized data modules.
 *
 * Run: node scripts/generate-pages.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// --- read data directly from the src data files (regex-free: import them) ---
const servicesMod = fs.readFileSync(path.join(rootDir, 'src/data/services.js'), 'utf8')
const projectsMod = fs.readFileSync(path.join(rootDir, 'src/data/projects.js'), 'utf8')
const articlesMod = fs.readFileSync(path.join(rootDir, 'src/data/articles.js'), 'utf8')

// Extract slugs & seo via data-url-free eval of the module source (pure data, no imports)
const evalModule = (src) => {
  const cut = src.indexOf('/** Find') // strip helper functions
  const body = cut > 0 ? src.slice(0, cut) : src.replace(/export function[\s\S]*$/, '')
  const exports_ = []
  const wrapped = body
    .replace(/export const /g, '__exports__.')
    .replace(/export function \w+[^{]*\{[\s\S]*?\n\}/g, '')
  const fn = new Function('__exports__', wrapped)
  const bag = {}
  fn(bag)
  return bag
}

const services = evalModule(servicesMod).services
const projects = evalModule(projectsMod).projects
const articles = evalModule(articlesMod).articles

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const shell = ({ page, slug, title, desc, canonical, ogTitle }) => `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="https://www.mehrazsanjshargh.ir${canonical}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="fa_IR" />
  <meta property="og:site_name" content="مهراز سنج شرق" />
  <meta property="og:title" content="${esc(ogTitle)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="https://www.mehrazsanjshargh.ir${canonical}" />
  <meta property="og:image" content="https://www.mehrazsanjshargh.ir/images/brand/logo.png" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <script>if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('no-motion')</script>
</head>
<body data-page="${page}" data-slug="${slug}">
  <noscript><style>.reveal { opacity: 1 }</style></noscript>
  <header id="site-nav" class="site-nav"></header>
  <main id="main">
    <div id="page-hero"></div>
    <div id="page-body"></div>
  </main>
  <footer id="site-footer" class="section-dark relative overflow-hidden"></footer>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
`

let count = 0

for (const s of services) {
  const file = path.join(rootDir, 'services', `${s.slug}.html`)
  fs.writeFileSync(
    file,
    shell({
      page: 'service',
      slug: s.slug,
      title: s.seo.title,
      desc: s.seo.desc,
      canonical: `/services/${s.slug}.html`,
      ogTitle: s.title,
    })
  )
  count++
}

for (const p of projects) {
  const file = path.join(rootDir, 'projects', `${p.slug}.html`)
  fs.writeFileSync(
    file,
    shell({
      page: 'project',
      slug: p.slug,
      title: p.seo.title,
      desc: p.seo.desc,
      canonical: `/projects/${p.slug}.html`,
      ogTitle: p.title,
    })
  )
  count++
}

for (const a of articles) {
  const file = path.join(rootDir, 'journal', `${a.slug}.html`)
  fs.writeFileSync(
    file,
    shell({
      page: 'article',
      slug: a.slug,
      title: a.seo.title,
      desc: a.seo.desc,
      canonical: `/journal/${a.slug}.html`,
      ogTitle: a.title,
    })
  )
  count++
}

console.log(`generated ${count} pages`)
console.log('services:', services.map((s) => s.slug).join(', '))
console.log('projects:', projects.length, 'articles:', articles.length)
