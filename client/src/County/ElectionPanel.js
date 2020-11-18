import React from "react";
import ElectionSummary from "./ElectionSummary"
import ElectionResults from "./ElectionResults";
import {getPartyPreference, isElectionDataValid} from "./helper";
import Spectrum from "./Spectrum";
import './styles/ElectionPanel.css'

/**
 * Display county's election details.
 */
export default class ElectionPanel extends React.Component {
    render() {
        if (!isElectionDataValid(this.props.electionResult)) {
            return (
                <div className={"col-sm election-panel"}>
                    <div className={"election-panel-title"}>
                        Elections
                    </div>
                    <p id={"data-unavailable-warning"}>
                        Sorry, election data for this county is incomplete or currently unavailable.
                    </p>
                </div>
            );
        }

        return (
            <div className={"col-sm election-panel"}>
                <div className={"election-panel-title"}>
                    Elections
                </div>

                <Spectrum
                    label={{
                        "0": {label: "Democrats", style: {textAlign: "left"}},
                        "1": {label: "Lean Dem", style: {textAlign: "left"}},
                        "2": {label: "Swing", style: {textAlign: "center"}},
                        "3": {label: "Lean Rep", style: {textAlign: "right"}},
                        "4": {label: "Republican", style: {textAlign: "right"}},
                    }}
                    value={getPartyPreference(this.props.electionResult)}
                    color={"blue, lightblue, lightpink, red"}
                />
                <ElectionSummary {...this.props} />
                <ElectionResults {...this.props}/>
            </div>
        );
    }
}
