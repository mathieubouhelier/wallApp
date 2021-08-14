/* eslint-disable no-undef */
import { login } from '../../actions/actionsbase';

describe('Logout', function () {
  beforeEach(() => {
    cy.visit('http://localhost:3001/');
  });

  it('Should logOut successfully', () => {
    login("johndoe@gmail.com","123456");
    cy.contains('Write');
    cy.get('[data-testid=btn-logout]').click();
    // eslint-disable-next-line no-unused-expressions
    cy.expect(window.localStorage.getItem('WallAppToken')).to.be.null;
    
  });
});
