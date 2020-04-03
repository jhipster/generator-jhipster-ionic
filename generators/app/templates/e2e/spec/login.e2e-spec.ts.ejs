import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../pages/login.po';

describe('Login', () => {

  let loginPage;

  beforeEach(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
  });

  it('should show a login button', async () => {
    expect(loginPage.getHeader()).toMatch(/Welcome, Java Hipster/);
    expect(await loginPage.loginButton.isPresent());
  });

  it('should fail to login with bad password', async () => {
    await loginPage.signInButton.click();
    await loginPage.login('admin', 'foo');
    <%_ if (authenticationType !== 'oauth2') { _%>
    const error = element(by.css('.toast-message'));
    if (await error.isPresent()) {
      expect(await error.getText()).toMatch(/Unable to sign in/);
    }
    <%_ } else { _%>
    // Keycloak
    const alert = element(by.css('.alert-error'));
    if (await alert.isPresent()) {
      expect(await alert.getText()).toMatch('Invalid username or password.');
    } else {
      // Okta
      const error = element(by.css('.infobox-error'));
      expect(await error.getText()).toMatch('Sign in failed!');
    }
    <%_ } _%>
  });

  it('should login successfully with admin account', async () => {
    await loginPage.signInButton.click();
    await loginPage.login('admin', 'admin'); // use process.env.E2E_USERNAME if you want to use env variables

    const welcome = /Welcome, Admin<% if (authenticationType === 'jwt') { %>istrator<% } %>/;
    await browser.wait(ec.visibilityOf(loginPage.logoutButton));
    expect(element.all(by.css('ion-title')).getText()).toMatch(welcome);
  });

  it('should logout successfully', async () => {
    if (await loginPage.logoutButton.isPresent()) {
      await loginPage.logout();
      await browser.wait(ec.urlContains('/'));
      expect(await loginPage.signInButton.isPresent());
    }
  });
});
