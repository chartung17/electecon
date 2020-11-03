import React, { useState } from 'react';
import CountyTrends from './CountyTrends';
import StateTrends from './StateTrends';
import NationalTrends from './NationalTrends';

/**
 * Display Trending page
 */
function Trends() {
  
  const [granularity, setGranularity] = useState(null);

  document.title = `Trends`;

  let trendChoice;
  if (granularity === "National") {
    trendChoice = <NationalTrends />;
  } else if (granularity === "State") {
    trendChoice = <StateTrends />;
  } else if (granularity === "County") {
    trendChoice = <CountyTrends />;
  }
  return(
    <div id="TrendPage">
      <button onClick={() => setGranularity("National")}>See National Trends</button>
      <button onClick={() => setGranularity("State")}>See State Trends</button>
      <button onClick={() => setGranularity("County")}>See County Trends</button>
      {trendChoice}
    </div>
  );

  
}

export default Trends;
