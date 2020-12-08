import React from 'react';
import YearDropdown from './YearDropdown';
import IndustryDropdown from './IndustryDropdown';
import XVariableDropdown from './XVariableDropdown';
import YVariableDropdown from './YVariableDropdown';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js/lib/core';
import './ScatterGraph.css';

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
			// nextYear: '2016',
			lastElectionYear: '2012',
			xVar: 'Democrat',
			yVar: 'Democrat',
			xQueryURL: '/dem-votes?year=2016',
			yQueryURL: '/dem-votes?year=2016',
			labels: [],
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
			// width: 0,
			// height: 0
		};

		// this.updateDimensions = this.updateDimensions.bind(this);

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
		      if (this.state.year === '2000') {
		        this.setState({
		          errorMsg1: 'GDP data is not available for the year 2000'
		        });
		      } else if (this.state.year < 2005) {
		      	if ((this.state.xVar === 'GDPGrowthSinceLastElection') || (this.state.yVar === 'GDPGrowthSinceLastElection')) {
		      		this.setState({
		      			errorMsg1: 'GDP data is not available for the year 2000 (the last election year)'
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

	    let lastElectionYear;
	    if (this.state.year % 4 === 0) {
	    	lastElectionYear = this.state.year - 4;
	    } else {
	    	lastElectionYear = this.state.year - (this.state.year % 4);
	    }

	    this.setState({
	    	xQueryURL: xQueryURL,
	    	yQueryURL: yQueryURL,
	    	lastElectionYear: lastElectionYear
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
        // this.updateDimensions();
        // window.addEventListener('resize', this.updateDimensions);
    }

 //    // update dimensions of map when window resized
 //    updateDimensions() {
	//     // let width = Math.min(window.innerWidth * 0.5, 1400);
	//     // let height = width;
	//     let height = Math.min(window.innerHeight * 0.9, 1400);
	//     let width = height;
	//     this.setState({
	//       width: width,
	//       height: height
	//     });
 //  	}

 //    // remove event listener on unmount
	// componentWillUnmount() {
	// 	window.removeEventListener('resize', this.updateDimensions);
	// }

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
			<div className='graph'>
				<Plot
			        data={[
			          {
			            x: this.state.xResult,
			            y: this.state.yResult,
			            type: 'scatter',
			            mode: 'markers',
			            marker: {color: 'blue'},
			           	text: this.state.labels
			          }
			        ]}
			        layout={ {width: 800, height: 800} }
			        // layout = {{
		         //      width: this.state.width,
		         //      height: this.state.height,
		         //      autosize: true
		         //      // title: {text: this.state.title, y: 0.95},
		         //    }}
			    />
			    <section className = 'selectors'>
				    <YearDropdown
	            		id='year-dropdown'
	           			handleYearChange={this.handleYearChange}
	          		/>
	          		{this.state.errorMsg1 + "\n"}
	          		{this.state.errorMsg2}
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
          		</section>
		    </div>
		)
	}
}
