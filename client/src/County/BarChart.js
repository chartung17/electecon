import React from "react";
import './styles/BarChart.css'

/**
 * Creates horizontal bar chart
 *
 * Props:
 * - title: str, title of the chart
 * - idPrefix: str, prefix to chart element's id
 * - unit: str, unit of measurement
 * - barColor: str, color of the bar
 * - maxValue: number, the maximum value to be displayed
 * - scale: decimal 0-1, how much the max value bar occupies the horizontal space
 * - data: {value: number, desc: str description of the value, icon: path}
 *
 */
export default class BarChart extends React.Component {
    render() {
        return (
            <div className={"barchart-container"}>
                <div className={"barchart-title"}>{this.props.title}</div>
                <table className={"barchart-table"}>
                    <colgroup>
                        <col className={"barchart-table-col-1"}/>
                        <col className={"barchart-table-col-2"}/>
                        <col className={"barchart-table-col-3"}/>
                    </colgroup>
                    <thead>
                    <tr>
                        <td colSpan={2}/>
                        <td className={"barchart-table-unit-header"}><b>{this.props.unit}</b></td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.data.map((value, index) => {
                        if (value["desc"] === "") return null;
                        let barWidth = this.props.scale * Math.max(0, Math.round(value["value"] / this.props.maxValue * 100)) + '%';

                        return (
                            <tr key={index}>
                                <td>
                                    <div>
                                        <img className={"barchart-table-image"} src={value["icon"]}
                                             alt={value["Description"]}
                                        />
                                        <p id={`${this.props.idPrefix}-desc-${index}`}
                                           className={"barchart-table-image-caption"}>
                                            {value["desc"]}
                                        </p>
                                    </div>
                                </td>
                                <td className={"barchart-table-bar-container"}>
                                    <div className={"barchart-table-bar"}
                                         style={{background: this.props.barColor, width: barWidth}}>
                                        &nbsp;
                                    </div>
                                </td>
                                <td id={`${this.props.idPrefix}-value-${index}`}>
                                    {value["value"].toFixed(1)}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}
