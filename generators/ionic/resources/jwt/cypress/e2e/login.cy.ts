import { LoginPage } from '../support/pages/login.po';
import { ADMIN_USERNAME, ADMIN_PASSWORD, USER_USERNAME, USER_PASSWORD } from '../support/config';

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
    loginPage.login(ADMIN_USERNAME, 'foo');
    cy.get('ion-toast').shadow().find('.toast-message').contains('Unable to sign in');
  });

  it('should login successfully with admin account', () => {
    cy.visit('/');
    loginPage.signIn();
    loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);

    const welcome = /Welcome, Administrator/;
    cy.get('app-home ion-title').invoke('text').should('match', welcome);
  });

  it('should logout successfully', () => {
    cy.login(USER_USERNAME, USER_PASSWORD);
    cy.visit('/tabs/home');
    cy.get('#logout').should('exist');
    loginPage.logout();
    cy.url().should('include', '/');
    cy.get('#signIn').should('exist');
  });
});
