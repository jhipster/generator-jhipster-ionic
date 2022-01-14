import { browser, by, element } from 'protractor';
import { Page } from './app.po';

export class LoginPage extends Page {
  username = element(by.name('username'));
  password = element(by.name('password'));
  // button on IdP sign-in form
  loginButton = element(by.css('input[type=submit]'));
  signInButton = element(by.id('signIn'));
  logoutButton = element(by.id('logout'));
  header = element(by.css('ion-title'));

  async getHeader() {
    return this.header.getText();
  }

  async setUserName(username) {
    await this.username.sendKeys(username);
  }

  async getUserName() {
    return this.username.getAttribute('value');
  }

  async clearUserName() {
    await this.username.clear();
  }

  async setPassword(password) {
    await this.password.sendKeys(password);
  }

  async getPassword() {
    return this.password.getAttribute('value');
  }

  async clearPassword() {
    await this.password.clear();
  }

  async login(username: string, password: string): Promise<void> {
    // Entering non angular site, tell webdriver to switch to synchronous mode.
    await browser.waitForAngularEnabled(false);
    await browser.sleep(1000);

    if (await this.username.isPresent()) {
      await this.username.sendKeys(username);
      await this.password.sendKeys(password);
      await this.loginButton.click();
      if (!(await this.username.isPresent())) {
        await browser.waitForAngularEnabled(true);
      }
    } else {
      // redirected back because already logged in
      await browser.waitForAngularEnabled(true);
    }
  }

  async logout() {
    await this.logoutButton.click();
  }
}
