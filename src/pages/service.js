/**
 * Individual service page renderer (slug from body[data-slug]).
 */
import { getService } from '../data/services.js'
import { getProjects } from '../data/projects.js'
import { getArticles, readingTime } from '../data/articles.js'
import { pageHero, sectionHead } from '../components/page-hero.js'
import { projectCard, articleCard } from '../components/cards.js'
import { mountProcess } from '../components/process.js'
import { icon } from '../utils/dom.js'

export async function mount() {
  const slug = document.body.dataset.slug
  const s = getService(slug)
  if (!s) return

  const hero = document.getElementById('page-hero')
  const body = document.getElementById('page-body')
  if (!hero || !body) return

  hero.innerHTML = pageHero({
    kicker: s.heroKicker,
    title: s.title,
    lead: s.tagline,
    code: s.code,
    crumbs: [
      { label: 'خانه', href: '/index.html' },
      { label: 'خدمات', href: '/services/index.html' },
      { label: s.shortTitle },
    ],
    actions: `
      <a href="/contact.html" class="btn btn-gold">${icon('phone', 'h-4 w-4')} درخواست مشاوره برای این خدمت</a>
      <a href="/projects/index.html" class="btn btn-ghost">پروژه‌های مرتبط</a>`,
  })

  body.innerHTML = `
  <!-- overview -->
  <section class="section">
    <div class="wrap grid lg:grid-cols-12 gap-12">
      <div class="lg:col-span-4">
        <div class="lg:sticky lg:top-32">
          <p class="kicker reveal">SERVICE OVERVIEW</p>
          <h2 class="mt-4 text-h2 font-extrabold text-ink reveal">شرح خدمت</h2>
          <div class="mt-8 card bg-paper2 p-6 reveal">
            <p class="en-note mb-4">SERVICE DATA</p>
            <dl class="text-sm">
              <div class="flex justify-between gap-4 py-2.5 border-b border-ink/10"><dt class="text-muted">کد خدمت</dt><dd class="font-mono text-golddeep">${s.code}</dd></div>
              <div class="flex justify-between gap-4 py-2.5 border-b border-ink/10"><dt class="text-muted">حوزه</dt><dd class="font-bold text-ink">ژئوماتیک مهندسی</dd></div>
              <div class="flex justify-between gap-4 py-2.5"><dt class="text-muted">پوشش جغرافیایی</dt><dd class="font-bold text-ink">کل استان خراسان</dd></div>
            </dl>
          </div>
        </div>
      </div>
      <div class="lg:col-span-8">
        <div class="text-inksoft leading-[2.2] text-[1.02rem] reveal">
          ${s.overview.map((p) => `<p class="mb-6">${p}</p>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- applications -->
  <section class="section bg-paper2 border-y border-ink/10">
    <div class="wrap">
      ${sectionHead('APPLICATIONS', 'کاربردهای این خدمت', 'در چه موقعیت‌هایی از چرخه پروژه، این خدمت نقش تعیین‌کننده دارد؟')}
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6 reveal-group">
        ${s.applications
          .map(
            (a) => `
        <article class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <span class="inline-flex items-center justify-center h-10 w-10 bg-ink text-gold rounded-sm">${icon('check', 'h-5 w-5')}</span>
            <span class="tech-code">${s.code}.APP</span>
          </div>
          <h3 class="font-bold text-ink text-[1.02rem] leading-7">${a.title}</h3>
          <p class="mt-3 text-sm leading-7 text-muted">${a.text}</p>
        </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- benefits -->
  <section class="section">
    <div class="wrap grid lg:grid-cols-12 gap-12">
      <div class="lg:col-span-5">
        ${sectionHead('BENEFITS', 'مزایای کارفرما', '')}
      </div>
      <div class="lg:col-span-7">
        <ul class="reveal-group">
          ${s.benefits
            .map(
              (b) => `
          <li class="flex items-start gap-4 py-5 border-b border-ink/10">
            <span class="mt-1 inline-block h-2.5 w-2.5 rotate-45 bg-gold shrink-0"></span>
            <span class="text-inksoft leading-8">${b}</span>
          </li>`
            )
            .join('')}
        </ul>
      </div>
    </div>
  </section>

  <!-- process -->
  <section class="section bg-paper2 border-y border-ink/10">
    <div class="wrap grid lg:grid-cols-12 gap-12">
      <div class="lg:col-span-4">
        <div class="lg:sticky lg:top-32">
          ${sectionHead('EXECUTION PROCESS', 'روند اجرای خدمت', 'گام‌های استاندارد اجرای این خدمت در پروژه‌ها.')}
        </div>
      </div>
      <div class="lg:col-span-8 relative" id="service-process"></div>
    </div>
  </section>

  <!-- related projects -->
  ${relatedProjectsHtml(s)}

  <!-- related articles -->
  ${
    s.relatedArticles.length
      ? `
  <section class="section bg-paper2 border-y border-ink/10">
    <div class="wrap">
      ${sectionHead('RELATED ARTICLES', 'مقالات مرتبط', '')}
      <div class="grid md:grid-cols-2 gap-6" id="service-articles"></div>
    </div>
  </section>`
      : ''
  }

  <!-- consultation CTA -->
  <section class="section-dark relative overflow-hidden">
    <div class="blueprint-grid-dark absolute inset-0 opacity-40 pointer-events-none" aria-hidden="true"></div>
    <div class="wrap relative py-8 flex flex-col md:flex-row items-center justify-between gap-8">
      <div>
        <p class="kicker kicker-dark">CONSULTATION</p>
        <h2 class="mt-4 text-h3 font-extrabold text-white">برای «${s.shortTitle}» به مشاوره تخصصی نیاز دارید؟</h2>
      </div>
      <div class="flex flex-wrap gap-4">
        <a href="/contact.html" class="btn btn-gold">درخواست مشاوره</a>
        <a href="/contact.html#contact-form" class="btn btn-light">ارسال درخواست آنلاین</a>
      </div>
    </div>
  </section>`

  // service process timeline (custom steps)
  mountProcess(
    document.getElementById('service-process'),
    s.process.map((p, i) => ({ title: p.title, en: `STEP ${i + 1}`, desc: p.text }))
  )

  // related projects
  const relProjects = getProjects(s.relatedProjects).slice(0, 3)
  const relRoot = document.getElementById('service-projects')
  if (relRoot && relProjects.length) {
    relRoot.innerHTML = relProjects.map((p) => projectCard(p, 'md')).join('')
  }

  // related articles
  const artRoot = document.getElementById('service-articles')
  if (artRoot) {
    artRoot.innerHTML = getArticles(s.relatedArticles)
      .map((a) => articleCard(a))
      .join('')
  }
}

function relatedProjectsHtml(s) {
  if (!s.relatedProjects.length) return ''
  return `
  <section class="section">
    <div class="wrap">
      ${sectionHead('RELATED PROJECTS', 'پروژه‌های مرتبط', 'سوابق اجرایی مستندشده‌ای که این خدمت در آن‌ها ارائه شده است.',
        `<a href="/projects/index.html" class="btn btn-ghost !h-11">آرشیو پروژه‌ها ${icon('arrow-left', 'h-4 w-4')}</a>`)}
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6" id="service-projects"></div>
    </div>
  </section>`
}
