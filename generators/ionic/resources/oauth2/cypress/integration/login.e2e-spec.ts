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
    cy.visit('/');
    loginPage.getHeader().invoke('text').should('match', /Welcome, Java Hipster/);
    cy.get('#signIn').should('exist');
  });

  it('should fail to login with bad password', () => {
    cy.visit('/');
    loginPage.login(username, 'foo');
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
    loginPage.login(username, password);

    const welcome = /Welcome, Admin/;
    cy.get('ion-title').invoke('text').should('match', welcome);
  });

  it('should logout successfully', () => {
    cy.get('#logout').should('exist');
    loginPage.logout();
    cy.url().should('include', '/');
    cy.get('#signIn').should('exist');
  });
});
