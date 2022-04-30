import { Page } from './app.po';

export class LoginPage extends Page {
  signIn() {
    cy.get('#signIn').click();
  }

  submit() {
    cy.get('#login').click();
  }

  logout() {
    cy.get('#logout').click();
  }

  getHeader() {
    return cy.get('ion-title');
  }

  typeUserName(username) {
    cy.get('ion-input[name="username"] input').type(username);
  }

  getUserName() {
    return cy.get('ion-input[name="username"] input');
  }

  clearUserName() {
    cy.get('ion-input[name="username"] input').clear();
  }

  typePassword(password) {
    cy.get('ion-input[name="password"] input').type(password);
  }

  getPassword() {
    return cy.get('ion-input[name="password"] input');
  }

  clearPassword() {
    cy.get('ion-input[name="password"] input').clear();
  }

  login(username: string, password: string) {
    this.typeUserName(username);
    this.typePassword(password);
    this.submit();
  }
}
