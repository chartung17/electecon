/*
 * Api for getting data for graph page
 */

import {GRAPH_ENDPOINT as ENDPOINT} from '../App'; 

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

