import React from 'react';
import {GRAPH_ENDPOINT as ENDPOINT} from '../App'; // CHANGE to GRAPH_ENDPOINT

export default class XVariableDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vars: [],
      selectedVar: 'Democrat'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // add variables to dropdown
  componentDidMount() {
    var vars = [];
    vars.push(<option value='RepDemDiff' selected>% Republican votes - % Democrat votes</option>);
    vars.push(<option value='Democrat'>% votes for Democrat</option>);
    vars.push(<option value='Republican'>% votes for Republican</option>);
    vars.push(<option value='Green'>% votes for Green</option>);
    vars.push(<option value='Other'>% votes for Other</option>);
    vars.push(<option value='TotalGDP'>Total GDP</option>);
    vars.push(<option value='GDPGrowthSince2001'>GDP Growth since 2001</option>);
    vars.push(<option value='GDPGrowthSinceLastElection'>GDP Growth since Last Election</option>);
    vars.push(<option value='IndustryGDP'>Industry GDP</option>);
    vars.push(<option value='GDPIndustryComp'>GDP Difference between Industry 1 and Industry 2</option>);
    
    this.setState({
        vars: vars
    })
  }

  // handle change in state
  handleChange(e) {
    this.setState({
      selectedVar: e.target.value
    });
    this.props.handleXVarChange(e.target.value);
    // this.props.handleYVarChange(e.target.value);
    // this.props.handleVarChange(e.target.value);
  }

  render() {
    return (
      <div className='dropdown'>
        <label for='vars'>X-Variable: </label>
        <select name='vars' value={this.state.selectedVar} onChange={this.handleChange}>
          {this.state.vars}
        </select>
      </div>
    );
  }
}
