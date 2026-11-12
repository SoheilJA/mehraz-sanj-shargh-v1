/**
 * Contact page — map placeholder is prepared for a configurable location
 * (company.map), contact form mounted with validation.
 */
import { company } from '../data/company.js'
import { contactFormHtml, mountContactForm } from '../components/form.js'

export async function mount() {
  const formRoot = document.getElementById('contact-form-root')
  if (formRoot) {
    formRoot.innerHTML = contactFormHtml()
    mountContactForm(formRoot)
  }

  const map = document.getElementById('map-placeholder')
  if (map) {
    const { lat, lng } = company.map
    map.innerHTML = `
      <div class="card overflow-hidden">
        <div class="relative h-64 md:h-72 bg-paper2 blueprint-grid">
          <!-- stylized static map placeholder — replace with an embedded map of the configured location -->
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g stroke="#1e2229" stroke-opacity="0.25" stroke-width="1.2">
              <path d="M-20 90 Q 160 60 320 100 T 700 80"/>
              <path d="M-20 190 Q 200 160 380 200 T 820 170"/>
              <path d="M140 -20 Q 170 90 130 320"/>
              <path d="M420 -20 Q 390 120 440 320"/>
              <path d="M640 -20 Q 680 100 610 320"/>
            </g>
            <g stroke="#d4af37" stroke-width="1.6">
              <path d="M400 150 v-38 M400 196 v38 M362 154 h-38 M438 168 h38"/>
              <circle cx="400" cy="173" r="26"/>
            </g>
            <circle cx="400" cy="173" r="7" fill="#d4af37"/>
            <text x="445" y="140" font-family="monospace" font-size="13" fill="#1e2229" fill-opacity="0.7">HQ — ${company.city}</text>
          </svg>
        </div>
        <div class="border-t border-ink/10 p-5 flex flex-wrap items-center justify-between gap-3">
          <p class="text-xs text-muted leading-6">${company.map.note}</p>
          <a class="btn btn-ghost !h-10 !px-4 !text-xs" target="_blank" rel="noopener"
             href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}">
            مشاهده موقعیت روی نقشه
          </a>
        </div>
      </div>`
  }
}
