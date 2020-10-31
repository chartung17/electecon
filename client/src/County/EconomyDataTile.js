import React, {Fragment} from "react";

export default class EconomyDataTile extends React.Component {
    render() {
        return (
            <Fragment>
                <tr>
                    {this.props.data.map((value, index) => {
                        return (
                            <Fragment key={index}>
                                <td className={"econ-tile-title"}>{value["title"]}</td>
                                {index === this.props.data.length - 1 ? null :
                                    <td className={"econ-tile-separator"}/>
                                }
                            </Fragment>
                        )
                    })}
                </tr>
                <tr>
                    {this.props.data.map((value, index) => {
                        return (
                            <Fragment key={index}>
                                <td id={value["id"]} className={"econ-tile"}>
                                    {value["type"] === "value" ? value["value"] :
                                        <Fragment>
                                            <img
                                                className={"econ-tile-image"}
                                                src={value["src"]}
                                                alt={value["caption"]}
                                            />
                                            <div id={"top-industry-image-caption"}
                                                 className={"econ-tile-image-caption"}>
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