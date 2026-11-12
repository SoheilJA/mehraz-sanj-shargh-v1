/**
 * Editorial card renderers used across homepage, archives and
 * related-content sections.
 */
import { icon } from '../utils/dom.js'
import { padFa } from '../utils/str.js'
import { projectCategories } from '../data/projects.js'
import { serviceVisual } from './service-visuals.js'
import { readingTime } from '../data/articles.js'

const arrowLink = (label, href, extra = '') => `
  <span class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-golddeep transition-all duration-300 group-hover:gap-3.5 ${extra}">
    ${label} ${icon('arrow-left', 'h-4 w-4')}
  </span>`

/* ---------------- Service card ---------------- */
export function serviceCard(s, i = 0) {
  return `
  <article class="card service-card group reveal">
    <a href="/services/${s.slug}.html" class="block">
      <div class="aspect-[4/3] bg-paper2 border-b border-ink/10 p-6 overflow-hidden">
        ${serviceVisual(s.slug)}
      </div>
      <div class="p-6 md:p-7">
        <div class="flex items-center justify-between mb-3">
          <span class="tech-code">${s.code}</span>
          <span class="en-note">${padFa(i + 1)} / ${padFa(4)}</span>
        </div>
        <h3 class="text-h3 font-extrabold text-ink">${s.title}</h3>
        <p class="mt-3 text-sm leading-7 text-muted line-clamp-3">${s.cardDesc}</p>
        ${arrowLink('صفحه خدمت')}
      </div>
    </a>
  </article>`
}

/* ---------------- Project card ---------------- */
export function projectCard(p, variant = 'md') {
  const cat = projectCategories[p.category] || p.category
  const img = p.gallery[0] || {}
  const media =
    img.type === 'illustration'
      ? `<div class="w-full h-full bg-paper2 p-8 flex items-center justify-center">${serviceVisual('utm-cadastre')}</div>`
      : img.type === 'plan'
        ? `<img src="${img.src}" alt="${img.alt}" loading="lazy"
             class="w-full h-full object-contain bg-white p-3 transition-transform duration-700 ease-elegant group-hover:scale-[1.04]"/>`
        : `<img src="${img.src}" alt="${img.alt}" loading="lazy"
             class="w-full h-full object-cover transition-transform duration-700 ease-elegant group-hover:scale-[1.05]"/>`

  const heights = { lg: 'h-[380px] md:h-[460px]', md: 'h-[280px] md:h-[340px]', strip: 'h-[220px] md:h-[260px]' }

  if (variant === 'strip') {
    return `
    <article class="card project-card group reveal overflow-hidden lg:col-span-12">
      <a href="/projects/${p.slug}.html" class="grid lg:grid-cols-12">
        <div class="lg:col-span-5 relative overflow-hidden ${heights.strip} lg:h-[280px]">${media}
          <span class="chip-cat">${cat}</span>
        </div>
        <div class="lg:col-span-7 p-6 md:p-8 flex flex-col justify-center">
          <div class="flex items-center justify-between mb-2">
            <span class="tech-code">${p.code}</span>
            <span class="text-xs text-muted">دسته: ${cat}</span>
          </div>
          <h3 class="text-h3 font-extrabold text-ink">${p.title}</h3>
          <p class="mt-3 text-sm leading-7 text-muted line-clamp-2">${p.summary}</p>
          ${arrowLink('مشاهده جزئیات پروژه')}
        </div>
      </a>
    </article>`
  }

  return `
  <article class="card project-card group reveal overflow-hidden ${variant === 'lg' ? 'lg:col-span-7' : 'lg:col-span-5'}">
    <a href="/projects/${p.slug}.html" class="block">
      <div class="relative overflow-hidden ${heights[variant]}">${media}
        <span class="chip-cat">${cat}</span>
      </div>
      <div class="p-6 md:p-7">
        <div class="flex items-center justify-between mb-2.5">
          <span class="tech-code">${p.code}</span>
          <span class="text-xs text-muted">${cat}</span>
        </div>
        <h3 class="text-lg md:text-xl font-extrabold text-ink leading-8">${p.title}</h3>
        <p class="mt-2.5 text-sm leading-7 text-muted line-clamp-2">${p.summary}</p>
        ${arrowLink('جزئیات پروژه')}
      </div>
    </a>
  </article>`
}

/* ---------------- Article card ---------------- */
export function articleCard(a) {
  const t = readingTime(a)
  return `
  <article class="card article-card group reveal">
    <a href="/journal/${a.slug}.html" class="block p-6 md:p-7">
      <div class="flex items-center justify-between mb-4">
        <span class="chip !text-[0.68rem] !px-3 !py-1 !border-ink/15">${a.category}</span>
        <span class="tech-code">${a.code}</span>
      </div>
      <h3 class="text-xl font-extrabold text-ink leading-8 group-hover:text-golddeep transition-colors">${a.title}</h3>
      <p class="mt-3 text-sm leading-7 text-muted line-clamp-3">${a.excerpt}</p>
      <div class="mt-5 pt-4 border-t border-ink/10 flex items-center justify-between text-xs text-muted">
        <span class="flex items-center gap-1.5">${icon('clock', 'h-3.5 w-3.5')} ${padFa(t)} دقیقه مطالعه</span>
        ${arrowLink('مطالعه مقاله', '#', '!mt-0')}
      </div>
    </a>
  </article>`
}
