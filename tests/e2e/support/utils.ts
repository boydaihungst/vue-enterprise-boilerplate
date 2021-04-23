import { cy } from 'local-cypress';
import { RootStore } from './../../../src/state/store';

// Returns the Vuex store.
export const getStore = (): Cypress.Chainable<RootStore> =>
  cy.window().its('__app__').its('$store');
