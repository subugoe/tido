// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// suppress a benign ResizeObserver runtime error that some browsers emit
// and which otherwise fails Cypress tests:
// "ResizeObserver loop completed with undelivered notifications."
Cypress.on('uncaught:exception', (err) => {
  if (err && err.message && err.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    // returning false prevents Cypress from failing the test
    return false
  }
  // allow other errors to fail the tests
})

// Alternatively you can use CommonJS syntax:
// require('./commands')
