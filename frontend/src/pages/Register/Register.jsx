import React, { useState, useEffect } from 'react';
import './Register.css';
import Container from 'react-bootstrap/Container';
import RegisterManager from './RegisterManager';
import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/Input'
import { deleteFromLocalStorage } from '../../services/localStorage';



const Register = () => {
  const history = useHistory();

  const [user, setUser] = useState({
    email: '',
    name:'',
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
      history.push('/wall')
    }
    console.log("response from SendRegisteredDataToManager", response.data.message);
    setErrorMessageRegister(response.data.message);
  }

  function handleClick(event) {
    event.preventDefault();

    if (user.password === user.passwordConfirmation) {
      SendRegisteredDataToManager()
    }
    setErrorMessageRegister("The two passwords are equals");
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

    <>
      <h1> Welcome to Register component</h1>

      <Container>
        <div className="simple-login-container">
          <h2>Sign up with email</h2>
          <h2>
            Enter your email address to create an account.
          </h2>
          {errorMessageRegister && <h2> {errorMessageRegister}</h2>}
          
          <Input
            inputType="name"
            inputValid={nameValid || user.name === ""}
            onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
          />
          <Input
            inputType="email"
            inputValid={emailValid || user.email === ""}
            onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
          />
         
          <Input 
            inputType="password"
            inputValid={(passwordValid || user.password === "")}
            onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
          />
         
          <Input
            inputType="passwordConfirmation"
            inputValid={(passwordConfirmationValid || user.passwordConfirmation === "")}
            onChange={(event) => setUser({ ...user, [event.target.name]: event.target.value })}
          />
          <div className="col text-center mt-5">
              <button
                className="btn btn-block btn-login my-3 col-md-12 "
                type="button"
                data-testid="sign-btn"
                disabled={!emailValid || !passwordValid}
                onClick={handleClick}
              >
                Sing in
              </button>
          </div>
        </div>
      </Container>
    </>
  )
}

export default Register;
