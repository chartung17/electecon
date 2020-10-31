import React from "react";
import ElectionSummary from "./ElectionSummary"
import ElectionResults from "./ElectionResults";

export default class ElectionPanel extends React.Component {
    render() {
        return (
            <div className={"col-sm election-panel"}>
                <div className={"election-panel-title"}>
                    Elections
                </div>
                {this.props.electionResult[0]["TotalVote"] === 0 ? null : <ElectionSummary {...this.props} />}
                <ElectionResults {...this.props}/>
            </div>
        );
    }
}