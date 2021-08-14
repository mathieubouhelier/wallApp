/* eslint-disable no-undef */
import {
  login
} from '../../actions/actionsbase';

describe('Tests for Login as visitor', function () {
  beforeEach(() => {
    cy.visit('http://localhost:3001/');
  });

  it('Assert Input Data', () => {
    cy.contains('The Wall');
    cy.get('[data-testid=btn-visitor]').should('be.visible').should('not.be.disabled');;
  });

  it('Should login as a visitor successfully', () => {
    cy.intercept('**/post', (req) => {
      req.reply((res) => {
        // eslint-disable-next-line jest/valid-expect
        expect(res.statusCode).to.be.oneOf([200, 304]);
      });
    }).as('getAllPosts');
    login();
    cy.contains('The Wall');
    cy.get('[data-testid=btn-visitor]').click();
    return cy.wait('@getAllPosts').then((req) => {
      cy.get('body').should('not.contain', 'Write a new Post');
      cy.get('[data-testid=btn-writePost]').should('not.exist');
      // eslint-disable-next-line no-unused-expressions
      cy.expect(window.localStorage.getItem('WallAppToken')).to.be.null;
    });
  });
});
