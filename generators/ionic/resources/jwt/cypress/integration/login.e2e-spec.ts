import { LoginPage } from '../fixtures/login.po';

describe('Login', () => {
  let loginPage;
  const username = process.env.E2E_USERNAME || 'admin';
  const password = process.env.E2E_PASSWORD || 'admin';

  beforeEach(() => {
    loginPage = new LoginPage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('should show a login button', () => {
    loginPage.getHeader().invoke('text').should('match', /Welcome, Java Hipster/);
    cy.get('#signIn').should('exist');
  });

  it('should fail to login with bad password', () => {
    cy.visit('/');
    cy.get('#signIn').click();
    loginPage.login(username, 'foo');
    const error = cy.get('.toast-message');
    if (error) {
      error.invoke('text').should('match', /Unable to sign in/);
    }
  });

  it('should login successfully with admin account', () => {
    cy.visit('/');
    cy.get('#signIn').click();
    loginPage.login(username, password);

    const welcome = /Welcome, Administrator/;
    cy.get('#logout').should('exist');
    cy.get('ion-title').invoke('text').should('match', welcome);
  });

  it('should logout successfully', () => {
    cy.get('#logout').should('exist');
    loginPage.logout();
    cy.url().should('include', '/');
    cy.get('#signIn').should('exist');
  });
});
