/**
 * FAQ page — category filters + accordion.
 */
import { faq, faqCategories } from '../data/faq.js'
import { accItem, mountAccordions } from '../components/accordion.js'
import { faNumber } from '../utils/str.js'

export async function mount() {
  const chipsRoot = document.getElementById('faq-filters')
  const listRoot = document.getElementById('faq-list')
  const count = document.getElementById('faq-count')
  if (!chipsRoot || !listRoot) return

  let active = 'همه'

  const renderChips = () => {
    chipsRoot.innerHTML = faqCategories
      .map(
        (c) =>
          `<button type="button" data-cat="${c}" class="chip ${active === c ? 'active' : ''}">
            ${c} <span class="chip-count num">${faNumber(c === 'همه' ? faq.length : faq.filter((f) => f.cat === c).length)}</span>
          </button>`
      )
      .join('')
    chipsRoot.querySelectorAll('[data-cat]').forEach((btn) =>
      btn.addEventListener('click', () => {
        active = btn.dataset.cat
        renderChips()
        renderList()
      })
    )
  }

  const renderList = () => {
    const list = active === 'همه' ? faq : faq.filter((f) => f.cat === active)
    listRoot.innerHTML = list.map((f) => accItem(f.q, f.a)).join('')
    if (count) count.textContent = `${faNumber(list.length)} پرسش و پاسخ`
    mountAccordions(listRoot)
    import('../utils/motion.js').then(({ initReveals }) => initReveals())
  }

  renderChips()
  renderList()
}
