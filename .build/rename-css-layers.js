import fs from 'fs';
import path from 'path';


function renameCssLayers() {
  return {
    name: 'rename-tailwind-layer',
    apply: 'build',
    closeBundle() {
      const cssPath = path.resolve('dist/tido.min.css');

      if (!fs.existsSync(cssPath)) {
        console.warn(`[rename-tailwind-layer] File not found: ${cssPath}`);
        return;
      }

      let css = fs.readFileSync(cssPath, 'utf8');

      css = css.replace(/@layer components;/g, "");
      css = css.replace(/@layer properties|@layer theme|@layer base|@layer utilities/g, '.tido');

      fs.writeFileSync(cssPath, css);
    },
  };
}

export { renameCssLayers }
