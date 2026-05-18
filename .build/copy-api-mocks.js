import { readFileSync, writeFileSync, cpSync, rmSync, existsSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

// Parse named arguments (--srcUrl=... --dstUrl=...)
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => a.slice(2).split('='))
)

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))

const srcUrl = args.srcUrl ?? 'http://localhost:8181/example'
const dstUrl = args.dstUrl === 'gh' ? pkg.homepage : (args.dstUrl ?? 'http://localhost:2222/api')

const src = 'tests/mocks/example'
const dst = 'examples/api'

if (existsSync(dst)) {
  rmSync(dst, { recursive: true })
}
cpSync(src, dst, { recursive: true })
cpSync('tests/mocks/text-api.png', join(dst, 'text-api.png'))

function replaceInFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      replaceInFiles(full)
    } else if (extname(full) === '.json') {
      const content = readFileSync(full, 'utf8')
      const escapedSrcUrl = srcUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      let replaced = content.replace(new RegExp(escapedSrcUrl, 'g'), dstUrl)
      replaced = replaced.replace(
        new RegExp(`${escapedSrcUrl}/text-api\\.png`, 'g'),
        `${dstUrl}/text-api.png`
      )
      if (content !== replaced) {
        writeFileSync(full, replaced)
      }
    }
  }
}

replaceInFiles(dst)
