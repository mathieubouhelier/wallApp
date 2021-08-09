import React from 'react';
import Login from '../../components/login/Login'
import { deleteFromLocalStorage } from '../../services/localStorage';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();

  const handleClickVisitor = () => {
    deleteFromLocalStorage("WallAppToken")
    history.push('/wall')
  }

  return (
    <>
      <h1> Welcome Home page</h1>
      <Login />
      <div className="container">
          <div className="simple-login-container">
      <div>
        <button
          className="btn btn-block btn-register mt-5 col-md-12"
          type="button"
          data-testid="no-account-btn"
          onClick={() => history.push('/register')}
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
          onClick={() => history.push('/wall')}
          onClick={handleClickVisitor}
        >
          {' '}
          Enter as a visitor
        </button>
      </div>
      </div>
      </div>
    </>
  )
}

export default Home;
