// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-wait-until';
import 'cypress-file-upload';

Cypress.Commands.add('login', () => {
  const pagesConfig = Cypress.config('pages');

  cy.visit(`${Cypress.config('baseUrl')}${pagesConfig.jobs.gastroenterologist}`)
  // cy.task('generateJwtToken')
  // .then(($token) => {

  //   const loginOptions = {
  //     method: 'GET',
  //     url: Cypress.config().baseUrl + "/login/google/token/",
  //     headers: {
  //       Authorization: 'Bearer ' + $token
  //     }
  //   }

  //   cy.request(loginOptions).then(($jsessionResponse) => {
  //     cy.visit(envVars.baseUrl) 
  //   });
  // });
});

Cypress.Commands.add('getDropdownOptions', () => {
  return cy.get('#user_occupations_container-label +div .MuiAutocomplete-inputFocused', {
    timeout: 10000,
  });
});