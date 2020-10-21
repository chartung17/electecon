import React from 'react';
import {ENDPOINT} from './Map';

export default class VariableDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vars: [],
      selectedVar: 'RepDemDiff'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // add variables to dropdown
  componentDidMount() {
    var vars = [];
    vars.push(<option value='RepDemDiff' selected>% Republican votes - % Democrat votes</option>);
    vars.push(<option value='Democrat'>% votes for Democrat</option>);
    vars.push(<option value='Republican'>% votes for Republican</option>);
    vars.push(<option value='Other'>% votes for Other</option>);
    vars.push(<option value='TotalGDP'>Total GDP</option>);
    fetch(ENDPOINT.concat(`/industries`),
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(row => {
      if (!row) return;
      let industries = row.map((rowObj, i) => rowObj.NAME);
      let indIDs = row.map((rowObj, i) => rowObj.INDUSTRY_ID);
      let i;
      for (i = 0; i < industries.length; i++) {
        if (industries[i].includes('2/')) {
          industries[i] = industries[i].substring(0, industries[i].indexOf('2/'));
        } else if (industries[i].includes('3/')) {
          industries[i] = industries[i].substring(0, industries[i].indexOf('3/'));
        }
        vars.push(<option value={'Industry' + indIDs[i]}>% GDP from {industries[i]}</option>);
      }
      this.setState({
        vars: vars
      })
    }, err => {
      console.log(err);
    });
  }

  // handle change in state
  handleChange(e) {
    this.setState({
      selectedVar: e.target.value
    });
    this.props.handleVarChange(e.target.value);
  }

  render() {
    return (
      <div className='dropdown'>
        <label for='vars'>Variable: </label>
        <select name='vars' value={this.state.selectedVar} onChange={this.handleChange}>
          {this.state.vars}
        </select>
      </div>
    );
  }
}
