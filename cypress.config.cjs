const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1400,
  viewportHeight: 800,
  experimentalSourceRewriting: true,
  chromeWebSecurity: false,
  screenshotsFolder: 'tests/cypress/screenshots',
  downloadsFolder: 'tests/cypress/downloads',
  fixturesFolder: 'tests/cypress/fixtures',
  videosFolder: 'tests/cypress/videos',
  e2e: {
    baseUrl: 'http://localhost:2222',
    specPattern: 'tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/cypress/support/e2e.js',
    defaultCommandTimeout: 8000
  },
});
