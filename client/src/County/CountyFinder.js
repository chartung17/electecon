import React from "react";
import {STATES} from './Constants'
import './styles/CountyFinder.css'
import {getCountiesInState} from "./CountyApi";
import {isEmpty} from "./helper";
import LoadingText from "./LoadingText";

/**
 * Display states and counties within chosen state.
 */
export default class CountyFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {counties: [], isFetching: false}
    }

    getCounties = (state) => {
        this.setState({isFetching: true});

        getCountiesInState(state)
            .then((counties) => {
                if (isEmpty(counties)) {
                    this.setState({counties: [], isFetching: false})
                }
                let buttonList = counties["counties"].map((county, index) => {
                    return (
                        <div
                            id={`btn-county-${county.NAME}`}
                            className={"btn btn-county"}
                            key={index}
                            onClick={() => this.props.getNewCounty(county.FIPS)}>
                            {county.NAME}
                        </div>
                    );
                });
                this.setState({counties: buttonList, isFetching: false})
            })
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
                        {!(this.state.counties.length === 0 && this.state.isFetching) ? null :
                            (
                                <tr id={"county-finder-state-container"}>
                                    <td><b>County</b></td>
                                    <td>
                                    <LoadingText
                                        style={{"textAlign": "center"}}
                                        text={"Fetching counties"}
                                    />
                                    </td>
                                </tr>
                            )}
                        {(this.state.counties.length === 0) ? null :
                            (
                                <tr id={"county-finder-state-container"}>
                                    <td><b>County</b></td>
                                    <td>{this.state.counties}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
