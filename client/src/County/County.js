import React, {Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './County.css'
import EconomyPanel from "./EconomyPanel";
import ElectionPanel from "./ElectionPanel";
import CountyFinder from "./CountyFinder";
const C = require('./Constants')
require('dotenv').config()

const API_HOST = process.env.REACT_APP_API_HOST || "localhost";
const API_PORT = process.env.REACT_APP_API_PORT || 5000;

export const ENDPOINT = `http://${API_HOST}:${API_PORT}/api/v1/county`;

export default class County extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countyName: "",
            countyState: "",
            gdpData: C.PLACEHOLDER_GDP_DATA,
            growingIndustry: C.PLACEHOLDER_GROWING_INDUSTRY,
            topIndustry: C.PLACEHOLDER_TOP_INDUSTRY,
            electionResult: C.PLACEHOLDER_ELECTION_RESULT,
        }
        document.title = 'County Details'
    }

    componentDidMount () {
        if (this.props.match !== undefined && this.props.match.params.fips !== undefined){
            this.getNewCounty(this.props.match.params.fips)
        }
    }

    getNewCounty = (fips) => {
        let ERR_HANDLER = (err) => {
            console.log(err)
        };

        // Get county name, state
        fetch(ENDPOINT.concat(`/counties?fips=${fips}`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER)
            .then(row => {
                if (row === undefined || row === null || row.length === 0) {
                    // revert to default data
                    this.setState({countyName: "County Name", countyState: "State"});
                    document.title = `County Details`
                    this.props.history.push(`/county`)
                } else {
                    this.setState({ countyName: row[0]["NAME"], countyState: row[0]["STATE"],
                    })
                    this.props.history.push(`/county/${fips}`)
                }
                document.title = `${this.state.countyName}, ${this.state.countyState} - County Details`
            });

        // Get county elections result
        fetch(ENDPOINT.concat(`/elections?fips=${fips}`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER)
            .then(row => {
                if (row === undefined || row === null || row.length === 0) {
                    // revert to default data
                    this.setState({electionResult: C.PLACEHOLDER_ELECTION_RESULT});
                } else {
                    let data = [];
                    for (let i of [...Array(row.length / 2).keys()]) {
                        let d_dem = row[i * 2];
                        let d_rep = row[i * 2 + 1];
                        data.push(
                            {
                                "Year": d_dem["YEAR"],
                                "DemCandidate": d_dem["CANDIDATE_NAME"],
                                "RepCandidate": d_rep["CANDIDATE_NAME"],
                                "DemVote": d_dem["CANDIDATE_VOTES"],
                                "RepVote": d_rep["CANDIDATE_VOTES"],
                                "TotalVote": d_dem["TOTAL_VOTES"]      // same as d_rep["TOTAL_VOTES"]
                            }
                        );
                    }
                    this.setState({electionResult: data});
                }
            });

        // Get county's yearly gdp (all industries)
        fetch(ENDPOINT.concat(`/annual-gdp?fips=${fips}`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER)
            .then(row => {
                if (row === undefined || row === null || row.length === 0) {
                    // revert to default data
                    this.setState({gdpData: C.PLACEHOLDER_GDP_DATA});
                } else {
                    let data = [];
                    for (let i of [...Array(row.length).keys()]) {
                        data.push(row[i]["GDP"])
                    }
                    this.setState({gdpData: data});
                }
            });

        // Get top 5 industries by size in 2018
        fetch(ENDPOINT.concat(`/top-industry?fips=${fips}`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER)
            .then(row => {
                if (row === undefined || row === null || row.length === 0) {
                    // revert to default data
                    this.setState({topIndustry: C.PLACEHOLDER_TOP_INDUSTRY});
                } else {
                    let data = [];
                    for (let i of [...Array(row.length).keys()]) {
                        data.push({"Description": row[i]["Description"], "GDP": row[i]["GDP"]})
                    }
                    this.setState({topIndustry: data});
                }
            });

        // Get top 5 industries by 2001-2018 CAGR
        fetch(ENDPOINT.concat(`/growing-industry?fips=${fips}`))
            .then(res => {
                return res.json();
            }, this.ERR)
            .then(row => {
                if (row === undefined || row === null || row.length === 0) {
                    // revert to default data
                    this.setState({growingIndustry: C.PLACEHOLDER_GROWING_INDUSTRY});
                } else {
                    let data = [];
                    for (let i of [...Array(row.length).keys()]) {
                        data.push({"Description": row[i]["Description"], "Growth": row[i]["Growth"]})
                    }
                    this.setState({growingIndustry: data});
                }
            });
    }

    render() {
        return (
            <Fragment>
                <CountyFinder getNewCounty={this.getNewCounty}/>
                <div id={"county-profile"}/>
                <h2>County Profile</h2>
                <div className={"county-details container"}>
                    <div className={"county-name jumbotron"}>
                        {this.state.countyName === "" ? "County Name, State" :
                            `${this.state.countyName}, ${this.state.countyState}`}
                    </div>

                    <div className={"panel-container container"}>
                        <div className={"row"}>
                            <EconomyPanel
                                gdpData={this.state.gdpData}
                                topIndustry={this.state.topIndustry}
                                fastestGrowthIndustry={this.state.growingIndustry}
                            />
                            <ElectionPanel electionResult={this.state.electionResult}/>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};
