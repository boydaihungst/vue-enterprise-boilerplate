/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
// Create custom Cypress commands and overwrite existing ones.
// https://on.cypress.io/custom-commands
import UsersMocked from '@tests/mock-api/resources/users';

Cypress.Commands.add(
  'logIn',
  ({
    username = UsersMocked.admin.username,
    password = UsersMocked.admin.password,
  } = {}) => {
    // Manually log the user in
    cy.location('pathname').then((pathname) => {
      if (pathname === 'blank') {
        cy.visit('/').then(() => {
          cy.window()
            .its('authStore')
            .then(async (authStore) => {
              console.log(authStore);
              await authStore.logIn({ username, password });
            });
        });
      }
      return;
    });
  },
);
