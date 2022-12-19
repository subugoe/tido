// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  plugins: [
    require('postcss-remove-selectors')({ selectors: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
    require('prepend-selector-postcss')({
      selector: '#tido ',
      excludePart: [
        'body',
        '.body--dark',
        ':root',
        '.tido-container',
        '.q-dialog',
        '.q-card',
        '.q-icon',
        '.q-menu',
        '.q-checkbox',
        '.q-list',
        '.q-item',
      ],
      appendTo: ['html'],
    }),
    // to edit target browsers: use "browserslist" field in package.json
    require('autoprefixer')
  ]
}
