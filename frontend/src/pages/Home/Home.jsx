import React from 'react';
import Login from '../../components/login/Login'
import { deleteFromLocalStorage } from '../../services/localStorage';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


const Home = () => {
  const history = useHistory();

  const handleClickVisitor = () => {
    deleteFromLocalStorage("WallAppToken")
    history.push('/wall')
  }

  return (
    <Container fluid className="bg-dark text-white vh-100 ">
      <div class="row text-center chalk-font py-5">
        <h1 >The Wall App</h1>
      </div>
      <Login />
      <Col className="p-3" >
        <Row className="justify-content-md-center">
          <Button
            className="mt-3 col-md-3 bg-white "
            variant="Light"
            onClick={() => history.push('/register')}
          >
            {' '}
            Register
          </Button>
        </Row>
        <Row className="justify-content-md-center">
          <Button
            className="mt-3 col-md-3 light bg-white "
            variant="Light"
            data-testid="no-account-btn"
            onClick={handleClickVisitor}
          >
            {' '}
            Enter as a visitor
          </Button>
        </Row>
      </Col>
    </Container>
  )
}

export default Home;
