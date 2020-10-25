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
    WITH Total_Votes AS (SELECT YEAR, FIPS, SUM(CANDIDATE_VOTES) AS TOTAL_VOTES
			   FROM Election
			   WHERE FIPS=${pool.escape(req.query.fips)}
               GROUP BY YEAR, FIPS)
    SELECT E.YEAR, CANDIDATE_NAME, PARTY, CANDIDATE_VOTES, TOTAL_VOTES
    FROM Election E
    	NATURAL JOIN Candidate C
        NATURAL JOIN Total_Votes TV
    WHERE E.FIPS=${pool.escape(req.query.fips)} AND
    	  PARTY IN ('Democrat', 'Republican')
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
          AND INDUSTRY_ID < 28
          AND INDUSTRY_ID NOT IN (0, 1, 6, 13, 16, 20, 23) 
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
    WITH Y2001GDP AS (SELECT INDUSTRY_ID, NAME, GDP 
               FROM GDP NATURAL JOIN Industry
               WHERE FIPS=${pool.escape(req.query.fips)} AND YEAR=2001),
         Y2018GDP AS (SELECT INDUSTRY_ID, NAME, GDP 
               FROM GDP NATURAL JOIN Industry
               WHERE FIPS=${pool.escape(req.query.fips)} AND YEAR=2018)
    SELECT Y2001GDP.NAME AS Description,
           ROUND(100 * (POWER(Y2018GDP.GDP / Y2001GDP.GDP, 1 / 18) - 1),2) AS Growth
    FROM Y2001GDP JOIN Y2018GDP ON Y2001GDP.INDUSTRY_ID=Y2018GDP.INDUSTRY_ID
    WHERE Y2001GDP.GDP IS NOT NULL
          AND Y2001GDP.GDP != 0
          AND Y2018GDP.GDP IS NOT NULL
          AND Y2001GDP.INDUSTRY_ID NOT IN (0, 1, 6, 13, 16, 20, 23) 
          AND Y2001GDP.INDUSTRY_ID < 28
    ORDER BY Growth DESC
    LIMIT 5;
    `;
    execQuery(q, res);
}

/**
 * Get county's 2001-2018 GDP growth national percentile.
 *
 * @param req
 * @param res
 */
function getGDPGrowthPercentile(req, res) {
    const q = `
    WITH Percentile AS (SELECT A.FIPS,
       	              ROUND(100 * (POWER(B.GDP / A.GDP, 1 / 18) - 1),2) AS Growth
       	       FROM (SELECT FIPS, GDP 
       	             FROM GDP NATURAL JOIN Industry
                     WHERE YEAR=2001 AND INDUSTRY_ID=0) A 
       				JOIN 
                    (SELECT FIPS, GDP 
       		         FROM GDP NATURAL JOIN Industry
                     WHERE YEAR=2018 AND INDUSTRY_ID=0) B 
       				ON A.FIPS=B.FIPS
       	       WHERE A.GDP IS NOT NULL
       	       	     AND A.GDP != 0
       	       	     AND B.GDP IS NOT NULL
       	       ORDER BY Growth DESC
               )
    SELECT FIPS, COUNT(1) / (SELECT COUNT(1) FROM Percentile) AS PERCENTILE
    FROM Percentile
    WHERE (SELECT Growth 
    	   FROM Percentile 
    	   WHERE FIPS=${pool.escape(req.query.fips)}) > Percentile.Growth;
    `;
    execQuery(q, res);
}

/**
 * Get county's 2018 GDP rank among counties in the same state.
 *
 * @param req
 * @param res
 */
function getStateGDPRank(req, res) {
    const q = `
    WITH County_GDP AS (SELECT * 
               FROM GDP NATURAL JOIN County
               WHERE INDUSTRY_ID=0 
                     AND YEAR=2018
                     AND County.STATE IN (SELECT STATE 
                                          FROM County 
                                          WHERE FIPS=${pool.escape(req.query.fips)})
               )
    SELECT FIPS, 
           (SELECT COUNT(1) FROM County_GDP) - COUNT(1) as COUNTY_GDP_RANK, 
           (SELECT COUNT(1) FROM County WHERE STATE IN (SELECT STATE FROM County WHERE FIPS=${pool.escape(req.query.fips)})) as STATE_COUNTY_COUNT
    FROM County_GDP
    WHERE (SELECT GDP
           FROM County_GDP 
           WHERE FIPS=${pool.escape(req.query.fips)}) > County_GDP.GDP;
    `;
    execQuery(q, res);
}

/**
 * Given county A's fips, get the fips and county name within the same state where
 * the party winning the 2016 election in county A also won in those counties.
 *
 * @param req
 * @param res
 */
function getCountyVotingForParty(req, res) {
    const q = `
    WITH County_Party AS (SELECT PARTY 
                     FROM Election NATURAL JOIN Candidate 
                     WHERE YEAR=2016 
                           AND FIPS=${pool.escape(req.query.fips)} 
				     ORDER BY CANDIDATE_VOTES DESC 
				     LIMIT 1),
	     County_State AS (SELECT STATE 
	                 FROM County 
	                 WHERE FIPS=${pool.escape(req.query.fips)})
    SELECT FIPS, NAME
    FROM Election E1 NATURAL JOIN Candidate C1 NATURAL JOIN County
    WHERE E1.YEAR=2016
    	  AND STATE IN (SELECT * FROM County_State)
    	  AND PARTY IN (SELECT * FROM County_Party)
    	  AND E1.CANDIDATE_VOTES > ALL (SELECT E2.CANDIDATE_VOTES 
    	                                FROM Election E2 NATURAL JOIN Candidate C2
    									WHERE E2.FIPS=E1.FIPS 
    									      AND E2.YEAR=E1.YEAR 
    									      AND C2.PARTY NOT IN (SELECT * FROM County_Party));
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
 * Get the names of all political parties
 *
 * @param req
 * @param res
 */
function getParties(req, res) {
    const q = `
    SELECT DISTINCT PARTY
    FROM Candidate
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
    WITH IndustryGDP AS (
      SELECT *
      FROM GDP
      WHERE YEAR = ${pool.escape(req.query.year)}
        AND INDUSTRY_ID IN (2,3,4,5,7,8,9,10,11,12,14,15,17,18,19,21,22,24,25,26,27)
     LIMIT 100000
    ), Result AS (
      SELECT I.FIPS, I.INDUSTRY_ID AS Z
      FROM IndustryGDP I
      WHERE I.INDUSTRY_ID =
        (SELECT J.INDUSTRY_ID
         FROM IndustryGDP J
         WHERE I.FIPS = J.FIPS
         ORDER BY J.GDP DESC
         LIMIT 1)
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

module.exports = {
    getCounties: getCounty,
    getElections: getElections,
    getAnnualGDP: getAnnualGDP,
    getTopIndustry: getTopIndustry,
    getGrowingIndustry: getGrowingIndustry,
    getGDPGrowthPercentile: getGDPGrowthPercentile,
    getStateGDPRank: getStateGDPRank,
    getCountyVotingForParty: getCountyVotingForParty,
    getAllCounties: getAllCounties,
    getParties: getParties,
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
