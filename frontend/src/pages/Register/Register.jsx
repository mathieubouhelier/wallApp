import React, { useState, useEffect } from 'react';
import Input from '../../shared/components/Input'
import { Container, Button, Col, Row } from 'react-bootstrap/';
import RegisterManager from './RegisterManager';
import { useHistory } from 'react-router-dom';


const Register = () => {
  const history = useHistory();

  const [user, setUser] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirmation: '',
  });
  const [errorMessageRegister, setErrorMessageRegister] = useState("");

  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordConfirmationValid, setPasswordConfirmationValid] = useState(false);
  const [nameValid, setNameValid] = useState(false);

  async function SendRegisteredDataToManager() {
    const response = await RegisterManager.logTheUser(user);
    if (response.status === 201) {
      history.push({
        pathname: '/successfully',
        state: { message: "Registration completed successfully", }
      });
    }
    setErrorMessageRegister(response.data.message);
  }

  function handleClick(event) {
    event.preventDefault();

    if (user.password === user.passwordConfirmation) {
      return SendRegisteredDataToManager()
    }
    setErrorMessageRegister("The two passwords are not equals");
  }

  useEffect(() => {
    const regexEmail = /[A-Z0-9]{1,}@[A-Z0-9]{2,}\.[A-Z0-9]{2,}/i;

    const isEmailValid = regexEmail.test(user.email);
    setEmailValid(isEmailValid)
    setNameValid(user.name.length > 7)
    setPasswordValid(user.password.length > 5)
    setPasswordConfirmationValid(user.passwordConfirmation.length > 5)
    setErrorMessageRegister("");

  }, [user]);

  return (
    <Container fluid className="bg-dark text-white justify-content-center text-center vh-100">
      <Container className="pt-5">
        <h2>Sign up with email</h2>
        <h2  className="py-4">
          Enter your email address to create an account.
        </h2>
        {errorMessageRegister && <h2> {errorMessageRegister}</h2>}
        <Input
          inputType="name"
          dataTestid="input-name"
          inputValid={nameValid || user.name === ""}
          onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
        />
        <Input
          inputType="email"
          dataTestid="input-email"
          inputValid={emailValid || user.email === ""}
          onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
        />
        <Input
          inputType="password"
          dataTestid="input-password"
          inputValid={(passwordValid || user.password === "")}
          onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
        />
        <Input
          inputType="passwordConfirmation"
          dataTestid="input-passwordConfirmation"

          inputValid={(passwordConfirmationValid || user.passwordConfirmation === "")}
          onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
        />
        <div className="col text-center mt-5">
          <Button
            className="mt-2 col-md-3 light bg-white rounded-pill"
            variant="Light"
            data-testid="btn-signin"
            disabled={!emailValid || !passwordValid || !passwordConfirmationValid}
            onClick={handleClick}
          >
            Sign in
          </Button>
        </div>
      </Container>
    </Container>
  )
}

export default Register;
