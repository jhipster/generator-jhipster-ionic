/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-namespace */
import './oauth2';
import { apiHost } from './config';

const authenticatedRequest = (data: any) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const tokenResponse = localStorage.getItem('CapacitorStorage.token_response');
  if (!tokenResponse) {
    return Cypress.Promise.reject('token_response is missing');
  }
  const { access_token, token_type } = JSON.parse(tokenResponse);
  return cy.request({
    ...data,
    url: apiHost + data.url,
    headers: {
      ...data.headers,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: token_type !== 'Bearer' ? access_token : `Bearer ${access_token}`,
    },
  });
};

const login = (username: string, password: string) => {
  cy.getOauth2Data().then(oauth2Data => {
    const { configuration: { authorization_endpoint } } = oauth2Data;
    cy.session(
      [username, password],
      () => {
        cy.visit('/');
        cy.get('#signIn').click();
        cy.origin(authorization_endpoint, {
          args: { authorization_endpoint, username, password }
          // eslint-disable-next-line @typescript-eslint/no-shadow
        }, ({ authorization_endpoint, username, password }) => {
          let usernameElement = 'username';
          let passwordElement = 'password';
          if (authorization_endpoint.includes('okta')) {
            usernameElement = 'identifier';
            passwordElement = 'credentials.passcode';
          }
          cy.get(`input[name="${usernameElement}"]`).type(username);
          cy.get(`input[name="${passwordElement}"]`).type(password);
          cy.get('[type="submit"]').first().click();
        });
        cy.url({timeout: 10000}).should('eq', Cypress.config().baseUrl + 'tabs/home');
      },
      {
        validate: () => {
          cy.authenticatedRequest({url: '/api/account'}).its('status').should('eq', 200);
        },
      }
    );
  });
};

Cypress.Commands.addAll({
  authenticatedRequest,
  login,
});

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(username: string, password: string): typeof login;
    authenticatedRequest<T = any>(options: Partial<RequestOptions>): typeof authenticatedRequest;
  }
}
