/* eslint-disable no-undef */
export function login() {
  cy.intercept('**/post', (req) => {
    req.reply((res) => {
      // eslint-disable-next-line jest/valid-expect
      expect(res.statusCode).to.be.oneOf([200, 304]);
    });
  }).as('getAllPosts');
  cy.get('[data-testid=input-email]')
      .type('johndoe@gmail.com')
     
    cy.get('[data-testid=input-password]')
      .type('123456')
      
    cy.get('[data-testid=btn-login]').click();
    cy.wait('@getAllPosts').then((req) => {
      cy.contains('Write a new Post');
      // eslint-disable-next-line no-unused-expressions
      cy.expect(window.localStorage.getItem('WallAppToken')).not.to.be.null;
    });
    cy.get('[data-testid=btn-home]').click();
}
