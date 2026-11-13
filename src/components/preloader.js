/**
 * Preloaders — two variants:
 *
 * 1. Boot preloader (first visit): markup is inlined in each page's <head>
 *    so it paints before the main CSS/JS bundles arrive. main.js removes it
 *    once the site has booted.
 * 2. Page-transition preloader (SPA-style navigation): a lightweight veil
 *    shown on internal link clicks; fades in instantly, releases as soon as
 *    the next page's boot completes (usually well under 350ms since chunks
 *    are cached).
 */
const BOOT_ID = 'boot-preloader'
const VEIL_ID = 'page-veil'
const SESSION_KEY = 'mss-visited'

/** Mark the session as visited (called after first boot completes). */
export function markVisited() {
  try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* private mode */ }
}

/** True when the visitor has already booted the site this session. */
export function hasVisited() {
  try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
}

/**
 * Remove the inline boot preloader with a smooth exit.
 * Called from main.js boot() after navbar/footer/page module are ready.
 */
export function dismissBootPreloader() {
  const el = document.getElementById(BOOT_ID)
  if (!el) return
  el.classList.add('done')
  setTimeout(() => el.remove(), 650)
}

/**
 * Lightweight veil shown during internal navigation. Instant on,
 * removed by the next page's boot (or as a fallback, on next paint).
 */
export function showTransitionVeil() {
  if (document.getElementById(VEIL_ID)) return
  const veil = document.createElement('div')
  veil.id = VEIL_ID
  veil.className = 'page-veil'
  veil.setAttribute('aria-hidden', 'true')
  veil.innerHTML = `
    <span class="page-veil-bar" aria-hidden="true"></span>
  `
  document.body.appendChild(veil)
  // class added after insertion so the opacity transition actually plays
  requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add('visible')))
}

/**
 * Wire up the SPA-style transition veil: internal, same-origin,
 * non-hash links trigger the veil before the browser navigates.
 */
export function initPageTransitions() {
  // The veil only makes sense once the site has booted once this session;
  // on the very first load the boot preloader already covers the wait.
  if (!hasVisited()) return
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]')
    if (!a) return
    const href = a.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return
    const url = new URL(a.href, location.href)
    if (url.origin !== location.origin) return
    if (url.pathname === location.pathname && url.search === location.search) return
    showTransitionVeil()
  }, { capture: true })
}

/** Called by the next page's boot: release the veil left by navigation. */
export function dismissTransitionVeil() {
  const veil = document.getElementById(VEIL_ID)
  if (!veil) return
  veil.classList.add('done')
  setTimeout(() => veil.remove(), 500)
}
