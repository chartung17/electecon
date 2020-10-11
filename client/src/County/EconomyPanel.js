import React from 'react';
import Chart from "react-google-charts";
import './County.css'
import {INDUSTRY_ICON_LINKS} from "./Constants";

export default class EconomyPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let gdpData = this.props.gdpData;
        let topIndustry = this.props.topIndustry;
        let fastestGrowthIndustry = this.props.fastestGrowthIndustry;
        let growthChartData = [
            [
                {type: 'string', label: 'Year'},
                {type: 'number', label: 'Growth'},
            ],
        ]
        for (let i = 1; i < gdpData.length; i++) {
            growthChartData.push([(2001 + i) + "", 100 * ((gdpData[i] / gdpData[i - 1]) - 1)]);
        }

        return (
            <div className={"col-sm economy-panel"}>
                <div className={"economy-panel-title"}>
                    Economy
                </div>

                <div className={"gdp-aggr"}>
                    <table className={"gdp-aggr-table"}>
                        <thead>
                        <tr>
                            <td className={"gdp-aggr-title"}>{"GDP\n\n(2018)"}</td>
                            <td className={"gdp-aggr-separator"}/>
                            <td className={"gdp-aggr-title"}>{"Avg. Annual Growth\n(2001-2018)"}</td>
                            <td className={"gdp-aggr-separator"}/>
                            <td className={"gdp-aggr-title"}>{"Top Industry"}</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className={"total-gdp-number"}>${(gdpData[gdpData.length - 1] / 1E6).toFixed(1)} bn</td>
                            <td/>
                            <td className={"gdp-cagr-number"}>{
                                gdpData[0] === 0 ? "N/A" :
                                    (100 * (Math.pow((gdpData[gdpData.length - 1] / gdpData[0]), 1 / (gdpData.length)) - 1)).toFixed(2)
                            } %
                            </td>
                            <td/>
                            <td className={"top-industry-image-container"}>
                                <img
                                    className={"top-industry-image"}
                                    src={INDUSTRY_ICON_LINKS[topIndustry[0]["Description"]]}
                                    alt={topIndustry[0]["Description"]}
                                />
                                <div className={"top-industry-image-caption"}>
                                    {topIndustry[0]["Description"]}
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className={"gdp-growth-chart"} style={{borderTop: "solid 1pt lightgrey"}}>
                    <div className={"gdp-growth-chart-title"}>GDP Growth</div>
                    <Chart
                        chartType="LineChart"
                        loader={<div>Loading Chart</div>}
                        data={growthChartData}
                        options={{
                            legend: 'none',
                            vAxis: {title: '% YoY'},
                            backgroundColor: "#f7f7f7"
                        }}
                    />
                </div>

                <div className={"top-5-industries"} style={{borderTop: "solid 1pt lightgrey"}}>
                    <div className={"top-5-industries-title"}>Top 5 Industries</div>
                    <table>
                        <thead>
                        <tr>
                            <td/>
                            <td/>
                            <td className={"top-gdp-industry-pct"}><b>%GDP</b></td>
                        </tr>
                        </thead>
                        <tbody>
                        {topIndustry.map((value, index) => {
                            // make maxIndustryPct occupy at most 80% max-width
                            let rescale_factor = 0.8;
                            let maxIndustryPct = gdpData[gdpData.length - 1] === 0 ? 0 :
                                topIndustry[0]["GDP"] / gdpData[gdpData.length - 1] * 100;
                            let pct = gdpData[gdpData.length - 1] === 0 ? 0 :
                                value["GDP"] / gdpData[gdpData.length - 1] * 100;

                            return (
                                <tr key={index}>
                                    <td>{value["Description"]}</td>
                                    <td className={"top-gdp-bar-container"}>
                                        <div className={"top-gdp-bar"}
                                             style={{
                                                 width: maxIndustryPct === 0 ? 0 :
                                                     rescale_factor * Math.max(0, Math.round(pct / maxIndustryPct * 100))
                                                     + '%'
                                             }}>
                                            &nbsp;
                                        </div>
                                    </td>
                                    <td className={"top-gdp-industry-pct"}>
                                        {maxIndustryPct === 0 ? null : pct.toFixed(1)}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>

                <div className={"growing-industries"}>
                    <div className={"growing-industries-title"}>Fastest Growing Industries</div>
                    <table>
                        <thead>
                        <tr>
                            <td/>
                            <td/>
                            <td className={"growing-industry-pct"}><b>%</b></td>
                        </tr>
                        </thead>
                        <tbody>
                        {fastestGrowthIndustry.map((value, index) => {
                            // make maxGrowthPct occupy at most 80% max-width
                            let rescale_factor = 0.8;
                            let maxGrowthPct = parseFloat(fastestGrowthIndustry[0]["Growth"]);
                            let pct = parseFloat(value["Growth"]);
                            return (
                                <tr key={index}>
                                    <td>{value["Description"]}</td>
                                    <td className={"growing-industries-bar-container"}>
                                        <div className={"growing-industries-bar"}
                                             style={{
                                                 width: maxGrowthPct === 0 ? 0 :
                                                     rescale_factor * Math.max(0, Math.round(pct / maxGrowthPct * 100)) + '%'
                                             }}>
                                            &nbsp;
                                        </div>
                                    </td>
                                    <td className={"growing-industry-pct"}>{maxGrowthPct === 0 ? null : pct.toFixed(1)}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
