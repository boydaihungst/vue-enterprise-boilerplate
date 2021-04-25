import { cy, describe, it } from 'local-cypress';
import UsersMocked from '../../mock-api/resources/users';

describe('Authentication', () => {
  const { admin } = UsersMocked;
  it('login link exists on the home page when logged out', () => {
    cy.visit('/');
    cy.contains('a', 'Log in')
      .should('have.attr', 'href')
      .and('match', /^(\/.*)?\/login$/); // /en/login or /login
  });

  it('login form shows an error on failure', () => {
    cy.visit('/login');

    // Enter bad login info
    cy.get('input[name="username"]').type('badUsername');
    cy.get('input[name="password"]').type('badPassword');

    // Submit the login form
    cy.contains('button', 'Log in').click();

    // Ensure that an error displays
    cy.contains('error logging in');
  });

  it('successful login works redirects to the home page and logging out works', () => {
    cy.visit('/login');
    // Enter the user-supplied username and password
    cy.get('input[name="username"]').type(admin.username || '');
    cy.get('input[name="password"]').type(admin.password || '');

    // Submit the login form
    cy.contains('button', 'Log in').click();

    // Confirm redirection to the homepage
    cy.location('pathname').should('match', /^(\/.*)?(\/)?$/);

    // Confirm a logout link exists
    cy.contains('a', 'Log out');
  });

  it('login after attempting to visit authenticated route redirects to that route after login', () => {
    cy.visit('/profile?someQuery');

    // Confirm redirection to the login page
    cy.location('pathname').should('match', /^(\/.*)?\/login$/);

    // Enter the user-supplied username and password
    cy.get('input[name="username"]').type(admin.username || '');
    cy.get('input[name="password"]').type(admin.password || '');

    // Submit the login form
    cy.contains('button', 'Log in').click();

    // Confirm redirection to the homepage
    cy.location('pathname').should('match', /^(\/.*)?\/profile$/);
    cy.location('search').should('equal', '?someQuery');

    // Confirm a logout link exists
    cy.contains('a', 'Log out');
  });

  it('logout link logs the user out when logged in', () => {
    cy.logIn();

    // Click the logout link
    cy.contains('a', 'Log out').click();

    // Confirm that the user is logged out
    cy.contains('a', 'Log in');
  });

  it('logout from an authenticated route redirects to home', () => {
    cy.logIn();
    cy.visit('/profile');

    // Click the logout link
    cy.contains('a', 'Log out').click();

    // Confirm we're on the correct page
    cy.location('pathname').should('equal', '/');

    // Confirm that the user is logged out
    cy.contains('a', 'Log in');
  });
});
