/**
 * Animated counters (GSAP). Only used with verified indicators.
 * IntersectionObserver starts the animation once when visible.
 */
import { gsap } from 'gsap'
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
        gsap.to(state, {
          v: target,
          duration: 1.5,
          ease: 'expo.out',
          onUpdate: () => {
            node.textContent = faDigits(Math.round(state.v))
          },
        })
      },
      { threshold: 0.4 }
    )
    io.observe(node)
  })
}
