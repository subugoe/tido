import { readFileSync, writeFileSync, cpSync, rmSync, existsSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

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
      let replaced = content.replace(/http:\/\/localhost:8181\/example/g, 'http://localhost:2222/api')
      replaced = replaced.replace(/http:\/\/localhost:8181\/text-api\.png/g, 'http://localhost:2222/api/text-api.png')
      if (content !== replaced) {
        writeFileSync(full, replaced)
      }
    }
  }
}

replaceInFiles(dst)
