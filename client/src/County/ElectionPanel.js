import React, {Fragment} from "react";
import {CANDIDATE_IMAGE} from "./Constants"
import {getStats, getPartyPreference} from './helper';

export default class ElectionPanel extends React.Component {
    render() {
        let electionResult = this.props.electionResult;
        let preference = getPartyPreference(electionResult);
        let stats = getStats(electionResult);

        return (
            <div className={"col-sm election-panel"}>
                <div className={"election-panel-title"}>
                    Elections
                </div>
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
                    {this.props.electionResult[0]["TotalVote"] === 0 ? null :
                        <Fragment>
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
                                        <li id={"elec-points-0"}>{stats["WinnerParty"]} candidates
                                            won {stats["WinnerCount"]} out of the
                                            last 5 general elections
                                            in {this.props.countyName} County, {this.props.countyState}.
                                        </li>
                                        <li id={"elec-points-1"}>The {stats["WinnerParty"]} winners, on average, lead
                                            by {stats["WinnerLead"].toFixed(1)} percentage point.
                                        </li>
                                        <li id={"elec-points-2"}>{stats["LastNumVotes"]} in {this.props.countyName} County
                                            voted
                                            2016 election,
                                            a {(stats["NumVoteChangePct2012"]).toFixed(1)}% {stats["NumVoteChangePct2012"] > 0 ? 'increase' : 'decrease'} to
                                            that of
                                            2012,
                                            a {(stats["NumVoteChangePct2001"]).toFixed(1)}% {stats["NumVoteChangePct2001"] > 0 ? 'increase' : 'decrease'} to
                                            that of
                                            2001.
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
                                                out of the {this.props.numCountyInState} counties in
                                                the {this.props.countyState}.
                                            </li>
                                        }
                                    </ul>
                                </td>

                            </tr>
                        </Fragment>
                    }
                    </tbody>
                </table>
                <table className={"election-table"}>
                    <tbody>
                    {electionResult.map((value, index) => {
                        let totalVote = parseInt(value["TotalVote"])
                        let demPct = parseInt(value["DemVote"]) * 100 / totalVote;
                        let repPct = parseInt(value["RepVote"]) * 100 / totalVote;
                        let demBarWidth = Math.round(demPct)
                        let repBarWidth = Math.round(repPct)

                        return (
                            <Fragment key={index}>

                                <tr className={"election-table-year-container"}>
                                    <td/>
                                    <td className={"election-table-year"} colSpan={2}>
                                        <h3>{value["Year"]}</h3></td>
                                    <td/>
                                </tr>
                                <tr className={"election-table-result-container"} key={index}>
                                    <td className={"headshot-container"}>
                                        <img
                                            src={require(`../assets/images/candidate/${CANDIDATE_IMAGE[value["DemCandidate"]]}`)}
                                            alt={value["DemCandidate"]}
                                            className={"headshot"}
                                        />
                                        {value["DemCandidate"]}
                                    </td>
                                    <td className={"democrat-results-container"}>
                                        {
                                            (totalVote === 0 || demPct < repPct) ? null :
                                                <img
                                                    src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Checkmark_green.svg"
                                                    alt="" className={"democrat-vote-checkmark"}
                                                    style={{marginLeft: `${Math.min(77, 100 - demBarWidth + 5)}%`}}
                                                />
                                        }
                                        <div className={"democrat-vote-bar"}
                                             style={{marginLeft: `${100 - Math.round(demBarWidth)}%`}}>
                                            &nbsp;
                                        </div>
                                        <div id={`elec-dem-pct-${index}`}>
                                            {(totalVote === 0 ? 0 : demPct.toFixed(1)) + "%"}
                                        </div>
                                        <div id={`elec-dem-vote-${index}`}>({value["DemVote"]})</div>
                                    </td>

                                    <td className={"republican-results-container"}>
                                        {(totalVote === 0 || demPct > repPct) ? null :
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Checkmark_green.svg"
                                                alt=""
                                                className={"republican-vote-checkmark"}
                                                style={{marginRight: `${Math.min(77, 100 - repBarWidth)}%`}}
                                            />
                                        }
                                        <div className={"republican-vote-bar"} style={{width: repBarWidth + '%'}}>
                                            &nbsp;
                                        </div>
                                        <div id={`elec-rep-pct-${index}`}>
                                            &nbsp; {(totalVote === 0 ? 0 : repPct.toFixed(1)) + "%"}
                                        </div>
                                        <div id={`elec-rep-vote-${index}`}
                                        >&nbsp; ({value["RepVote"]})
                                        </div>
                                    </td>
                                    <td className={"headshot-container"}>
                                        <img
                                            src={require(`../assets/images/candidate/${CANDIDATE_IMAGE[value["RepCandidate"]]}`)}
                                            alt={value["RepCandidate"]}
                                            className={"headshot"}/>
                                        {value["RepCandidate"]}
                                    </td>
                                </tr>
                            </Fragment>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}
