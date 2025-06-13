import {exec} from "child_process";

function removeCssLayers() {
    return {
      name: 'remove-css-layers',
      closeBundle: () => exec('npx postcss dist/tido.min.css -o dist/tido.min.css', (err, stdout, stderr) => {
        if (err) {
          console.error(stderr);
        } else {
          console.log(stdout || '✅ Removed CSS Layers');
        }
      })
    }
}

export { removeCssLayers }
