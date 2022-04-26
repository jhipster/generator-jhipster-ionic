import { Page } from './app.po';

export class LoginPage extends Page {
  signIn() {
    cy.get('#signIn').click();
  }

  getHeader() {
    return cy.get('ion-title');
  }

  setUserName(username) {
    cy.get('ion-input[name="username"] input').type(username);
  }

  getUserName() {
    return cy.get('ion-input[name="username"] input');
  }

  clearUserName() {
    cy.get('ion-input[name="username"] input').clear();
  }

  setPassword(password) {
    cy.get('ion-input[name="password"] input').type(password);
  }

  getPassword() {
    return cy.get('ion-input[name="password"] input');
  }

  clearPassword() {
    cy.get('ion-input[name="password"] input').clear();
  }

  login(username: string, password: string) {
    this.setUserName(username);
    this.setPassword(password);
    cy.get('#login').click();
  }

  logout() {
    cy.get('#logout').click();
  }
}