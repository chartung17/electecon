import React from 'react';
import YearDropdown from './YearDropdown';
import IndustryDropdown from './IndustryDropdown';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js/lib/core';

import {GRAPH_ENDPOINT as ENDPOINT} from '../App';

Plotly.register([
  require('plotly.js/lib/bar')
]);
const Plot = createPlotlyComponent(Plotly);

export default class Graph extends React.Component {
	constructor(props) {
		super(props);

		document.title = 'Graph';

		this.state = {
			year1: '2016',
			year2: '2016',
			year3: '2016',
			yQueryURL: '/bar-industry-gdp?year1=2016&year2=2016&year3=2016&industry1=1&industry2=1&industry3=1',
			industry1: '1',
			industry2: '1',
			industry3: '1',
			industry1String: 'Private industries, 2016',
			industry2String: 'Private industries, 2016',
			industry3String: 'Private industries, 2016',
			xResult: ['Industry 1', 'Industry 2', 'Industry 3'],// ['Private industries, 2016','Private industries, 2016','Private industries, 2016'],
			yResult: [],
			errorMsg1: '',
			errorMsg2: '',
			errorMsg3: ''
		};

		this.handleYear1Change = this.handleYear1Change.bind(this);
		this.handleYear2Change = this.handleYear2Change.bind(this);
		this.handleYear3Change = this.handleYear3Change.bind(this);
		this.handleIndustry1Change = this.handleIndustry1Change.bind(this);
		this.handleIndustry2Change = this.handleIndustry2Change.bind(this);
		this.handleIndustry3Change = this.handleIndustry3Change.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	// handle state change in year dropdown
	handleYear1Change(newYear) {
    	this.setState({
      		year1: newYear
    	});
  	}

  	// handle state change in year dropdown
	handleYear2Change(newYear) {
    	this.setState({
      		year2: newYear
    	});
  	}

  	// handle state change in year dropdown
	handleYear3Change(newYear) {
    	this.setState({
      		year3: newYear
    	});
  	}

	// handle state change in variable drowdown
	handleIndustry1Change(newIndustry) {
		this.setState({
			industry1: newIndustry
	    });
	}

	// handle state change in variable drowdown
	handleIndustry2Change(newIndustry) {
		this.setState({
			industry2: newIndustry
	    });
	}

	// handle state change in variable drowdown
	handleIndustry3Change(newIndustry) {
		this.setState({
			industry3: newIndustry
	    });
	}

	handleClick = () => {
		// let industry1String = this.state.industry1String;

		// if (this.state.industry1 === '1') {
		// 	industry1String = 'Private industries, ' + this.state.year1;
		// } else if (this.state.industry1 === '2') {
		// 	industry1String = 'Agriculture, forestry, fishing and hunting, ' + this.state.year1;
		// } else if (this.state.industry1 === '3') {
		// 	industry1String = 'Mining, quarrying, and oil and gas extraction, ' + this.state.year1;
		// } else if (this.state.industry1 === '4') {
		// 	industry1String = 'Utilities, ' + this.state.year1;
		// } else if (this.state.industry1 === '5') {
		// 	industry1String = 'Construction, ' + this.state.year1;
		// } else if (this.state.industry1 === '6') {
		// 	industry1String = 'Manufacturing, ' + this.state.year1;
		// } else if (this.state.industry1 === '7') {
		// 	industry1String = 'Durable goods manufacturing, ' + this.state.year1;
		// } else if (this.state.industry1 === '8') {
		// 	industry1String = 'Nondurable goods manufacturing, ' + this.state.year1;
		// } else if (this.state.industry1 === '9') {
		// 	industry1String = 'Wholesale trade, ' + this.state.year1;
		// } else if (this.state.industry1 === '10') {
		// 	industry1String = 'Retail trade, ' + this.state.year1;
		// } else if (this.state.industry1 === '11') {
		// 	industry1String = 'Transportation, ' + this.state.year1;
		// } else if (this.state.industry1 === '12') {
		// 	industry1String = 'Information, ' + this.state.year1;
		// } else if (this.state.industry1 === '13') {
		// 	industry1String = 'Finance, insurance, real estate, rental, and leasing, ' + this.state.year1;
		// } else if (this.state.industry1 === '14') {
		// 	industry1String = 'Finance and insurance, ' + this.state.year1;
		// } else if (this.state.industry1 === '15') {
		// 	industry1String = 'Real estate and rental and leasing, ' + this.state.year1;
		// } else if (this.state.industry1 === '16') {
		// 	industry1String = 'Professional and business services, ' + this.state.year1;
		// } else if (this.state.industry1 === '17') {
		// 	industry1String = 'Professional, scientific, and technical services, ' + this.state.year1;
		// } else if (this.state.industry1 === '18') {
		// 	industry1String = 'Management of companies and enterprises, ' + this.state.year1;
		// } else if (this.state.industry1 === '19') {
		// 	industry1String = 'Administrative and support and waste management and remediation services, ' + this.state.year1;
		// } else if (this.state.industry1 === '20') {
		// 	industry1String = 'Educational services, health care, and social assistance, ' + this.state.year1;
		// } else if (this.state.industry1 === '21') {
		// 	industry1String = 'Educational services, ' + this.state.year1;
		// } else if (this.state.industry1 === '22') {
		// 	industry1String = 'Health care and social assistance, ' + this.state.year1;
		// } else if (this.state.industry1 === '23') {
		// 	industry1String = 'Arts, entertainment, recreation, accommodation, and food services, ' + this.state.year1;
		// } else if (this.state.industry1 === '24') {
		// 	industry1String = 'Arts, entertainment, and recreation, ' + this.state.year1;
		// } else if (this.state.industry1 === '25') {
		// 	industry1String = 'Accommodation and food services, ' + this.state.year1;
		// } else if (this.state.industry1 === '26') {
		// 	industry1String = 'Other services (except government and government enterprises), ' + this.state.year1;
		// } else if (this.state.industry1 === '27') {
		// 	industry1String = 'Government and government enterprises, ' + this.state.year1;
		// } else if (this.state.industry1 === '28') {
		// 	industry1String = 'Natural resources and mining, ' + this.state.year1;
		// } else if (this.state.industry1 === '29') {
		// 	industry1String = 'Trade, ' + this.state.year1;
		// } else if (this.state.industry1 === '30') {
		// 	industry1String = 'Transportation and utilities, ' + this.state.year1;
		// } else if (this.state.industry1 === '31') {
		// 	industry1String = 'Manufacturing and information, ' + this.state.year1;
		// } else if (this.state.industry1 === '32') {
		// 	industry1String = 'Private goods-producing industries 2, ' + this.state.year1;
		// } else if (this.state.industry1 === '33') {
		// 	industry1String = 'Private services-providing industries 3, ' + this.state.year1;
		// } 

		// let industry2String = this.industry2String;

		// if (this.state.industry2 === '1') {
		// 	industry1String = 'Private industries, ' + this.state.year2;
		// } else if (this.state.industry2 === '2') {
		// 	industry2String = 'Agriculture, forestry, fishing and hunting, ' + this.state.year2;
		// } else if (this.state.industry2 === '3') {
		// 	industry2String = 'Mining, quarrying, and oil and gas extraction, ' + this.state.year2;
		// } else if (this.state.industry2 === '4') {
		// 	industry2String = 'Utilities, ' + this.state.year2;
		// } else if (this.state.industry2 === '5') {
		// 	industry2String = 'Construction, ' + this.state.year2;
		// } else if (this.state.industry2 === '6') {
		// 	industry2String = 'Manufacturing, ' + this.state.year2;
		// } else if (this.state.industry2 === '7') {
		// 	industry2String = 'Durable goods manufacturing, ' + this.state.year2;
		// } else if (this.state.industry2 === '8') {
		// 	industry2String = 'Nondurable goods manufacturing, ' + this.state.year2;
		// } else if (this.state.industry2 === '9') {
		// 	industry2String = 'Wholesale trade, ' + this.state.year2;
		// } else if (this.state.industry2 === '10') {
		// 	industry2String = 'Retail trade, ' + this.state.year2;
		// } else if (this.state.industry2 === '11') {
		// 	industry2String = 'Transportation, ' + this.state.year2;
		// } else if (this.state.industry2 === '12') {
		// 	industry2String = 'Information, ' + this.state.year2;
		// } else if (this.state.industry2 === '13') {
		// 	industry2String = 'Finance, insurance, real estate, rental, and leasing, ' + this.state.year2;
		// } else if (this.state.industry2 === '14') {
		// 	industry2String = 'Finance and insurance, ' + this.state.year2;
		// } else if (this.state.industry2 === '15') {
		// 	industry2String = 'Real estate and rental and leasing, ' + this.state.year2;
		// } else if (this.state.industry2 === '16') {
		// 	industry2String = 'Professional and business services, ' + this.state.year2;
		// } else if (this.state.industry2 === '17') {
		// 	industry2String = 'Professional, scientific, and technical services, ' + this.state.year2;
		// } else if (this.state.industry2 === '18') {
		// 	industry2String = 'Management of companies and enterprises, ' + this.state.year2;
		// } else if (this.state.industry2 === '19') {
		// 	industry2String = 'Administrative and support and waste management and remediation services, ' + this.state.year2;
		// } else if (this.state.industry2 === '20') {
		// 	industry2String = 'Educational services, health care, and social assistance, ' + this.state.year2;
		// } else if (this.state.industry2 === '21') {
		// 	industry2String = 'Educational services, ' + this.state.year2;
		// } else if (this.state.industry2 === '22') {
		// 	industry2String = 'Health care and social assistance, ' + this.state.year2;
		// } else if (this.state.industry2 === '23') {
		// 	industry2String = 'Arts, entertainment, recreation, accommodation, and food services, ' + this.state.year2;
		// } else if (this.state.industry2 === '24') {
		// 	industry2String = 'Arts, entertainment, and recreation, ' + this.state.year2;
		// } else if (this.state.industry2 === '25') {
		// 	industry2String = 'Accommodation and food services, ' + this.state.year2;
		// } else if (this.state.industry2 === '26') {
		// 	industry2String = 'Other services (except government and government enterprises), ' + this.state.year2;
		// } else if (this.state.industry2 === '27') {
		// 	industry2String = 'Government and government enterprises, ' + this.state.year2;
		// } else if (this.state.industry2 === '28') {
		// 	industry2String = 'Natural resources and mining, ' + this.state.year2;
		// } else if (this.state.industry2 === '29') {
		// 	industry2String = 'Trade, ' + this.state.year2;
		// } else if (this.state.industry2 === '30') {
		// 	industry2String = 'Transportation and utilities, ' + this.state.year2;
		// } else if (this.state.industry2 === '31') {
		// 	industry2String = 'Manufacturing and information, ' + this.state.year2;
		// } else if (this.state.industry2 === '32') {
		// 	industry2String = 'Private goods-producing industries 2, ' + this.state.year2;
		// } else if (this.state.industry2 === '33') {
		// 	industry2String = 'Private services-providing industries 3, ' + this.state.year2;
		// } 

		// let industry3String = this.industry3String;

		// if (this.state.industry3 === '1') {
		// 	industry3String = 'Private industries, ' + this.state.year3;
		// } else if (this.state.industry3 === '2') {
		// 	industry3String = 'Agriculture, forestry, fishing and hunting, ' + this.state.year3;
		// } else if (this.state.industry3 === '3') {
		// 	industry3String = 'Mining, quarrying, and oil and gas extraction, ' + this.state.year3;
		// } else if (this.state.industry3 === '4') {
		// 	industry3String = 'Utilities, ' + this.state.year3;
		// } else if (this.state.industry3 === '5') {
		// 	industry3String = 'Construction, ' + this.state.year3;
		// } else if (this.state.industry3 === '6') {
		// 	industry3String = 'Manufacturing, ' + this.state.year3;
		// } else if (this.state.industry3 === '7') {
		// 	industry3String = 'Durable goods manufacturing, ' + this.state.year3;
		// } else if (this.state.industry3 === '8') {
		// 	industry3String = 'Nondurable goods manufacturing, ' + this.state.year3;
		// } else if (this.state.industry3 === '9') {
		// 	industry3String = 'Wholesale trade, ' + this.state.year3;
		// } else if (this.state.industry3 === '10') {
		// 	industry3String = 'Retail trade, ' + this.state.year3;
		// } else if (this.state.industry3 === '11') {
		// 	industry3String = 'Transportation, ' + this.state.year3;
		// } else if (this.state.industry3 === '12') {
		// 	industry3String = 'Information, ' + this.state.year3;
		// } else if (this.state.industry3 === '13') {
		// 	industry3String = 'Finance, insurance, real estate, rental, and leasing, ' + this.state.year3;
		// } else if (this.state.industry3 === '14') {
		// 	industry3String = 'Finance and insurance, ' + this.state.year3;
		// } else if (this.state.industry3 === '15') {
		// 	industry3String = 'Real estate and rental and leasing, ' + this.state.year3;
		// } else if (this.state.industry3 === '16') {
		// 	industry3String = 'Professional and business services, ' + this.state.year3;
		// } else if (this.state.industry3 === '17') {
		// 	industry3String = 'Professional, scientific, and technical services, ' + this.state.year3;
		// } else if (this.state.industry3 === '18') {
		// 	industry3String = 'Management of companies and enterprises, ' + this.state.year3;
		// } else if (this.state.industry3 === '19') {
		// 	industry3String = 'Administrative and support and waste management and remediation services, ' + this.state.year3;
		// } else if (this.state.industry3 === '20') {
		// 	industry3String = 'Educational services, health care, and social assistance, ' + this.state.year3;
		// } else if (this.state.industry3 === '21') {
		// 	industry3String = 'Educational services, ' + this.state.year3;
		// } else if (this.state.industry3 === '22') {
		// 	industry3String = 'Health care and social assistance, ' + this.state.year3;
		// } else if (this.state.industry3 === '23') {
		// 	industry3String = 'Arts, entertainment, recreation, accommodation, and food services, ' + this.state.year3;
		// } else if (this.state.industry3 === '24') {
		// 	industry3String = 'Arts, entertainment, and recreation, ' + this.state.year3;
		// } else if (this.state.industry3 === '25') {
		// 	industry3String = 'Accommodation and food services, ' + this.state.year3;
		// } else if (this.state.industry3 === '26') {
		// 	industry3String = 'Other services (except government and government enterprises), ' + this.state.year3;
		// } else if (this.state.industry3 === '27') {
		// 	industry3String = 'Government and government enterprises, ' + this.state.year3;
		// } else if (this.state.industry3 === '28') {
		// 	industry3String = 'Natural resources and mining, ' + this.state.year3;
		// } else if (this.state.industry3 === '29') {
		// 	industry3String = 'Trade, ' + this.state.year3;
		// } else if (this.state.industry3 === '30') {
		// 	industry3String = 'Transportation and utilities, ' + this.state.year3;
		// } else if (this.state.industry3 === '31') {
		// 	industry3String = 'Manufacturing and information, ' + this.state.year3;
		// } else if (this.state.industry3 === '32') {
		// 	industry3String = 'Private goods-producing industries 2, ' + this.state.year3;
		// } else if (this.state.industry3 === '33') {
		// 	industry3String = 'Private services-providing industries 3, ' + this.state.year3;
		// } 

		if (this.state.year1 === '2000') {
	        this.setState({
	          errorMsg1: 'GDP data is not available for the year 2000'
	        });
	      } else {
	      	this.setState({
	          errorMsg1: ''
	        });
	    }

	    if (this.state.year2 === '2000') {
	        this.setState({
	          errorMsg2: 'GDP data is not available for the year 2000'
	        });
	      } else {
	      	this.setState({
	          errorMsg2: ''
	        });
	    }

	    if (this.state.year3 === '2000') {
	        this.setState({
	          errorMsg3: 'GDP data is not available for the year 2000'
	        });
	      } else {
	      	this.setState({
	          errorMsg3: ''
	        });
	    }


		let yQueryURL = '/bar-industry-gdp?year1=' + this.state.year1 + '&year2=' + this.state.year2 + '&year3=' + this.state.year3 + '&industry1=' + this.state.industry1 + '&industry2=' + this.state.industry2 + '&industry3=' + this.state.industry3;

	    this.setState({
	    	yQueryURL: yQueryURL
	    	// industry1String: industry1String,
	    	// industry2String: industry2String,
	    	// industry3String: industry3String,
	    	// xResult: [industry1String, industry2String, industry3String]
	    }, function() {
	    	return this.componentDidMount();
	    });

	}

	componentDidMount() {
		var yarr = [];

        fetch(ENDPOINT.concat(this.state.yQueryURL))
            .then(res => res.json())
            .then(
            	(result) => {
    		      	yarr = result.map((rowObj, i) => rowObj.Z);
            		this.setState({
            			yResult: yarr
            		});
            	},
            	(error) => {
            		this.setState({
            			error
            		});
            	}
            )
    }

	render() {
		return (
			<div>
				<Plot
			        data={[
			          {
			            x: this.state.xResult,
			            y: this.state.yResult,
			            type: 'bar',
			            mode: 'markers',
			            marker: {color: 'blue'},
			          }
			        ]}
			        layout={ {width: 800, height: 800, title: 'A Fancy Plot'} }
			    />
			    <YearDropdown
            		id='year-dropdown-1'
           			handleYearChange={this.handleYear1Change}
          		/>
          		{this.state.errorMsg1}
          		<YearDropdown
            		id='year-dropdown-2'
           			handleYearChange={this.handleYear2Change}
          		/>
          		{this.state.errorMsg2}
          		<YearDropdown
            		id='year-dropdown-3'
           			handleYearChange={this.handleYear3Change}
          		/>
          		{this.state.errorMsg3}
          		<IndustryDropdown
					id='industry-dropdown-1'
					handleIndustryChange={this.handleIndustry1Change}
           		/>
           		<IndustryDropdown
					id='industry-dropdown-2'
					handleIndustryChange={this.handleIndustry2Change}
           		/>
           		<IndustryDropdown
					id='industry-dropdown-3'
					handleIndustryChange={this.handleIndustry3Change}
           		/>
          		<button id='submit' onClick={this.handleClick}>Submit</button>
          		Year1: {this.state.year1}
          		Year2: {this.state.year2}
          		Year3: {this.state.year3}
		    </div>
		)
	}
}
