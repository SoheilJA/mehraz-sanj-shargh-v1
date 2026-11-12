/**
 * Minimal lightbox for project galleries.
 */
import { icon } from '../utils/dom.js'

export function mountLightbox() {
  let box = document.getElementById('site-lightbox')
  if (!box) {
    box = document.createElement('div')
    box.id = 'site-lightbox'
    box.className = 'lightbox'
    box.setAttribute('role', 'dialog')
    box.setAttribute('aria-modal', 'true')
    box.setAttribute('aria-label', 'نمایش بزرگ تصویر پروژه')
    document.body.appendChild(box)
  }

  const open = (src, alt, isPlan) => {
    box.innerHTML = `
      <img src="${src}" alt="${alt || 'تصویر پروژه'}" class="${isPlan ? 'bg-white p-4' : ''}"/>
      <button class="absolute top-5 end-6 text-white/80 hover:text-gold transition-colors" aria-label="بستن">
        ${icon('x', 'h-8 w-8')}
      </button>`
    box.classList.add('open')
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    box.classList.remove('open')
    document.body.style.overflow = ''
  }

  document.addEventListener('click', (e) => {
    const img = e.target.closest('[data-lightbox]')
    if (img) {
      e.preventDefault()
      open(img.dataset.lightbox, img.getAttribute('alt'), img.dataset.plan === '1')
      return
    }
    if (e.target.closest('.lightbox') && !e.target.matches('.lightbox img')) close()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })
}
