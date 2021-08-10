import React from 'react';
import { useHistory } from 'react-router-dom';


const Successfully = (props) => {
  const message = props.location.state ? props.location.state.message : ""
  const history = useHistory();
  function handleClick(event) {
    history.push('/wall')
  }

  return (
    <div className="container">
      <div className="simple-login-container">
        <div className="col text-center">
          <h2>{message}</h2>
          <div >
            <button
              className="btn btn-block btn-login my-3 col-md-12 "
              type="button"
              onClick={handleClick}
            >
              Wall
            </button>
          </div>
          <h3>Click to the button to access to the Wall</h3>
        </div>
      </div>
    </div>
  )
}

export default Successfully;