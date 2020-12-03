import React from 'react';
import YearDropdown from './YearDropdown';
import XVariableDropdown from './XVariableDropdown';
import YVariableDropdown from './YVariableDropdown';
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
			year: '2016',
			nextYear: '2016',
			xVar: 'Democrat',
			yVar: 'Democrat',
			xQueryURL: '/dem-votes?year=2016',
			yQueryURL: '/dem-votes?year=2016',
			xResult: [],
			yResult: []
		};

		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleXVarChange = this.handleXVarChange.bind(this);
		this.handleYVarChange = this.handleYVarChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	// handle state change in year dropdown
	handleYearChange(newYear) {
    	this.setState({
      		year: newYear
    	});
  	}

	// handle state change in variable drowdown
	handleXVarChange(newVar) {
		this.setState({
			xVar: newVar
		});
	}

	// handle state change in variable drowdown
	handleYVarChange(newVar) {
		this.setState({
			yVar: newVar
		});
	}

	handleClick = () => {
		let xQueryURL = this.state.xQueryURL;
	    if (this.state.xVar === 'Democrat') {
	      xQueryURL = '/dem-votes?year=' + this.state.year;
	    } else if (this.state.xVar === 'Republican') {
	      xQueryURL = '/rep-votes?year=' + this.state.year;
	    } else if (this.state.xVar === 'Green') {
	      xQueryURL = '/green-votes?year=' + this.state.year;
	    } else if (this.state.xVar === 'Other') {
	      xQueryURL = '/other-votes?year=' + this.state.year;
	    } else if (this.state.xVar === 'RepDemDiff') {
	      xQueryURL = '/rep-dem-diff?year=' + this.state.year;
	    } else if (this.state.xVar === 'TotalGDP') {
	      xQueryURL = '/total-county-gdp?year=' + this.state.year;
	    } else if (this.state.xVar === 'GDPGrowthSince2001') {
	      xQueryURL = '/gdp-growth-since-2001';
	    } else if (this.state.xVar === 'GDPGrowthSinceLastElection') {
	      xQueryURL = '/gdp-growth-since-last-election?year=' + this.state.year;
	    } else if (this.state.xVar === 'GDPIndustryComp') {
	      xQueryURL = '/gdp-industry-comp?year=' + this.state.year + '&industry1=' + this.state.industry1;
	      this.setState({
	   	 	needsIndustry: true
	      });
	    } else if (this.state.xVar === 'IndustryGDP') {
	      xQueryURL = '/industry-gdp-county?year=' + this.state.year + '&industry1=' + this.state.industry1 + '&industry2=' + this.state.industry2;
	    }

	    let yQueryURL = this.state.yQueryURL;
	    if (this.state.yVar === 'Democrat') {
	      yQueryURL = '/dem-votes?year=' + this.state.year;
	    } else if (this.state.yVar === 'Republican') {
	      yQueryURL = '/rep-votes?year=' + this.state.year;
	    } else if (this.state.yVar === 'Green') {
	      yQueryURL = '/green-votes?year=' + this.state.year;
	    } else if (this.state.yVar === 'Other') {
	      yQueryURL = '/other-votes?year=' + this.state.year;
	    } else if (this.state.yVar === 'RepDemDiff') {
	      yQueryURL = '/rep-dem-diff?year=' + this.state.year;
	    } else if (this.state.yVar === 'TotalGDP') {
	      yQueryURL = '/total-county-gdp?year=' + this.state.year;
	    } else if (this.state.yVar === 'GDPGrowthSince2001') {
	      yQueryURL = '/gdp-growth-since-2001';
	    } else if (this.state.yVar === 'GDPGrowthSinceLastElection') {
	      yQueryURL = '/gdp-growth-since-last-election?year=' + this.state.year;
	    } else if (this.state.yVar === 'GDPIndustryComp') {
	      yQueryURL = '/gdp-industry-comp?year=' + this.state.year + '&industry1=' + this.state.industry1;
	    } else if (this.state.yVar === 'IndustryGDP') {
	      yQueryURL = '/industry-gdp-county?year=' + this.state.year + '&industry1=' + this.state.industry1 + '&industry2=' + this.state.industry2;
	    }

	    this.setState({
	    	xQueryURL: xQueryURL,
	    	yQueryURL: yQueryURL
	    }, function() {
	    	return this.componentDidMount();
	    });

	}

	componentDidMount() {
		var xarr = [];
		var yarr = [];

		fetch(ENDPOINT.concat(this.state.xQueryURL))
            .then(res => res.json())
            .then(
            	(result) => {
    		      	xarr = result.map((rowObj, i) => rowObj.Z);
            		this.setState({
            			xResult: xarr
            		});
            	},
            	(error) => {
            		this.setState({
            			error
            		});
            	}
            )

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
			            marker: {color: 'red'},
			          }
			        ]}
			        layout={ {width: 896, height: 672, title: 'A Fancy Plot'} }
			    />
			    <YearDropdown
            		id='year-dropdown'
           			handleYearChange={this.handleYearChange}
          		/>
          		<XVariableDropdown
          			id='variable-dropdown'
          			handleXVarChange={this.handleXVarChange}
          			includeCategorical={true}
          		/>
          		<YVariableDropdown
          			id='variable-dropdown'
          			handleYVarChange={this.handleYVarChange}
          			includeCategorical={true}
          		/>
          		<button id='submit' onClick={this.handleClick}>Submit</button>

		    </div>
		)
	}
}
