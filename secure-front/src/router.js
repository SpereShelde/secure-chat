import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import App from './components/App';

const BasicRoute = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route exact path="/chat" component={App}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/register" component={Register}/>
    </Switch>
  </BrowserRouter>
);

export default BasicRoute;
