/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import { apiHost } from './config';
import { environment } from '../../src/environments/environment';

const {
  oidcConfig: { redirect_url: redirect_uri, scopes: scope, audience, client_id },
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

Cypress.Commands.addAll({
  getOauth2Data,
  keycloakLogin
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
