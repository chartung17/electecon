let db = require('./database')
let [pool, execQuery] = [db.pool, db.execQuery]
let util = require('./helpers')

/**
 * Get the Abbreviations for all states
 * 
 * @param  {} req
 * @param  {} res
 */
function getStates(req, res) {
    const q = `
    Select Distinct STATE
    FROM County
    WHERE STATE NOT IN ('AS', 'GU', 'MP', 'PR', 'VI')
    `;
    execQuery(q, res);
}
/**
 * Get election results for a state
 * @param  {} req
 * @param  {} res
 */
function getStateElectionResults(req, res) {
    const q = `
    WITH DEM_ELECTION AS(
        Select E.YEAR as Year, Ca.CANDIDATE_NAME as DemCandidate, SUM(CANDIDATE_VOTES) as DemVote
        From Candidate Ca Join Election E on Ca.CANDIDATE_ID = E.CANDIDATE_ID
	        Join County Co on Co.FIPS = E.FIPS
        Where Ca.PARTY = 'Democrat' AND Co.State=${pool.escape(req.query.state)}
        Group By E.YEAR
        Order By E.YEAR
    ),
    REP_ELECTION AS (
        Select E.YEAR as Year, Ca.CANDIDATE_NAME as RepCandidate, SUM(CANDIDATE_VOTES) as RepVote
        From Candidate Ca Join Election E on Ca.CANDIDATE_ID = E.CANDIDATE_ID
	        Join County Co on Co.FIPS = E.FIPS
        Where Ca.PARTY = 'Republican' AND Co.State=${pool.escape(req.query.state)}
        Group By E.YEAR
        Order By E.YEAR
    )
    Select D.Year, D.DemCandidate, R.RepCandidate, D.DemVote, R.RepVote, (D.DemVote + R.RepVote) as TotalVote
    From DEM_ELECTION D Join REP_ELECTION R on D.Year = R.Year;
    `;
    execQuery(q, res);
}

function getNationalElectionResults(req, res) {
    const q = `
    WITH DEM_ELECTION AS(
        Select E.YEAR as Year, Ca.CANDIDATE_NAME as DemCandidate, SUM(CANDIDATE_VOTES) as DemVote
        From Candidate Ca Join Election E on Ca.CANDIDATE_ID = E.CANDIDATE_ID
	        Join County Co on Co.FIPS = E.FIPS
        Where Ca.PARTY = 'Democrat'
        Group By E.YEAR
        Order By E.YEAR
    ),
    REP_ELECTION AS (
        Select E.YEAR as Year, Ca.CANDIDATE_NAME as RepCandidate, SUM(CANDIDATE_VOTES) as RepVote
        From Candidate Ca Join Election E on Ca.CANDIDATE_ID = E.CANDIDATE_ID
	        Join County Co on Co.FIPS = E.FIPS
        Where Ca.PARTY = 'Republican'
        Group By E.YEAR
        Order By E.YEAR
    )
    Select D.Year, D.DemCandidate, R.RepCandidate, D.DemVote, R.RepVote, (D.DemVote + R.RepVote) as TotalVote
    From DEM_ELECTION D Join REP_ELECTION R on D.Year = R.Year;
    `;
    execQuery(q, res);
}


module.exports = {
    getStates: getStates,
    getStateElectionResults: getStateElectionResults,
    getNationalElectionResults: getNationalElectionResults,
}
