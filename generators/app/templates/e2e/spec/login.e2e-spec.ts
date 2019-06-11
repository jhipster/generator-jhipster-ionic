import { browser, by, element, ExpectedConditions as ec, protractor } from 'protractor';
import { LoginPage } from '../pages/login.po';

describe('Login', () => {

  let loginPage;

  beforeAll(async () => {
    loginPage = new LoginPage();
    loginPage.navigateTo('/');
    await browser.waitForAngular();
  });

  it('should show a login button', () => {
    expect(loginPage.getHeader()).toMatch(/Welcome, Java Hipster/);
    expect(loginPage.loginButton.isPresent());
  });

  it('should fail to login with bad password', async () => {
    loginPage.login('admin', 'foo');
    <%_ if (authenticationType !== 'oauth2') { _%>
    const error = element(by.css('.toast-message'));
    browser.wait(ec.visibilityOf(error)).then(() => {
        error.getText().then((value) => {
            expect(value).toMatch(/Unable to sign in/);
        });
    });
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
    loginPage.clearUserName();
    <%_ if (authenticationType !== 'oauth2') { _%>
    // element.clear() not working, so don't try to reset username
    // loginPage.setUserName('admin'); // use process.env.E2E_USERNAME if you want to use env variables
    <%_ }  else { _%>
    loginPage.setUserName('admin');
    <%_ } _%>
    loginPage.clearPassword();
    loginPage.setPassword('admin');
    await loginPage.loginButton.click();

    await browser.waitForAngular();

    const welcome = /Welcome, Admin<% if (authenticationType === 'jwt') { %>istrator<% } %>/;
    await browser.wait(ec.visibilityOf(loginPage.logoutButton));
    expect(element.all(by.css('ion-title')).getText()).toMatch(welcome);
  });

  it('should logout successfully', async () => {
    await loginPage.logout();
    await browser.wait(ec.urlContains('/'));
    expect(loginPage.signInButton.isPresent());
  })
});
