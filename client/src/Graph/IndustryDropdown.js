import React from 'react';

export default class IndustryDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vars: [],
      selectedVar: '1'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // add variables to dropdown
  componentDidMount() {
    var vars = [];
    vars.push(<option key='1' value='1'>Private industries</option>);
    vars.push(<option key='2' value='2'>Agriculture, forestry, fishing and hunting</option>);
    vars.push(<option key='3' value='3'>Mining, quarrying, and oil and gas extraction</option>);
    vars.push(<option key='4' value='4'>Utilities</option>);
    vars.push(<option key='5' value='5'>Construction</option>);
    vars.push(<option key='6' value='6'>Manufacturing</option>);
    vars.push(<option key='7' value='7'>Durable goods manufacturing</option>);
    vars.push(<option key='8' value='8'>Nondurable goods manufacturing</option>);
    vars.push(<option key='9' value='9'>Wholesale trade</option>);
    vars.push(<option key='10' value='10'>Retail trade</option>);
    vars.push(<option key='11' value='11'>Transportation and warehousing</option>);
    vars.push(<option key='12' value='12'>Information</option>);
    vars.push(<option key='13' value='13'>Finance, insurance, real estate, rental, and leasing</option>);
    vars.push(<option key='14' value='14'>Finance and insurance</option>);
    vars.push(<option key='15' value='15'>Real estate and rental and leasing</option>);
    vars.push(<option key='16' value='16'>Professional and business services</option>);
    vars.push(<option key='17' value='17'>Professional, scientific, and technical services</option>);
    vars.push(<option key='18' value='18'>Management of companies and enterprises</option>);
    vars.push(<option key='19' value='19'>Administrative and support and waste management and remediation services</option>);
    vars.push(<option key='20' value='20'>Educational services, health care, and social assistance</option>);
    vars.push(<option key='21' value='21'>Educational services</option>);
    vars.push(<option key='22' value='22'>Health care and social assistance</option>);
    vars.push(<option key='23' value='23'>Arts, entertainment, recreation, accommodation, and food services</option>);
    vars.push(<option key='24' value='24'>Arts, entertainment, and recreation</option>);
    vars.push(<option key='25' value='25'>Accommodation and food services</option>);
    vars.push(<option key='26' value='26'>Other services (except government and government enterprises)</option>);
    vars.push(<option key='27' value='27'>Government and government enterprises</option>);
    vars.push(<option key='28' value='28'>Natural resources and mining</option>);
    vars.push(<option key='29' value='29'>Trade</option>);
    vars.push(<option key='30' value='30'>Transportation and utilities</option>);
    vars.push(<option key='31' value='31'>Manufacturing and information</option>);
    vars.push(<option key='32' value='32'>Private goods-producing industries 2/</option>);
    vars.push(<option key='33' value='33'>Private services-providing industries 3/</option>);

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
