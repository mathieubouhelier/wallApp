/* eslint-disable jest/valid-expect-in-promise */
/* eslint-disable no-undef */

describe('Tests for Register', function () {
  beforeEach(() => {
    cy.visit('http://localhost:3001/register');
  });

  before(() => {
    cy.exec('cd .. && cd backend && npx sequelize-cli db:drop');
    cy.exec(
      'cd .. && cd backend && npx sequelize-cli db:create && npx sequelize-cli db:migrate $',
    );
    cy.exec('cd .. && cd backend && npx sequelize-cli db:seed:all $');
  });

  it('Assert register route is working', () => {
    cy.visit('http://localhost:3001/');
    cy.contains('The Wall App');
    cy.get('[data-testid=btn-register]').click();
    cy.contains('Sign up with email');
    cy.get('[data-testid=btn-signin]').should('exist');
  });

  it('Assert Input Data', () => {
    cy.contains('Sign up with email');
    cy.get('[data-testid=input-name]')
      .type('testNameRegister')
      .should('have.value', 'testNameRegister');
    cy.get('[data-testid=input-email]')
      .type('testNameRegister@mail.com')
      .should('have.value', 'testNameRegister@mail.com');
    cy.get('[data-testid=input-password]')
      .type('123456')
      .should('have.value', '123456');
    cy.get('[data-testid=input-passwordConfirmation]')
      .type('123456')
      .should('have.value', '123456');
    cy.get('[data-testid=btn-signin]').should('be.visible').should('not.be.disabled');;
  });

  it('Should register successfully', () => {
    cy.intercept('**/register', (req) => {
      req.reply((res) => {
        // eslint-disable-next-line jest/valid-expect
        expect(res.statusCode).to.be.oneOf([201, 304]);
      });
    }).as('register');
    cy.intercept('**/post', (req) => {
      req.reply((res) => {
        // eslint-disable-next-line jest/valid-expect
        expect(res.statusCode).to.be.oneOf([200, 304]);
      });
    }).as('getAllPosts');
    cy.contains('Sign up');
    cy.get('[data-testid=input-name]').type('testNameRegister');
    cy.get('[data-testid=input-email]').type('testNameRegister@mail.com');
    cy.get('[data-testid=input-password]').type('123456');
    cy.get('[data-testid=input-passwordConfirmation]').type('123456');
    cy.get('[data-testid=btn-signin]').click();

    
    
    cy.wait('@register').then((req) => {
      cy.contains('successfully');
      // eslint-disable-next-line no-unused-expressions
      cy.expect(window.localStorage.getItem('WallAppToken')).not.to.be.null;
    });
    cy.get('[data-testid=btn-back]').click();
    
    cy.wait('@getAllPosts').then((req) => {
      cy.contains('Write a new Post');
      cy.get('[data-testid=btn-writePost]').should('exist');

      // eslint-disable-next-line no-unused-expressions
      cy.expect(window.localStorage.getItem('WallAppToken')).not.to.be.null;
    });
    
  });

  it('Should not register successfully with password and password confirmation different', () => {
    cy.contains('Sign up');
    cy.get('[data-testid=input-name]').type('testNameRegister');
    cy.get('[data-testid=input-email]').type('testNameRegister@mail.com');
    cy.get('[data-testid=input-password]').type('123456');
    cy.get('[data-testid=input-passwordConfirmation]').type('123457');
    cy.get('[data-testid=btn-signin]').click();
    cy.contains('The two passwords are not equals');
    cy.url().should('not.contain', 'successfully');
  });

  it('Should not register successfully with a incorrect email', () => {
    cy.contains('Sign up');
    cy.get('[data-testid=input-name]').type('testNameRegister');
    cy.get('[data-testid=input-email]').type('testNameRegister');
    cy.get('[data-testid=input-password]').type('123456');
    cy.get('[data-testid=input-passwordConfirmation]').type('123456');
    cy.get('[data-testid=btn-signin]').should('be.disabled');
    cy.contains('Please enter a valid email address.');
    cy.url().should('not.contain', 'successfully');
  });

  it('Should not register successfully with existing user', () => {
    cy.contains('Sign up');
    cy.get('[data-testid=input-name]').type('testNameRegister');
    cy.get('[data-testid=input-email]').type('testNameRegister@mail.com');
    cy.get('[data-testid=input-password]').type('123456');
    cy.get('[data-testid=input-passwordConfirmation]').type('123456');
    cy.get('[data-testid=btn-signin]').click();
    cy.contains('User already exist');
    cy.url().should('not.contain', 'successfully');
  });

});
