import React from 'react';
import Chart from "react-google-charts";
/**
 * Display a graph of election data
 * @param  {} props ElectionData object
 */
function ElectionGraph(props) {
    
    
    if (!props.data || props.data.length === 0) {
        return (
            <div id="ElectionGraph">No election data found.</div>
        )
    }
    

    let formattedData = [['Year', 'Democrat Votes', 'Republican Votes']];
    for (let election of props.data) {
        formattedData.push([election.Year, election.DemVote, election.RepVote]);
    }

    return(
        <div id="ElectionGraph">
            <Chart
                chartType="AreaChart"
                loader={<div>Loading Chart</div>}
                data={formattedData}
                options= {{
                    title: 'Election Trends',
                    vAxis: {title: 'Votes'},
                    hAxis: {title: 'Year', format: '####', ticks: [2000, 2004, 2008, 2012, 2016], textStyle: {fontSize: 12}},
                    chartArea: {width: '60%', height: '70%'},
                }}
            />
        </div>
    );
}

export default ElectionGraph;