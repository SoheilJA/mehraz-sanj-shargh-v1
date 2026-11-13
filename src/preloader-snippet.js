/**
 * Inline boot preloader snippet — injected into every page's <head>.
 * Paints a minimal branded preloader before any CSS/JS bundle arrives.
 * The full styling lives in main.css; a fallback copy lives inline so the
 * very first paint is already branded even before main.css loads.
 */
export const BOOT_PRELOADER_SNIPPET = `
<div id="boot-preloader" aria-hidden="true">
  <style>
    /* Fallback styling: keeps the preloader branded before main.css arrives. */
    #boot-preloader { position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; background: #f7f4ee; }
    #boot-preloader .bp-logo { width: 64px; height: 64px; object-fit: cover; border-radius: 4px; border: 1px solid rgb(30 34 41 / 0.12); animation: bp-pulse 1.6s ease-in-out infinite; }
    #boot-preloader .bp-brand { font-family: Vazirmatn, 'Segoe UI', Tahoma, sans-serif; font-size: 0.95rem; font-weight: 800; color: #1e2229; }
    #boot-preloader .bp-track { width: 148px; height: 2px; overflow: hidden; background: rgb(30 34 41 / 0.1); border-radius: 2px; position: relative; }
    #boot-preloader .bp-fill { position: absolute; inset-block: 0; width: 40%; background: #d4af37; border-radius: 2px; animation: bp-slide 1.1s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
    @keyframes bp-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
    @keyframes bp-slide { 0% { left: -40%; } 100% { left: 100%; } }
  </style>
  <img class="bp-logo" src="/images/brand/logo.png" alt="" width="64" height="64" />
  <span class="bp-brand">مهراز سنج شرق</span>
  <span class="bp-track"><span class="bp-fill"></span></span>
</div>
`
