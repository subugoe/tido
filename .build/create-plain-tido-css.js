import {exec} from "child_process";

function createPlainTidoCss() {
    exec('npx postcss dist/tido.min.css -o dist/tido.min.css', (err, stdout, stderr) => {
      if (err) {
        console.error(stderr);
      } else {
        console.log(stdout || '✅ Layers flattened to plain.css');
      }
    });
}

export { createPlainTidoCss };
