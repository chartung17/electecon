import React, {Fragment} from "react";
import './styles/DataTileRow.css'

/**
 * Data tile row group
 *
 * Props:
 * - data: [
 *          {id: str element id,
 *          type: "value" or "icon",
 *          title: str name of the data,
 *          value: str
 *          }, ..., {...}]
 */
export default class DataTileRow extends React.Component {
    render() {
        return (
            <Fragment>
                <tr>
                    {this.props.data.map((value, index) => {
                        return (
                            <Fragment key={index}>
                                <td className={"data-tile-title"}>{value["title"]}</td>
                                {index === this.props.data.length - 1 ? null :
                                    <td className={"data-tile-separator"}/>
                                }
                            </Fragment>
                        )
                    })}
                </tr>
                <tr>
                    {this.props.data.map((value, index) => {
                        return (
                            <Fragment key={index}>
                                <td id={value["id"]} className={"data-tile"}>
                                    {value["type"] === "value" ? value["value"] :
                                        <Fragment>
                                            <img
                                                className={"data-tile-image"}
                                                src={value["src"]}
                                                alt={value["caption"]}
                                            />
                                            <div className={"data-tile-image-caption"}>
                                                {value["caption"]}
                                            </div>
                                        </Fragment>
                                    }
                                </td>
                                {index === this.props.data.length - 1 ? null : <td/>}
                            </Fragment>
                        )
                    })}
                </tr>
            </Fragment>
        );
    }
}
