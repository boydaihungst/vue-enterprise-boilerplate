// Create custom Cypress commands and overwrite existing ones.
// https://on.cypress.io/custom-commands
import { cy, Cypress } from 'local-cypress';
import UsersMocked from '../../mock-api/resources/users';
import { getStore } from './utils';

Cypress.Commands.add(
  'logIn',
  ({
    username = UsersMocked.admin.username,
    password = UsersMocked.admin.password,
  } = {}) => {
    // Manually log the user in
    cy.location('pathname').then((pathname) => {
      if (pathname === 'blank') {
        cy.visit('/');
      }
    });
    getStore().then((store) =>
      store.dispatch('auth/logIn', { username, password })
    );
  }
);
