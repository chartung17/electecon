import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.css';
import Navbar from './Navbar';
import County from './County/County';
import Map from './Map/Map';
import Graph from './Graph';
import Trends from './Trends';

function App() {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Navbar />
        <div id="main">
          <Switch>
            <Route path="/map" exact component={() => <Map />} />
            <Route path="/graph" exact component={() => <Graph />} />
            <Route path="/trends" exact component={() => <Trends />} />
            <Route path="/county/:fips" component={(props) => <County {...props}/>} />
            <Route path="/county/" component={(props) => <County {...props}/>} />
            <Route render={() => <Redirect to="/map" />} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
