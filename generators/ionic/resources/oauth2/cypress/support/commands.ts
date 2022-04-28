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
  cy.session(
    [username, password],
    () => {
      cy.oauthLogin(username, password);

      /* Login by ui, use it once cypress origin becomes stable enough.
      cy.visit('/');
      cy.get('#signIn').click();
      cy.url({ timeout: 10000 }).should('includes', '/realms/');
      cy.url().then(url => {
        const { protocol, host } = new URL(url);
        // eslint-disable-next-line @typescript-eslint/no-shadow
        // `${protocol}//${host}/`
        cy.origin('http://keycloak:9080', { args: { url, username, password } }, ({ url, username, password }) => {
          // Reload oauth2 login page due to cypress origin change.
          cy.visit(url);
          cy.get('input[name="username"]').type(username);
          cy.get('input[name="password"]').type(password);
          cy.get('input[type="submit"]').click();
        });
      });
      cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + 'tabs/home');
      */
    },
    {
      validate: () => {
        cy.authenticatedRequest({ url: '/api/account' }).its('status').should('eq', 200);
      },
    }
  );
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
