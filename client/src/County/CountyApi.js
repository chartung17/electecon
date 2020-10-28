/* 
 * Api for getting county data
 */

const C = require('./Constants');

const API_HOST = process.env.REACT_APP_API_HOST || "localhost";
const API_PORT = process.env.REACT_APP_API_PORT || 5000;
export const ENDPOINT = `http://${API_HOST}:${API_PORT}/api/v1/county`;

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