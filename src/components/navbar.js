/**
 * Navbar component — rendered from navigation data on every page.
 * Transparent over hero, condensed on scroll, dropdowns, animated
 * mobile menu, active-state detection.
 */
import { navigation } from '../data/navigation.js'
import { company } from '../data/company.js'
import { icon } from '../utils/dom.js'
import { lenis, prefersReducedMotion } from '../utils/motion.js'

function isActive(item) {
  let path = location.pathname.replace(/\/$/, '') || '/index.html'
  if (path === '') path = '/index.html'
  if (path === '/index.html' && item.href === '/index.html') return true
  return (item.match || []).some((m) => {
    if (m === '/' || m === '/index.html') return path === '/index.html'
    return path.startsWith(m)
  })
}

function navItemsHtml() {
  return navigation.items
    .map((item) => {
      if (item.type === 'link') {
        return `<a class="nav-link ${isActive(item) ? 'active' : ''}" href="${item.href}">${item.label}</a>`
      }
      const kids = item.children
        .map(
          (c) => `
          <a class="nav-dd-item" href="${c.href}">
            ${c.code ? `<span class="dd-code">${c.code}</span>` : ''}
            <span>
              <span class="block text-[0.92rem] font-bold text-ink">${c.label}</span>
              ${c.desc ? `<span class="block mt-0.5 text-xs leading-5 text-muted">${c.desc}</span>` : ''}
            </span>
          </a>`
        )
        .join('')
      return `
        <div class="nav-dd">
          <a class="nav-link ${isActive(item) ? 'active' : ''}" href="${item.href}">
            ${item.label}${icon('chevron-down', 'nav-ico')}
          </a>
          <div class="nav-dd-panel">
            <div class="nav-dd-card">
              ${kids}
              ${item.footer
                ? `<a class="block mt-2 px-4 py-2.5 text-xs font-bold text-golddeep hover:bg-gold/10 rounded-sm" href="${item.footer.href}">${item.footer.label} ←</a>`
                : ''}
            </div>
          </div>
        </div>`
    })
    .join('')
}

function mobileItemsHtml() {
  return navigation.items
    .map((item) => {
      if (item.type === 'link') {
        return `<a class="mm-link" data-mm href="${item.href}">${item.label}</a>`
      }
      return `
        <div class="border-b border-ink/10 py-4">
          <a class="mm-link !border-0 !py-0" data-mm href="${item.href}">${item.label}</a>
          <div class="mm-sub">
            ${item.children.map((c) => `<a data-mm href="${c.href}" class="hover:text-golddeep transition-colors">${c.label}</a>`).join('')}
          </div>
        </div>`
    })
    .join('')
}

export function mountNavbar() {
  const header = document.getElementById('site-nav')
  if (!header) return

  header.innerHTML = `
    <div class="wrap nav-inner">
      <a href="/index.html" class="flex items-center gap-3 shrink-0" aria-label="${company.fullName}">
        <img src="/images/brand/logo.png" alt="لوگوی شرکت مهندسی نقشه‌برداری مهراز سنج شرق"
             class="h-11 w-11 rounded-[4px] border border-ink/10 bg-dark object-cover" width="44" height="44" />
        <span class="hidden sm:block leading-tight">
          <span class="block text-[1.05rem] font-extrabold text-ink">مهراز سنج شرق</span>
          <span class="en-note !text-[0.58rem] text-muted">Engineering &amp; Geomatics</span>
        </span>
      </a>

      <nav class="hidden lg:flex items-center gap-7" aria-label="ناوبری اصلی">
        ${navItemsHtml()}
      </nav>

      <div class="flex items-center gap-2.5">
        <a href="${navigation.search.href}" class="hidden md:inline-flex items-center justify-center h-10 w-10 text-ink/70 hover:text-golddeep transition-colors"
           aria-label="${navigation.search.label}" title="${navigation.search.label}">
          ${icon('search', 'h-[18px] w-[18px]')}
        </a>
        <a href="${navigation.cta.href}" class="btn btn-gold !h-10 !px-5 !text-[0.85rem] hidden md:inline-flex">
          ${icon('phone', 'h-4 w-4')} ${navigation.cta.label}
        </a>
        <button id="nav-burger" class="lg:hidden inline-flex flex-col items-center justify-center gap-1.5 h-11 w-11 border border-ink/15 rounded-sm text-ink"
                aria-label="منوی موبایل" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <div class="flex flex-col justify-between h-full overflow-y-auto">
        <nav aria-label="ناوبری موبایل">${mobileItemsHtml()}</nav>
        <div class="mt-8 flex flex-col gap-3">
          <a href="${navigation.cta.href}" class="btn btn-gold w-full">${icon('phone', 'h-4 w-4')} ${navigation.cta.label}</a>
          <a href="${navigation.search.href}" class="btn btn-ghost w-full">${icon('search', 'h-4 w-4')} جستجو در سایت</a>
        </div>
      </div>
    </div>
  `

  // --- scroll state ---
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 32)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  // --- mobile menu ---
  const burger = header.querySelector('#nav-burger')
  const menu = header.querySelector('#mobile-menu')
  const setOpen = (open) => {
    menu.classList.toggle('open', open)
    menu.setAttribute('aria-hidden', String(!open))
    burger.setAttribute('aria-expanded', String(open))
    document.body.style.overflow = open ? 'hidden' : ''
    if (open && !prefersReducedMotion) {
      const links = menu.querySelectorAll('[data-mm]')
      links.forEach((l, i) => {
        l.style.opacity = '0'
        l.style.transform = 'translateY(14px)'
        setTimeout(() => {
          l.style.transition = 'opacity .45s ease, transform .45s cubic-bezier(0.22,1,0.36,1)'
          l.style.opacity = '1'
          l.style.transform = 'translateY(0)'
        }, 40 + i * 45)
      })
    }
  }
  burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')))
  menu.querySelectorAll('[data-mm]').forEach((a) =>
    a.addEventListener('click', () => setOpen(false))
  )
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false)
  })
}
