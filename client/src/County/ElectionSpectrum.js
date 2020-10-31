import React, {Fragment} from "react";

export default class ElectionSpectrum extends React.Component {
    render() {
        return (
            <Fragment>
                <tr className={"election-table-year-container"}>
                    <td className={"election-spectrum-dem-title"}><b>Democrats</b></td>
                    <td className={"election-spectrum-dem-title"}><b>Lean Dem</b></td>
                    <td className={"election-spectrum-swing-title"}><b>Swing</b></td>
                    <td className={"election-spectrum-rep-title"}><b>Lean Rep</b></td>
                    <td className={"election-spectrum-rep-title"}><b>Republican</b></td>
                </tr>
                <tr>
                    <td colSpan={5} className={"spectrum"}>
                        &nbsp;
                    </td>
                </tr>
                <tr>
                    <td colSpan={"5"}>
                        {/* -3.5% is 0%; 96.5% is 100% */}
                        <div className="arrow-up"
                             style={{marginLeft: `${this.props.preference - 3.5}%`}}>&nbsp;</div>
                    </td>
                </tr>
            </Fragment>
        );
    }

}