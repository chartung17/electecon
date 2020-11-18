import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.css';
import Navbar from './Navbar';
import County from './County/County';
import Map from './Map/Map';
import Graph from './Graph';
import Trends from './Trends/Trends';

let ENDPOINT = "http://localhost:5000/api/v1";
if (process.env.NODE_ENV === "production"){
    ENDPOINT = `https://election-app-server.herokuapp.com/api/v1`;
}

export const MAP_ENDPOINT = ENDPOINT + '/map';
export const GRAPH_ENDPOINT = ENDPOINT + '/graph';
export const TRENDS_ENDPOINT = ENDPOINT + '/trends';
export const COUNTY_ENDPOINT = ENDPOINT + '/county';

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
