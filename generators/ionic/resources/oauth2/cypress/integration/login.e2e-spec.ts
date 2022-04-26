import { LoginPage } from '../support/pages/login.po';
import { adminUsername, adminPassword, userUsername, userPassword } from '../support/config';

describe('Login', () => {
  const loginPage = new LoginPage();

  it('should show a login button', () => {
    cy.visit('/');
    loginPage
      .getHeader()
      .invoke('text')
      .should('match', /Welcome, Java Hipster/);
    cy.get('#signIn').should('exist');
  });

  it('should fail to login with bad password', () => {
    cy.visit('/');
    loginPage.signIn();
    loginPage.login(adminUsername, 'foo');
    // Keycloak
    const alert = cy.get('#input-error');
    if (alert) {
      alert.should('include.text', 'Invalid username or password.');
    } else {
      // Okta
      const error = cy.get('.infobox-error');
      error.should('include.text', 'Sign in failed!');
    }
  });

  it('should login successfully with admin account', () => {
    cy.visit('/');
    loginPage.signIn();
    loginPage.login(adminUsername, adminPassword);

    const welcome = /Welcome, Admin/;
    cy.get('ion-title').invoke('text').should('match', welcome);
  });

  it('should logout successfully', () => {
    cy.login(userUsername, userPassword);
    cy.visit('/');
    cy.get('#logout').should('exist');
    loginPage.logout();
    cy.url().should('include', '/');
    cy.get('#signIn').should('exist');
  });
});
