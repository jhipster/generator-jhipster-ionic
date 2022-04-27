// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import 'cypress-localstorage-commands';
import { apiBaseUrl } from './config';

Cypress.Commands.addAll({
  authenticatedRequest: (data: any) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token, token_type } = JSON.parse(localStorage.getItem('CapacitorStorage.token_response'));
    return cy.request({
      ...data,
      url: apiBaseUrl + data.url,
      headers: {
        ...data.headers,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: token_type !== 'Bearer' ? access_token : `Bearer ${access_token}`,
      },
    });
  },

  login: (username: string, password: string) => {
    cy.session(
      [username, password],
      () => {
        cy.visit('/');
        cy.get('#signIn').click();
        cy.url({ timeout: 10000 }).should('includes', '/realms/');
        cy.url().then(url => {
          const { protocol, host } = new URL(url);
          // eslint-disable-next-line @typescript-eslint/no-shadow
          cy.origin(`${protocol}//${host}`, { args: { url, username, password } }, ({ url, username, password }) => {
            // Reload oauth2 login page due to cypress origin change.
            cy.visit(url);
            cy.get('input[name="username"]').type(username);
            cy.get('input[name="password"]').type(password);
            cy.get('input[type="submit"]').click();
          });
        });
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + 'tabs/home');
      },
      {
        validate: () => {
          cy.authenticatedRequest({ url: '/api/account' }).its('status').should('eq', 200);
        },
      }
    );
  },
});
