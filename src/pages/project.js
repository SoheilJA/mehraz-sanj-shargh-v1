/**
 * Individual project page renderer (slug from body[data-slug]).
 */
import { getProject, getProjects, projectCategories } from '../data/projects.js'
import { getServices } from '../data/services.js'
import { pageHero, sectionHead } from '../components/page-hero.js'
import { projectCard } from '../components/cards.js'
import { capabilityVisuals } from '../components/service-visuals.js'
import { icon } from '../utils/dom.js'

export async function mount() {
  const slug = document.body.dataset.slug
  const p = getProject(slug)
  if (!p) return

  const hero = document.getElementById('page-hero')
  const body = document.getElementById('page-body')
  if (!hero || !body) return

  const cat = projectCategories[p.category] || p.category

  hero.innerHTML = pageHero({
    kicker: `DOCUMENTED PROJECT — ${p.code}`,
    title: p.title,
    lead: p.summary,
    code: p.code,
    crumbs: [
      { label: 'خانه', href: '/index.html' },
      { label: 'پروژه‌ها', href: '/projects/index.html' },
      { label: cat, href: `/projects/index.html?cat=${p.category}` },
      { label: p.code },
    ],
    actions: `
      <a href="/contact.html" class="btn btn-primary">درخواست مشاوره مشابه این پروژه</a>
      <a href="/projects/index.html" class="btn btn-ghost">سایر پروژه‌ها</a>`,
  })

  body.innerHTML = `
  <!-- meta strip -->
  <section class="border-b border-ink/10 bg-paper">
    <div class="wrap py-6 flex flex-wrap items-center justify-between gap-5">
      <div class="flex flex-wrap items-center gap-3 text-sm">
        <span class="chip active !cursor-default">${cat}</span>
        <span class="text-muted">${icon('layers', 'h-4 w-4 inline align-[-2px]')} دسته‌بندی سوابق اجرایی</span>
      </div>
      <span class="tech-code">DOC / ${p.code} / FIELD RECORD</span>
    </div>
  </section>

  <!-- description + scope -->
  <section class="section">
    <div class="wrap grid lg:grid-cols-12 gap-12">
      <div class="lg:col-span-7">
        ${sectionHead('PROJECT DESCRIPTION', 'شرح پروژه', '')}
        <div class="text-inksoft leading-[2.2] text-[1.02rem] reveal">
          ${p.description.map((t) => `<p class="mb-6">${t}</p>`).join('')}
        </div>
      </div>
      <div class="lg:col-span-5">
        <div class="card bg-paper2 p-7 reveal lg:sticky lg:top-32">
          <p class="en-note mb-5">TECHNICAL SCOPE</p>
          <h3 class="text-h3 font-extrabold text-ink">دامنه کار فنی</h3>
          <ul class="mt-6 space-y-4">
            ${p.scope
              .map(
                (item) => `
            <li class="flex items-start gap-3.5 text-sm leading-7 text-inksoft">
              <span class="mt-1.5 inline-block h-2.5 w-2.5 rotate-45 bg-gold shrink-0"></span>
              <span>${item}</span>
            </li>`
              )
              .join('')}
          </ul>
          <p class="mt-7 pt-5 border-t border-ink/10 text-xs text-muted leading-6">
            این برگه، سند ثبت سوابق اجرایی از آرشیو رسمی شرکت است؛ تاریخ‌ها، مبالغ و نام کارفرمایان به دلیل نبود تأییدیه رسمی منتشر نشده‌اند.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- gallery -->
  ${galleryHtml(p)}

  <!-- related services -->
  ${
    p.relatedServices.length
      ? `
  <section class="section bg-paper2 border-y border-ink/10">
    <div class="wrap">
      ${sectionHead('RELATED SERVICES', 'خدمات مرتبط با این پروژه', '')}
      <div class="grid md:grid-cols-2 gap-6" id="project-services"></div>
    </div>
  </section>`
      : ''
  }

  <!-- related projects -->
  ${
    p.relatedProjects.length
      ? `
  <section class="section">
    <div class="wrap">
      ${sectionHead('RELATED PROJECTS', 'پروژه‌های مرتبط', '')}
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6" id="project-related"></div>
    </div>
  </section>`
      : ''
  }

  <!-- CTA -->
  <section class="section-dark relative overflow-hidden">
    <div class="blueprint-grid-dark absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true"></div>
    <div class="wrap relative py-8 flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <p class="kicker kicker-dark">NEXT STEP</p>
        <h2 class="mt-4 text-h3 font-extrabold text-white">پروژه مشابهی در دست اجرا دارید؟</h2>
      </div>
      <a href="/contact.html" class="btn btn-gold">درخواست مشاوره تخصصی</a>
    </div>
  </section>`

  // gallery lightbox wiring
  body.querySelectorAll('[data-lightbox]').forEach((img) => {
    if (img.dataset.plan === undefined && img.classList.contains('bg-white')) img.dataset.plan = '1'
  })

  // related services
  const svcRoot = document.getElementById('project-services')
  if (svcRoot) {
    svcRoot.innerHTML = getServices(p.relatedServices)
      .map(
        (s) => `
      <a href="/services/${s.slug}.html" class="card p-6 group">
        <div class="flex items-center justify-between mb-3">
          <span class="tech-code">${s.code}</span>
          ${icon('arrow-left', 'h-4 w-4 text-golddeep transition-transform group-hover:-translate-x-1')}
        </div>
        <h3 class="font-bold text-ink text-lg leading-7">${s.title}</h3>
        <p class="mt-2.5 text-sm leading-7 text-muted line-clamp-2">${s.cardDesc}</p>
      </a>`
      )
      .join('')
  }

  // related projects
  const relRoot = document.getElementById('project-related')
  if (relRoot) {
    relRoot.innerHTML = getProjects(p.relatedProjects)
      .slice(0, 3)
      .map((rp) => projectCard(rp, 'md'))
      .join('')
  }
}

function galleryHtml(p) {
  if (!p.gallery.length) return ''
  const items = p.gallery
    .map((g) => {
      if (g.type === 'illustration') {
        return `
        <figure class="card bg-paper2 p-8 md:p-10 flex flex-col items-center justify-center gap-6">
          <div class="w-full max-w-md aspect-[16/11]">${capabilityVisuals.asbuilt}</div>
          <figcaption class="text-xs text-muted text-center leading-6 px-4">${g.caption}${g.alt ? ` — ${g.alt}` : ''}</figcaption>
        </figure>`
      }
      const isPlan = g.type === 'plan'
      return `
      <figure class="card overflow-hidden reveal">
        <img src="${g.src}" alt="${g.alt}" data-lightbox="${g.src}" ${isPlan ? 'data-plan="1"' : ''}
             class="w-full ${isPlan ? 'bg-white object-contain p-4' : 'object-cover'} cursor-zoom-in h-[300px] md:h-[380px]" loading="lazy" />
        <figcaption class="px-5 py-4 border-t border-ink/10 flex items-center justify-between gap-3">
          <span class="text-sm text-inksoft">${g.caption}</span>
          <span class="tech-code">${isPlan ? 'CAD DOC' : 'FIELD PHOTO'}</span>
        </figcaption>
      </figure>`
    })
    .join('')

  return `
  <section class="section">
    <div class="wrap">
      ${sectionHead('DOCUMENTATION GALLERY', 'گالری مستندات پروژه', 'برای بزرگ‌نمایی اسناد و تصاویر، روی آن‌ها کلیک کنید.')}
      <div class="grid ${p.gallery.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-7">${items}</div>
    </div>
  </section>`
}
