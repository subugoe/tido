import fs from 'fs';
import path from 'path';


function fixTailwindScoping() {
  return {
    name: 'fix-tailwind-scoping',
    apply: 'build',
    closeBundle() {
      const cssPath = path.resolve('dist/tido.min.css');

      if (!fs.existsSync(cssPath)) {
        console.warn(`[fix-tailwind-scoping] File not found: ${cssPath}`);
        return;
      }

      let css = fs.readFileSync(cssPath, 'utf8');

      css = css.replace(/(:root|html)/g, '.tido');
      css = css.replace(/:host/g, '.tido:host');
      css = css.replace(/\.tido ::/g, '.tido *::');
      css = css.replace(/\.tido :/g, '.tido *:');
      css = css.replace(/:where\(\.tido\s/g, '.tido *:where(');

      fs.writeFileSync(cssPath, css);
    },
  };
}

export { fixTailwindScoping }
