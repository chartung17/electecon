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

  componentDidMount() {
    var vars = [];
    vars.push(<option value='RepDemDiff' selected>% Republican votes - % Democrat votes</option>);
    vars.push(<option value='Democrat'>% votes for Democrat</option>);
    vars.push(<option value='Republican'>% votes for Republican</option>);
    vars.push(<option value='Other'>% votes for Other</option>);
    // fetch(ENDPOINT.concat(`/parties`),
    // {
    //   method: 'GET'
    // }).then(res => {
    //   return res.json();
    // }, err => {
    //   console.log(err);
    // }).then(row => {
    //   if (!row) return;
    //   let parties = row.map((rowObj, i) => rowObj.PARTY);
    //   let i;
    //   for (i = 0; i < parties.length; i++) {
    //     if (parties[i] === null) {
    //       vars.push(<option value={'partyNULL'}>% votes for Other</option>);
    //     } else {
    //       vars.push(<option value={'party' + parties[i]}>% votes for {parties[i]}</option>);
    //     }
    //   }
    //   this.setState({
    //     vars: vars
    //   })
    // }, err => {
    //   console.log(err);
    // });


    this.setState({
      vars: vars
    });
  }

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
