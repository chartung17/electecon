import React, {Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/County.css'
import EconomyPanel from "./EconomyPanel";
import ElectionPanel from "./ElectionPanel";
import CountyFinder from "./CountyFinder";
import {getCountyData} from "./CountyApi";
import LoadingText from "./LoadingText";

const C = require('./Constants')
require('dotenv').config()
export const ASSETS_PATH = process.env.PUBLIC_URL + `/assets`;

/**
 * Highest order component of the County details page.
 */
export default class County extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...C.PLACEHOLDER,
            isFetching: false,
            validCounty : true
        };
        document.title = 'County Details'
    }

    componentDidMount() {
        if (this.props.match !== undefined && this.props.match.params.fips !== undefined) {
            this.getNewCounty(this.props.match.params.fips);
        }
    }

    getNewCounty = (fips) => {
        this.setState({isFetching: true})

        getCountyData(fips).then((data) => {
            let newState = [];

            // flatten results
            for (const datum of data) {
                newState = {...newState, ...datum};
            }
            this.setState({...newState, isFetching: false});

            // set page title, window and scroll behavior
            if (newState["countyName"] === C.PLACEHOLDER["countyName"]) {
                this.setState({validCounty: false});
                document.title = `County Details`;
            } else {
                this.setState({validCounty: true});
                window.history.pushState({}, null, process.env.PUBLIC_URL + `/county/${fips}`);
                document.getElementById("county-profile").scrollIntoView();
                document.title = `${this.state.countyName}, ${this.state.countyState} - County Details`
            }
        });
    }

    render() {
        return (
            <Fragment>
                <CountyFinder getNewCounty={this.getNewCounty}/>
                <div id={"county-profile"}/>
                {(this.state.isFetching ||
                    this.state.countyName === C.PLACEHOLDER["countyName"]
                ) ? null :
                    <div id={"county-details"} className={"container"}>
                        <div id={"county-name-container"}>
                            <h1 id={"county-name"}>
                                {this.state.countyName === "" ? "County Name, State" :
                                    `${this.state.countyName}, ${this.state.countyState}`}
                            </h1>
                        </div>
                        <div className={"panel-container container"}>
                            <div className={"row"}>
                                <EconomyPanel {...this.state}/>
                                <ElectionPanel {...this.state}/>
                            </div>
                        </div>
                    </div>
                }
                {!this.state.isFetching ? null : (
                    <LoadingText
                        id={"fetching-message"}
                        style={{"paddingBottom":"40vh", "fontSize": "18pt"}}
                        text={"Fetching result"}
                    />
                )}
                {(this.state.isFetching || this.state.validCounty) ? null : (
                    <h4>
                        County not found.
                    </h4>
                )}
            </Fragment>
        );
    }
};
