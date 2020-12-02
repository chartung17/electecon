import React, { useState } from 'react';
import ScatterGraph from './ScatterGraph';
import BarGraph from './BarGraph';

import {GRAPH_ENDPOINT as ENDPOINT} from '../App';

/**
 * Display Trending page
 */
function Graph() {
  
  const [granularity, setGranularity] = useState(null);

  document.title = `Graph`;

  let graphChoice;
  if (granularity === "Scatter") {
    graphChoice = <ScatterGraph />;
  } else if (granularity === "Bar") {
    graphChoice = <BarGraph />;
  }
  return(
    <div id="GraphPage">
      <button onClick={() => setGranularity("Scatter")}>Scatterplot</button>
      <button onClick={() => setGranularity("Bar")}>Bar Graph</button>
      {graphChoice}
    </div>
  );

  
}

export default Graph;