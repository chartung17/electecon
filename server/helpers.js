function isEmpty(input){
  return input === undefined || input === null || input.length === 0;
}

function split_quote(params){
  return params.split(',').map(x => `'${x}'`).join(',');
}

/**
* Return the text for the end of the query,
* grouping by state or county as specified in req
*
* @param req
*/
function getLevel(req) {
  if (req.query.level === 'county') {
    return `
    SELECT F.Z
    FROM County C LEFT OUTER JOIN Filtered F ON C.FIPS = F.FIPS
    ORDER BY C.FIPS;
    `;
  } else {
    return `
    SELECT * FROM Filtered;
    `;
  }
}

/**
* Determine whether to query the entire table, or a table aggregated by state
*
* @param req
*/
function getTable(req, type, year, ind=0) {
  if (req.query.level === 'county') {
    if (type === 'election') {
      return 'SELECT * FROM Election WHERE YEAR = ' + year;
    } else if (type === 'gdp') {
      return 'SELECT * FROM GDP WHERE YEAR = ' + year + ' AND INDUSTRY_ID = ' + ind;
    }
  } else {
    if (type === 'election') {
      return `
      SELECT STATE AS FIPS, CANDIDATE_ID, SUM(CANDIDATE_VOTES) AS CANDIDATE_VOTES
      FROM County NATURAL JOIN Election
      WHERE YEAR = ` + year + `
      GROUP BY STATE, CANDIDATE_ID
      `;
    } else if (type === 'gdp') {
      return `
      SELECT STATE AS FIPS, SUM(GDP) AS GDP
      FROM County NATURAL JOIN GDP
      WHERE YEAR = ` + year + ` AND INDUSTRY_ID = ` + ind + `
      GROUP BY STATE
      `;
    }
  }
}

/**
* Return the text of the specified filter query
*
* @param req
*/
function getFilterQuery(req) {
  let op = req.query.operand;
  if (op === 'gt') {
    op = '>'
  } else {
    op = '<';
  }
  if (req.query.filter === 'none') {
    return 'SELECT FIPS FROM Result';
  } else if (req.query.filter === 'RepDemDiff') {
    const q = `
    WITH ElectionTable2 AS (
      ` + getTable(req, 'election', req.query.filteryear) + `
    ), TotalVotes2 AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
      FROM ElectionTable2
      GROUP BY FIPS
    ), RepVotes2 AS (
      SELECT FIPS, CANDIDATE_VOTES AS Rep
      FROM ElectionTable2 NATURAL JOIN Candidate
      WHERE PARTY = 'Republican'
    ), DemVotes2 AS (
      SELECT FIPS, CANDIDATE_VOTES AS Dem
      FROM ElectionTable2 NATURAL JOIN Candidate
      WHERE PARTY = 'Democrat'
    ), Diff AS (
      SELECT FIPS, (((Rep - Dem) / Total) * 100) AS Diff
      FROM TotalVotes2 NATURAL JOIN RepVotes2 NATURAL JOIN DemVotes2
    )
    SELECT DISTINCT FIPS
    FROM Diff
    WHERE Diff ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter === 'Republican') {
    const q = `
    WITH ElectionTable2 AS (
      ` + getTable(req, 'election', req.query.filteryear) + `
    ), TotalVotes2 AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
      FROM ElectionTable2
      GROUP BY FIPS
    ), RepVotes2 AS (
      SELECT FIPS, CANDIDATE_VOTES AS Rep
      FROM ElectionTable2 NATURAL JOIN Candidate
      WHERE PARTY = 'Republican'
    ), Percent AS (
      SELECT FIPS, ((Rep / Total) * 100) AS Percent
      FROM TotalVotes2 NATURAL JOIN RepVotes2
    )
    SELECT DISTINCT FIPS
    FROM Percent
    WHERE Percent ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter === 'Democrat') {
    const q = `
    WITH ElectionTable2 AS (
      ` + getTable(req, 'election', req.query.filteryear) + `
    ), TotalVotes2 AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
      FROM ElectionTable2
      GROUP BY FIPS
    ), DemVotes2 AS (
      SELECT FIPS, CANDIDATE_VOTES AS Dem
      FROM ElectionTable2 NATURAL JOIN Candidate
      WHERE PARTY = 'Democrat'
    ), Percent AS (
      SELECT FIPS, ((Dem / Total) * 100) AS Percent
      FROM TotalVotes2 NATURAL JOIN DemVotes2
    )
    SELECT DISTINCT FIPS
    FROM Percent
    WHERE Percent ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter === 'Other') {
    const q = `
    WITH ElectionTable2 AS (
      ` + getTable(req, 'election', req.query.filteryear) + `
    ), TotalVotes2 AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
      FROM ElectionTable2
      GROUP BY FIPS
    ), OtherVotes2 AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Other
      FROM ElectionTable2 NATURAL JOIN Candidate
      WHERE PARTY IS NULL OR (PARTY != 'Republican' AND PARTY != 'Democrat')
      GROUP BY FIPS
    ), Percent AS (
      SELECT FIPS, ((Other / Total) * 100) AS Percent
      FROM TotalVotes2 NATURAL JOIN OtherVotes2
    )
    SELECT DISTINCT FIPS
    FROM Percent
    WHERE Percent ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter === 'TotalGDP') {
    const q = `
    WITH TotalGDP2 AS (
      ` + getTable(req, 'gdp', req.query.filteryear, 0) + `
    )
    SELECT FIPS
    FROM TotalGDP2
    WHERE (GDP / 1000) ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter.startsWith('Industry')) {
    let indID = req.query.filter.substr(8);
    const q = `
    WITH TotalGDP2 AS (
      ` + getTable(req, 'gdp', req.query.filteryear, 0) + `
    ), IndustryGDP2 AS (
      ` + getTable(req, 'gdp', req.query.filteryear, indID) + `
    ), Percent AS (
      SELECT T.FIPS, ((I.GDP / T.GDP) * 100) AS Percent
      FROM TotalGDP2 T JOIN IndustryGDP2 I ON T.FIPS = I.FIPS
    )
    SELECT DISTINCT FIPS
    FROM Percent
    WHERE Percent ${op} ${req.query.val}
    `;
    return q;
  } else {
    return 'SELECT FIPS FROM Result';
  }
}

module.exports = {
  isEmpty: isEmpty,
  split_quote: split_quote,
  getLevel: getLevel,
  getTable: getTable,
  getFilterQuery: getFilterQuery
}
