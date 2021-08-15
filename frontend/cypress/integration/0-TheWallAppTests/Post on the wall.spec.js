/* eslint-disable jest/valid-expect-in-promise */
/* eslint-disable no-undef */
import { login } from '../../actions/actionsbase';

describe('Tests for Post', function () {
  beforeEach(() => {
    cy.exec('cd .. && cd backend && npx sequelize-cli db:drop');
    cy.exec(
      'cd .. && cd backend && npx sequelize-cli db:create && npx sequelize-cli db:migrate $',
      );
      cy.exec('cd .. && cd backend && npx sequelize-cli db:seed:all $');
      login('johndoe@gmail.com', '123456');
  });
  

  it('Assert wall route is working', () => {
    cy.contains('Write a new Post');
    cy.visit('http://localhost:3001/');
    cy.contains('The Wall App');
    login('johndoe@gmail.com', '123456');

    cy.contains('First Post');
    cy.contains('The 2nd one');
    cy.contains('Edit this post').should('have.length', 1);
    cy.contains('Delete this post').should('have.length', 1);
  });

  it('Assert write a post route is working', () => {
    cy.contains('Write a new Post');
    cy.get('[data-testid=btn-writePost]').click();
    cy.contains('write and publish');
  });

  it('Assert Write a Post Input Data', () => {
    cy.get('[data-testid=btn-writePost]').click();
    cy.contains('write and publish');
    cy.get('[data-testid=input-title]')
      .type('title to test publish')
      .should('have.value', 'title to test publish');
    cy.get('[data-testid=input-content]')
      .type('Write content to test publish a new post')
      .should('have.value', 'Write content to test publish a new post');
    cy.get('[data-testid=btn-publish]')
      .should('be.visible')
      .should('not.be.disabled');
    cy.get('[data-testid=btn-back]')
      .should('be.visible')
      .should('not.be.disabled');
  });

  it('Should publish successfully', () => {
    cy.intercept('**/post', (req) => {
      req.reply((res) => {
        // eslint-disable-next-line jest/valid-expect
        expect(res.statusCode).to.be.oneOf([200, 201, 304]);
      });
    }).as('post');
    cy.get('[data-testid=btn-writePost]').click();
    cy.contains('write and publish');
    cy.get('[data-testid=input-title]').type('title to test publish');
    cy.get('[data-testid=input-content]').type(
      'Write content to test publish a new post',
    );
    cy.get('[data-testid=btn-publish]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.wait('@post').then((req) => {
      cy.contains('successfully');
      // eslint-disable-next-line no-unused-expressions
      cy.expect(window.localStorage.getItem('WallAppToken')).not.to.be.null;
    });
    cy.get('[data-testid=btn-back]').click();
    cy.contains('title to test publish');

  });

  it('Assert edit a post', () => {
    cy.intercept('**/post/*', (req) => {
      req.reply((res) => {
        // eslint-disable-next-line jest/valid-expect
        expect(res.statusCode).to.be.oneOf([200, 201, 304]);
      });
    }).as('post');
    cy.get('[data-testid=btn-edit-0]').click();
    cy.contains('edit');
    cy.get('[data-testid=input-title]').type('title to test publish');
    cy.get('[data-testid=input-content]').type(
      'Write content to test publish a new post',
    );
    cy.get('[data-testid=btn-publish]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.wait('@post').then((req) => {
      cy.contains('successfully');
      // eslint-disable-next-line no-unused-expressions
      cy.expect(window.localStorage.getItem('WallAppToken')).not.to.be.null;
    });
    cy.get('[data-testid=btn-back]').click();
    cy.contains('First Posttitle to test publish');
    
  });


  it('Should not be possible to edit a post with the wrong user', () => {
    login('user3@gmail.com','123456')
    cy.contains('First Post');
    cy.contains('The 2nd one');
    cy.get('[data-testid=btn-edit]').should('not.exist')
  });

  it('Should be possible to delete a post', () => {
    cy.contains('First Post');
    cy.contains('The 2nd one');
    cy.get('[data-testid=btn-delete-0]').click();
    cy.contains('First Post').should('not.exist');
  });

  it('Should not be possible to delete a post with the wrong user', () => {
    cy.contains('The 2nd one');
    login('user3@gmail.com','123456')
    cy.get('[data-testid=btn-delete-0]').should('not.exist')
  });
});
