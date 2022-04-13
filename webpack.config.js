/*
 * This config makes JetBrains IDE's recognize the @ in VueJS imports
 * See: https://stackoverflow.com/a/58898937/1959760
 */
const resolve = (dir) => require('path')
  .join(__dirname, dir);

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
};
