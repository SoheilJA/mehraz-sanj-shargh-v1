/**
 * Interactive technical composition for the capabilities section.
 * A list of six capabilities drives a diagram panel; the panel's gold
 * measurement line redraws itself whenever the active item changes.
 * Auto-cycles until the visitor interacts.
 */
import { padFa } from '../utils/str.js'
import { capabilityVisuals } from './service-visuals.js'

export const capabilities = [
  {
    key: 'monitoring',
    title: 'پایش هندسی سازه‌ها',
    en: 'GEOMETRIC MONITORING',
    desc: 'ردیابی دوره‌ای انحراف، تغییرشکل و نشست در طول اجرا؛ از دیواره‌های گود تا ستون‌های بلندمرتبه.',
  },
  {
    key: 'layout',
    title: 'پیاده‌سازی کارگاهی',
    en: 'CONSTRUCTION LAYOUT',
    desc: 'انتقال آکس‌ها، ترازها و زوایای پلان مصوب به متن کارگاه با توتال استیشن.',
  },
  {
    key: 'topo',
    title: 'برداشت توپوگرافی',
    en: 'TOPOGRAPHIC SURVEYING',
    desc: 'نمونه‌برداری متراکم از عوارض و ترازهای زمین و تولید مدل رقومی موقعیت.',
  },
  {
    key: 'gnss',
    title: 'موقعیت‌یابی GNSS',
    en: 'GNSS POSITIONING',
    desc: 'تعیین موقعیت ماهواره‌ای چندفرکانسی برای شبکه‌بندی اراضی و سامانه مختصات پروژه.',
  },
  {
    key: 'asbuilt',
    title: 'مستندسازی As-Built',
    en: 'AS-BUILT DOCUMENTATION',
    desc: 'ثبت هندسه واقعی ساخته‌شده در فایل‌های CAD/Civil با مهر مهندسی.',
  },
  {
    key: 'earthwork',
    title: 'محاسبات حجم خاکی',
    en: 'EARTHWORK VOLUMES',
    desc: 'محاسبه حجم خاکبرداری و خاکریزی میان سطوح رقومی موجود و طرح، به تفکیک لایه‌ها.',
  },
]

export function mountCapabilities(root) {
  const holder = typeof root === 'string' ? document.getElementById(root) : root
  if (!holder) return

  let active = 0
  let interacted = false

  const listHtml = capabilities
    .map(
      (c, i) => `
      <button type="button" data-cap="${i}" class="cap-item group w-full text-start py-4 border-b border-ink/10 transition-all duration-300 ${
        i === 0 ? 'is-active' : ''
      }">
        <span class="flex items-baseline gap-4">
          <span class="cap-num font-mono text-xs ${i === 0 ? 'text-golddeep' : 'text-muted'}">${padFa(i + 1)}</span>
          <span class="flex-1">
            <span class="block font-extrabold text-ink text-[1.05rem] transition-colors">${c.title}</span>
            <span class="cap-desc block overflow-hidden text-muted text-sm leading-7 transition-all duration-500 ${
              i === 0 ? 'max-h-20 opacity-100 mt-1' : 'max-h-0 opacity-0'
            }">${c.desc}</span>
          </span>
          <span class="cap-en en-note hidden md:block">${c.en}</span>
        </span>
      </button>`
    )
    .join('')

  holder.innerHTML = `
    <div class="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      <div class="lg:col-span-5">
        <div class="cap-list">${listHtml}</div>
      </div>
      <div class="lg:col-span-7">
        <div class="card relative bg-paper2 overflow-hidden">
          <div class="cap-panel aspect-[16/10] p-8 md:p-10 flex items-center justify-center"></div>
          <div class="border-t border-ink/10 px-6 py-3 flex items-center justify-between">
            <span class="cap-readout en-note" id="cap-readout">${capabilities[0].en}</span>
            <span class="flex items-center gap-2 text-xs text-muted">
              <span class="inline-block h-1.5 w-1.5 rounded-full bg-gold"></span>
              <span class="cap-label">${capabilities[0].title}</span>
            </span>
          </div>
        </div>
      </div>
    </div>`

  const panel = holder.querySelector('.cap-panel')
  const readout = holder.querySelector('#cap-readout')
  const label = holder.querySelector('.cap-label')

  const renderPanel = (i) => {
    const c = capabilities[i]
    panel.classList.remove('playing')
    panel.innerHTML = capabilityVisuals[c.key]
    // force reflow so the draw animation restarts
    void panel.offsetWidth
    panel.classList.add('playing')
    readout.textContent = c.en
    label.textContent = c.title
  }
  renderPanel(0)

  const setActive = (i, user = false) => {
    if (user) interacted = true
    active = i
    holder.querySelectorAll('.cap-item').forEach((btn, j) => {
      const on = j === i
      btn.classList.toggle('is-active', on)
      btn.querySelector('.cap-num').className = `cap-num font-mono text-xs ${on ? 'text-golddeep' : 'text-muted'}`
      btn.querySelector('.cap-desc').className =
        `cap-desc block overflow-hidden text-muted text-sm leading-7 transition-all duration-500 ${
          on ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'
        }`
    })
    renderPanel(i)
  }

  holder.querySelectorAll('.cap-item').forEach((btn) => {
    const i = Number(btn.dataset.cap)
    btn.addEventListener('pointerenter', () => setActive(i, true))
    btn.addEventListener('click', () => setActive(i, true))
  })

  // Gentle auto-cycle until the visitor interacts.
  const cycle = setInterval(() => {
    if (interacted || document.hidden) return
    setActive((active + 1) % capabilities.length)
  }, 4200)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(cycle)
  })
}
