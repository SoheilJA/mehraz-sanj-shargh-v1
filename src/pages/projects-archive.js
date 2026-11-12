/**
 * Projects archive — client-side category filtering without page reload.
 * Reads ?cat= on load, syncs URL via history.replaceState.
 */
import { projects, projectCategories } from '../data/projects.js'
import { projectCard } from '../components/cards.js'
import { icon } from '../utils/dom.js'
import { faNumber } from '../utils/str.js'

export async function mount() {
  const chipsRoot = document.getElementById('projects-filters')
  const grid = document.getElementById('projects-grid')
  const count = document.getElementById('projects-count')
  if (!chipsRoot || !grid) return

  const cats = Object.keys(projectCategories)
  const params = new URLSearchParams(location.search)
  let active = cats.includes(params.get('cat')) ? params.get('cat') : 'all'

  const chips = [
    { key: 'all', label: 'همه پروژه‌ها' },
    ...cats.map((c) => ({ key: c, label: projectCategories[c] })),
  ]

  const renderChips = () => {
    chipsRoot.innerHTML = chips
      .map((c) => {
        const n = c.key === 'all' ? projects.length : projects.filter((p) => p.category === c.key).length
        return `<button type="button" data-cat="${c.key}" class="chip ${active === c.key ? 'active' : ''}">
          ${c.label} <span class="chip-count num">${faNumber(n)}</span>
        </button>`
      })
      .join('')
    chipsRoot.querySelectorAll('[data-cat]').forEach((btn) =>
      btn.addEventListener('click', () => setFilter(btn.dataset.cat))
    )
  }

  const renderGrid = () => {
    const list = active === 'all' ? projects : projects.filter((p) => p.category === active)
    grid.innerHTML = list.map((p) => projectCard(p, 'md')).join('')
    if (count) {
      count.textContent = `نمایش ${faNumber(list.length)} سابقه اجرایی از ${faNumber(projects.length)}`
    }
  }

  const setFilter = (key) => {
    active = key
    history.replaceState(null, '', key === 'all' ? 'index.html' : `index.html?cat=${key}`)
    renderChips()
    renderGrid()
    // re-run icons & reveals for fresh nodes
    import('../components/icons.js').then(({ initIcons }) => initIcons())
    import('../utils/motion.js').then(({ initReveals }) => initReveals())
  }

  renderChips()
  renderGrid()

  // CTA
  const cta = document.getElementById('projects-cta')
  if (cta) {
    cta.innerHTML = `<a href="/contact.html" class="btn btn-gold">${icon('phone', 'h-4 w-4')} بررسی پروژه شما با ما</a>`
  }
}
