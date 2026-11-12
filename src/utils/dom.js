/** Tiny DOM helpers used by all renderers. */

/**
 * Create an element from HTML string.
 * @param {string} html
 * @returns {HTMLElement}
 */
export function el(html) {
  const tpl = document.createElement('template')
  tpl.innerHTML = html.trim()
  return tpl.content.firstElementChild
}

/**
 * Render an HTML string into a container (replacing content).
 * @param {string|Element} target - selector, element or null
 * @param {string} html
 * @returns {HTMLElement|null}
 */
export function render(target, html) {
  const node = typeof target === 'string' ? document.querySelector(target) : target
  if (!node) return null
  node.innerHTML = html
  return node
}

/**
 * Prepend rendered HTML to a target.
 * @param {string|Element} target
 * @param {string} html
 */
export function prepend(target, html) {
  const node = typeof target === 'string' ? document.querySelector(target) : target
  if (node) node.insertAdjacentHTML('afterbegin', html)
}

/**
 * Append rendered HTML to a target.
 * @param {string|Element} target
 * @param {string} html
 */
export function append(target, html) {
  const node = typeof target === 'string' ? document.querySelector(target) : target
  if (node) node.insertAdjacentHTML('beforeend', html)
}

/** Lucide icon markup (icons are initialized globally after render). */
export function icon(name, cls = 'h-5 w-5') {
  return `<i data-lucide="${name}" class="${cls}" aria-hidden="true"></i>`
}
