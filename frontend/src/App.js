import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Wall from './pages/Wall/Wall';
import {checkUserAuthorization} from './services/auth';
import Register from './pages/Register/Register';
import PublishPost from './pages/PublishPost/PublishPost';
import RegisteredSuccessfully from './pages/RegisteredSuccessfully/RegisteredSuccessfully';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/wall" component={Wall} />
        <Route
          exact
          path="/publish"
          render={() =>
            checkUserAuthorization().authorized ? <PublishPost /> : <Redirect to="/" />
          }
        />
        <Route
          exact
          path="/registeredsuccessfully"
          component={RegisteredSuccessfully}
        />
        {/* <Route exact path="/login" component={Login} />
        <Route path="/" component={NotFound} /> */}
      </Switch>
    </Router>
  );
}

export default App;
