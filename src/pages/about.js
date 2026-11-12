/**
 * About page — capabilities list, equipment preview and process reuse.
 */
import { capabilities } from '../components/capabilities.js'
import { mountProcess } from '../components/process.js'
import { equipment } from '../data/equipment.js'
import { icon } from '../utils/dom.js'
import { padFa } from '../utils/str.js'

export async function mount() {
  // capabilities list (static grid, no panel)
  const caps = document.getElementById('about-capabilities')
  if (caps) {
    caps.innerHTML = capabilities
      .map(
        (c, i) => `
      <div class="card p-6 reveal" data-reveal-delay="${(i % 3) * 0.08}">
        <div class="flex items-center justify-between mb-4">
          <span class="font-mono text-xs text-golddeep">${padFa(i + 1)}</span>
          <span class="en-note">${c.en}</span>
        </div>
        <h3 class="font-bold text-ink text-[1.05rem]">${c.title}</h3>
        <p class="mt-2.5 text-sm leading-7 text-muted">${c.desc}</p>
      </div>`
      )
      .join('')
  }

  // equipment preview
  const eq = document.getElementById('about-equipment')
  if (eq) {
    eq.innerHTML = equipment
      .map(
        (e) => `
      <a href="/equipment.html" class="card p-6 group flex items-center gap-5">
        <span class="inline-flex items-center justify-center h-12 w-12 bg-ink text-gold rounded-sm shrink-0">
          ${icon(e.icon, 'h-6 w-6')}
        </span>
        <span class="flex-1">
          <span class="block font-bold text-ink">${e.title}</span>
          <span class="block text-xs text-muted mt-1">${e.latin}</span>
        </span>
        ${icon('arrow-left', 'h-4 w-4 text-golddeep transition-transform group-hover:-translate-x-1')}
      </a>`
      )
      .join('')
  }

  // process timeline
  mountProcess(document.getElementById('about-process'))
}
