import React from 'react';
import Chart from 'react-google-charts';

function IndustryGraph(props) {

    if (!props.gdp || !props.industryGDP || props.gdp.length !== props.industryGDP.length) {
        return (
            <div id="IndustryGraph">No industry data found.</div>
        )
    }

    let rawIndustryGDPdata = [['Year', 'industryGDP']];
    let proportionalGDPdata = [['Year', 'fraction of total GDP']];
    for (let i = 0; i < props.gdp.length; i++) {
        let industry = props.industryGDP[i];
        let gdp = props.gdp[i];
        // skip this entry if years don't match
        if (industry.year !== gdp.year) continue;
        let proportion = parseFloat(industry.GDP) / parseFloat(gdp.GDP);
        // validate that years match and proportion calculations are correct
        if (!isNaN(proportion)) {
            rawIndustryGDPdata.push([industry.YEAR, industry.GDP]);
            proportionalGDPdata.push([industry.YEAR, proportion ]);
        }
    }

    if (rawIndustryGDPdata.length === 1) {
        return(
            <div id="IndustryGraph">
                No industry GDP data found.
            </div>
        );
    } 

    return(
        <div id="IndustryGraph">
            <div className="card">
                <div className="card-body">
                <Chart
                    chartType="LineChart"
                    loader={<div>Loading Industry GDP data</div>}
                    data={rawIndustryGDPdata}
                    options={{
                        title: 'Industry GDP Trends',
                        vAxis: {title: 'GDP'},
                        hAxis: {title: 'Year', format: '####', ticks: [2000, 2004, 2008, 2012, 2016], textStyle: {fontSize: 12}},
                        chartArea: {width: '60%', height: '70%'},
                    }}
                />
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                <Chart
                    chartType="LineChart"
                    loader={<div>Loading Industry GDP data</div>}
                    data={proportionalGDPdata}
                    options={{
                        vAxis: {title: 'fraction of total GDP'},
                        hAxis: {title: 'Year', format: '####', ticks: [2000, 2004, 2008, 2012, 2016], textStyle: {fontSize: 12}},
                        chartArea: {width: '60%', height: '70%'},
                    }}
                />
                </div>
            </div>
            
        </div>
    );

}

export default IndustryGraph;