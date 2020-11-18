import React from "react";
import './styles/Spectrum.css'

export default class Spectrum extends React.Component {
    render() {
        return (
            <table className={"spectrum-table"}>
                <tbody>
                    <tr className={"spectrum-container"}>
                        {Object.keys(this.props.label).map((key) => {
                            return <td style={this.props.label[key]["style"]} key={key}>
                                <b>
                                    {this.props.label[key]["label"]}
                                </b>
                            </td>;
                        })}
                    </tr>
                    <tr>
                        <td colSpan={Object.keys(this.props.label).length}
                            style={{backgroundImage: `linear-gradient(to right, ${this.props.color})`}}
                        >
                            &nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={Object.keys(this.props.label).length}>
                            {/* -3.5% is 0%; 96.5% is 100% */}
                            <div className="arrow-up"
                                 style={{marginLeft: `${this.props.value - 3.5}%`}}>&nbsp;</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
