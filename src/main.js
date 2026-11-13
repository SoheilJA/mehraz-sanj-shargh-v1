/**
 * Site bootstrap — executed on every page.
 * Renders navbar/footer, boots motion, then dynamically imports the
 * page-specific module (code splitting per page type).
 */
import './styles/main.css'
import { initIcons } from './components/icons.js'
import { mountNavbar } from './components/navbar.js'
import { mountFooter } from './components/footer.js'
import { mountLightbox } from './components/lightbox.js'
import { initMotion, initReveals } from './utils/motion.js'
import {
  markVisited,
  dismissBootPreloader,
  dismissTransitionVeil,
  initPageTransitions,
} from './components/preloader.js'

/**
 * GitHub Pages serves the site from a sub-path (BASE_URL). Source code
 * uses root-absolute URLs ("/..."), so rewrite them at runtime for any
 * DOM injected after the build — keeps a single source of truth.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function rewriteRootUrls(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return
  for (const el of [node, ...node.querySelectorAll('[href], [src]')]) {
    // elements marked data-no-rewrite already carry the final base path
    // (e.g. the inline boot preloader, rewritten at build time)
    if (el.closest?.('[data-no-rewrite]')) continue
    for (const attr of ['href', 'src']) {
      const value = el.getAttribute?.(attr)
      if (value && value.startsWith('/') && !value.startsWith('//')) {
        el.setAttribute(attr, BASE + value)
      }
    }
  }
}

function watchRootUrls() {
  if (BASE === '') return
  rewriteRootUrls(document.body)
  new MutationObserver((mutations) => {
    for (const m of mutations) for (const n of m.addedNodes) rewriteRootUrls(n)
  }).observe(document.body, { childList: true, subtree: true })
}

async function boot() {
  // Stylesheet has arrived (this module imports it) — clear the FOUC guard.
  document.documentElement.classList.remove('js-loading')

  watchRootUrls()
  mountNavbar()
  mountFooter()
  initMotion()
  mountLightbox()

  const page = document.body.dataset.page
  if (page) {
    try {
      const mod = await import(`./pages/${page}.js`)
      await mod.mount?.()
    } catch (err) {
      console.warn(`[mehraz] page module "${page}" failed:`, err)
    }
  }

  // Icons and reveals for content rendered by page modules.
  initIcons()
  initReveals()

  // Preloaders: release the boot screen and any navigation veil, then
  // remember the visit so subsequent navigations use the light veil only.
  dismissBootPreloader()
  dismissTransitionVeil()
  markVisited()
  initPageTransitions()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()
