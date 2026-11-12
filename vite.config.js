import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)))

/**
 * Collect every .html file of the project as a rollup entry so the
 * production build emits a true static multi-page site.
 */
function collectHtmlInputs(dir, entries = {}) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.') || name === 'dist') continue
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) collectHtmlInputs(full, entries)
    else if (name.endsWith('.html')) entries[path.relative(rootDir, full)] = full
  }
  return entries
}

export default defineConfig({
  root: rootDir,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: collectHtmlInputs(rootDir),
    },
  },
})
