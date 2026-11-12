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

const repoName = 'mehraz-sanj-shargh-v1'

/**
 * Rewrite root-absolute URLs ("/...", "/src/...") in emitted HTML so the
 * site works when served from a sub-path like GitHub Pages project sites.
 */
function rewriteAbsoluteBase() {
  return {
    name: 'rewrite-absolute-base',
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.html')) {
          let html = file.source
          html = html.replace(/(href|src)=("|')(\/(?!\/))/g, `$1=$2/${repoName}/`)
          html = html.replace(/(content=("|')\/(?!\/))/g, `$1/${repoName}/`)
          file.source = html
        }
      }
    },
  }
}

export default defineConfig({
  root: rootDir,
  base: `/${repoName}/`,
  plugins: [rewriteAbsoluteBase()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: collectHtmlInputs(rootDir),
    },
  },
})
