import { LoginPage } from '../fixtures/login.po';

describe('Login', () => {
  let loginPage;
  const username = process.env.E2E_USERNAME || 'admin';
  const password = process.env.E2E_PASSWORD || 'admin';

  beforeEach(() => {
    loginPage = new LoginPage();
    loginPage.navigateTo('/');
  });

  it('should show a login button', () => {
    loginPage.getHeader().invoke('text').should('match', /Welcome, Java Hipster/);
    loginPage.loginButton.should('exist');
  });

  it('should fail to login with bad password', () => {
    loginPage.signInButton.click();
    loginPage.login(username, 'foo');
    const error = cy.get('.toast-message');
    if (error) {
      error.invoke('text').should('match', /Unable to sign in/);
    }
  });

  it('should login successfully with admin account', () => {
    loginPage.signInButton.click();
    loginPage.login(username, password);

    const welcome = /Welcome, Administrator/;
    cy.get('.ion-title').invoke('text').should('match', welcome);
  });

  it('should logout successfully', () => {
    if (loginPage.logoutButton) {
      loginPage.logout();
      cy.url().should('include', '/');
      loginPage.signInButton.should('exist');
    }
  });
});
