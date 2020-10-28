import React from 'react';
import './Map.css';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js/lib/core';
import {ENDPOINT} from './Map';

Plotly.register([
  require('plotly.js/lib/choropleth')
]);
const Plot = createPlotlyComponent(Plotly);

export default class Choropleth extends React.Component {
  // create state info in constructor
  constructor(props) {
    super(props);
    this.state = {
      fips: [],
      names: [],
      z: [],
      industries: [],
      nonAggregateIndustries: [],
      nonAggregateIndIDs: [],
      topIndustryColorbar: [],
      customdata: [],
      colorscale: '',
      title: '',
      zmin: 0,
      zmax: 0,
      zauto: true,
      width: 0,
      height: 0,
      year: props.year,
      queryURL: props.queryURL,
      filter: props.filter,
      filterYear: props.filterYear,
      operand: props.operand,
      val: props.val,
      industry: props.industry,
      hovertemplate: '',
      showscale: true
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  // responsive colorscale used for plotting GDP variables
  gdpColorscale(z) {
    let vals = [];
    let len = z.length;
    for (let i = 0; i < len; i++) {
      if (typeof z[i] === 'number') {
        vals.push(z[i]);
      }
    }
    vals.sort((a, b) => {return (a - b)});
    len = vals.length;
    let min = vals[0];
    let max = vals[len-1];
    let range = max - min;
    let p20 = vals[Math.floor(0.2 * len) - 1];
    p20 = ((p20 - min) / range).toString();
    let p40 = vals[Math.floor(0.4 * len) - 1];
    p40 = ((p40 - min) / range).toString();
    let p60 = vals[Math.floor(0.6 * len) - 1];
    p60 = ((p60 - min) / range).toString();
    let p80 = vals[Math.floor(0.8 * len) - 1];
    p80 = ((p80 - min) / range).toString();
    return [
      ['0.0', '#0000ff'],
      [p20, '#00ffff'],
      [p40, '#00ff00'],
      [p60, '#ffff00'],
      [p80, '#ff0000'],
      ['1.0', '#ff00ff']
    ];
  }

  // colorscale used for top industry query
  topIndustryColorscale = [
    ['0.0', 'forestgreen'],
    ['0.05', 'dimgray'],
    ['0.1', 'aquamarine'],
    ['0.15', 'goldenrod'],
    ['0.2', 'blue'],
    ['0.25', 'mediumslateblue'],
    ['0.3', 'yellow'],
    ['0.35', 'darkcyan'],
    ['0.4', 'deepskyblue'],
    ['0.45', 'darkviolet'],
    ['0.5', 'deeppink'],
    ['0.55', 'lawngreen'],
    ['0.6', 'lightcoral'],
    ['0.65', 'maroon'],
    ['0.7', 'midnightblue'],
    ['0.75', 'wheat'],
    ['0.8', 'orangered'],
    ['0.85', 'orchid'],
    ['0.9', 'silver'],
    ['0.95', 'darkorange'],
    ['1.0', 'red']
  ];

  // query the specified URL and update state accordingly
  queryZ() {
    let queryURL = this.state.queryURL + '?year=' + this.state.year +
      '&filter=' + this.state.filter + '&filteryear=' + this.state.filterYear +
      '&operand=' + this.state.operand + '&val=' + this.state.val +
      '&industry=' + this.state.industry;
    let currentState = this.state;
    let customdata = [];
    fetch(ENDPOINT.concat(queryURL),
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(row => {
      if (!row) return;
      let z = row.map((rowObj, i) => rowObj.Z);
      if (queryURL.startsWith('/top-industry')) {
        for (let j = 0; j < z.length; j++) {
          customdata.push(this.state.nonAggregateIndustries[this.state.nonAggregateIndIDs.indexOf(z[j])]);
          if (z[j] !== null) {
            z[j] = this.state.nonAggregateIndIDs.indexOf(z[j]);
          }
        }
      } else {
        customdata = currentState.customdata;
      }
      let gdpColorscale = this.gdpColorscale(z);
      // make sure query matches curretn selection; if not, abort
      if ((currentState !== this.state) && (this.state.z.length > 0)) {
        return;
      }
      // update state with query results
      else if (queryURL.startsWith('/rep-dem-diff')) {
        this.setState({
          colorscale: 'RdBu',
          title: '% Republican votes - % Democrat votes in ' + this.state.year,
          zmin: -100,
          zmax: 100,
          zauto: false,
          hovertemplate: '<b>%{text}</b><br>%{z}<extra></extra>',
          showscale: true,
          z: z,
          customdata: customdata
        });
      } else if (queryURL.startsWith('/rep-votes')) {
        this.setState({
          colorscale: [['0.0', 'white'], ['1.0', 'red']],
          title: '% Republican votes in ' + this.state.year,
          zmin: 0,
          zmax: 100,
          zauto: false,
          hovertemplate: '<b>%{text}</b><br>%{z}<extra></extra>',
          showscale: true,
          z: z,
          customdata: customdata
        });
      } else if (queryURL.startsWith('/dem-votes')) {
        this.setState({
          colorscale: [['0.0', 'white'], ['1.0', 'blue']],
          title: '% Democrat votes in ' + this.state.year,
          zmin: 0,
          zmax: 100,
          zauto: false,
          hovertemplate: '<b>%{text}</b><br>%{z}<extra></extra>',
          showscale: true,
          z: z,
          customdata: customdata
        });
      } else if (queryURL.startsWith('/other-votes')) {
        this.setState({
          colorscale: [['0.0', 'white'], ['1.0', 'green']],
          title: '% Other votes in ' + this.state.year,
          zmin: 0,
          zmax: 100,
          zauto: true,
          hovertemplate: '<b>%{text}</b><br>%{z}<extra></extra>',
          showscale: true,
          z: z,
          customdata: customdata
        });
      } else if (queryURL.startsWith('/total-gdp')) {
        this.setState({
          colorscale: gdpColorscale,
          title: 'Total GDP (millions of dollars) in ' + this.state.year,
          zmin: 0,
          zmax: 100,
          zauto: true,
          hovertemplate: '<b>%{text}</b><br>%{z}<extra></extra>',
          showscale: true,
          z: z,
          customdata: customdata
        });
      } else if (queryURL.startsWith('/industry-gdp')) {
        this.setState({
          colorscale: gdpColorscale,
          title: '% GDP from ' + this.getIndustryName(this.state.industry) + ' in ' + this.state.year,
          zmin: 0,
          zmax: 100,
          zauto: true,
          hovertemplate: '<b>%{text}</b><br>%{z}<extra></extra>',
          showscale: true,
          z: z,
          customdata: customdata
        });
      } else if (queryURL.startsWith('/top-industry')) {
        this.setState({
          colorscale: this.topIndustryColorscale,
          title: 'Top Industry (non-aggregate) in ' + this.state.year,
          zmin: 0,
          zmax: 20,
          zauto: false,
          hovertemplate: '<b>%{text}</b><br>%{customdata}<extra></extra>',
          showscale: false,
          z: z,
          customdata: customdata
        });
      }
    }, err => {
      console.log(err);
    });
  }

  // get the name of the industry with the specified id
  getIndustryName(indID) {
    return this.state.industries[indID-1];
  }

  componentDidMount() {
    // get names and fips for all counties and store in state
    fetch(ENDPOINT.concat(`/counties`),
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(row => {
      if (!row) return;
      let fips = row.map((rowObj, i) => rowObj.FIPS);
      let names = row.map((rowObj, i) => rowObj.NAME);
      this.setState({
        fips: fips,
        names: names,
        customdata: fips
      });
    }, err => {
      console.log(err);
    });

    // get names and IDs for all industries and store in state
    fetch(ENDPOINT.concat(`/industries`),
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(row => {
      if (!row) return;
      let industries = row.map((rowObj, i) => rowObj.NAME);
      let i;
      for (i = 0; i < industries.length; i++) {
        if (industries[i].includes('2/')) {
          industries[i] = industries[i].substring(0, industries[i].indexOf('2/'));
        } else if (industries[i].includes('3/')) {
          industries[i] = industries[i].substring(0, industries[i].indexOf('3/'));
        }
      }
      this.setState({
        industries: industries
      })
    }, err => {
      console.log(err);
    });

    // get names and IDs for all non-aggregate industries and store in state
    fetch(ENDPOINT.concat(`/non-aggregate-industries`),
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(row => {
      if (!row) return;
      let industries = row.map((rowObj, i) => rowObj.NAME);
      let indIDs = row.map((rowObj, i) => rowObj.INDUSTRY_ID);
      let i;
      let topIndustryColorbar = [];
      for (i = 0; i < industries.length; i++) {
        if (industries[i].includes('2/')) {
          industries[i] = industries[i].substring(0, industries[i].indexOf('2/'));
        } else if (industries[i].includes('3/')) {
          industries[i] = industries[i].substring(0, industries[i].indexOf('3/'));
        }
        topIndustryColorbar.push(
          <div className='colorbarBox'>
            <div className='colorBox' style={{backgroundColor: this.topIndustryColorscale[i][1]}}></div>
            <p className='colorbarLabel'>{industries[i]}</p>
          </div>
        );
      }
      this.setState({
        nonAggregateIndustries: industries,
        nonAggregateIndIDs: indIDs,
        topIndustryColorbar: topIndustryColorbar
      });
    }, err => {
      console.log(err);
    });

    // set dimensions of graph based on window size, and add event listener in case of window resize
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);

    // execute default query
    this.queryZ();
  }

  // update dimensions of map when window resized
  updateDimensions() {
  let width = Math.min(window.innerWidth * 0.9, 1400);
    let height = width / 2;
    this.setState({
      width: width,
      height: height
    });
  }

  // remove event listener on unmount
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  // update graph when new info received from parent component
  componentWillReceiveProps(nextProps) {
    this.setState({
      year: nextProps.year,
      queryURL: nextProps.queryURL,
      filter: nextProps.filter,
      filterYear: nextProps.filterYear,
      operand: nextProps.operand,
      val: nextProps.val,
      industry: nextProps.industry
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props === prevProps) {
      return;
    }
    this.queryZ();
  }

  render() {
    return (
      <div id='choroplethWrap'>
      <Plot
      id = 'choropleth'
      data = {[{
        type: "choropleth",
        geojson: "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json",
        locations: this.state.fips,
        z: this.state.z,
        text: this.state.names,
        colorscale: this.state.colorscale,
        zmin: this.state.zmin,
        zmax: this.state.zmax,
        zauto: this.state.zauto,
        hovertemplate: this.state.hovertemplate,
        customdata: this.state.customdata,
        showscale: this.state.showscale
      }]}
      onClick = {(data) => { window.location.href = '/county/' + data.points[0].location + '#county-profile'; }}
      layout = {{
        geo: {scope: 'usa'},
        width: this.state.width,
        height: this.state.height,
        autosize: true,
        margin: {t: 0, b: 0},
        title: {text: this.state.title, y: 0.95},
        dragmode: false
      }}
      config = {{responsive: true}}
      />
      {this.state.showscale
        ? <div></div>
        : <div id='colorbar'>{this.state.topIndustryColorbar}</div>
      }
      </div>
      );
    }
  }
