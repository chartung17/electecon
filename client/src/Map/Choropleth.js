import React from 'react';
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
      colorscale: '',
      title: '',
      zmin: 0,
      zmax: 0,
      zauto: true,
      year: props.year,
      queryURL: props.queryURL
    };
  }

  // query the specified URL and update state accordingly
  queryZ(queryURL) {
    if (queryURL === '') {
      this.setState({
        colorscale: 'RdBu',
        title: '',
        zmin: -100,
        zmax: 100,
        zauto: false
      });
      return;
    } if (queryURL.search('/rep-dem-diff') === 0) {
      this.setState({
        colorscale: 'RdBu',
        title: '% Republican votes - % Democrat votes in ' + this.state.year,
        zmin: -100,
        zmax: 100,
        zauto: false
      });
    } else if (queryURL.search('/rep-votes') === 0) {
      this.setState({
        colorscale: [['0.0', 'white'], ['1.0', 'red']],
        title: '% Republican votes in ' + this.state.year,
        zmin: 0,
        zmax: 100,
        zauto: false
      });
    } else if (queryURL.search('/dem-votes') === 0) {
      this.setState({
        colorscale: [['0.0', 'white'], ['1.0', 'blue']],
        title: '% Democrat votes in ' + this.state.year,
        zmin: 0,
        zmax: 100,
        zauto: false
      });
    } else if (queryURL.search('/other-votes') === 0) {
      this.setState({
        colorscale: [['0.0', 'white'], ['1.0', 'green']],
        title: '% Other votes in ' + this.state.year,
        zmin: 0,
        zmax: 100,
        zauto: true
      });
    }
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
      this.setState({
        z: z
      });
    }, err => {
      console.log(err);
    });
  }

  // get names and fips for all counties and store in state
  componentDidMount() {
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
        names: names
      });
    }, err => {
      console.log(err);
    });

    // execute default query
    this.queryZ(this.state.queryURL + '?year=' + this.state.year);
  }

  // update graph when new info received from parent component
  componentWillReceiveProps(nextProps) {
    this.setState({
      year: nextProps.year,
      queryURL: nextProps.queryURL
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props === prevProps) {
      return;
    }
    this.queryZ(this.state.queryURL + '?year=' + this.state.year);
    this.forceUpdate();
  }

  render() {
    return (
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
        colorbar: {y: 0, yanchor: "bottom", title: {text: this.state.title, side: "right"}}}
      ]}
      onClick = {(data) => { window.location.href = '/county/' + data.points[0].location; }}
      layout = {{
        geo: {scope: 'usa'},
        width: 1200,
        height: 700,
        margin: {t: 0, b: 0},
        title: {text: this.state.title, y: 0.95}
      }}
      />
      );
    }
  }
