import React from 'react';

export default class YVariableDropdown extends React.Component {
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
    vars.push(<option value='RepDemDiff' key='1'>% Republican votes - % Democrat votes</option>);
    vars.push(<option value='Democrat' key='2'>% votes for Democrat</option>);
    vars.push(<option value='Republican' key='3'>% votes for Republican</option>);
    vars.push(<option value='Green' key='4'>% votes for Green</option>);
    vars.push(<option value='Other' key='5'>% votes for Other</option>);
    vars.push(<option value='TotalGDP' key='6'>Total GDP</option>);
    vars.push(<option value='GDPGrowthSince2001' key='7'>GDP Growth since 2001</option>);
    vars.push(<option value='GDPGrowthSinceLastElection' key='8'>GDP Growth since Last Election</option>);
    vars.push(<option value='IndustryGDP' key='9'>Industry GDP</option>);
    vars.push(<option value='GDPIndustryComp' key='10'>GDP Difference between Industry 1 and Industry 2</option>);

    this.setState({
        vars: vars
    })
  }

  // handle change in state
  handleChange(e) {
    this.setState({
      selectedVar: e.target.value
    });
    this.props.handleYVarChange(e.target.value);
  }

  render() {
    return (
      <div className='dropdown'>
        <label htmlFor='vars'>Y-Variable: </label>
        <select name='vars' value={this.state.selectedVar} onChange={this.handleChange}>
          {this.state.vars}
        </select>
      </div>
    );
  }
}
