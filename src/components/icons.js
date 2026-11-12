import { createIcons, icons } from 'lucide'

/** Initialize all lucide icons present in the current DOM. */
export function initIcons() {
  try {
    createIcons({ icons })
  } catch (err) {
    console.warn('lucide icons failed:', err)
  }
}
