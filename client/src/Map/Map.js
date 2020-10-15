import React from 'react';
import Choropleth from './Choropleth';
require('dotenv').config()

const API_HOST = process.env.REACT_APP_API_HOST || "localhost";
const API_PORT = process.env.REACT_APP_API_PORT || 5000;

export const ENDPOINT = `http://${API_HOST}:${API_PORT}/api/v1/map`;

export default class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div><Choropleth /></div>
    );
  }
}
