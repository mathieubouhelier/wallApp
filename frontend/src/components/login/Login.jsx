import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import LoginManager from './LoginManager';
import { useHistory } from 'react-router-dom';
import Input from "../../shared/components/Input"
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


const Login = () => {
  const history = useHistory();

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [errorMessageLogin, setErrorMessageLogin] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  async function handleClick(event) {
    event.preventDefault();
    const response = await LoginManager.logTheUser(user);
    if (response.status === 201) {
      history.push('/wall')
    }
    setErrorMessageLogin(response.data.message);
  }

  useEffect(() => {
    const regexEmail = /[A-Z0-9]{1,}@[A-Z0-9]{2,}\.[A-Z0-9]{2,}/i;
    const isEmailValid = regexEmail.test(user.email);
    setEmailValid(isEmailValid)
    setPasswordValid(user.password.length > 5)
    setErrorMessageLogin("");
  }, [user]);

  return (
    <Container fluid className="bg-dark text-white justify-content-center text-center">
      {errorMessageLogin && <h2> {errorMessageLogin}</h2>}
      <Input
        inputType="email"
        inputValid={emailValid || user.email === ""}
        onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
      />
      <Input
        inputType="password"
        inputValid={passwordValid || user.password === ""}
        onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
      />
      <Col className="p-3" >
        <Row className="justify-content-md-center">
          <Button
            className=" my-3 col-md-3 rounded-pill"
            onClick={handleClick} variant="outline-light"
            disabled={!emailValid || !passwordValid}
            >
            Login
          </Button>{' '}
        </Row>
      </Col>
    </Container>
  )
}

export default Login;
