import React, { useEffect, useState }from 'react';
import CountyFinder from '../County/CountyFinder';
//import Plot from 'react-plotly.js';

const API_HOST = process.env.REACT_APP_API_HOST || "localhost";
const API_PORT = process.env.REACT_APP_API_PORT || 5000;
export const ENDPOINT = `http://${API_HOST}:${API_PORT}/api/v1`;

function Trends() {
  const [fips, setFips] = useState(null);

  // if fips changes, fetch new election results
  useEffect(() => {
    // do stuff
  }, [fips]); 

  return (
    <div >
      <CountyFinder getNewCounty={setFips}></CountyFinder>
    </div>
  );
}

export default Trends;
