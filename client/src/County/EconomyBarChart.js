import React from "react";

export default class EconomyBarChart extends React.Component {
    render() {
        return (
            <div className={"econ-barchart-container"}>
                <div className={"econ-barchart-title"}>{this.props.title}</div>
                <table className={"econ-barchart-table"}>
                    <colgroup>
                        <col className={"econ-barchart-table-col-1"}/>
                        <col className={"econ-barchart-table-col-2"}/>
                        <col className={"econ-barchart-table-col-3"}/>
                    </colgroup>
                    <thead>
                    <tr>
                        <td colSpan={2}/>
                        <td className={"econ-barchart-table-pct-header"}><b>{this.props.unit}</b></td>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.data.map((value, index) => {
                        if (value["desc"] === "") return null;
                        let barWidth = this.props.scale * Math.max(0, Math.round(value["pct"] / this.props.maxValue * 100)) + '%';

                        return (
                            <tr key={index}>
                                <td>
                                    <div>
                                        <img className={"econ-barchart-table-image"} src={value["icon"]}
                                             alt={value["Description"]}
                                        />
                                        <p id={`${this.props.idPrefix}-desc-${index}`}
                                           className={"econ-barchart-table-image-caption"}>
                                            {value["desc"]}
                                        </p>
                                    </div>
                                </td>
                                <td className={"econ-barchart-table-bar-container"}>
                                    <div className={"econ-barchart-table-bar"}
                                         style={{background: this.props.barColor, width: barWidth}}>
                                        &nbsp;
                                    </div>
                                </td>
                                <td id={`${this.props.idPrefix}-value-${index}`}>
                                    {value["pct"].toFixed(1)}
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