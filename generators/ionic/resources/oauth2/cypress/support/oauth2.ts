/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
import { apiHost } from './config';

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
          configuration
        }));
    });

Cypress.Commands.addAll({
  getOauth2Data,
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
