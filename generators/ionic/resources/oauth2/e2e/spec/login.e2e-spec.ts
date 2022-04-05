import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../pages/login.po';

describe('Login', () => {
  let loginPage;
  const username = process.env.E2E_USERNAME || 'admin';
  const password = process.env.E2E_PASSWORD || 'admin';

  beforeEach(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
  });

  it('should show a login button', async () => {
    expect(loginPage.getHeader()).toMatch(/Welcome, Java Hipster/);
    expect(await loginPage.loginButton.isPresent());
  });

  it('should fail to login with bad password', async () => {
    await browser.wait(ec.visibilityOf(loginPage.signInButton));
    await loginPage.signInButton.click();
    await loginPage.login(username, 'foo');
    // Keycloak
    const alert = element(by.css('#input-error'));
    if (await alert.isPresent()) {
      expect(await alert.getText()).toMatch('Invalid username or password.');
    } else {
      // Okta
      const error = element(by.css('.infobox-error'));
      expect(await error.getText()).toMatch('Sign in failed!');
    }
  });

  it('should login successfully with admin account', async () => {
    await browser.wait(ec.visibilityOf(loginPage.signInButton));
    await loginPage.signInButton.click();
    await loginPage.login(username, password);

    const welcome = /Welcome, Admin/;
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
