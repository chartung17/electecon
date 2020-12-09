import React from 'react';
import Chart from "react-google-charts";

/**
 * Display a graph of gdp data
 * @param  {} props gdpdata
 */

function GDPGraph(props) {

    if (!props.gdpData || props.gdpData.length === 0) {
        return (
            <div id="GDPGraph">No GDP data found.</div>
        )
    }

    let formattedData = [['Year', 'GDP (millions of dollars)']];
    for (let entry of props.gdpData) {
        formattedData.push([entry.YEAR, entry.GDP]);
    }
    

    return(
        <div id="GDPGraph">
            <Chart 
                chartType="LineChart" 
                loader={<div>Loading GDP Data</div>}
                data={formattedData}
                options={{
                    title: 'GDP Trends',
                    vAxis: {title: 'GDP (millions of dollars)'},
                    hAxis: {title: 'Year', format: '####', ticks: [2000, 2004, 2008, 2012, 2016], textStyle: {fontSize: 12}},
                    chartArea: {width: '60%', height: '70%'},
                }}
            />
        </div>
    );
}

export default GDPGraph;