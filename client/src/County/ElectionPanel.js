import React, {Fragment} from "react";
import {HEADSHOTS_LINKS} from "./Constants"

export default class ElectionPanel extends React.Component {
    render() {
        let electionResult = this.props.electionResult;

        return (
            <div className={"col-sm election-panel"}>
                <div className={"election-panel-title"}>
                    Election Results
                </div>

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
                                            src={HEADSHOTS_LINKS[value["DemCandidate"]]}
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
                                                    style={{marginLeft: `${100 - demBarWidth + 5}px`}}
                                                />
                                        }
                                        <div className={"democrat-vote-bar"}
                                             style={{
                                                 width: `${toString(demBarWidth)}px`,
                                                 marginLeft: `${100 - demBarWidth}px`
                                             }}>
                                            &nbsp;
                                        </div>
                                        <div>
                                            {(totalVote === 0 ? 0 : demPct.toFixed(1)) + "%"}
                                        </div>
                                        <div>({value["DemVote"]})</div>
                                    </td>

                                    <td className={"republican-results-container"}>
                                        {(totalVote === 0 || demPct > repPct) ? null :
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Checkmark_green.svg"
                                                alt=""
                                                className={"republican-vote-checkmark"}
                                                style={{marginRight: `${100 - repBarWidth}px`}}
                                            />
                                        }
                                        <div className={"republican-vote-bar"}
                                             style={{width: repBarWidth + 'px'}}>
                                            &nbsp;
                                        </div>
                                        <div>
                                            &nbsp; {(totalVote === 0 ? 0 : repPct.toFixed(1)) + "%"}
                                        </div>
                                        <div>&nbsp; ({value["RepVote"]})</div>
                                    </td>
                                    <td className={"headshot-container"}>
                                        <img
                                            src={HEADSHOTS_LINKS[value["RepCandidate"]]}
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
