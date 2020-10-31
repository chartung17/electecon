import React from "react";
import {COUNTY_ENDPOINT as ENDPOINT} from '../App';
import {STATES} from './Constants'

export default class CountyFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {counties: []}
    }

    ERR = (err) => {
        console.log(err)
    };

    getCounties = (state) => {
        fetch(ENDPOINT.concat(`/counties?state=${state}`))
            .then(res => {
                return res.json();
            }, this.ERR)
            .then(rows => {
                if (rows === undefined || rows === null || rows.length === 0) {
                    this.setState({counties: []});
                } else {
                    let fipsNameList = rows.map((county, index) => {
                        return (
                            <div
                                id={`btn-county-${county.NAME}`}
                                className={"btn btn-county"}
                                key={index}
                                onClick={() => this.props.getNewCounty(county.FIPS)}>
                                {county.NAME}
                            </div>);
                    })
                    this.setState({counties: fipsNameList});
                }
            }, this.ERR)
    }


    render() {
        return (
            <div className={"county-finder container"}>
                <div id={"county-finder"} className={"row"}>
                    <h2><b>Find a county:</b></h2>
                </div>
                <div className={"row"}>
                    <table>
                        <tbody>
                        <tr id={"county-finder-state-container"}>
                            <td><b>State</b></td>
                            <td>
                                {
                                    STATES.map((state, index) => {
                                        return (
                                            <div className={"btn btn-state"} key={index}
                                                 onClick={() => this.getCounties(state)}
                                                 id={`btn-state-${state}`}>
                                                {state}
                                            </div>);
                                    })
                                }
                            </td>
                        </tr>
                        {this.state.counties.length === 0 ? null :
                            <tr id={"county-finder-state-container"}>
                                <td><b>County</b></td>
                                <td>
                                    {this.state.counties}
                                </td>
                            </tr>
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
