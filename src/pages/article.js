/**
 * Single article renderer (slug from body[data-slug]):
 * TOC + scrollspy, prose blocks, reading time, share, related content.
 */
import { getArticle, getArticles, readingTime } from '../data/articles.js'
import { getServices } from '../data/services.js'
import { pageHero, sectionHead } from '../components/page-hero.js'
import { articleCard } from '../components/cards.js'
import { icon } from '../utils/dom.js'
import { padFa } from '../utils/str.js'

let tocId = 0

function slugify(text) {
  return 'h-' + text.replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 40)
}

function renderBlocks(blocks) {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'h2': {
          const id = slugify(b.text) + '-' + ++tocId
          return `<h2 id="${id}" data-toc="${id}">${b.text}</h2>`
        }
        case 'ul':
          return `<ul>${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>`
        case 'quote':
          return `<blockquote>${b.text}</blockquote>`
        case 'table':
          return `<div class="overflow-x-auto"><table>
            <thead><tr>${b.head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
          </table></div>`
        default:
          return `<p>${b.text}</p>`
      }
    })
    .join('')
}

export async function mount() {
  const slug = document.body.dataset.slug
  const a = getArticle(slug)
  if (!a) return

  const hero = document.getElementById('page-hero')
  const body = document.getElementById('page-body')
  if (!hero || !body) return

  const mins = readingTime(a)
  const h2s = a.blocks.filter((b) => b.type === 'h2')

  hero.innerHTML = pageHero({
    kicker: `${a.category} — ${a.code}`,
    title: a.title,
    lead: a.excerpt,
    code: a.code,
    crumbs: [
      { label: 'خانه', href: '/index.html' },
      { label: 'مجله', href: '/journal/index.html' },
      { label: a.category, href: `/journal/index.html?cat=${encodeURIComponent(a.category)}` },
      { label: 'مقاله' },
    ],
  })

  body.innerHTML = `
  <section class="section">
    <div class="wrap grid lg:grid-cols-12 gap-12">
      <!-- article body -->
      <article class="lg:col-span-8">
        <header class="flex flex-wrap items-center gap-x-6 gap-y-3 pb-8 mb-8 border-b border-ink/10 reveal">
          <span class="flex items-center gap-2 text-xs text-muted">${icon('clock', 'h-4 w-4')} ${padFa(mins)} دقیقه مطالعه</span>
          <span class="flex items-center gap-2 text-xs text-muted">${icon('pen-line', 'h-4 w-4')} تحریریه فنی مهراز سنج شرق</span>
          <span class="flex items-center gap-2 text-xs text-muted">${icon('file-text', 'h-4 w-4')} ${a.code}</span>
          <span class="ms-auto flex items-center gap-2">
            <button id="share-copy" class="btn btn-ghost !h-9 !px-3.5 !text-xs" type="button">${icon('link', 'h-3.5 w-3.5')} کپی لینک</button>
            <a id="share-mail" class="btn btn-ghost !h-9 !px-3.5 !text-xs" href="#">${icon('mail', 'h-3.5 w-3.5')} اشتراک ایمیل</a>
          </span>
        </header>
        <div class="prose-fa reveal">
          ${renderBlocks(a.blocks)}
        </div>
      </article>

      <!-- sidebar -->
      <aside class="lg:col-span-4">
        <div class="lg:sticky lg:top-32 flex flex-col gap-6">
          <nav class="card bg-paper2 p-6 reveal" aria-label="فهرست مطالب">
            <p class="en-note mb-4">TABLE OF CONTENTS</p>
            <ol class="space-y-3 text-sm">
              ${h2s
                .map((h, i) => {
                  const id = 'h-' + slugify(h.text) + '-' + (i + 1)
                  return `<li><a class="toc-link text-muted hover:text-golddeep leading-7 transition-colors" href="#${id}">${padFa(i + 1)}. ${h.text}</a></li>`
                })
                .join('')}
            </ol>
          </nav>
          <div class="card p-6 reveal">
            <p class="en-note mb-4">RELATED SERVICES</p>
            <div class="flex flex-col gap-3">
              ${getServices(a.relatedServices)
                .map(
                  (s) => `
                <a href="/services/${s.slug}.html" class="flex items-center justify-between gap-3 text-sm text-inksoft hover:text-golddeep transition-colors">
                  <span class="font-bold">${s.shortTitle}</span>
                  ${icon('arrow-left', 'h-4 w-4 opacity-50')}
                </a>`
                )
                .join('')}
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>

  <!-- related articles -->
  <section class="section bg-paper2 border-y border-ink/10">
    <div class="wrap">
      ${sectionHead('RELATED ARTICLES', 'مقالات مرتبط', '')}
      <div class="grid md:grid-cols-2 gap-6" id="article-related"></div>
    </div>
  </section>`

  // ids must match between TOC and headings (order-dependent)
  const headings = body.querySelectorAll('h2[data-toc]')
  const tocLinks = body.querySelectorAll('.toc-link')
  headings.forEach((h, i) => {
    const link = tocLinks[i]
    if (link) link.setAttribute('href', '#' + h.id)
  })

  // scrollspy
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        tocLinks.forEach((l) => l.classList.remove('!text-golddeep', 'font-bold'))
        const active = body.querySelector(`.toc-link[href="#${e.target.id}"]`)
        if (active) active.classList.add('!text-golddeep', 'font-bold')
      })
    },
    { rootMargin: '-20% 0px -70% 0px' }
  )
  headings.forEach((h) => spy.observe(h))

  // share
  const url = location.href
  const shareTitle = encodeURIComponent(a.title + ' | مجله مهراز سنج شرق')
  const copyBtn = document.getElementById('share-copy')
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url)
      copyBtn.innerHTML = `${icon('check', 'h-3.5 w-3.5')} لینک کپی شد`
      setTimeout(() => (copyBtn.innerHTML = `${icon('link', 'h-3.5 w-3.5')} کپی لینک`), 2000)
    } catch {
      /* clipboard unavailable */
    }
  })
  const mail = document.getElementById('share-mail')
  if (mail) mail.href = `mailto:?subject=${shareTitle}&body=${encodeURIComponent(url)}`

  // related articles
  const relRoot = document.getElementById('article-related')
  if (relRoot) {
    relRoot.innerHTML = getArticles(a.relatedArticles)
      .map((ra) => articleCard(ra))
      .join('')
  }
}
