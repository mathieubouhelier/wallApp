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
import NotFound from './pages/NotFound/NotFound';
import { checkUserAuthorization } from './services/auth';
import Register from './pages/Register/Register';
import PublishPost from './pages/PublishPost/PublishPost';
import Successfully from './shared/components/Successfully';

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
          render={(props) =>
            checkUserAuthorization().authorized ? (
              <PublishPost dataWall={props} />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route exact path="/successfully" component={Successfully} />
        <Route path="/" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
