/*
 * Api for getting data for trends page
 */

import {TRENDS_ENDPOINT as ENDPOINT} from '../App';

let ERR_HANDLER = (err) => {
    console.log(err)
};

export function getStates() {
    return fetch(ENDPOINT.concat(`/state`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER);
}

export function getStateElectionResult(state) {
    return fetch(ENDPOINT.concat(`/state-election?state=${state}`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER);
}

