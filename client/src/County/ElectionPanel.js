import React from "react";
import ElectionSummary from "./ElectionSummary"
import ElectionResults from "./ElectionResults";
import {getPartyPreference, isElectionDataValid} from "./helper";
import ElectionSpectrum from "./ElectionSpectrum";

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

                <table className={"election-table"}>
                    <tbody>
                    <ElectionSpectrum preference={getPartyPreference(this.props.electionResult)}/>
                    <tr>
                        <td>&nbsp;</td>
                    </tr>
                    <ElectionSummary {...this.props} />
                    </tbody>
                </table>

                <ElectionResults {...this.props}/>
            </div>
        );
    }
}