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
      z: []
    };
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

    // get rep-dem-diff for all counties and store in state
    fetch(ENDPOINT.concat(`/rep-dem-diff?year=2016`),
    {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(row => {
      if (!row) return;
      let diff = row.map((rowObj, i) => rowObj.Diff);
      this.setState({
        z: diff
      });
    }, err => {
      console.log(err);
    });
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
        colorscale: 'RdBu',
        zmin: -100,
        zmax: 100,
        colorbar: {y: 0, yanchor: "bottom", title: {text: "2016 % Republican votes - % Democrat votes", side: "right"}}}
      ]}
      onClick = {(data) => {
        var pts = '';
        for(var i=0; i < data.points.length; i++){
          pts = data.points[i].location;
        }
        window.location.href = '/county/' + pts;
      }}
      layout = {{
        geo: {scope: 'usa'},
        width: 1200,
        height: 700,
        margin: {t: 0, b: 0}
      }}
      />
      );
    }
  }
