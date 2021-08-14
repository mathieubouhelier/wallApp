/* eslint-disable no-undef */

describe('Tests for Login', function () {
  beforeEach(() => {
    cy.visit('http://localhost:3001/');
  });

  before(() => {
    cy.exec('cd .. && cd backend && npx sequelize-cli db:drop');
    cy.exec('cd .. && cd backend && npx sequelize-cli db:create && npx sequelize-cli db:migrate $');
    cy.exec('cd .. && cd backend && npx sequelize-cli db:seed:all $');
  });

  it('Assert Input Data', () => {
    cy.contains('The Wall');
    cy.get('[data-testid=input-email]')
      .type('johndoe@gmail.com')
      .should('have.value', 'johndoe@gmail.com');
    cy.get('[data-testid=input-password]')
      .type('123456')
      .should('have.value', '123456');
    cy.get('[data-testid=btn-login]').should('be.visible');
  });

  it('Should login successfully', () => {
    cy.intercept('**/post', (req) => {
      req.reply((res) => {
        // eslint-disable-next-line jest/valid-expect
        expect(res.statusCode).to.be.oneOf([200, 304]);
      });
    }).as('getAllPosts');
    cy.contains('The Wall');
    cy.get('[data-testid=input-email]').type('johndoe@gmail.com');
    cy.get('[data-testid=input-password]').type('123456');
    cy.get('[data-testid=btn-login]').click();
    return cy.wait('@getAllPosts').then((req) => {
      cy.contains('Write a new Post');
      cy.get('[data-testid=btn-writePost]').should('exist');

      // eslint-disable-next-line no-unused-expressions
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
