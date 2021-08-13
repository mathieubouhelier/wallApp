/* eslint-disable no-undef */

describe('Tests for Login', function () {
  beforeEach(() => {
    cy.visit('http://localhost:3001/');
  });

  it('Assert Input Data', () => {
    cy.contains('The Wall');
    cy.get('[data-testid=input-email]')
      .type('johndoe@gmail.com')
      .should('have.value', 'johndoe@gmail.com');
    cy.get('[data-testid=input-password]')
      .type('123456')
      .should('have.value', '123456');
    cy.get('[data-testid=btn-login').should('be.visible');
  });

  it('Should login successfully', () => {
    cy.contains('The Wall');
    cy.get('[data-testid=input-email]').type('johndoe@gmail.com');
    cy.get('[data-testid=input-password]').type('123456');
    cy.get('[data-testid=btn-login').click();
    cy.intercept('**/post', (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.be.oneOf([200, 304]);
      });
    }).as('getAllPosts');
    return cy.wait('@getAllPosts').then((req) => {
      console.log('req Agenda 2', req);
      cy.contains('Write a new Post');
      cy.expect(window.localStorage.getItem('WallAppToken')).not.to.be.null;
    });
  });

  it('Should not login successfully with a wrong password', () => {
    cy.contains('The Wall');
    cy.get('[data-testid=input-email]').type('johndoe@gmail.com');
    cy.get('[data-testid=input-password]').type('12345888');
    cy.get('[data-testid=btn-login').click();
    cy.contains('Invalid login and/or password');
    cy.url().should('not.contain', 'wall');
  });

  it('Should not login successfully with a wrong email', () => {
    cy.contains('The Wall');
    cy.get('[data-testid=input-email]').type('johndoe42@gmail.com');
    cy.get('[data-testid=input-password]').type('123456');
    cy.get('[data-testid=btn-login').click();
    cy.contains('Invalid login and/or password');
    cy.url().should('not.contain', 'wall');
  });
});
