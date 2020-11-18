import React from 'react';
import Chart from "react-google-charts";
import BarChart from "./BarChart";
import DataTile from "./DataTile";
import {ASSETS_PATH} from "./County";
import {INDUSTRY_ICON} from "./Constants";
import {getGrowthChartData, isGDPDataValid, getTileData} from "./helper";
import './styles/EconomyPanel.css'

/**
 * Display county's economic details.
 *
 */
export default class EconomyPanel extends React.Component {
    render() {
        let gdpData = this.props.gdpData;
        if (!isGDPDataValid(gdpData)) {
            return (
                <div className={"col-sm economy-panel"}>
                    <div className={"economy-panel-title"}>
                        Economy
                    </div>
                    <p id={"data-unavailable-warning"}>
                        Sorry, economic data for this county is incomplete or currently unavailable.
                    </p>
                </div>
            );
        }

        const INDUSTRY_ICON_PATH = `${ASSETS_PATH}/icons/industry`;
        let tileData = getTileData({...this.props}, INDUSTRY_ICON_PATH);

        return (
            <div className={"col-sm economy-panel"}>
                <div className={"economy-panel-title"}>
                    Economy
                </div>

                <DataTile
                    title={"Overview"}
                    data={tileData}
                />

                <div id={"gdp-growth-chart"}>
                    <div className={"econ-subpanel-title"}>GDP Growth</div>
                    <Chart chartType="LineChart" data={getGrowthChartData(gdpData)}
                           options={{legend: 'none', vAxis: {title: '% YoY'},}}/>
                </div>

                <BarChart
                    title="Top 5 Industries"
                    idPrefix="top-gdp"
                    unit="%GDP"
                    barColor="blue"
                    maxValue={this.props.topIndustry[0]["GDP"] / gdpData[gdpData.length - 1] * 100}
                    scale={0.9}
                    data={
                        [this.props.topIndustry.map((value, index) => {
                            return {
                                value: value["GDP"] / gdpData[gdpData.length - 1] * 100,
                                desc: value["Description"],
                                icon: `${INDUSTRY_ICON_PATH}/${INDUSTRY_ICON[value["Description"]]}`
                            }
                        })
                        ][0]
                    }
                />

                <BarChart
                    title="Fastest Growing Industries"
                    idPrefix="growing-industry"
                    unit="%"
                    barColor="red"
                    maxValue={parseFloat(this.props.fastestGrowingIndustry[0]["Growth"])}
                    scale={0.9}
                    data={
                        [this.props.fastestGrowingIndustry.map((value, index) => {
                            return {
                                value: parseFloat(value["Growth"]),
                                desc: value["Description"],
                                icon: `${INDUSTRY_ICON_PATH}/${INDUSTRY_ICON[value["Description"]]}`
                            }
                        })
                        ][0]
                    }
                />
            </div>
        );
    }
}
