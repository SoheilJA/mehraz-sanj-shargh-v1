/**
 * Shared inner-page hero: breadcrumb, kicker, title, lead and a large
 * technical code watermark. Rendered by page modules.
 */
import { padFa } from '../utils/str.js'

export function breadcrumbHtml(crumbs) {
  return `
  <nav class="breadcrumb mb-8" aria-label="مسیر صفحه">
    ${crumbs
      .map(
        (c, i) =>
          `${i > 0 ? '<span class="sep">/</span>' : ''}${
            c.href ? `<a href="${c.href}">${c.label}</a>` : `<span aria-current="page">${c.label}</span>`
          }`
      )
      .join('')}
  </nav>`
}

/**
 * @param {object} o - { kicker, title, lead, crumbs, code, actions }
 */
export function pageHero(o) {
  return `
  <section class="page-hero bg-paper2 relative overflow-hidden">
    <div class="blueprint-grid absolute inset-0 opacity-70 pointer-events-none" aria-hidden="true"></div>
    ${o.code ? `<span class="absolute -bottom-8 start-4 md:start-10 font-mono font-extrabold text-[clamp(5rem,12vw,10rem)] leading-none text-ink/[0.05] select-none pointer-events-none" aria-hidden="true">${o.code}</span>` : ''}
    <div class="wrap relative pt-[calc(var(--nav-h)+3.5rem)] pb-16 md:pb-20">
      ${breadcrumbHtml(o.crumbs || [])}
      ${o.kicker ? `<p class="kicker" data-entrance>${o.kicker}</p>` : ''}
      <h1 class="mt-5 text-h1 font-extrabold text-ink max-w-3xl text-balance" data-entrance>${o.title}</h1>
      ${o.lead ? `<p class="mt-6 text-lead text-inksoft max-w-2xl leading-[2]" data-entrance>${o.lead}</p>` : ''}
      ${
        o.actions
          ? `<div class="mt-9 flex flex-wrap gap-4" data-entrance>${o.actions}</div>`
          : ''
      }
    </div>
    <div class="hairline-gold absolute bottom-0 inset-x-0" aria-hidden="true"></div>
  </section>`
}

export function sectionHead(kicker, title, lead = '', extraRight = '') {
  return `
  <div class="flex flex-wrap items-end justify-between gap-6 mb-12 reveal">
    <div class="max-w-2xl">
      <p class="kicker">${kicker}</p>
      <h2 class="mt-4 text-h2 font-extrabold text-ink">${title}</h2>
      ${lead ? `<p class="mt-4 text-muted leading-8">${lead}</p>` : ''}
    </div>
    ${extraRight}
  </div>`
}

export function padCode(i) {
  return padFa(i)
}
