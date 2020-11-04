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
* Get the names and IDs of all industries (excluding total)
*
* @param req
* @param res
*/
function getIndustries(req, res) {
  const q = `
  SELECT *
  FROM Industry
  WHERE INDUSTRY_ID > 0
  `;
  execQuery(q, res);
}

/**
* Get the names and IDs of all non-aggregate industries
*
* @param req
* @param res
*/
function getNonAggregateIndustries(req, res) {
  const q = `
  SELECT *
  FROM Industry
  WHERE INDUSTRY_ID IN (2,3,4,5,7,8,9,10,11,12,14,15,17,18,19,21,22,24,25,26,27)
  `;
  execQuery(q, res);
}

/**
* Get the difference between the percentage of Republican votes
* and the percentage of Democrat votes for all counties
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
    WHERE YEAR = ${pool.escape(req.query.year)} AND PARTY = 'Republican'
  ), DemVotes AS (
    SELECT FIPS, CANDIDATE_VOTES AS Dem
    FROM Election NATURAL JOIN Candidate
    WHERE YEAR = ${pool.escape(req.query.year)} AND PARTY = 'Democrat'
  ), Result AS (
    SELECT FIPS, (((Rep - Dem) / Total) * 100) AS Z
    FROM TotalVotes NATURAL JOIN RepVotes NATURAL JOIN DemVotes
  ), Filter AS (
    ` + util.getFilterQuery(req) +
    `
  ), Filtered AS (
    SELECT * FROM Result NATURAL JOIN Filter
  )
  SELECT F.Z
  FROM County C LEFT OUTER JOIN Filtered F ON C.FIPS = F.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

/**
* Get the percentage of Democrat votes for all counties
*
* @param req
* @param res
*/
function getDemVotes(req, res) {
  const q = `
  WITH TotalVotes AS (
    SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
    FROM Election
    WHERE YEAR = ${pool.escape(req.query.year)}
    GROUP BY FIPS
  ), DemVotes AS (
    SELECT FIPS, CANDIDATE_VOTES AS Dem
    FROM Election NATURAL JOIN Candidate
    WHERE YEAR = ${pool.escape(req.query.year)} AND PARTY = 'Democrat'
  ), Result AS (
    SELECT FIPS, ((Dem / Total) * 100) AS Z
    FROM TotalVotes NATURAL JOIN DemVotes
  ), Filter AS (
    ` + util.getFilterQuery(req) +
    `
  ), Filtered AS (
    SELECT * FROM Result NATURAL JOIN Filter
  )
  SELECT F.Z
  FROM County C LEFT OUTER JOIN Filtered F ON C.FIPS = F.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

/**
* Get the percentage of Republican votes for all counties
*
* @param req
* @param res
*/
function getRepVotes(req, res) {
  const q = `
  WITH TotalVotes AS (
    SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
    FROM Election
    WHERE YEAR = ${pool.escape(req.query.year)}
    GROUP BY FIPS
  ), RepVotes AS (
    SELECT FIPS, CANDIDATE_VOTES AS Rep
    FROM Election NATURAL JOIN Candidate
    WHERE YEAR = ${pool.escape(req.query.year)} AND PARTY = 'Republican'
  ), Result AS (
    SELECT FIPS, ((Rep / Total) * 100) AS Z
    FROM TotalVotes NATURAL JOIN RepVotes
  ), Filter AS (
    ` + util.getFilterQuery(req) +
    `
  ), Filtered AS (
    SELECT * FROM Result NATURAL JOIN Filter
  )
  SELECT F.Z
  FROM County C LEFT OUTER JOIN Filtered F ON C.FIPS = F.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

/**
* Get the percentage of Other votes for all counties
*
* @param req
* @param res
*/
function getOtherVotes(req, res) {
  const q = `
  WITH TotalVotes AS (
    SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
    FROM Election
    WHERE YEAR = ${pool.escape(req.query.year)}
    GROUP BY FIPS
  ), OtherVotes AS (
    SELECT FIPS, SUM(CANDIDATE_VOTES) AS Other
    FROM Election NATURAL JOIN Candidate
    WHERE YEAR = ${pool.escape(req.query.year)}
    AND (PARTY IS NULL OR (PARTY != 'Republican' AND PARTY != 'Democrat'))
    GROUP BY FIPS
  ), Result AS (
    SELECT FIPS, ((Other / Total) * 100) AS Z
    FROM TotalVotes NATURAL JOIN OtherVotes
  ), Filter AS (
    ` + util.getFilterQuery(req) +
    `
  ), Filtered AS (
    SELECT * FROM Result NATURAL JOIN Filter
  )
  SELECT F.Z
  FROM County C LEFT OUTER JOIN Filtered F ON C.FIPS = F.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

/**
* Get the total GDP for all counties
*
* @param req
* @param res
*/
function getTotalGDP(req, res) {
  const q = `
  WITH Result AS (
    SELECT FIPS, (GDP / 1000) AS Z
    FROM GDP
    WHERE INDUSTRY_ID = 0 AND YEAR = ${pool.escape(req.query.year)}
  ), Filter AS (
    ` + util.getFilterQuery(req) +
    `
  ), Filtered AS (
    SELECT * FROM Result NATURAL JOIN Filter
  )
  SELECT F.Z
  FROM County C LEFT OUTER JOIN Filtered F ON C.FIPS = F.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

/**
* Get the percentage of GDP from the specified industry for all counties
*
* @param req
* @param res
*/
function getIndustryGDP(req, res) {
  const q = `
  WITH TotalGDP AS (
    SELECT FIPS, GDP AS Total
    FROM GDP
    WHERE INDUSTRY_ID = 0 AND YEAR = ${pool.escape(req.query.year)}
  ), IndustryGDP AS (
    SELECT FIPS, GDP
    FROM GDP
    WHERE YEAR = ${pool.escape(req.query.year)} AND INDUSTRY_ID = ${pool.escape(req.query.industry)}
  ), Result AS (
    SELECT FIPS, ((GDP / Total) * 100) AS Z
    FROM TotalGDP NATURAL JOIN IndustryGDP
  ), Filter AS (
    ` + util.getFilterQuery(req) +
    `
  ), Filtered AS (
    SELECT * FROM Result NATURAL JOIN Filter
  )
  SELECT F.Z
  FROM County C LEFT OUTER JOIN Filtered F ON C.FIPS = F.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

/**
* Get largest industry (non-aggregate) for all counties
*
* @param req
* @param res
*/
function getTopIndustries(req, res) {
  const q = `
  WITH Result AS (
    SELECT FIPS, INDUSTRY_ID AS Z
    FROM TopIndustry
    WHERE YEAR = ${pool.escape(req.query.year)}
  ), Filter AS (
    ` + util.getFilterQuery(req) +
    `
  ), Filtered AS (
    SELECT * FROM Result NATURAL JOIN Filter
  )
  SELECT F.Z
  FROM County C LEFT OUTER JOIN Filtered F ON C.FIPS = F.FIPS
  ORDER BY C.FIPS;
  `;
  execQuery(q, res);
}

module.exports = {
  getAllCounties: getAllCounties,
  getRepDemDiff: getRepDemDiff,
  getDemVotes: getDemVotes,
  getRepVotes: getRepVotes,
  getOtherVotes: getOtherVotes,
  getTotalGDP: getTotalGDP,
  getIndustryGDP: getIndustryGDP,
  getIndustries: getIndustries,
  getNonAggregateIndustries: getNonAggregateIndustries,
  getTopIndustries: getTopIndustries
}
