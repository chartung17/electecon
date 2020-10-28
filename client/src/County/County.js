import React, {Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './County.css'
import EconomyPanel from "./EconomyPanel";
import ElectionPanel from "./ElectionPanel";
import CountyFinder from "./CountyFinder";
import {COUNTY_ENDPOINT as ENDPOINT} from '../App';
import {getCountyElectionResult} from "./CountyApi";

const C = require('./Constants')
require('dotenv').config()
export const ASSETS_PATH = process.env.PUBLIC_URL + `/assets`;

export default class County extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countyName: C.PLACEHOLDER_COUNTY_NAME,
            countyState: C.PLACEHOLDER_COUNTY_STATE,
            gdpData: C.PLACEHOLDER_GDP_DATA,
            fastestGrowingIndustry: C.PLACEHOLDER_GROWING_INDUSTRY,
            topIndustry: C.PLACEHOLDER_TOP_INDUSTRY,
            electionResult: C.PLACEHOLDER_ELECTION_RESULT,
            GDPGrowthPercentile: C.PLACEHOLDER_GDP_GROWTH_PERCENTILE,
            stateGDPRank: C.PLACEHOLDER_STATE_GDP_RANK,
            countyVotingForParty: C.PLACEHOLDER_COUNTY_VOTING_FOR_PARTY,
            numCountyInState: C.PLACEHOLDER_NUM_COUNTY_IN_STATE,
        }
        document.title = 'County Details'
    }

    componentDidMount() {
        if (this.props.match !== undefined && this.props.match.params.fips !== undefined) {
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
                    this.setState({
                        countyName: C.PLACEHOLDER_COUNTY_NAME,
                        countyState: C.PLACEHOLDER_COUNTY_STATE
                    });
                    document.title = `County Details`;
                } else {
                    this.setState({countyName: row[0]["NAME"], countyState: row[0]["STATE"]})
                    window.history.pushState({}, null, process.env.PUBLIC_URL + `/county/${fips}`);
                    document.getElementById("county-profile").scrollIntoView();
                }
                document.title = `${this.state.countyName}, ${this.state.countyState} - County Details`
            });

        // Get county elections result
        getCountyElectionResult(fips, ERR_HANDLER).then(electionData => {
            this.setState({electionResult: electionData});
        })
            
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
                    this.setState({fastestGrowingIndustry: C.PLACEHOLDER_GROWING_INDUSTRY});
                } else {
                    let data = [];
                    for (let i of [...Array(row.length).keys()]) {
                        data.push({"Description": row[i]["Description"], "Growth": row[i]["Growth"]})
                    }
                    this.setState({fastestGrowingIndustry: data});
                }
            });

        // Get county's avg. GDP growth national percentile (among counties)
        fetch(ENDPOINT.concat(`/gdp-growth-percentile?fips=${fips}`))
            .then(res => {
                return res.json();
            }, this.ERR)
            .then(row => {
                if (row === undefined || row === null || row.length === 0) {
                    // revert to default data
                    this.setState({GDPGrowthPercentile: C.PLACEHOLDER_GDP_GROWTH_PERCENTILE});
                } else {
                    let percentile = (row[0]["PERCENTILE"] * 100).toFixed(1) + '%';
                    this.setState({GDPGrowthPercentile: percentile});
                }
            });

        // Get county's GDP rank within the state
        fetch(ENDPOINT.concat(`/state-gdp-rank?fips=${fips}`))
            .then(res => {
                return res.json();
            }, this.ERR)
            .then(row => {
                if (row === undefined || row === null || row.length === 0) {
                    // revert to default data
                    this.setState({stateGDPRank: C.PLACEHOLDER_STATE_GDP_RANK});
                } else {
                    let rank = `${row[0]["COUNTY_GDP_RANK"]} / ${row[0]["STATE_COUNTY_COUNT"]}`;
                    this.setState({stateGDPRank: rank, numCountyInState: row[0]["STATE_COUNTY_COUNT"]});
                }
            });

        // Get the fips and county name within the same state where
        // the party winning the 2016 election in this county also won in those counties.
        fetch(ENDPOINT.concat(`/county-voting-for-party?fips=${fips}`))
            .then(res => {
                return res.json();
            }, this.ERR)
            .then(row => {
                if (row === undefined || row === null || row.length === 0) {
                    // revert to default data
                    this.setState({countyVotingForParty: C.PLACEHOLDER_COUNTY_VOTING_FOR_PARTY});
                } else {
                    this.setState({countyVotingForParty: row});
                }
            });
    }

    render() {
        return (
            <Fragment>
                <CountyFinder getNewCounty={this.getNewCounty}/>
                <div id={"county-profile"}/>
                {this.state.countyName === C.PLACEHOLDER_COUNTY_NAME ? null :
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
            </Fragment>
        );
    }
};
