import React, {Fragment} from "react";
import {CANDIDATE_IMAGE} from "./Constants";
import {ASSETS_PATH} from "./County";
import './styles/ElectionResults.css'

/**
 * Display past election results.
 *
 */
export default class ElectionResults extends React.Component {
    render() {
        let CANDIDATE_IMG_PATH = `${ASSETS_PATH}/images/candidate`;
        let CHECKMARK_ICON = `${ASSETS_PATH}/icons/other/checkmark.svg`;

        return (
            <table className={"election-table"}>
                <tbody>
                {this.props.electionResult.map((value, index) => {
                    let totalVote = parseInt(value["TotalVote"])
                    let demPct = parseInt(value["DemVote"]) * 100 / totalVote;
                    let repPct = parseInt(value["RepVote"]) * 100 / totalVote;
                    let demBarWidth = isNaN(demPct) ? 0 : Math.round(demPct);
                    let repBarWidth = isNaN(repPct) ? 0 : Math.round(repPct);
                    let repWon = demPct < repPct

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
                                        src={`${CANDIDATE_IMG_PATH}/${CANDIDATE_IMAGE[value["DemCandidate"]]}`}
                                        alt={value["DemCandidate"]}
                                        className={"headshot"}
                                    />
                                    {value["DemCandidate"]}
                                </td>
                                <td className={"democrat-results-container"}>
                                    {repWon ? null :
                                            <img
                                                src={CHECKMARK_ICON}
                                                alt="checkmark" className={"democrat-vote-checkmark"}
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
                                    <div id={`elec-dem-vote-${index}`}>
                                        ({value["DemVote"]})
                                    </div>
                                </td>
                                <td className={"republican-results-container"}>
                                    {!repWon ? null :
                                        <img src={CHECKMARK_ICON} alt="checkmark" className={"republican-vote-checkmark"}
                                             style={{marginRight: `${Math.min(77, 100 - repBarWidth)}%`}}
                                        />
                                    }
                                    <div className={"republican-vote-bar"} style={{width: repBarWidth + '%'}}>
                                        &nbsp;
                                    </div>
                                    <div id={`elec-rep-pct-${index}`}>
                                        &nbsp; {(totalVote === 0 ? 0 : repPct.toFixed(1)) + "%"}
                                    </div>
                                    <div id={`elec-rep-vote-${index}`}>
                                        &nbsp; ({value["RepVote"]})
                                    </div>
                                </td>
                                <td className={"headshot-container"}>
                                    <img
                                        src={`${CANDIDATE_IMG_PATH}/${CANDIDATE_IMAGE[value["RepCandidate"]]}`}
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
        );
    }
}
