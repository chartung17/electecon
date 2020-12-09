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

var fetch1Complete = false;
var fetch2Complete = false;
var fetch3Complete = false;

export default class Graph extends React.Component {
	constructor(props) {
		super(props);

		document.title = 'Graph';

		this.state = {
			year: '2016',
			// nextYear: '2016',
			lastElectionYear: '2012',
			xVar: 'Democrat',
			yVar: 'Democrat',
			xQueryURL: '/dem-votes?year=2016',
			yQueryURL: '/dem-votes?year=2016',
			labels: [],
			locations: [],
			needsXIndustryDropdown1: false,
			needsXIndustryDropdown2: false,
			needsYIndustryDropdown1: false,
			needsYIndustryDropdown2: false,
			xIndustry1: 1,
			xIndustry2: 1,
			yIndustry1: 1,
			yIndustry2: 1,
			xResult: [],
			yResult: [],
			errorMsg1: '',
			errorMsg2: ''
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
		let lastElectionYear;
	    if (newYear % 4 === 0) {
	    	lastElectionYear = newYear - 4;
	    } else {
	    	lastElectionYear = newYear - (newYear % 4);
	    }

    	this.setState({
      		year: newYear,
      		lastElectionYear: lastElectionYear
    	});
  	}

	// handle state change in x variable drowdown
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

	// handle state change in y variable drowdown
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

	// handle state change in first industry dropdown for x-axis
	handleXIndustry1Change(newIndustry) {
		this.setState({
			xIndustry1: newIndustry
	    });
	}

	// handle state change in second industry drowdown for x-axis
	handleXIndustry2Change(newIndustry) {
		this.setState({
			xIndustry2: newIndustry
	    });
	}

	// handle state change in first industry dropdown for y-axis
	handleYIndustry1Change(newIndustry) {
		this.setState({
			yIndustry1: newIndustry
	    });
	}

	// handle state change in second industry dropdown for y-axis
	handleYIndustry2Change(newIndustry) {
		this.setState({
			yIndustry2: newIndustry
	    });
	}

	handleClick = () => {
		let xQueryURL = this.state.xQueryURL;
	    if (this.state.xVar === 'Democrat') {
	      xQueryURL = '/dem-votes?year=' + this.state.year;
	    } else if (this.state.xVar === 'Republican') {
	      xQueryURL = '/rep-votes?year=' + this.state.year;
	    } else if (this.state.xVar === 'Other') {
	      xQueryURL = '/other-votes?year=' + this.state.year;
	    } else if (this.state.xVar === 'RepDemDiff') {
	      xQueryURL = '/rep-dem-diff?year=' + this.state.year;
	    } else if (this.state.xVar === 'TotalGDP') {
	      xQueryURL = '/total-county-gdp?year=' + this.state.year;
	    } else if (this.state.xVar === 'GDPGrowthSince2001') {
	      xQueryURL = '/gdp-growth-since-2001';
	    } else if (this.state.xVar === 'GDPGrowthSinceLastElection') {
	      xQueryURL = '/gdp-growth-since-last-election?year=' + this.state.year + '&lastElectionYear=' + this.state.lastElectionYear;
	    } else if (this.state.xVar === 'GDPIndustryComp') {
	      xQueryURL = '/gdp-industry-comp?year=' + this.state.year + '&industry1=' + this.state.xIndustry1 + '&industry2=' + this.state.xIndustry2;
	    } else if (this.state.xVar === 'IndustryGDP') {
	      xQueryURL = '/industry-gdp-county?year=' + this.state.year + '&industry1=' + this.state.xIndustry1;
	    }

	    let yQueryURL = this.state.yQueryURL;
	    if (this.state.yVar === 'Democrat') {
	      yQueryURL = '/dem-votes?year=' + this.state.year;
	    } else if (this.state.yVar === 'Republican') {
	      yQueryURL = '/rep-votes?year=' + this.state.year;
	    } else if (this.state.yVar === 'Other') {
	      yQueryURL = '/other-votes?year=' + this.state.year;
	    } else if (this.state.yVar === 'RepDemDiff') {
	      yQueryURL = '/rep-dem-diff?year=' + this.state.year;
	    } else if (this.state.yVar === 'TotalGDP') {
	      yQueryURL = '/total-county-gdp?year=' + this.state.year;
	    } else if (this.state.yVar === 'GDPGrowthSince2001') {
	      yQueryURL = '/gdp-growth-since-2001';
	    } else if (this.state.yVar === 'GDPGrowthSinceLastElection') {
	      yQueryURL = '/gdp-growth-since-last-election?year=' + this.state.year + '&lastElectionYear=' + this.state.lastElectionYear;
	    } else if (this.state.yVar === 'GDPIndustryComp') {
	      yQueryURL = '/gdp-industry-comp?year=' + this.state.year + '&industry1=' + this.state.yIndustry1 + '&industry2=' + this.state.yIndustry2;
	    } else if (this.state.yVar === 'IndustryGDP') {
	      yQueryURL = '/industry-gdp-county?year=' + this.state.year + '&industry1=' + this.state.yIndustry1;
	    }

		let electionYears = ['2000', '2004', '2008', '2012', '2016'];
	    if ((this.state.xVar) === 'TotalGDP' || (this.state.xVar === 'GDPGrowthSince2001') || (this.state.xVar === 'GDPGrowthSinceLastElection') || (this.state.xVar === 'GDPIndustryComp') || (this.state.xVar === 'IndustryGDP') ||
	     (this.state.yVar === 'TotalGDP') || (this.state.yVar === 'GDPGrowthSince2001') || (this.state.yVar === 'GDPGrowthSinceLastElection') || (this.state.yVar === 'GDPIndustryComp') || (this.state.yVar === 'IndustryGDP')) {
		      if (this.state.year < 2005) {
		      	if (this.state.year === '2000') {
			        this.setState({
			          errorMsg1: 'GDP data is not available for the year 2000'
			        });
			    } else if ((this.state.xVar === 'GDPGrowthSinceLastElection') || (this.state.yVar === 'GDPGrowthSinceLastElection')) {
		      		this.setState({
		      			errorMsg1: 'GDP data is not available for the year 2000 (the last election year)'
		      		});
				} else {
					this.setState({
						errorMsg1: ''
					});
				}
		      } else {
			      	this.setState({
						errorMsg1: ''
					});
			}
	    } else {
	    	this.setState({
	    		errorMsg1: ''
			});
	    }

	    if ((this.state.xVar === 'Democrat') || (this.state.xVar === 'Republican') || (this.state.xVar === 'Other') || (this.state.xVar === 'RepDemDiff') ||
	    	(this.state.yVar === 'Democrat') || (this.state.yVar === 'Republican') || (this.state.yVar === 'Other') || (this.state.yVar === 'RepDemDiff')) {
		    if (!electionYears.includes(this.state.year)) {
		        this.setState({
		          errorMsg2: 'Election data is not available for the year ' + this.state.year
		        });
		    } else {
		      	this.setState({
		          errorMsg2: ''
		        });
		    }
	    } else {
	    	this.setState({
	    		errorMsg2: ''
			});
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
		var locationsArr = [];

		fetch(ENDPOINT.concat(this.state.xQueryURL))
            .then(res => res.json())
            .then(
            	(result) => {
    		      	xarr = result.map((rowObj, i) => rowObj.Z);
    		      	fetch1Complete = true;
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
    		      	fetch2Complete = true;
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
	                locationsArr = result.map((rowObj, i) => rowObj.FIPS);
	                fetch3Complete = true;
            		this.setState({
            			labels: labelsArr,
            			locations: locationsArr
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

		let finalXResult;
		let finalYResult;
		let finalLabels;
		let finalLocations;
		if ((fetch1Complete) && (fetch2Complete) && (fetch3Complete)){
			finalXResult = this.state.xResult;
			finalYResult = this.state.yResult;
			finalLabels = this.state.labels;
			finalLocations = this.state.locations;
			fetch1Complete = false;
			fetch2Complete = false;
			fetch3Complete =  false;
		}

		let dimension = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) * 0.8;

		return (
			<div className='page'>
				<section className='graph'>
					<Plot
				        data={[
				          {
				            x: finalXResult,
				            y: finalYResult,
				            type: 'scatter',
				            mode: 'markers',
				            marker: {color: 'blue'},
				            text: finalLabels,
				            customdata: finalLocations
				          }
				        ]}
				        layout={ {width: dimension, height: dimension, hovermode: 'closest'} }
				        onClick = {(data) => {
				          window.location.href = process.env.PUBLIC_URL + '/county/' + data.points[0].customdata + '#county-profile';
				        }}
				    />
			    </section>
			    <section className='scatterSelector'>
	          		<p className='error'>{this.state.errorMsg1 + "\n"}</p>
	          		<p className='error'>{this.state.errorMsg2}</p>
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
          		</section>
          		<button id='submit' onClick={this.handleClick}>Submit</button>
		    </div>
		)
	}
}
