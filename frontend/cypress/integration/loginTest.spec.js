/* eslint-disable no-undef */
describe('Tests for Login', function () {
  it('I should login successfully', () => {
    // eslint-disable-next-line no-undef
    cy.visit('http://localhost:3001/');

    cy.get(':nth-child(1) > .form-control').type('test@test.com');

    cy.get(':nth-child(2) > .form-control').type('test');

    cy.get('.btn').click();

    cy.url().should('contain', 'http://localhost:4100/');
    cy.get(':nth-child(4) > .nav-link').should('have.attr', 'href', '/@test');
    cy.get(':nth-child(3) > .nav-link').should(
      'have.attr',
      'href',
      '/settings',
    );
    cy.get('.container > .nav > :nth-child(2) > .nav-link').should(
      'have.attr',
      'href',
      '/editor',
    );
  });
});
