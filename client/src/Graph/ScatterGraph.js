import React from 'react';
import YearDropdown from './YearDropdown';
import IndustryDropdown from './IndustryDropdown';
import XVariableDropdown from './XVariableDropdown';
import YVariableDropdown from './YVariableDropdown';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js/lib/core';

import {GRAPH_ENDPOINT as ENDPOINT} from '../App';

Plotly.register([
  require('plotly.js/lib/scatter')
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
			labels: [],
			needsXIndustryDropdown1: false,
			needsXIndustryDropdown2: false,
			needsYIndustryDropdown1: false,
			needsYIndustryDropdown2: false,
			xIndustry1: '',
			xIndustry2: '',
			yIndustry1: '',
			yIndustry2: '',
			xResult: [],
			yResult: []
		};

		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleXIndustry1Change = this.handleXIndustry1Change.bind(this);
		this.handleXIndustry2Change = this.handleXIndustry2Change.bind(this);
		this.handleYIndustry1Change = this.handleYIndustry1Change.bind(this);
		this.handleYIndustry2Change = this.handleYIndustry2Change.bind(this);
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
		if (newVar === 'GDPIndustryComp') {
			this.setState({
				xVar: newVar,
		   	 	needsXIndustryDropdown1: true,
		   	 	needsXIndustryDropdown2: true
		    });
	    } else if (newVar === 'IndustryGDP') {
	    	this.setState({
				xVar: newVar,
		   	 	needsXIndustryDropdown1: true,
		   	 	needsXIndustryDropdown2: false,
		    });
	    } else {
	    	this.setState({
				xVar: newVar,
		   	 	needsXIndustryDropdown1: false,
		   	 	needsXIndustryDropdown2: false
		    });
	    }
	}

	// handle state change in variable drowdown
	handleYVarChange(newVar) {
		if (newVar === 'GDPIndustryComp') {
			this.setState({
				yVar: newVar,
		   	 	needsYIndustryDropdown1: true,
		   	 	needsYIndustryDropdown2: true
		    });
	    } else if (newVar === 'IndustryGDP') {
	    	this.setState({
				yVar: newVar,
		   	 	needsYIndustryDropdown1: true,
		   	 	needsYIndustryDropdown2: false,
		    });
	    } else {
	    	this.setState({
				yVar: newVar,
		   	 	needsYIndustryDropdown1: false,
		   	 	needsYIndustryDropdown2: false
		    });
	    }
	}

	// handle state change in variable drowdown
	handleXIndustry1Change(newIndustry) {
		this.setState({
			xIndustry1: newIndustry
	    });
	}

	// handle state change in variable drowdown
	handleXIndustry2Change(newIndustry) {
		this.setState({
			xIndustry2: newIndustry
	    });
	}

	// handle state change in variable drowdown
	handleYIndustry1Change(newIndustry) {
		this.setState({
			yIndustry1: newIndustry
	    });
	}

	// handle state change in variable drowdown
	handleYIndustry2Change(newIndustry) {
		this.setState({
			yIndustry2: newIndustry
	    });
	}

	handleClick = () => {
		let xQueryURL = this.state.xQueryURL;
	    if (this.state.xVar === 'Democrat') {
	      xQueryURL = '/dem-votes' + '?year=' + this.state.year;
	    } else if (this.state.xVar === 'Republican') {
	      xQueryURL = '/rep-votes' + '?year=' + this.state.year;
	    } else if (this.state.xVar === 'Green') {
	      xQueryURL = '/green-votes' + '?year=' + this.state.year;
	    } else if (this.state.xVar === 'Other') {
	      xQueryURL = '/other-votes' + '?year=' + this.state.year;
	    } else if (this.state.xVar === 'RepDemDiff') {
	      xQueryURL = '/rep-dem-diff' + '?year=' + this.state.year;
	    } else if (this.state.xVar === 'TotalGDP') {
	      xQueryURL = '/total-county-gdp' + '?year=' + this.state.year;
	    } else if (this.state.xVar === 'GDPGrowthSince2001') {
	      xQueryURL = '/gdp-growth-since-2001';
	    } else if (this.state.xVar === 'GDPGrowthSinceLastElection') {
	      xQueryURL = '/gdp-growth-since-last-election'  + '?year=' + this.state.year;
	    } else if (this.state.xVar === 'GDPIndustryComp') {
	      xQueryURL = '/gdp-industry-comp'  + '?year=' + this.state.year + '&xIndustry1=' + this.state.xIndustry1;
	    } else if (this.state.xVar === 'IndustryGDP') {
	      xQueryURL = '/industry-gdp-county'  + '?year=' + this.state.year + 'xIndustry1=' + this.state.xIndustry1 + '&xIndustry2=' + this.state.xIndustry2;
	    }

	    let yQueryURL = this.state.yQueryURL;
	    if (this.state.yVar === 'Democrat') {
	      yQueryURL = '/dem-votes' + '?year=' + this.state.year;
	    } else if (this.state.yVar === 'Republican') {
	      yQueryURL = '/rep-votes' + '?year=' + this.state.year;
	    } else if (this.state.yVar === 'Green') {
	      yQueryURL = '/green-votes' + '?year=' + this.state.year;
	    } else if (this.state.yVar === 'Other') {
	      yQueryURL = '/other-votes'  + '?year=' + this.state.year;
	    } else if (this.state.yVar === 'RepDemDiff') {
	      yQueryURL = '/rep-dem-diff' + '?year=' + this.state.year;
	    } else if (this.state.yVar === 'TotalGDP') {
	      yQueryURL = '/total-county-gdp'  + '?year=' + this.state.year;
	    } else if (this.state.yVar === 'GDPGrowthSince2001') {
	      yQueryURL = '/gdp-growth-since-2001';
	    } else if (this.state.yVar === 'GDPGrowthSinceLastElection') {
	      yQueryURL = '/gdp-growth-since-last-election'  + '?year=' + this.state.year;
	    } else if (this.state.yVar === 'GDPIndustryComp') {
	      yQueryURL = '/gdp-industry-comp'  + '?year=' + this.state.year + '&industry1=' + this.state.industry1;
	    } else if (this.state.yVar === 'IndustryGDP') {
	      yQueryURL = '/industry-gdp-county'  + '?year=' + this.state.year + '&industry1=' + this.state.industry1 + '&industry2=' + this.state.industry2;
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
		var labelsArr = [];

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

        fetch(ENDPOINT.concat('/counties'))
            .then(res => res.json())
            .then(
            	(result) => {
    		      	labelsArr = result.map((rowObj, i) => rowObj.Z);
            		this.setState({
            			labels: labelsArr
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
		let XIndustryDropdown1;
		let XIndustryDropdown2;
		if (this.state.needsXIndustryDropdown1) {
			XIndustryDropdown1 = <IndustryDropdown
            					id='x-industry-dropdown'
           						handleIndustryChange={this.handleXIndustry1Change}/>;
		}
		if (this.state.needsXIndustryDropdown2) {
			XIndustryDropdown2 = <IndustryDropdown
            					id='x-industry-dropdown'
           						handleIndustryChange={this.handleXIndustry2Change}/>;
		}

		let YIndustryDropdown1;
		let YIndustryDropdown2;
		if (this.state.needsYIndustryDropdown1) {
			YIndustryDropdown1 = <IndustryDropdown
            					id='y-industry-dropdown'
           						handleIndustryChange={this.handleYIndustry1Change}/>;
		}
		if (this.state.needsYIndustryDropdown2) {
			YIndustryDropdown2 = <IndustryDropdown
            					id='y-industry-dropdown'
           						handleIndustryChange={this.handleYIndustry2Change}/>;
		}

		return (
			<div>
				<Plot
			        data={[
			          {
			            x: this.state.xResult,
			            y: this.state.yResult,
			            type: 'scatter',
			            mode: 'markers',
			            marker: {color: 'red'},
			           	text: this.state.labels
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
          		{XIndustryDropdown1}
          		{XIndustryDropdown2}
          		<YVariableDropdown
          			id='variable-dropdown'
          			handleYVarChange={this.handleYVarChange}
          			includeCategorical={true}
          		/>
          		{YIndustryDropdown1}
          		{YIndustryDropdown2}
          		<button id='submit' onClick={this.handleClick}>Submit</button>
		    </div>
		)
	}
}