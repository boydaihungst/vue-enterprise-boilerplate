describe('Home Page', () => {
  it('has the correct title and heading', () => {
    cy.visit('/');
    cy.title().should('equal', 'My App - Home');
    cy.contains('h3', 'Home Page');
  });
});
export {};
