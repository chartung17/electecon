/*
 * Api for getting data for trends page
 */

import {MAP_ENDPOINT, COUNTY_ENDPOINT, TRENDS_ENDPOINT as ENDPOINT} from '../App';

let ERR_HANDLER = (err) => {
    console.log(err)
};
/**
 * Get all states 
 */
export function getStates() {
    return fetch(ENDPOINT.concat(`/state`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER);
}
/**
 * Given a state, get election results
 * @param  {} state - 2 letter state abbreviation
 */
export function getStateElectionResult(state) {
    return fetch(ENDPOINT.concat(`/state-election?state=${state}`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER);
}
/**
 * get national election results
 */
export function getNationalElectionResult() {
    return fetch(ENDPOINT.concat(`/national-election`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER);
}

/**
 * get county GDP data
 * @param {} fips - county fips code
 */
export function getCountyGDPData(fips) {
    return fetch(COUNTY_ENDPOINT.concat(`/annual-gdp?fips=${fips}`))
            .then(res => {
                return res.json();
            });
}

/**
 * get state GDP data
 * @param {} state - state abbreviation
 */
export function getStateGDPData(state) {
    return fetch(ENDPOINT.concat(`/state-gdp?state=${state}`))
            .then(res => {
                return res.json();
            });
}

/**
 * get national GDP data
 */
export function getNationalGDPData() {
    return fetch(ENDPOINT.concat(`/national-gdp`))
            .then(res => {
                return res.json();
            });
}

export function getIndustries() {
    return fetch(MAP_ENDPOINT.concat(`/industries`))
            .then(res => {
                return res.json();
            });
}

export function getCountyIndustryGDP(fips, industry) {
    return fetch(ENDPOINT.concat(`/county-industry?fips=${fips}&industry=${industry}`))
            .then(res => {
                return res.json();
            })
}

export function getStateIndustryGDP(state, industry) {
    return fetch(ENDPOINT.concat(`/state-industry?state=${state}&industry=${industry}`))
            .then(res => {
                return res.json();
            })
}

export function getNationalIndustryGDP(industry) {
    return fetch(ENDPOINT.concat(`/national-industry?industry=${industry}`))
            .then(res => {
                return res.json();
            })
}
