import React, {Fragment} from "react";
import './styles/DataTile.css'
import DataTileRow from "./DataTileRow";

/**
 * Display data in tile format.
 *
 * Props:
 * - title: str
 * - data: [
 *          [{id: str element id,
 *          type: "value" or "icon",
 *          title: str name of the data,
 *          value: str
 *          }, ..., {...}]     // row one
 *         , ..., [...]        // subsequent rows
 *        ]
 */
export default class DataTile extends React.Component {
    render() {
        return (
            <div className={"data-tile-container"}>
                <div className={"title data-tile-container-title"}>
                    {this.props.title}
                </div>
                <table>
                    <tbody>
                    {this.props.data.map((data, index) => {
                        return (
                            <Fragment key={index}>
                                <DataTileRow
                                    data={data}/>
                                {(index === this.props.data.length - 1) ?
                                    null :
                                    (<tr><td>&nbsp;</td></tr>)}
                            </Fragment>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}
