function isEmpty(input){
  return input === undefined || input === null || input.length === 0;
}

function split_quote(params){
  return params.split(',').map(x => `'${x}'`).join(',');
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
    WITH TotalVotes2 AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
      FROM Election
      WHERE YEAR = ${req.query.filteryear}
      GROUP BY FIPS
    ), RepVotes2 AS (
      SELECT FIPS, CANDIDATE_VOTES AS Rep
      FROM Election NATURAL JOIN Candidate
      WHERE YEAR = ${req.query.filteryear} AND PARTY = 'Republican'
    ), DemVotes2 AS (
      SELECT FIPS, CANDIDATE_VOTES AS Dem
      FROM Election NATURAL JOIN Candidate
      WHERE YEAR = ${req.query.filteryear} AND PARTY = 'Democrat'
    ), Diff AS (
      SELECT FIPS, (((Rep - Dem) / Total) * 100) AS Diff
      FROM TotalVotes2 NATURAL JOIN RepVotes2 NATURAL JOIN DemVotes2
    )
    SELECT FIPS
    FROM Diff
    WHERE Diff ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter === 'Republican') {
    const q = `
    WITH TotalVotes2 AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
      FROM Election
      WHERE YEAR = ${req.query.filteryear}
      GROUP BY FIPS
    ), RepVotes2 AS (
      SELECT FIPS, CANDIDATE_VOTES AS Rep
      FROM Election NATURAL JOIN Candidate
      WHERE YEAR = ${req.query.filteryear} AND PARTY = 'Republican'
    ), Percent AS (
      SELECT FIPS, ((Rep / Total) * 100) AS Percent
      FROM TotalVotes2 NATURAL JOIN RepVotes2
    )
    SELECT FIPS
    FROM Percent
    WHERE Percent ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter === 'Democrat') {
    const q = `
    WITH TotalVotes2 AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
      FROM Election
      WHERE YEAR = ${req.query.filteryear}
      GROUP BY FIPS
    ), DemVotes2 AS (
      SELECT FIPS, CANDIDATE_VOTES AS Dem
      FROM Election NATURAL JOIN Candidate
      WHERE YEAR = ${req.query.filteryear} AND PARTY = 'Democrat'
    ), Percent AS (
      SELECT FIPS, ((Dem / Total) * 100) AS Percent
      FROM TotalVotes2 NATURAL JOIN DemVotes2
    )
    SELECT FIPS
    FROM Percent
    WHERE Percent ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter === 'Other') {
    const q = `
    WITH TotalVotes2 AS (
      SELECT FIPS, SUM(CANDIDATE_VOTES) AS Total
      FROM Election
      WHERE YEAR = ${req.query.filteryear}
      GROUP BY FIPS
    ), OtherVotes2 AS (
      SELECT FIPS, CANDIDATE_VOTES AS Other
      FROM Election NATURAL JOIN Candidate
      WHERE YEAR = ${req.query.filteryear}
      AND (PARTY IS NULL OR (PARTY != 'Republican' AND PARTY != 'Democrat'))
    ), Percent AS (
      SELECT FIPS, ((Other / Total) * 100) AS Percent
      FROM TotalVotes2 NATURAL JOIN OtherVotes2
    )
    SELECT FIPS
    FROM Percent
    WHERE Percent ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter === 'TotalGDP') {
    const q = `
    SELECT FIPS
    FROM GDP
    WHERE INDUSTRY_ID = 0 AND YEAR = ${req.query.filteryear} AND (GDP / 1000) ${op} ${req.query.val}
    `;
    return q;
  } else if (req.query.filter.startsWith('Industry')) {
    let indID = req.query.filter.substr(8);
    const q = `
    WITH TotalGDP AS (
      SELECT FIPS, GDP AS Total
      FROM GDP
      WHERE INDUSTRY_ID = 0 AND YEAR = ${req.query.filteryear}
    ), IndustryGDP AS (
      SELECT FIPS, GDP
      FROM GDP
      WHERE YEAR = ${req.query.filteryear} AND INDUSTRY_ID = ${indID}
    ), Percent AS (
      SELECT FIPS, ((GDP / Total) * 100) AS Percent
      FROM TotalGDP NATURAL JOIN IndustryGDP
    )
    SELECT FIPS
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
  getFilterQuery: getFilterQuery
}
