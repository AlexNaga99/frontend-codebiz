import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import AppLayout from './components/layout';
import './App.css';
import Home from './pages/home';
import NotFound from './pages/not-found';

const App = () => {
  return (
    <Router>   
      <Switch>
          <AppLayout exact path="/" component={Home}/>
          <AppLayout component={NotFound}/>
      </Switch>
    </Router>
  );
}

export default App;
