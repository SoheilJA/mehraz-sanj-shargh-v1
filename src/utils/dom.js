/** Lucide icon markup (icons are initialized globally after render). */
export function icon(name, cls = 'h-5 w-5') {
  return `<i data-lucide="${name}" class="${cls}" aria-hidden="true"></i>`
}
