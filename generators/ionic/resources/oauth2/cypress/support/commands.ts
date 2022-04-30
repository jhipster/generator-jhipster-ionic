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
      cy.getOauth2Data().then(oauth2Data => {
        const {
          info: { clientId },
          configuration: { authorization_endpoint, token_endpoint },
        } = oauth2Data;
        // Keycloak is using login by api because https://github.com/cypress-io/cypress/issues/21201
        if (authorization_endpoint.includes('realm')) {
          cy.keycloakLogin(oauth2Data, username, password).then(({ headers }) => {
            const { location } = headers;
            const locationUrl = new URL(location as string);
            const code = locationUrl.searchParams.get('code');

            // Retrieve token.
            cy.request({
              method: 'POST',
              url: token_endpoint,
              followRedirect: false,
              form: true,
              body: {
                grant_type: 'authorization_code',
                code,
                refresh_token: undefined,
                redirect_uri: window.location.origin,
                client_id: clientId,
              },
            }).then(({ body }) => {
              localStorage.setItem('CapacitorStorage.token_response', JSON.stringify(body));
              cy.visit('/');
              cy.url().should('eq', Cypress.config().baseUrl + 'tabs/home');
            });
          });
        } else {
          cy.visit('/');
          cy.get('#signIn').click();
          cy.origin(authorization_endpoint, {
            args: {authorization_endpoint, username, password}
            // eslint-disable-next-line @typescript-eslint/no-shadow
          }, ({authorization_endpoint, username, password}) => {
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
        }
      });
    },
    {
      validate: () => {
        cy.authenticatedRequest({url: '/api/account'}).its('status').should('eq', 200);
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
