import React from 'react';
import {GRAPH_ENDPOINT as ENDPOINT} from '../App'; // CHANGE to GRAPH_ENDPOINT

export default class IndustryDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vars: [],
      selectedVar: 'PrivateIndustries'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // add variables to dropdown
  componentDidMount() {
    var vars = [];
    vars.push(<option value='PrivateIndustries' selected>Private industries</option>);
    vars.push(<option value='Agriculture' selected>Agriculture, forestry, fishing and hunting</option>);
    vars.push(<option value='Mining'>Mining, quarrying, and oil and gas extraction</option>);
    vars.push(<option value='utilities'>Utilities</option>);
    vars.push(<option value='Construction'>Construction</option>);
    vars.push(<option value='Manufacturing'>Manufacturing</option>);
    vars.push(<option value='DurableGoods'>Durable goods manufacturing</option>);
    vars.push(<option value='NondurableGoods'>Nondurable goods manufacturing</option>);
    vars.push(<option value='WholesaleTrade'>Wholesale trade</option>);
    vars.push(<option value='RetailTrade'>Retail trade</option>);
    vars.push(<option value='Transportation&Warehousing'>Transportation and warehousing</option>);
    vars.push(<option value='information'>Information</option>);
    vars.push(<option value='FinanceCategory'>Finance, insurance, real estate, rental, and leasing</option>);
    vars.push(<option value='Finance&Insurance'>Finance and insurance</option>);
    vars.push(<option value='RealEstate'>Real estate and rental and leasing</option>);
    vars.push(<option value='Professional&BusinessServices'>Professional and business services</option>);
    vars.push(<option value='Prof/scientific/tech'>Professional, scientific, and technical services</option>);
    vars.push(<option value='Management'>Management of companies and enterprises</option>);
    vars.push(<option value='Admin'>Administrative and support and waste management and remediation services</option>);
    vars.push(<option value='Educational/Healthcare/social'>Educational services, health care, and social assistance</option>);
    vars.push(<option value='Educational'>Educational services</option>);
    vars.push(<option value='Healthcare'>Health care and social assistance</option>);
    vars.push(<option value='ArtsCategory'>Arts, entertainment, recreation, accommodation, and food services</option>);
    vars.push(<option value='Arts/entertainment/rec'>Arts, entertainment, and recreation</option>);
    vars.push(<option value='Accommodation/Food'>Accommodation and food services</option>);
    vars.push(<option value='OtherServices'>Other services (except government and government enterprises)</option>);
    vars.push(<option value='Government'>Government and government enterprises</option>);
    vars.push(<option value='NaturalResources'>Natural resources and mining</option>);
    vars.push(<option value='Trade'>Trade</option>);
    vars.push(<option value='Transportation&Utilities'>Transportation and utilities</option>);
    vars.push(<option value='Manufacturing&Information'>Manufacturing and information</option>);
    vars.push(<option value='PrivateGoods'>Private goods-producing industries 2/</option>);
    vars.push(<option value='PrivateServices'>Private services-providing industries 3/</option>);

    this.setState({
        vars: vars
    })
  }

  // handle change in state
  handleChange(e) {
    this.setState({
      selectedVar: e.target.value
    });
    this.props.handleIndustryChange(e.target.value);
  }

  render() {
    return (
      <div className='dropdown'>
        <label for='vars'>Industry: </label>
        <select name='vars' value={this.state.selectedVar} onChange={this.handleChange}>
          {this.state.vars}
        </select>
      </div>
    );
  }
}