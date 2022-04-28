import { userUsername, userPassword } from '../support/config';

describe('App', () => {
  describe('default screen', () => {
    it('should have the correct title', () => {
      cy.visit('/');
      cy.title().should('include', 'Ionic App');
    });
  });

  it('entrypoint should redirect to home when logged in', () => {
    cy.login(userUsername, userPassword);
    cy.visit('/');
    cy.url().should('eq', Cypress.config().baseUrl + 'tabs/home');
  });
});
