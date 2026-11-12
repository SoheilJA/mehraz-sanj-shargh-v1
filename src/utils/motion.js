/**
 * Motion foundation: Lenis smooth scroll + GSAP/ScrollTrigger wiring,
 * scroll reveals, entrance animations, reduced-motion handling.
 */
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Current Lenis instance (null when reduced motion is on). */
export let lenis = null

function initLenis() {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // Smooth anchor navigation
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a) return
    const target = document.querySelector(a.getAttribute('href'))
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target, { offset: -90 })
  })
}

/** Scroll-triggered reveals for .reveal / .reveal-group elements.
 *  Re-runnable: only processes elements not yet initialized. */
export function initReveals() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, .reveal-group').forEach((n) => n.classList.add('reveal-init'))
    return
  }

  gsap.utils.toArray('.reveal:not(.reveal-init)').forEach((node) => {
    node.classList.add('reveal-init')
    gsap.fromTo(
      node,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: parseFloat(node.dataset.revealDelay || 0),
        scrollTrigger: { trigger: node, start: 'top 88%', once: true },
      }
    )
  })

  gsap.utils.toArray('.reveal-group:not(.reveal-init)').forEach((group) => {
    group.classList.add('reveal-init')
    const children = group.querySelectorAll(':scope > *')
    if (!children.length) return
    gsap.fromTo(
      children,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 86%', once: true },
      }
    )
  })
}

/** Subtle page entrance for [data-entrance] elements. */
export function pageEntrance(scope = document) {
  if (prefersReducedMotion) return
  const nodes = scope.querySelectorAll('[data-entrance]')
  if (!nodes.length) return
  gsap.fromTo(
    nodes,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.15 }
  )
}

/** Refresh ScrollTrigger positions after dynamic content is rendered. */
export function refreshMotion() {
  ScrollTrigger.refresh()
}

/** Boot motion for the current page. Called once from main.js. */
export function initMotion() {
  if (prefersReducedMotion) {
    document.documentElement.classList.add('no-motion')
    return { gsap, ScrollTrigger, reduced: true }
  }
  initLenis()
  const start = () => {
    initReveals()
    pageEntrance()
    window.addEventListener('load', () => ScrollTrigger.refresh())
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start)
  else start()
  return { gsap, ScrollTrigger, reduced: false, lenis: () => lenis }
}
