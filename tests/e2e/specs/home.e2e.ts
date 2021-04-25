import { cy, describe, it } from 'local-cypress';
import appConfig from '@src/app.config.json';

describe('Home Page', () => {
  it('has the correct title and heading', () => {
    cy.visit('/');
    cy.title().should('equal', `Home - ${appConfig.description}`);
    cy.contains('h1', 'Home Page');
  });
});
