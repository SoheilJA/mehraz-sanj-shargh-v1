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

async function boot() {
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
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()
