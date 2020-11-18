import React from "react";
import {getStats} from "./helper";
import './styles/ElectionSummary.css'
import {YEAR} from "./Constants";

/**
 * Display election facts in bullet points.
 *
 */
export default class ElectionSummary extends React.Component {
    render() {
        let electionResult = this.props.electionResult;
        let stats = getStats(electionResult);

        return (
            <table className={"election-table"}>
                <tbody>
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
                                a {(stats["VotePctChangePenultimateElection"]).toFixed(1)}% {stats["VotePctChangePenultimateElection"] > 0 ? 'increase' : 'decrease'} to
                                that of {YEAR.election[YEAR.election.length - 2]},
                                a {(stats["VotePctChangeFirstElection"]).toFixed(1)}% {stats["VotePctChangeFirstElection"] > 0 ? 'increase' : 'decrease'} to
                                that of {YEAR.election[0]}.
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
