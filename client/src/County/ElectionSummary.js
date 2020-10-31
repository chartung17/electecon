import React from "react";
import {getPartyPreference, getStats} from "./helper";

export default class ElectionSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let electionResult = this.props.electionResult;
        let preference = getPartyPreference(electionResult);
        let stats = getStats(electionResult);

        return (
            <table className={"election-table"}>
                <tbody>
                <tr className={"election-table-year-container"}>
                    <td style={{textAlign: "left"}}><b>Democrats</b></td>
                    <td style={{textAlign: "left"}}><b>Lean Dem</b></td>
                    <td style={{textAlign: "center"}}><b>Swing</b></td>
                    <td style={{textAlign: "right"}}><b>Lean Rep</b></td>
                    <td style={{textAlign: "right"}}><b>Republican</b></td>
                </tr>
                <tr>
                    <td colSpan={5}
                        style={{backgroundImage: "linear-gradient(to right, blue, lightblue, lightpink, red)"}}>
                        &nbsp;
                    </td>
                </tr>
                <tr>
                    <td colSpan={"5"}>
                        {/* -3.5% is 0%; 96.5% is 100% */}
                        <div className="arrow-up"
                             style={{marginLeft: `${preference - 3.5}%`}}>&nbsp;</div>
                    </td>
                </tr>

                <tr>
                    <td>&nbsp;</td>
                </tr>

                <tr>
                    <td colSpan={"5"} style={{textAlign: "justify"}}>
                        <ul>
                            <li id={"elec-points-0"}>{stats["WinnerParty"]} candidates won {stats["WinnerCount"]} out of
                                the
                                last 5 general elections in {this.props.countyName} County, {this.props.countyState}.
                            </li>
                            <li id={"elec-points-1"}>The {stats["WinnerParty"]} winners, on average, lead
                                by {stats["WinnerLead"].toFixed(1)} percentage point.
                            </li>
                            <li id={"elec-points-2"}>
                                {stats["LastNumVotes"]} in {this.props.countyName} County voted 2016 election,
                                a {(stats["NumVoteChangePct2012"]).toFixed(1)}% {stats["NumVoteChangePct2012"] > 0 ? 'increase' : 'decrease'} to
                                that of 2012,
                                a {(stats["NumVoteChangePct2001"]).toFixed(1)}% {stats["NumVoteChangePct2001"] > 0 ? 'increase' : 'decrease'} to
                                that of 2001.
                            </li>
                            {this.props.countyVotingForParty.length - 1 === 0 ?
                                <li id={"elec-points-3"}>
                                    {this.props.countyName} County is the only county
                                    (out of {this.props.numCountyInState}) in {this.props.countyState} where
                                    the {stats["WinnerParty"]} candidate won.
                                </li>
                                :
                                <li id={"elec-points-3"}>
                                    {this.props.countyName} County
                                    joins {this.props.countyVotingForParty.length - 1} other
                                    counties in {this.props.countyState} that pre-dominantly voted
                                    for {stats["WinnerParty"]} candidate in 2016,
                                    out of the {this.props.numCountyInState} counties in {this.props.countyState}.
                                </li>
                            }
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }
}