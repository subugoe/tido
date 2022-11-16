const fs = require('fs');

let data = fs.readFileSync('./dist/tido.js', { encoding: 'utf8', flag: 'r' });

// Replace bootstrap icons in build file.
data = data
.replace(
  'url(/bootstrap-icons.woff)',
  'url(https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/fonts/bootstrap-icons.woff)'
  )
.replace(
  'url(/bootstrap-icons.woff2)',
  'url(https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/fonts/bootstrap-icons.woff2)'
);

fs.writeFileSync('./dist/tido.js', data);

fs.unlinkSync('./dist/bootstrap-icons.woff');
fs.unlinkSync('./dist/bootstrap-icons.woff2');
