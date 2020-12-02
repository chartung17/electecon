import React from 'react';

export default class IndustryDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vars: [],
      selectedVar: '2'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // add variables to dropdown
  componentDidMount() {
    var vars = [];
    vars.push(<option value='2'>Private industries</option>);
    vars.push(<option value='3'>Agriculture, forestry, fishing and hunting</option>);
    vars.push(<option value='6'>Mining, quarrying, and oil and gas extraction</option>);
    vars.push(<option value='10'>Utilities</option>);
    vars.push(<option value='11'>Construction</option>);
    vars.push(<option value='12'>Manufacturing</option>);
    vars.push(<option value='13'>Durable goods manufacturing</option>);
    vars.push(<option value='25'>Nondurable goods manufacturing</option>);
    vars.push(<option value='34'>Wholesale trade</option>);
    vars.push(<option value='35'>Retail trade</option>);
    vars.push(<option value='36'>Transportation and warehousing</option>);
    vars.push(<option value='45'>Information</option>);
    vars.push(<option value='50'>Finance, insurance, real estate, rental, and leasing</option>);
    vars.push(<option value='51'>Finance and insurance</option>);
    vars.push(<option value='56'>Real estate and rental and leasing</option>);
    vars.push(<option value='59'>Professional and business services</option>);
    vars.push(<option value='60'>Professional, scientific, and technical services</option>);
    vars.push(<option value='64'>Management of companies and enterprises</option>);
    vars.push(<option value='65'>Administrative and support and waste management and remediation services</option>);
    vars.push(<option value='68'>Educational services, health care, and social assistance</option>);
    vars.push(<option value='69'>Educational services</option>);
    vars.push(<option value='70'>Health care and social assistance</option>);
    vars.push(<option value='75'>Arts, entertainment, recreation, accommodation, and food services</option>);
    vars.push(<option value='76'>Arts, entertainment, and recreation</option>);
    vars.push(<option value='79'>Accommodation and food services</option>);
    vars.push(<option value='82'>Other services (except government and government enterprises)</option>);
    vars.push(<option value='83'>Government and government enterprises</option>);
    vars.push(<option value='87'>Natural resources and mining</option>);
    vars.push(<option value='88'>Trade</option>);
    vars.push(<option value='89'>Transportation and utilities</option>);
    vars.push(<option value='90'>Manufacturing and information</option>);
    vars.push(<option value='91'>Private goods-producing industries 2/</option>);
    vars.push(<option value='92'>Private services-providing industries 3/</option>);

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
        <label htmlFor='vars'>Industry: </label>
        <select name='vars' value={this.state.selectedVar} onChange={this.handleChange}>
          {this.state.vars}
        </select>
      </div>
    );
  }
}