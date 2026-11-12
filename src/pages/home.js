/**
 * Homepage — hero scene, service cards, terms marquee, capabilities,
 * featured projects, process timeline, equipment cards, counters,
 * testimonials marquee and journal cards.
 */
import { mountHeroScene } from '../scenes/hero-scene.js'
import { services } from '../data/services.js'
import { featuredProjects } from '../data/projects.js'
import { articles } from '../data/articles.js'
import { equipment, calibrationImage } from '../data/equipment.js'
import { testimonials } from '../data/testimonials.js'
import { serviceCard, projectCard, articleCard } from '../components/cards.js'
import { buildMarquee } from '../components/marquee.js'
import { mountCapabilities } from '../components/capabilities.js'
import { mountProcess } from '../components/process.js'
import { animateCounters } from '../components/counters.js'
import { icon } from '../utils/dom.js'

function renderEquipmentCards() {
  const root = document.getElementById('home-equipment')
  if (!root) return
  root.innerHTML = equipment
    .map(
      (eq) => `
    <article class="card mb-6 p-6 md:p-7 last:mb-0">
      <div class="flex items-start justify-between gap-4 mb-4">
        <span class="inline-flex items-center justify-center h-12 w-12 bg-ink text-gold rounded-sm">
          ${icon(eq.icon, 'h-6 w-6')}
        </span>
        <span class="tech-code">${eq.code}</span>
      </div>
      <h3 class="text-h3 font-extrabold text-ink">${eq.title}</h3>
      <p class="en-note mt-1.5">${eq.latin}</p>
      <p class="mt-4 text-sm leading-8 text-muted">${eq.desc}</p>
      <div class="mt-5 flex flex-wrap gap-2">
        ${eq.uses.map((u) => `<span class="chip !text-xs !px-3 !py-1.5">${u}</span>`).join('')}
      </div>
    </article>`
    )
    .join('')
}

function renderTermsMarquee() {
  const terms = [
    'TOTAL STATION',
    'GNSS MULTI-FREQUENCY',
    'GEOMETRIC MONITORING',
    'CONSTRUCTION LAYOUT',
    'AS-BUILT DOCUMENTATION',
    'UTM / CADASTRE',
    'EARTHWORK VOLUMES',
    'TOPOGRAPHIC SURVEYING',
  ]
  buildMarquee(
    document.getElementById('terms-marquee'),
    terms.map((t) => `
      <span class="flex items-center gap-6 px-6 text-white/55 text-sm font-medium whitespace-nowrap">
        ${t}
        <span class="inline-block h-2 w-2 rotate-45 bg-gold/70"></span>
      </span>`),
    { duration: 38, vanish: false }
  )
}

function renderTestimonials() {
  const root = document.getElementById('testimonials-marquee')
  if (!root) return
  buildMarquee(
    root,
    testimonials.map(
      (t) => `
    <figure class="w-[330px] md:w-[400px] shrink-0 mx-3 card p-7 flex flex-col justify-between">
      <blockquote class="text-inksoft leading-8 text-[0.95rem] line-clamp-5">«${t.quote}»</blockquote>
      <figcaption class="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between gap-3">
        <span class="text-xs text-muted leading-5">${t.author}</span>
        ${t.demo ? '<span class="chip !text-[0.62rem] !px-2.5 !py-0.5 !border-gold/60 !text-golddeep shrink-0">نمونه نمایشی</span>' : ''}
      </figcaption>
    </figure>`
    ),
    { duration: 55 }
  )
}

export async function mount() {
  // 3D hero
  mountHeroScene(document.getElementById('hero-canvas'))

  // Service cards
  const servicesRoot = document.getElementById('home-services')
  if (servicesRoot) servicesRoot.innerHTML = services.map((s, i) => serviceCard(s, i)).join('')

  // Technical terms marquee
  renderTermsMarquee()

  // Capabilities composition
  mountCapabilities(document.getElementById('capabilities-root'))

  // Featured projects — editorial grid with varying spans
  const projectsRoot = document.getElementById('home-projects')
  if (projectsRoot) {
    const featured = featuredProjects().slice(0, 5)
    const variants = ['lg', 'md', 'md', 'lg', 'strip']
    projectsRoot.innerHTML = featured.map((p, i) => projectCard(p, variants[i % variants.length])).join('')
  }

  // Process timeline
  mountProcess(document.getElementById('process-root'))

  // Equipment cards
  renderEquipmentCards()

  // Capability indicator counters
  animateCounters()

  // Testimonials marquee
  renderTestimonials()

  // Journal cards (latest three)
  const journalRoot = document.getElementById('home-journal')
  if (journalRoot) journalRoot.innerHTML = articles.slice(0, 3).map((a) => articleCard(a)).join('')
}
