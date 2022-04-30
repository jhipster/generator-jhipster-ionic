/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import { apiHost } from './config';
import { environment } from '../../src/environments/environment';

const {
  oidcConfig: { scopes: scope, audience, client_id },
} = environment;

// Get oauth2 basic data
const getOauth2Data = () =>
  cy
    .request({
      url: `${apiHost}/api/auth-info`,
      followRedirect: false,
    })
    .then(({ body: info }) => {
      const { issuer } = info;
      return cy
        .request({
          url: `${issuer.replace(/\/$/, '')}/.well-known/openid-configuration`,
          followRedirect: false,
        })
        .then(({ body: configuration }) => ({
          info,
          configuration,
          qs: {
            redirect_uri: window.location.origin,
            client_id,
            response_type: 'code',
            scope,
            audience,
          },
        }));
    });

// Get authorization from keycloak
const keycloakLogin = ({ configuration, qs }, username: string, password: string) => {
  const { authorization_endpoint } = configuration;
  return cy
    .request({
      url: authorization_endpoint,
      qs,
      followRedirect: false,
    })
    .then(response => {
      const html = document.createElement('html');
      html.innerHTML = response.body;

      const form = html.getElementsByTagName('form')[0];
      const url = form.action;
      return cy.request({
        method: 'POST',
        url,
        followRedirect: false,
        form: true,
        body: {
          username,
          password,
        },
      });
    });
};

// Get authorization from auth0
const auth0Login = ({ configuration, qs }, username: string, password: string) => {
  const { authorization_endpoint } = configuration;
  return cy
    .request({
      url: authorization_endpoint,
      qs,
      followRedirect: true,
    })
    .then(response => {
      const html = document.createElement('html');
      html.innerHTML = response.body;
      const state = html.querySelector('input[name="state"]').value;
      return cy.request({
        method: 'POST',
        url: `${new URL(authorization_endpoint).origin}/u/login`,
        followRedirect: true,
        form: true,
        body: {
          state,
          action: 'default',
          username,
          password,
        },
      });
    });
};

// Get authorization from okta
const oktaLogin = ({ configuration, qs }, username, password) => {
  const { authorization_endpoint } = configuration;
  const url = new URL(authorization_endpoint);
  return cy
    .request({
      method: 'POST',
      url: `${url.origin}/api/v1/authn`,
      followRedirect: false,
      body: {
        username,
        password,
      },
    })
    .its('body.sessionToken')
    .as('sessionToken')
    .then(function () {
      cy.request({
        url: authorization_endpoint,
        qs: {
          ...qs,
          sessionToken: this.sessionToken,
        },
        followRedirect: true,
      }).then(() => {
        cy.visit('/');
      });
    });
};

const oauthLogin = (username: string, password: string) => {
  getOauth2Data().then(oauth2Data => {
    const {
      info: { clientId },
      configuration: { authorization_endpoint, token_endpoint },
    } = oauth2Data;
    const url = new URL(authorization_endpoint);
    let authorizeCode;
    if (url.origin.includes('okta')) {
      authorizeCode = oktaLogin(oauth2Data, username, password);
    } else if (url.origin.includes('auth0')) {
      authorizeCode = auth0Login(oauth2Data, username, password);
    } else {
      authorizeCode = keycloakLogin(oauth2Data, username, password);
    }
    authorizeCode.then(({ headers, redirects }) => {
      const { location } = headers;
      // redirects is returned by OAuth0
      const locationUrl = new URL((redirects) ? redirects.pop().split(' ').pop() : location as string);
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
  });
};

Cypress.Commands.addAll({
  oauthLogin,
});

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      oauthLogin(username: string, password: string): Cypress.Chainable;
    }
  }
}

// Convert this to a module instead of script (allows import/export)
export {};
