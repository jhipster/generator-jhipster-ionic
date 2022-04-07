import { Page } from './app.po';

export class LoginPage extends Page {
  username = cy.get('input[name="username"]');
  password = cy.get('input[name="password"]')
  // button on IdP sign-in form
  loginButton = cy.get('input[type=submit]');
  signInButton = cy.get('#signIn');
  logoutButton = cy.get('#logout');
  header = cy.get('.ion-title');

  getHeader() {
    return this.header;
  }

  setUserName(username) {
    this.username.type(username);
  }

  getUserName() {
    return this.username;
  }

  clearUserName() {
    this.username.clear();
  }

  setPassword(password) {
    this.password.type(password);
  }

  getPassword() {
    return this.password;
  }

  clearPassword() {
    this.password.clear();
  }

  login(username: string, password: string) {
    if (this.username) {
      this.username.type(username);
      this.password.type(password);
      this.loginButton.click();
    }
  }

  logout() {
    this.logoutButton.click();
  }
}
