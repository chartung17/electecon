/* 
 * Api for getting county data
 */

const C = require('./Constants');

<<<<<<< HEAD
import {COUNTY_ENDPOINT as ENDPOINT} from '../App';
=======
const API_HOST = process.env.REACT_APP_API_HOST || "localhost";
const API_PORT = process.env.REACT_APP_API_PORT || 5000;
export const ENDPOINT = `http://${API_HOST}:${API_PORT}/api/v1/county`;
>>>>>>> 4135f33e04cbdcbc334e084006a81a5687a71c95

/*

*/
 /**
  * Returns election result object for a specified county
  * 
  * @param  {} fips county ID
  * @param  {} ERR_HANDLER error Handler
  * @returns electionResult json object
  *           Year: number;
  *           DemCandidate: string;
  *           RepCandidate: string;
  *           DemVote: number;
  *           RepVote: number;
  *           TotalVote: number;
  */
 export function getCountyElectionResult(fips, ERR_HANDLER) {
    return fetch(ENDPOINT.concat(`/elections?fips=${fips}`))
            .then(res => {
                return res.json();
            }, ERR_HANDLER)
            .then(row => {
                if (row === undefined || row === null || row.length === 0) {
                    // revert to default data
                    return C.PLACEHOLDER_ELECTION_RESULT;
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
                    return data;
                }
            });
 };
 /**
  * @param  {} fips county identifier
  * @param  {} ERR_HANDLER error handler
  * @returns array of gdp data
  */
 export function getCountyGDP(fips, ERR_HANDLER) {
    return fetch(ENDPOINT.concat(`/annual-gdp?fips=${fips}`))
    .then(res => {
        return res.json();
    }, ERR_HANDLER)
    .then(row => {
        if (row === undefined || row === null || row.length === 0) {
            // revert to default data
            return C.PLACEHOLDER_GDP_DATA;
        } else {
            let data = [];
            for (let i of [...Array(row.length).keys()]) {
                data.push(row[i]["GDP"])
            }
            return data;
        }
    });
 }

 
 /**
  * @param  {} fips county identifier
  * @param  {} ERR_HANDLER error handler
  * @returns "Description" : String
  *          "Growth" : percentage
  *          for top 5 industries
  */
 export function getCountyTopIndustries(fips, ERR_HANDLER) {
    return fetch(ENDPOINT.concat(`/top-industry?fips=${fips}`))
    .then(res => {
        return res.json();
    }, ERR_HANDLER)
    .then(row => {
        if (row === undefined || row === null || row.length === 0) {
            // revert to default data
            return C.PLACEHOLDER_TOP_INDUSTRY;
        } else {
            let data = [];
            for (let i of [...Array(row.length).keys()]) {
                data.push({"Description": row[i]["Description"], "GDP": row[i]["GDP"]})
            }
            return data;
        }
    });
 };
 /**
  * @param  {} fips
  * @param  {} ERR_HANDLER
  * @returns "Description" : String
  *          "Growth" : percentage 
  *          for top 5 growing industries
  */
 export function getCountyGrowingIndustry(fips, ERR_HANDLER) {
    return fetch(ENDPOINT.concat(`/growing-industry?fips=${fips}`))
    .then(res => {
        return res.json();
    }, ERR_HANDLER)
    .then(row => {
        if (row === undefined || row === null || row.length === 0) {
            // revert to default data
            return C.PLACEHOLDER_GROWING_INDUSTRY;
        } else {
            let data = [];
            for (let i of [...Array(row.length).keys()]) {
                data.push({"Description": row[i]["Description"], "Growth": row[i]["Growth"]})
            }
            return data;
        }
    });
 };