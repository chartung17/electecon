import React, { useEffect, useState } from 'react';
import CountyFinder from '../County/CountyFinder';
//import Plot from 'react-plotly.js';

function Trends() {
  const [fips, setFips] = useState(null);

  // if fips changes, fetch new election results
  useEffect(() => {
    // call api to get election results
  }, [fips]); 

  return (
    <div >
      <CountyFinder getNewCounty={setFips}></CountyFinder>
    </div>
  );
}

export default Trends;
