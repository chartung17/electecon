/*
 * Api for getting data for trends page
 */

import {TRENDS_ENDPOINT as ENDPOINT} from '../App';

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
