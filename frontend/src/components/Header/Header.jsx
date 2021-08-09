import React from 'react';
import { useHistory } from 'react-router-dom';
import { deleteFromLocalStorage } from '../../services/localStorage';

const Header = () => {

  function handleClickLogout(event) {
    event.preventDefault();
    deleteFromLocalStorage("WallAppToken");
    history.push(`/`)
  }
  const history = useHistory();


  return (
    <>
      <h1 className="font-link"> this is header</h1>
      <button
        onClick={handleClickLogout}
      >Logout</button>
      <button
        onClick={() => history.push(`/`)}
      >home</button>
    </>
  )
}
export default Header;

