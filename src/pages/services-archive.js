/**
 * Services archive page — renders the four core service cards.
 */
import { services } from '../data/services.js'
import { serviceCard } from '../components/cards.js'
import { buildMarquee } from '../components/marquee.js'
import { icon } from '../utils/dom.js'

export async function mount() {
  const root = document.getElementById('services-grid')
  if (root) root.innerHTML = services.map((s, i) => serviceCard(s, i)).join('')

  buildMarquee(
    document.getElementById('terms-marquee'),
    [
      'GEOMETRIC CONTROL',
      'TOPOGRAPHY',
      'AS-BUILT',
      'UTM / CADASTRE',
      'EARTHWORK VOLUMES',
      'GNSS NETWORKS',
    ].map(
      (t) => `
      <span class="flex items-center gap-6 px-6 text-white/55 text-sm font-medium whitespace-nowrap">
        ${t}<span class="inline-block h-2 w-2 rotate-45 bg-gold/70"></span>
      </span>`
    ),
    { duration: 36, vanish: false }
  )

  const cta = document.getElementById('services-cta')
  if (cta) {
    cta.addEventListener('click', () => {})
    cta.innerHTML = `<a href="/contact.html" class="btn btn-gold">${icon('phone', 'h-4 w-4')} درخواست مشاوره تخصصی</a>`
  }
}
