import React from 'react';
import './Map.css';
import Choropleth from './Choropleth';
import YearDropdown from './YearDropdown';
import VariableDropdown from './VariableDropdown';
require('dotenv').config()

const API_HOST = process.env.REACT_APP_API_HOST || "localhost";
const API_PORT = process.env.REACT_APP_API_PORT || 5000;

export const ENDPOINT = `http://${API_HOST}:${API_PORT}/api/v1/map`;

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    document.title = 'Map';
    this.state = {
      year: '2016',
      nextYear: '2016',
      queryURL: '/rep-dem-diff',
      nextVar: ''
    }
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleVarChange = this.handleVarChange.bind(this);
  }

  // handle state change in year dropdown
  handleYearChange(year) {
    this.setState({
      nextYear: year
    });
  }

  // handle state change in variable drowdown
  handleVarChange(newVar) {
    this.setState({
      nextVar: newVar
    });
  }

  // when submit button is clicked, update state in order to re-render map
  handleClick = () => {
    let queryURL = this.state.queryURL;
    if (this.state.nextVar === 'Democrat') {
      queryURL = '/dem-votes';
    } else if (this.state.nextVar === 'Republican') {
      queryURL = '/rep-votes';
    } else if (this.state.nextVar === 'Other') {
      queryURL = '/other-votes'
    } else if (this.state.nextVar === 'RepDemDiff') {
      queryURL = '/rep-dem-diff'
    }
    this.setState({
      year: this.state.nextYear,
      queryURL: queryURL
    });
  };


  render() {
    return (
      <div className='map'>
        <Choropleth year={this.state.year} queryURL={this.state.queryURL}/>
        <p>Select a year and variable, then click "Submit" to update the map.</p>
        <section className='selector'>
          <YearDropdown id='year-dropdown' handleYearChange={this.handleYearChange} />
          <VariableDropdown id='variable-dropdown' handleVarChange={this.handleVarChange} />
          <button id='submit' onClick={this.handleClick}>Submit</button>
        </section>
      </div>
    );
  }
}
