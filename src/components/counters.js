/**
 * Animated counters (anime.js). Only used with verified indicators.
 * IntersectionObserver starts the animation once when visible.
 */
import anime from 'animejs'
import { faDigits } from '../utils/str.js'
import { prefersReducedMotion } from '../utils/motion.js'

export function animateCounters(root = document) {
  const nodes = root.querySelectorAll('[data-counter]')
  if (!nodes.length) return

  nodes.forEach((node) => {
    const target = parseFloat(node.dataset.counter)
    if (prefersReducedMotion) {
      node.textContent = faDigits(target)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        const state = { v: 0 }
        anime({
          targets: state,
          v: target,
          round: 1,
          duration: 1500,
          easing: 'easeOutExpo',
          update: () => {
            node.textContent = faDigits(state.v)
          },
        })
      },
      { threshold: 0.4 }
    )
    io.observe(node)
  })
}
