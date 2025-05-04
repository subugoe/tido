import fs from "fs";

function injectConfig(projectName) {

  const config = fs.readFileSync(`examples/config/${projectName ?? 'default'}.json`, 'utf8');
  return {
    name: 'inject-config',
    transformIndexHtml(html) {
      return config ? html.replace('<!-- CONFIG PLACEHOLDER -->', `<script id="config" type="application/json">${config}</script>`) : html;
    }
  }
}

export {
  injectConfig
}
