let mysql = require('mysql');
require('dotenv').config()
let pool = mysql.createPool({
    connectionLimit: process.env.DB_MAX_CONNECTIONS || 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DEFAULT_DATABASE,
});

let util = require('./helpers')

/**
 * Executes given query and sets the response's body;
 *
 * @param query SQL query string
 * @param res   response body
 */
function execQuery(query, res) {
    pool.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            res.json(rows);
        }
    });
}

/**
 * Get county data.
 *
 * Usage:
 *  - Fetch all data from County table (~3k rows)
 *    /api/v1/county/counties
 *  - Fetch all data from County table where county in state AL or AZ and FIPS in [01001,01005,04017]
 *    /api/v1/county/counties?state=AL,AZ&fips=01001,01005,04017     # no spaces between items
 *  - Fetch 100 to 200th counties in the state of TX
 *    /api/v1/county/counties?state=TX&page=2&page_size=100
 *
 * @param req   request body
 * @param res   response body
 */
function getCounty(req, res) {
    let where = [];
    let paging = "";

    // Build WHERE clause
    if (!util.isEmpty(req.query.state)) {
        where.push(`STATE IN (${util.split_quote(req.query.state)})`);
    }
    if (!util.isEmpty(req.query.fips)) {
        where.push(`FIPS IN (${util.split_quote(req.query.fips)})`);
    }
    where = where.length === 0 ? "" : `WHERE ${where.join(' AND ')}`

    // Specify LIMIT, OFFSET
    if (!util.isEmpty(req.query.page_size) || !util.isEmpty(req.query.page)) {
        let page_size = Number(req.query.page_size);
        let page = Number(req.query.page);

        if (Number.isInteger(page_size) && Number.isInteger(page) && page_size >= 0 && page >= 0) {
            paging = `LIMIT ${page_size} OFFSET ${(page - 1) * page_size}` // page 1 is 0 offset
        } else {
            res.status(404).json({"message": "Invalid page or page size"});
            return;
        }
    }

    try {
        let q = `SELECT * FROM County ${where} ${paging};`;
        execQuery(q, res);
    } catch (e) {
        res.status(404).json({"message": "Invalid query"});
    }
}

/**
 * Query year, candidate's name, party, and vote of a given FIPS.
 *
 * @param req
 * @param res default response body
 */
function getElections(req, res) {
    const q = `
    SELECT YEAR, CANDIDATE_NAME, PARTY, CANDIDATE_VOTES
    FROM Election NATURAL JOIN Candidate
    WHERE FIPS=${pool.escape(req.query.fips)}
          AND PARTY IN ('Democrat', 'Republican')
    ORDER BY YEAR DESC, PARTY;
    `;
    execQuery(q, res);
}

/**
 * Get annual GDP (all industry) of a county
 *
 * @param req
 * @param res
 */
function getAnnualGDP(req, res) {
    const q = `
    SELECT YEAR, GDP
    FROM GDP
    WHERE INDUSTRY_ID=0
          AND FIPS=${pool.escape(req.query.fips)};
    `;
    execQuery(q, res);
}

/**
 * Get 2018 GDP of 5 largest industries (non-aggregate) in a county
 *
 * @param req
 * @param res
 */
function getTopIndustry(req, res) {
    const q = `
    SELECT NAME AS Description, GDP
    FROM GDP NATURAL JOIN Industry
    WHERE YEAR=2018
          AND INDUSTRY_ID IN (2,3,4,5,7,8,9,10,11,12,14,15,17,18,19,21,22,24,25,26,27)
          AND FIPS=${pool.escape(req.query.fips)}
    ORDER BY GDP DESC
    LIMIT 5;
    `;
    execQuery(q, res);
}

/**
 * Get 5 industries (non-aggregate) in a county with largest 2001-2018 CAGR
 *
 * @param req
 * @param res
 */
function getGrowingIndustry(req, res) {
    const q = `
    WITH A AS (SELECT INDUSTRY_ID, NAME, GDP FROM GDP NATURAL JOIN Industry
    WHERE FIPS=${pool.escape(req.query.fips)} AND YEAR=2001) ,
    B AS (SELECT INDUSTRY_ID, NAME, GDP FROM GDP NATURAL JOIN Industry
    WHERE FIPS=${pool.escape(req.query.fips)} AND YEAR=2018)
    SELECT A.NAME AS Description,
           ROUND(100 * (POWER(B.GDP / A.GDP, 1 / 18) - 1),2) AS Growth
    FROM A JOIN B ON A.INDUSTRY_ID=B.INDUSTRY_ID
    WHERE A.GDP IS NOT NULL
          AND A.GDP != 0
          AND B.GDP IS NOT NULL
          AND A.INDUSTRY_ID IN (2,3,4,5,7,8,9,10,11,12,14,15,17,18,19,21,22,24,25,26,27)
    ORDER BY Growth DESC
    LIMIT 5;
    `;
    execQuery(q, res);
}

/**
 * Get the FIPS and name of all counties
 *
 * @param req
 * @param res
 */
function getAllCounties(req, res) {
    const q = `
    SELECT FIPS, CONCAT(NAME, ', ', STATE) AS NAME
    FROM County
    ORDER BY FIPS
    `;
    execQuery(q, res);
}

/**
 * Get the FIPS and the difference between the percentage of Republican votes
 * and the percentage Democrat votes for all counties
 *
 * @param req
 * @param res
 */
function getRepDemDiff(req, res) {
    const q = `
    WITH TotalVotes AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
      FROM Election
      WHERE YEAR = ${pool.escape(req.query.year)}
      GROUP BY FIPS
    ), RepVotes AS (
      SELECT FIPS, CANDIDATE_VOTES AS Rep
      FROM Election NATURAL JOIN Candidate
      WHERE YEAR = ${pool.escape(req.query.year)} AND PARTY = 'republican'
    ), DemVotes AS (
      SELECT FIPS, CANDIDATE_VOTES AS Dem
      FROM Election NATURAL JOIN Candidate
      WHERE YEAR = ${pool.escape(req.query.year)} AND PARTY = 'democrat'
    ), Diff AS (
      SELECT FIPS, (((Rep - Dem) / Total) * 100) AS Diff
      FROM TotalVotes NATURAL JOIN RepVotes NATURAL JOIN DemVotes
    )
    SELECT D.Diff
    FROM County C LEFT OUTER JOIN Diff D ON C.FIPS = D.FIPS
    ORDER BY C.FIPS
    `;
    execQuery(q, res);
}

module.exports = {
    getCounties: getCounty,
    getElections: getElections,
    getAnnualGDP: getAnnualGDP,
    getTopIndustry: getTopIndustry,
    getGrowingIndustry: getGrowingIndustry,
    getAllCounties: getAllCounties,
    getRepDemDiff: getRepDemDiff
}
