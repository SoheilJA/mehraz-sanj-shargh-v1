/**
 * Generates public/sitemap.xml from the page list (run after
 * generate-pages.mjs). Run: node scripts/generate-sitemap.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://www.mehrazsanjshargh.ir'

const collect = (dir, base = '') => {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.') || name === 'dist') continue
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) out.push(...collect(full, `${base}/${name}`))
    else if (name.endsWith('.html') && name !== '404.html') {
      out.push((base === '' ? '/' : base + '/') + (name === 'index.html' ? '' : name))
    }
  }
  return out
}

const urls = [...new Set(collect(rootDir))].sort()
const today = new Date().toISOString().slice(0, 10)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE}${u === '/' ? '/' : u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u === '/' ? '1.0' : u.endsWith('/') ? '0.8' : '0.6'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), xml)
console.log(`sitemap: ${urls.length} urls`)
