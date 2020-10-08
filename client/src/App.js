import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.css';
import Navbar from './Navbar';
import County from './County';
import Map from './Map';
import Graph from './Graph';
import Trends from './Trends';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div id="main">
          <Switch>
            <Route path="/" exact component={() => <Map />} />
            <Route path="/graph" exact component={() => <Graph />} />
            <Route path="/trends" exact component={() => <Trends />} />
            <Route path="/county" component={() => <County />} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
