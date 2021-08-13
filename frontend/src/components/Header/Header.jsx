import React from 'react';
import { useHistory } from 'react-router-dom';
import { deleteFromLocalStorage } from '../../services/localStorage';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const Header = () => {

  function handleClickLogout(event) {
    event.preventDefault();
    deleteFromLocalStorage("WallAppToken");
    history.push(`/`)
  }
  const history = useHistory();

  return (
    <Container fluid className="bg-dark text-white mp-3">

      <Button className="mt-3 col-md-1 bg-white m-2"
        variant="Light" onClick={handleClickLogout}
      >Logout
      </Button>
      <Button className="mt-3 col-md-1 bg-white m-2"
            data-testid="btn-home"
            variant="Light" onClick={() => history.push(`/`)}
      >home
      </Button>
    </Container>
  )
}
export default Header;

