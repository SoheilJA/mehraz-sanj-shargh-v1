/**
 * Search page — client-side full search across services, projects,
 * articles and FAQ entries. Reads and live-updates ?q=.
 */
import { services } from '../data/services.js'
import { projects, projectCategories } from '../data/projects.js'
import { articles } from '../data/articles.js'
import { faq } from '../data/faq.js'
import { icon } from '../utils/dom.js'
import { faNumber } from '../utils/str.js'

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[يﻱ]/g, 'ی')
    .replace(/[كﻙ]/g, 'ک')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\u200c/g, ' ')
}

export async function mount() {
  const input = document.getElementById('search-input')
  const results = document.getElementById('search-results')
  const meta = document.getElementById('search-meta')
  if (!input || !results) return

  const index = [
    ...services.map((s) => ({
      type: 'خدمت',
      href: `/services/${s.slug}.html`,
      title: s.title,
      text: s.cardDesc + ' ' + s.overview.join(' '),
      code: s.code,
    })),
    ...projects.map((p) => ({
      type: 'پروژه',
      href: `/projects/${p.slug}.html`,
      title: p.title,
      text: p.summary + ' ' + p.description.join(' '),
      code: p.code,
      cat: projectCategories[p.category],
    })),
    ...articles.map((a) => ({
      type: 'مقاله',
      href: `/journal/${a.slug}.html`,
      title: a.title,
      text: a.excerpt + ' ' + a.blocks.map((b) => b.text || (b.items || []).join(' ')).join(' '),
      code: a.code,
    })),
    ...faq.map((f, i) => ({
      type: 'پرسش متداول',
      href: '/faq.html',
      title: f.q,
      text: f.a,
      code: `FAQ-${i + 1}`,
    })),
  ]

  const search = (raw) => {
    const q = raw.trim()
    history.replaceState(null, '', q ? `search.html?q=${encodeURIComponent(q)}` : 'search.html')
    if (!q) {
      results.innerHTML = ''
      meta.textContent = ''
      return
    }
    const words = normalize(q).split(/\s+/).filter(Boolean)
    const hits = index.filter((item) => {
      const hay = normalize(item.title + ' ' + item.text)
      return words.every((w) => hay.includes(w))
    })

    meta.textContent = hits.length
      ? `${faNumber(hits.length)} نتیجه برای «${q}»`
      : ''

    results.innerHTML = hits.length
      ? hits
          .map(
            (h) => `
        <a href="${h.href}" class="card p-6 group block reveal-init">
          <div class="flex items-center justify-between gap-4 mb-2.5">
            <span class="flex items-center gap-3">
              <span class="chip !cursor-default !text-[0.68rem] !px-3 !py-1">${h.type}${h.cat ? ' · ' + h.cat : ''}</span>
              <span class="tech-code">${h.code}</span>
            </span>
            ${icon('arrow-left', 'h-4 w-4 text-golddeep transition-transform group-hover:-translate-x-1')}
          </div>
          <h3 class="font-bold text-ink text-lg leading-8">${h.title}</h3>
          <p class="mt-2 text-sm leading-7 text-muted line-clamp-2">${h.text}</p>
        </a>`
          )
          .join('')
      : `
        <div class="card p-10 text-center">
          <p class="text-ink font-bold">نتیجه‌ای یافت نشد.</p>
          <p class="mt-3 text-sm text-muted leading-7">عبارت دیگری را امتحان کنید؛ مثلاً «آکس»، «ازبیلت»، «گودبرداری» یا «UTM».</p>
        </div>`
    import('../components/icons.js').then(({ initIcons }) => initIcons())
  }

  const params = new URLSearchParams(location.search)
  const initial = params.get('q') || ''
  if (initial) input.value = initial
  search(initial)

  let t
  input.addEventListener('input', () => {
    clearTimeout(t)
    t = setTimeout(() => search(input.value), 180)
  })
}
