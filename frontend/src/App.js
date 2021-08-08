import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import RegisteredSuccessfully from './pages/RegisteredSuccessfully/RegisteredSuccessfully'
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/registeredsuccessfully" component={RegisteredSuccessfully} />
        {/* <Route exact path="/login" component={Login} />
        <Route path="/" component={NotFound} /> */}
      </Switch>
    </Router>
  );
}

export default App;
