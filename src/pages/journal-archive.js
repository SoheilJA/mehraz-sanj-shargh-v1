/**
 * Journal archive — featured article, category filters, live search,
 * editorial cards and a load-more control.
 */
import { articles, articleCategories, readingTime } from '../data/articles.js'
import { articleCard } from '../components/cards.js'
import { icon } from '../utils/dom.js'
import { padFa } from '../utils/str.js'

const PAGE_SIZE = 3

export async function mount() {
  const featuredRoot = document.getElementById('journal-featured')
  const chipsRoot = document.getElementById('journal-filters')
  const grid = document.getElementById('journal-grid')
  const searchInput = document.getElementById('journal-search')
  const moreBtn = document.getElementById('journal-more')
  const empty = document.getElementById('journal-empty')
  if (!grid) return

  const params = new URLSearchParams(location.search)
  let activeCat = articleCategories.includes(params.get('cat')) ? params.get('cat') : 'all'
  let query = (params.get('q') || '').trim()
  let shown = PAGE_SIZE

  if (searchInput && query) searchInput.value = query

  // Featured — the first article (only when no active filter)
  const renderFeatured = () => {
    if (!featuredRoot) return
    if (activeCat !== 'all' || query) {
      featuredRoot.innerHTML = ''
      return
    }
    const a = articles[0]
    featuredRoot.innerHTML = `
    <a href="/journal/${a.slug}.html" class="card group grid lg:grid-cols-12 overflow-hidden reveal">
      <div class="lg:col-span-8 p-8 md:p-12 flex flex-col justify-center">
        <div class="flex items-center gap-4 mb-6">
          <span class="chip active !cursor-default !text-xs">${a.category}</span>
          <span class="flex items-center gap-1.5 text-xs text-muted">${icon('clock', 'h-3.5 w-3.5')} ${padFa(readingTime(a))} دقیقه مطالعه</span>
          <span class="tech-code">${a.code}</span>
        </div>
        <h2 class="text-h2 font-extrabold text-ink leading-[1.4]">${a.title}</h2>
        <p class="mt-5 text-muted leading-8 max-w-2xl">${a.excerpt}</p>
        <span class="mt-7 inline-flex items-center gap-2 text-sm font-bold text-golddeep transition-all group-hover:gap-3.5">
          خواندن مقاله منتخب ${icon('arrow-left', 'h-4 w-4')}
        </span>
      </div>
      <div class="lg:col-span-4 bg-ink relative min-h-[200px] flex items-center justify-center overflow-hidden">
        <div class="blueprint-grid-dark absolute inset-0 opacity-60"></div>
        <span class="absolute font-mono font-extrabold text-gold/25 text-8xl select-none">${a.code.slice(-2)}</span>
        <span class="relative text-white/70 en-note">FEATURED ARTICLE</span>
      </div>
    </a>`
  }

  const matches = (a) => {
    if (activeCat !== 'all' && a.category !== activeCat) return false
    if (!query) return true
    const hay = (a.title + ' ' + a.excerpt + ' ' + a.category).toLowerCase()
    return query
      .toLowerCase()
      .split(/\s+/)
      .every((w) => hay.includes(w))
  }

  const renderChips = () => {
    if (!chipsRoot) return
    chipsRoot.innerHTML = [{ key: 'all', label: 'همه' }, ...articleCategories.map((c) => ({ key: c, label: c }))]
      .map((c) => `<button type="button" data-cat="${c.key}" class="chip ${activeCat === c.key ? 'active' : ''}">${c.label}</button>`)
      .join('')
    chipsRoot.querySelectorAll('[data-cat]').forEach((btn) =>
      btn.addEventListener('click', () => {
        activeCat = btn.dataset.cat
        shown = PAGE_SIZE
        renderFeatured()
        renderChips()
        renderGrid()
      })
    )
  }

  const renderGrid = () => {
    const list = articles.filter(matches)
    const visible = list.slice(0, shown)
    grid.innerHTML = visible.map((a) => articleCard(a)).join('')

    if (empty) empty.classList.toggle('hidden', list.length > 0)
    if (moreBtn) {
      moreBtn.classList.toggle('hidden', shown >= list.length)
      const rest = list.length - shown
      moreBtn.querySelector('span').textContent = `نمایش ${padFa(Math.min(PAGE_SIZE, rest))} مقاله دیگر (${padFa(rest)} باقی‌مانده)`
    }
    import('../components/icons.js').then(({ initIcons }) => initIcons())
    import('../utils/motion.js').then(({ initReveals }) => initReveals())
  }

  if (searchInput) {
    let t
    searchInput.addEventListener('input', () => {
      clearTimeout(t)
      t = setTimeout(() => {
        query = searchInput.value.trim()
        shown = PAGE_SIZE
        renderFeatured()
        renderGrid()
      }, 200)
    })
  }

  moreBtn?.addEventListener('click', () => {
    shown += PAGE_SIZE
    renderGrid()
  })

  renderFeatured()
  renderChips()
  renderGrid()
}
