import { readFileSync, writeFileSync, cpSync, rmSync, existsSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const src = 'tests/mocks/example'
const dst = 'examples/api'

if (existsSync(dst)) {
  rmSync(dst, { recursive: true })
}

cpSync(src, dst, { recursive: true })

function replaceInFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      replaceInFiles(full)
    } else if (extname(full) === '.json') {
      const content = readFileSync(full, 'utf8')
      const replaced = content.replace(/http:\/\/localhost:8181\/example/g, 'http://localhost:2222/api')
      if (content !== replaced) {
        writeFileSync(full, replaced)
      }
    }
  }
}

replaceInFiles(dst)
