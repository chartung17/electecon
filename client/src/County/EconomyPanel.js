import React from 'react';
import Chart from "react-google-charts";
import './County.css'
import {INDUSTRY_ICON} from "./Constants";
import {ASSETS_PATH} from "./County";


export default class EconomyPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let INDUSTRY_ICON_PATH = `${ASSETS_PATH}/icons/industry`;
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

                <div className={"econ-tile-container"}>
                    <div className={"econ-subpanel-title"} style={{textAlign: "left", paddingBottom: "3vh"}}>Overview
                    </div>
                    <table className={"econ-tile-table"}>
                        <thead>
                        <tr>
                            <td className={"econ-tile-title"}>{"GDP\n\n(2018)"}</td>
                            <td className={"econ-tile-separator"}/>
                            <td className={"econ-tile-title"}>{"Avg. Annual Growth\n(2001-2018)"}</td>
                            <td className={"econ-tile-separator"}/>
                            <td className={"econ-tile-title"}>{"Top Industry"}</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td id={"total-gdp-number"} className={"econ-tile"}>
                                {gdpData[0] === 0 ? "N/A" :
                                    '$' + (gdpData[gdpData.length - 1] / 1E6).toFixed(1) + ' bn'
                                }
                            </td>
                            <td/>
                            <td id={"gdp-cagr-number"} className={"econ-tile"}>{
                                gdpData[0] === 0 ? "N/A" :
                                    (100 * (Math.pow((gdpData[gdpData.length - 1] / gdpData[0]), 1 / (gdpData.length)) - 1)).toFixed(2) + '%'
                            }
                            </td>
                            <td/>
                            <td className={"econ-tile"}>
                                {topIndustry[0]["Description"] === "" ? null :
                                <img
                                    className={"econ-tile-image"}
                                    src={`${INDUSTRY_ICON_PATH}/${INDUSTRY_ICON[topIndustry[0]["Description"]]}`}
                                    alt={topIndustry[0]["Description"]}
                                />
                                }
                                <div id={"top-industry-image-caption"} className={"econ-tile-image-caption"}>
                                    {topIndustry[0]["Description"]}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td className={"econ-tile-title"}>{"State GDP Rank"}</td>
                            <td className={"econ-tile-separator"}/>
                            <td className={"econ-tile-title"}>{"Avg. Annual Growth National Percentile"}</td>
                            <td className={"econ-tile-separator"}/>
                            <td className={"econ-tile-title"}>{"Fastest Growing Industry"}</td>
                        </tr>
                        <tr>
                            <td id={"state-gdp-rank"} className={"econ-tile"}>
                                {gdpData[0] === 0 ? "N/A" : this.props.stateGDPRank}
                            </td>
                            <td/>
                            <td id={"gdp-growth-percentile"} className={"econ-tile"}>
                                {gdpData[0] === 0 ? "N/A" : this.props.GDPGrowthPercentile}
                            </td>
                            <td/>
                            <td className={"econ-tile"}>
                                { fastestGrowthIndustry[0]["Description"] === "" ? null :
                                <img className={"econ-tile-image"}
                                     src={`${INDUSTRY_ICON_PATH}/${INDUSTRY_ICON[fastestGrowthIndustry[0]["Description"]]}`}
                                     alt={fastestGrowthIndustry[0]["Description"]}
                                />
                                }
                                <div id={"growing-industry-image-caption"} className={"econ-tile-image-caption"}>
                                    {fastestGrowthIndustry[0]["Description"]}
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div id={"gdp-growth-chart"}>
                    <div className={"econ-subpanel-title"}>GDP Growth</div>
                    <Chart
                        chartType="LineChart"
                        loader={<div>Loading Chart</div>}
                        data={growthChartData}
                        options={{legend: 'none', vAxis: {title: '% YoY'},}}
                    />
                </div>

                <div className={"econ-subpanel-container"}>
                    <div className={"econ-subpanel-title"}>Top 5 Industries</div>
                    <table className={"econ-subpanel-table"}>
                        <colgroup>
                            <col style={{width: "20%"}}/>
                            <col style={{width: "60%"}}/>
                            <col style={{width: "10%"}}/>
                        </colgroup>
                        <thead>
                        <tr>
                            <td/>
                            <td/>
                            <td className={"econ-subpanel-table-pct-header"}><b>%GDP</b></td>
                        </tr>
                        </thead>
                        <tbody>
                        {topIndustry.map((value, index) => {
                            // make maxIndustryPct occupy at most 90% max-width
                            let rescale_factor = 0.9;
                            let maxIndustryPct = gdpData[gdpData.length - 1] === 0 ? 0 :
                                topIndustry[0]["GDP"] / gdpData[gdpData.length - 1] * 100;
                            let pct = gdpData[gdpData.length - 1] === 0 ? 0 :
                                value["GDP"] / gdpData[gdpData.length - 1] * 100;

                            return (
                                <tr key={index}>
                                    <td>
                                        <div>
                                            { value["Description"] === "" ? null :
                                                <img className={"econ-subpanel-table-image"}
                                                     src={`${INDUSTRY_ICON_PATH}/${INDUSTRY_ICON[value["Description"]]}`}
                                                     alt={value["Description"]}
                                                />
                                            }
                                            <p id={`top-gdp-desc-${index}`} className={"econ-subpanel-table-image-caption"}>
                                                {value["Description"]}
                                            </p>
                                        </div>
                                    </td>
                                    <td className={"econ-subpanel-table-bar-container"}>
                                        <div className={"econ-subpanel-table-bar top-gdp-bar"}
                                             style={{
                                                 width: maxIndustryPct === 0 ? 0 :
                                                     rescale_factor * Math.max(0, Math.round(pct / maxIndustryPct * 100))
                                                     + '%'
                                             }}>
                                            &nbsp;
                                        </div>
                                    </td>
                                    <td id={`top-gdp-value-${index}`}>
                                        {maxIndustryPct === 0 ? null : pct.toFixed(1)}
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>

                <div className={"econ-subpanel-container"}>
                    <div className={"econ-subpanel-title"}>Fastest Growing Industries</div>
                    <table className={"econ-subpanel-table"}>
                        <colgroup>
                            <col style={{width: "20%"}}/>
                            <col style={{width: "60%"}}/>
                            <col style={{width: "10%"}}/>
                        </colgroup>
                        <thead>
                        <tr>
                            <td/>
                            <td/>
                            <td className={"econ-subpanel-table-pct"}><b>%</b></td>
                        </tr>
                        </thead>
                        <tbody>
                        {fastestGrowthIndustry.map((value, index) => {
                            // make maxGrowthPct occupy at most 90% max-width
                            let rescale_factor = 0.9;
                            let maxGrowthPct = parseFloat(fastestGrowthIndustry[0]["Growth"]);
                            let pct = parseFloat(value["Growth"]);
                            return (
                                <tr key={index}>
                                    <td>
                                        <div>
                                            { value["Description"] === "" ? null :
                                                <img className={"econ-subpanel-table-image"}
                                                     src={`${INDUSTRY_ICON_PATH}/${INDUSTRY_ICON[value["Description"]]}`}
                                                     alt={value["Description"]}
                                                />
                                            }
                                            <p id={`growing-industry-desc-${index}`} className={"econ-subpanel-table-image-caption"}>
                                                {value["Description"]}
                                            </p>
                                        </div>
                                    </td>
                                    <td className={"econ-subpanel-table-bar-container"}>
                                        <div className={"econ-subpanel-table-bar growing-industries-bar"}
                                             style={{
                                                 width: maxGrowthPct === 0 ? 0 :
                                                     rescale_factor * Math.max(0, Math.round(pct / maxGrowthPct * 100)) + '%'
                                             }}>
                                            &nbsp;
                                        </div>
                                    </td>
                                    <td id={`growing-industry-value-${index}`}>
                                        {maxGrowthPct === 0 ? null : pct.toFixed(1)}
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
