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
import { apiHost } from './config';
import { LoginPage } from './pages/login.po';

Cypress.Commands.addAll({
  authenticatedRequest: (data: any) => {
    const token = JSON.parse(localStorage.getItem('jhi-authenticationtoken') || sessionStorage.getItem('jhi-authenticationtoken'));
    return cy.request({
      ...data,
      url: apiHost + data.url,
      headers: {
        ...data.headers,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
      },
    });
  },

  login: (username: string, password: string) => {
    cy.session(
      [username, password],
      () => {
        cy.visit('/tabs/home');
        const loginPage = new LoginPage();
        loginPage.signIn();
        loginPage.login(username, password);
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
