import React, { useState, useEffect } from 'react';
import './FormLogin.css';
import Container from 'react-bootstrap/Container';
import LoginManager from './LoginManager';
import { useHistory } from 'react-router-dom';
import Input from "../../shared/components/Input"
import { deleteFromLocalStorage } from '../../services/localStorage';



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
    if ( response.status === 201) {
      history.push('/wall')
    }
    setErrorMessageLogin(response.data.message);

}

const handleClickVisitor = () => {
  deleteFromLocalStorage("WallAppToken")
  history.push('/wall')
}

useEffect(() => {
  const regexEmail = /[A-Z0-9]{1,}@[A-Z0-9]{2,}\.[A-Z0-9]{2,}/i;

  const isEmailValid = regexEmail.test(user.email);
  setEmailValid(isEmailValid)
  setPasswordValid(user.password.length > 5)
  setErrorMessageLogin("");

}, [user]);

return (

  <>
    <h1> Welcome Login component</h1>

    <Container>

      <div className="container">
        <div className="simple-login-container">
          <h2>Login</h2>
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
          <div className="col text-center">
            <div >
              <button
                className="btn btn-block btn-login my-3 col-md-12 "
                type="button"
                data-testid="signin-btn"
                disabled={!emailValid || !passwordValid}
                onClick={handleClick}
              >
                Login
              </button>
            </div>

            <div>
              <button
                className="btn btn-block btn-register mt-5 col-md-12"
                type="button"
                data-testid="no-account-btn"
              // onClick={() => history.push('/register')}
              >
                {' '}
                Register
              </button>
            </div>
            <div>
              <button
                className="btn btn-block btn-register mt-3 col-md-12"
                type="button"
                data-testid="no-account-btn"
                // onClick={() => history.push('/register')}
                onClick={handleClickVisitor}

              >
                {' '}
                Enter as a visitor
              </button>
            </div>
          </div>
        </div>
      </div>

    </Container>

  </>
)
}

export default Login;
