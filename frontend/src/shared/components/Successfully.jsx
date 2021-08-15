import React from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import Header from '../../components/Header/Header'


const Successfully = (props) => {
  const message = props.location.state ? props.location.state.message : "";
  const history = useHistory();
  function handleClick() {
    history.push('/wall')
  }

  return (
    <Container fluid className="bg-dark text-white min-vh-100 text-center">
      <Header />
      <div class="row text-center chalk-font py-4">
        <h2>{message}</h2>
      </div>
      <Button className="mt-3 col-md-3 bg-white m-2 rounded-pill"
        variant="Light"
        data-testid="btn-back"
        onClick={handleClick}
      >Back to the Wall</Button>
    </Container>
  )
}

export default Successfully;
