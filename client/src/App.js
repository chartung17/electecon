import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './App.css';
import Navbar from './Navbar';
import County from './County/County';
import Map from './Map/Map';
import Graph from './Graph';
import Trends from './Trends';

// set useLocalServer to true to use server running on localhost, or false to use Heroku server
const useLocalServer = true;

// define base URLs for server fetch requests
const API_HOST = process.env.REACT_APP_API_HOST || "localhost";
const API_PORT = process.env.REACT_APP_API_PORT || 5000;

let ENDPOINT;
if (useLocalServer) ENDPOINT = `http://${API_HOST}:${API_PORT}/api/v1`;
else ENDPOINT = `http://election-app-server.herokuapp.com/api/v1`;

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
