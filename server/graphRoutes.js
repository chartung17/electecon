let db = require('./database')
let [pool, execQuery] = [db.pool, db.execQuery]
let util = require('./helpers')


/**
 * Get the total GDP by county
 * 
 * @param  {} req
 * @param  {} res
 */

// function getGDPandVoteDiff(req, res) {
//     const q = `
//     WITH GDPByCounty AS (
//       SELECT FIPS, GDP
//       FROM GDP
//       WHERE INDUSTRY_ID = ${pool.escape(req.query.industry)} AND YEAR = ${pool.escape(req.query.year)}
//     ), TotalVotes AS (
//       SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
//       FROM Election
//       WHERE YEAR = ${pool.escape(req.query.year)}
//       GROUP BY FIPS
//     ), RepVotes AS (
//       SELECT FIPS, CANDIDATE_VOTES AS Rep
//       FROM Election NATURAL JOIN Candidate
//       WHERE YEAR = ${pool.escape(req.query.year)} AND PARTY = 'Republican'
//     ), DemVotes AS (
//       SELECT FIPS, CANDIDATE_VOTES AS Dem
//       FROM Election NATURAL JOIN Candidate
//       WHERE YEAR = ${pool.escape(req.query.year)} AND PARTY = 'Democrat'
//     ), Result AS (
//       SELECT FIPS, (((Rep - Dem) / Total) * 100) AS Z
//       FROM TotalVotes NATURAL JOIN RepVotes NATURAL JOIN DemVotes
//     )
//     SELECT g.GDP, r.Z
//     FROM GDPByCounty g JOIN Result r ON g.FIPS = r.FIPS
//     `;
//     execQuery(q, res);
// }

// function getGDPGrowthAndVoteDiff(req, res) {
//     const q = `
//     WITH GDP2018 AS (
//       SELECT FIPS, GDP
//       FROM GDP
//       WHERE INDUSTRY_ID = 0 AND YEAR = 2018
//     ), GDP2001 AS (
//       SELECT FIPS, GDP
//       FROM GDP
//       WHERE INDUSTRY_ID = 0 AND YEAR = 2001
//     ), GDPGrowth AS (
//       SELECT n.FIPS AS FIPS, (n.GDP / o.GDP) AS GROWTH
//       FROM GDP2018 n JOIN GDP2001 o ON n.FIPS = o.FIPS
//     ), TotalVotes AS (
//       SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
//       FROM Election
//       GROUP BY FIPS
//     ), RepVotes AS (
//       SELECT FIPS, CANDIDATE_VOTES AS Rep
//       FROM Election NATURAL JOIN Candidate
//       WHERE PARTY = 'Republican'
//     ), DemVotes AS (
//       SELECT FIPS, CANDIDATE_VOTES AS Dem
//       FROM Election NATURAL JOIN Candidate
//       WHERE PARTY = 'Democrat'
//     ), Result AS (
//       SELECT FIPS, (((Rep - Dem) / Total) * 100) AS Z
//       FROM TotalVotes NATURAL JOIN RepVotes NATURAL JOIN DemVotes
//     )
//     SELECT g.GROWTH, r.Z
//     FROM GDPGrowth g JOIN Result r ON g.FIPS = r.FIPS
//     `;
//     execQuery(q, res);
// }

function getGDPGrowthSince2001(req, res) {
    const q = `
    WITH GDP2018 AS (
      SELECT FIPS, GDP
      FROM GDP
      WHERE INDUSTRY_ID = 0 AND YEAR = 2018
    ), GDP2001 AS (
      SELECT FIPS, GDP
      FROM GDP
      WHERE INDUSTRY_ID = 0 AND YEAR = 2001
    ), GDPGrowth AS (
      SELECT n.FIPS AS FIPS, (n.GDP / o.GDP) AS GROWTH
      FROM GDP2018 n JOIN GDP2001 o ON n.FIPS = o.FIPS
    )
    SELECT G.GROWTH AS Z
    FROM County C LEFT OUTER JOIN GDPGrowth G ON C.FIPS = G.FIPS
    ORDER BY C.FIPS
    `;
    execQuery(q, res);
}

function getGDPGrowthSinceLastElection(req, res) {
    const q = `
    WITH GDPCurrent AS (
      SELECT FIPS, GDP
      FROM GDP
      WHERE INDUSTRY_ID = 0 AND YEAR = ${pool.escape(req.query.year)}
    ), GDPLast AS (
      SELECT FIPS, GDP
      FROM GDP
      WHERE INDUSTRY_ID = 0 AND YEAR = (${pool.escape(req.query.year)} - 4)
    ), GDPGrowth AS (
      SELECT c.FIPS AS FIPS, (c.GDP / l.GDP) AS GROWTH
      FROM GDPCurrent c JOIN GDPLast l ON c.FIPS = l.FIPS
    )
    SELECT G.GROWTH AS Z
    FROM County C LEFT OUTER JOIN GDPGrowth G ON C.FIPS = G.FIPS
    ORDER BY C.FIPS
    `;
    execQuery(q, res);
}

function getGDPIndustryComp(req, res) {
    const q = `
    WITH Industry1 AS (
      SELECT FIPS, GDP
      FROM GDP
      WHERE INDUSTRY_ID = ${pool.escape(req.query.industry1)} AND YEAR = ${pool.escape(req.query.year)}
    ), Industry2 AS (
      SELECT FIPS, GDP
      FROM GDP
      WHERE INDUSTRY_ID = ${pool.escape(req.query.industry2)} AND YEAR = ${pool.escape(req.query.year)}
    )
    SELECT o.GDP AS GDP1, t.GDP AS GDP2
    FROM Industry1 o JOIN Industry2 t ON o.FIPS = t.FIPS
    `;
    execQuery(q, res);
}

function getTotalGDPByCounty(req, res) {
    const q = `
    WITH TotalGDP AS (
      SELECT GDP, FIPS
      FROM GDP
      WHERE INDUSTRY_ID = 0 AND YEAR = ${pool.escape(req.query.year)}
    )
    SELECT R.GDP AS Z
    FROM County C LEFT OUTER JOIN TotalGDP R ON C.FIPS = R.FIPS
    ORDER BY C.FIPS
    `;
    execQuery(q, res);
}

function getDemVotes(req, res) {
  const q = `
  WITH TotalVotes AS (
    SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
    FROM Election
    WHERE YEAR = ${req.query.year}
    GROUP BY FIPS
  ), DemVotes AS (
    SELECT FIPS, CANDIDATE_VOTES AS Dem
    FROM Election NATURAL JOIN Candidate
    WHERE YEAR = ${req.query.year} AND PARTY = 'Democrat'
  ), Result AS (
    SELECT FIPS, ((Dem / Total) * 100) AS Z
    FROM TotalVotes NATURAL JOIN DemVotes
  )
  SELECT R.Z AS Z
  FROM County C LEFT OUTER JOIN Result R ON C.FIPS = R.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

function getRepVotes(req, res) {
  const q = `
  WITH TotalVotes AS (
    SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
    FROM Election
    WHERE YEAR = ${req.query.year}
    GROUP BY FIPS
  ), RepVotes AS (
    SELECT FIPS, CANDIDATE_VOTES AS Rep
    FROM Election NATURAL JOIN Candidate
    WHERE YEAR = ${req.query.year} AND PARTY = 'Republican'
  ), Result AS (
    SELECT FIPS, ((Rep / Total) * 100) AS Z
    FROM TotalVotes NATURAL JOIN RepVotes
  )
  SELECT R.Z AS Z
  FROM County C LEFT OUTER JOIN Result R ON C.FIPS = R.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

function getGreenVotes(req, res) {
  const q = `
  WITH TotalVotes AS (
    SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
    FROM Election
    WHERE YEAR = ${req.query.year}
    GROUP BY FIPS
  ), GreenVotes AS (
    SELECT FIPS, CANDIDATE_VOTES AS Green
    FROM Election NATURAL JOIN Candidate
    WHERE YEAR = ${req.query.year} AND PARTY = 'green'
  ), Result AS (
    SELECT FIPS, ((Green / Total) * 100) AS Z
    FROM TotalVotes NATURAL JOIN GreenVotes
  )
  SELECT R.Z AS Z
  FROM County C LEFT OUTER JOIN Result R ON C.FIPS = R.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

function getRepDemDiff(req, res) {
  const q = `
  WITH TotalVotes AS (
    SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
    FROM Election
    WHERE YEAR = ${req.query.year}
    GROUP BY FIPS
  ), DemVotes AS (
    SELECT FIPS, CANDIDATE_VOTES AS Dem
    FROM Election NATURAL JOIN Candidate
    WHERE YEAR = ${req.query.year} AND PARTY = 'Democrat'
  ), RepVotes AS (
    SELECT FIPS, CANDIDATE_VOTES AS Rep
    FROM Election NATURAL JOIN Candidate
    WHERE YEAR = ${req.query.year} AND PARTY = 'Republican'
  ), Result AS (
    SELECT FIPS, (((Rep - Dem) / Total) * 100) AS Z
    FROM TotalVotes NATURAL JOIN RepVotes NATURAL JOIN DemVotes
  )
  SELECT R.Z AS Z
  FROM County C LEFT OUTER JOIN Result R ON C.FIPS = R.FIPS
  ORDER BY C.FIPS
  `;
  execQuery(q, res);
}

function getIndustryGDPByCounty(req, res) {
    const q = `
    WITH IndustryGDP AS (
      SELECT GDP, FIPS
      FROM GDP
      WHERE INDUSTRY_ID = ${pool.escape(req.query.industry)} AND YEAR = ${pool.escape(req.query.year)}
    )
    SELECT R.GDP AS Z
    FROM County C LEFT OUTER JOIN IndustryGDP R ON C.FIPS = R.FIPS
    ORDER BY C.FIPS
    `;
    execQuery(q, res);
}


module.exports = {
    getGDPIndustryComp: getGDPIndustryComp,
    getTotalGDPByCounty: getTotalGDPByCounty,
    getIndustryGDPByCounty: getIndustryGDPByCounty,
    getDemVotes: getDemVotes,
    getRepVotes: getRepVotes,
    getGreenVotes: getGreenVotes,
    getRepDemDiff: getRepDemDiff,
    getGDPGrowthSince2001: getGDPGrowthSince2001,
    getGDPGrowthSinceLastElection: getGDPGrowthSinceLastElection
    // add all queries here
}

// /**
//  * EXPLANATION OF QUERY
//  * 
//  * @param  {} req
//  * @param  {} res
//  */
// function queryName(req, res) {
//     const q = `
//     Select 
//     FROM
//     WHERE
//     `; // add body of query inside ' '
//     execQuery(q, res);
// }

// module.exports = {
//     queryName: queryName,
//     queryName2: queryName2
//     // add all queries here
// }
