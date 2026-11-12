/**
 * Equipment & Technology page — cards from equipment data plus the
 * calibration field photo and the technical terms marquee.
 */
import { equipment, equipmentNotes, calibrationImage } from '../data/equipment.js'
import { buildMarquee } from '../components/marquee.js'
import { icon } from '../utils/dom.js'

export async function mount() {
  const root = document.getElementById('equipment-grid')
  if (root) {
    root.innerHTML = equipment
      .map(
        (eq, i) => `
      <article class="card p-7 md:p-9 reveal" data-reveal-delay="${i * 0.08}">
        <div class="flex items-start justify-between gap-4 mb-6">
          <span class="inline-flex items-center justify-center h-14 w-14 bg-ink text-gold rounded-sm">
            ${icon(eq.icon, 'h-7 w-7')}
          </span>
          <span class="tech-code">${eq.code}</span>
        </div>
        <h3 class="text-h3 font-extrabold text-ink">${eq.title}</h3>
        <p class="en-note mt-2">${eq.latin}</p>
        <p class="mt-5 text-inksoft leading-8 text-[0.95rem]">${eq.desc}</p>
        <div class="mt-6 pt-6 border-t border-ink/10">
          <p class="en-note mb-4">FIELD APPLICATIONS</p>
          <div class="flex flex-wrap gap-2">
            ${eq.uses.map((u) => `<span class="chip !text-xs !px-3 !py-1.5">${u}</span>`).join('')}
          </div>
        </div>
      </article>`
      )
      .join('')
  }

  buildMarquee(
    document.getElementById('terms-marquee'),
    [
      'TOTAL STATION',
      'GNSS MULTI-FREQUENCY',
      'CALIBRATED EQUIPMENT',
      'FIELD CREWS',
      'CONTROL NETWORKS',
      'CAD / CIVIL OUTPUT',
    ].map(
      (t) => `
      <span class="flex items-center gap-6 px-6 text-white/55 text-sm font-medium whitespace-nowrap">
        ${t}<span class="inline-block h-2 w-2 rotate-45 bg-gold/70"></span>
      </span>`
    ),
    { duration: 36, vanish: false }
  )

  const img = document.getElementById('calibration-photo')
  if (img) {
    img.setAttribute('data-lightbox', calibrationImage.src)
  }
}
