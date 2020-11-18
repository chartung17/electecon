import {COUNTY_ENDPOINT as ENDPOINT} from '../App';
import {isEmpty} from "./helper";

const C = require('./Constants');

/**
 * Get promise of values of all the details of a county
 *
 * @param fips
 * @returns {Promise<unknown[]>}
 */
export function getCountyData(fips) {
    let apis = [
        getCountyNameState,
        getGDPGrowthPercentile,
        getStateGDPRank,
        getCountyVotingForParty,
        getCountyElectionResult,
        getCountyGDP,
        getCountyTopIndustries,
        getCountyGrowingIndustry,
    ];
    return Promise.all(apis.map((api) => {
        return api(fips)
    })).then((values) => {
        return values;
    });
}


/**
 * Given FIPS, get name of the county, state of the county.
 *
 * @param fips
 * @returns {Promise<{countyState: string, countyName: string}>}
 */
export function getCountyNameState(fips) {
    let result = {
        countyName: C.PLACEHOLDER["countyName"],
        countyState: C.PLACEHOLDER["countyState"]
    };

    return fetch(ENDPOINT.concat(`/counties?fips=${fips}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch county name, state data.')
            }
            return response.json();
        })
        .then(data => {
            if (!isEmpty(data)) {
                result["countyName"] = data[0]["NAME"];
                result["countyState"] = data[0]["STATE"];
            }
            return result;
        })
        .catch((error) => {
            console.error('ERROR: ', error)
        });
}

/**
 * Given FIPS, get annual GDP growth national percentile over available period.
 *
 * @param fips
 * @returns {Promise<{GDPGrowthPercentile: string}>}
 */
export function getGDPGrowthPercentile(fips) {
    let result = {
        GDPGrowthPercentile: C.PLACEHOLDER["GDPGrowthPercentile"]
    };

    // Get county's avg. GDP growth national percentile (among counties)
    return fetch(ENDPOINT.concat(`/gdp-growth-percentile?fips=${fips}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch GDP growth percentile data.')
            }
            return response.json();
        })
        .then(data => {
            if (!isEmpty(data)) {
                result["GDPGrowthPercentile"] = (data[0]["PERCENTILE"] * 100).toFixed(1) + '%';
            }
            return result;
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
}

/**
 * Get county's most recent GDP rank among counties in the same state.
 *
 * @param fips
 * @returns {Promise<{numCountyInState: number, stateGDPRank: string}>}
 */
export function getStateGDPRank(fips) {
    let result = {
        stateGDPRank: C.PLACEHOLDER["stateGDPRank"],
        numCountyInState: C.PLACEHOLDER["numCountyInState"]
    }

    // Get county's GDP rank within the state
    return fetch(ENDPOINT.concat(`/state-gdp-rank?fips=${fips}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch state GDP rank data.')
            }
            return response.json();
        })
        .then(data => {
            if (!isEmpty(data)) {
                result["stateGDPRank"] = `${data[0]["COUNTY_GDP_RANK"]} / ${data[0]["STATE_COUNTY_COUNT"]}`;
                result["numCountyInState"] = data[0]["STATE_COUNTY_COUNT"];
            }
            return result;
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
}

/**
 * Get the fips and county name within the same state where
 * the party winning the 2016 election in this county also won in those counties.
 *
 * @param fips
 * @returns {Promise<{countyVotingForParty: string}>}
 */
export function getCountyVotingForParty(fips) {
    let result = {
        countyVotingForParty: C.PLACEHOLDER["countyVotingForParty"]
    };

    return fetch(ENDPOINT.concat(`/county-voting-for-party?fips=${fips}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch county voting for party data.')
            }
            return response.json();
        })
        .then(data => {
            if (!isEmpty(data)) {
                result["countyVotingForParty"] = data
            }
            return result;
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
}


/**
 * Returns election result object for a specified county
 *
 * @param  {} fips county ID
 * @returns electionResult json object
 *           Year: number;
 *           DemCandidate: string;
 *           RepCandidate: string;
 *           DemVote: number;
 *           RepVote: number;
 *           TotalVote: number;
 */
export function getCountyElectionResult(fips) {
    let result = {
        electionResult: C.PLACEHOLDER["electionResult"]
    };

    return fetch(ENDPOINT.concat(`/elections?fips=${fips}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch county voting for party data.')
            }
            return response.json();
        })
        .then(data => {
            if (!isEmpty(data)) {
                let elections = [];
                for (let i of [...Array(data.length / 2).keys()]) {
                    let d_dem = data[i * 2];
                    let d_rep = data[i * 2 + 1];
                    elections.push(
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
                result["electionResult"] = elections;
            }
            return result;
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
}

/**
 * @param  {} fips county identifier
 * @returns array of gdp data
 */
export function getCountyGDP(fips) {
    let result = {gdpData: C.PLACEHOLDER["gdpData"]};

    return fetch(ENDPOINT.concat(`/annual-gdp?fips=${fips}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch GDP data.')
            }
            return response.json();
        })
        .then(data => {
            if (!isEmpty(data)) {
                result["gdpData"] = data.map((row) => {
                    return row["GDP"]
                })
            }
            return result;
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
}

/**
 * @param  {} fips county identifier
 * @returns "Description" : String
 *          "Growth" : percentage
 *          for top 5 industries
 */
export function getCountyTopIndustries(fips) {
    let result = {topIndustry: C.PLACEHOLDER["topIndustry"]};

    return fetch(ENDPOINT.concat(`/top-industry?fips=${fips}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch top industry data.')
            }
            return response.json();
        })
        .then(data => {
            if (!isEmpty(data)) {
                result["topIndustry"] = data.map((values) => {
                    return {"Description": values["Description"], "GDP": values["GDP"]}
                });
            }
            return result;
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
}

/**
 * @param  {} fips
 * @returns "Description" : String
 *          "Growth" : percentage
 *          for top 5 growing industries
 */
export function getCountyGrowingIndustry(fips) {
    let result = {
        fastestGrowingIndustry: C.PLACEHOLDER["fastestGrowingIndustry"]
    };

    return fetch(ENDPOINT.concat(`/growing-industry?fips=${fips}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch fastest growing industry data.')
            }
            return response.json();
        })
        .then(data => {
            if (!isEmpty(data)) {
                result["fastestGrowingIndustry"] = data.map((values) => {
                    return {"Description": values["Description"], "Growth": values["Growth"]};
                });
            }
            return result;
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
}

/**
 * Get the list of counties in a given state.
 *
 * @param state, two letter abbreviation
 * @returns {Promise<{counties: []}>}
 */
export function getCountiesInState(state) {
    let result = {counties: []};

    return fetch(ENDPOINT.concat(`/counties?state=${state}`))
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch counties in state data.')
            }
            return response.json();
        })
        .then(data => {
            if (!isEmpty(data)) {
                result["counties"] = data;
            }
            return result;
        })
        .catch((error) => {
            console.error('Error: ', error)
        });
}
