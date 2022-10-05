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
import './commands'
require('cypress-xpath');
require('cypress-grep')()
// cy.faker = require('faker');

before(function () {
  cy.login();
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // throw new Error('error!');
  return false
})

Cypress.on('fail', (error, runnable) => {
  // we now have access to the err instance
  // and the mocha runnable this failed on
  throw error // throw error to have test still fail
})

// Alternatively you can use CommonJS syntax:
// require('./commands')
const chainStart = "___CY_ALL_CHAIN_START___"
cy.all = function (...commands) {
  const _ = Cypress._
  // eslint-disable-next-line
  const chain = cy.wrap(null, { log: false })
  const stopCommand = _.find(cy.queue.get(), {
    attributes: { chainerId: chain.chainerId },
  })
  const startCommand = _.find(cy.queue.get(), {
    attributes: { chainerId: commands[0].chainerId },
  })
  const p = chain.then(() => {
    return (
      _(commands)
        .map(cmd => {
          return cmd[chainStart]
            ? cmd[chainStart].attributes
            : _.find(cy.queue.get(), {
              attributes: { chainerId: cmd.chainerId },
            }).attributes
        })
        .concat(stopCommand.attributes)
        .slice(1)
        .flatMap(cmd => {
          return cmd.prev.get("subject")
        })
        .value()
    )
  })
  p[chainStart] = startCommand
  return p
}

String.prototype.format = function () {
  // store arguments in an array
  var args = arguments;
  // use replace to iterate over the string
  // select the match and check if the related argument is present
  // if yes, replace the match with the argument
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    // check if the argument is present
    return typeof args[index] == 'undefined' ? match : args[index];
  });
};