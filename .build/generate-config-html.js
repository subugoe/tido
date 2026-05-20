import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { marked } from 'marked'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function extractSection(text, heading) {
  const lines = text.split('\n')
  const start = lines.findIndex(l => l.trim() === heading)
  if (start === -1) {
    console.error(`Section "${heading}" not found in README`)
    process.exit(1)
  }
  const rest = lines.slice(start + 1)
  const end = rest.findIndex(l => /^##\s/.test(l))
  return rest.slice(0, end !== -1 ? end : undefined).join('\n')
}

const isFragment = process.argv.includes('--fragment')

function wrapHtml(body) {
  const content = `    <h1>TIDO — Configuration Reference</h1>
    <p style="color:#555;margin-bottom:1.5rem;">
      Auto-generated from <code>README.md</code>.
    </p>
${body.split('\n').map(l => '    ' + l).join('\n')}
    <div class="source-note">
      Source: <code>README.md</code> — <a href="https://github.com/subugoe/tido">TIDO</a>
    </div>`

  if (isFragment) return content

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>TIDO — Configuration Reference</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #f8f9fa;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,.1);
      padding: 2rem 2.5rem;
    }
    h1 { font-size: 2rem; margin-bottom: .5rem; color: #111; }
    h2 { font-size: 1.5rem; margin: 2rem 0 .75rem; padding-bottom: .35rem; border-bottom: 2px solid #e9ecef; color: #222; }
    h3 { font-size: 1.2rem; margin: 1.75rem 0 .5rem; color: #333; }
    h4 { font-size: 1.05rem; margin: 1.25rem 0 .4rem; color: #444; }
    p { margin: .75rem 0; }
    a { color: #3456aa; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code {
      font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      background: #f1f3f5;
      padding: .15em .4em;
      border-radius: 4px;
      font-size: .875em;
    }
    pre {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1rem 1.25rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1rem 0;
      font-size: .875rem;
      line-height: 1.5;
    }
    pre code {
      background: none;
      padding: 0;
      font-size: inherit;
      color: inherit;
      border-radius: 0;
    }
    .table-wrap { overflow-x: auto; margin: 1rem 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: .875rem;
    }
    th, td {
      text-align: left;
      padding: .6rem .75rem;
      border: 1px solid #dee2e6;
    }
    th { background: #f1f3f5; font-weight: 600; white-space: nowrap; }
    tr:nth-child(even) td { background: #f8f9fa; }
    li { margin: .3rem 0 .3rem 1.5rem; }
    details {
      margin: 1rem 0;
      padding: .75rem 1rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
    }
    summary { cursor: pointer; font-weight: 600; }
    .source-note {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
      font-size: .8rem;
      color: #6c757d;
    }
    @media (max-width: 640px) {
      .container { padding: 1.25rem; }
      body { padding: 1rem .5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
${content}
  </div>
</body>
</html>
`
}

const readmePath = path.join(root, 'README.md')

if (!fs.existsSync(readmePath)) {
  console.error('README.md not found at', readmePath)
  process.exit(1)
}

const readme = fs.readFileSync(readmePath, 'utf8')
const configMd = extractSection(readme, '## Configuration')
const htmlBody = marked.parse(configMd, { gfm: true })
const result = wrapHtml(htmlBody)

process.stdout.write(result)
