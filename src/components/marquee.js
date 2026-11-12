/**
 * Infinite marquee builder. Content is duplicated once inside the track;
 * the CSS keyframe marquee-rtl translates the track by 50% for a
 * seamless RTL loop. Pauses on hover; disabled for reduced motion.
 */
export function buildMarquee(container, itemsHtml, { duration = 46, vanish = true } = {}) {
  if (!container) return
  container.classList.add('marquee')
  if (vanish) container.classList.add('marquee-vanish')
  const items = Array.isArray(itemsHtml) ? itemsHtml.join('') : itemsHtml
  container.innerHTML = `
    <div class="marquee-track" style="--marquee-dur:${duration}s">
      ${items}
      ${items}
    </div>`
}
