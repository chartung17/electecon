import {INDUSTRY_ICON} from "./Constants";

const C = require('./Constants')

/**
 * Compute a county's party preference over the last 5 elections
 *
 * Scale: 0 to 100
 *        0   = ALL votes goes to Democrats
 *        100 = ALL votes goes to Republican
 *
 * More weight given to more recent elections.
 *
 * Preference = \sum_{Election Years} weight_{Year} * \frac{RepPct_{Year}}{TotalVote_{Year}}
 *
 * Adjustment:
 *   Preference += 10 if Republican won >= 4 of the last 5 elections
 *   Preference -= 10 if Democrats won  >= 4 of the last 5 elections
 *   Rationale: avoid marking county where one party *always* gather 55~65% votes as 'Swing' county
 *
 * @param electionResult
 * @returns number
 */
export function getPartyPreference(electionResult) {
    let length = electionResult.length;
    if (length !== 5) return 50;

    let preference = 0;         // weighted avg of # Republican Votes / # Total Vote
    let weight = [0.5, 0.2, 0.2, 0.05, 0.05];  // more weight for more recent elections
    let repWinCount = 0;        // # of election won by Republican

    // result sorted by most recent first
    electionResult.forEach((value, index) => {
        let totalVote = parseInt(value["TotalVote"])
        let repPct = parseInt(value["RepVote"]) * 100 / totalVote;
        let demPct = parseInt(value["DemVote"]) * 100 / totalVote;
        repWinCount += repPct > demPct ? 1 : 0;
        preference += (repPct * weight[index]);
    });

    // bonus 10pp if either party won 4 or more of the last 5 elections
    if (repWinCount >= 4) preference = Math.min(100, preference + 10)
    if (repWinCount <= 2) preference = Math.max(0, preference - 10)
    return preference;
}


/**
 * Compute basic election stats
 *
 * @param electionResult
 * @returns {{WinnerLead: number, WinnerParty: string, WinnerCount: number, LastNumVotes: number, NumVoteChangePct2001: number, NumVoteChangePct2012: number}}
 */
export function getStats(electionResult) {
    let repWinCount = 0;
    let demWinCount = 0;
    let demWinLead = 0;
    let repWinLead = 0;
    let totalVote2001 = 0;
    let totalVote2012 = 0;
    let totalVote2016 = 0;

    electionResult.forEach((value, index) => {
        const totalVote = parseInt(value["TotalVote"])
        let demPct = parseInt(value["DemVote"]) * 100 / totalVote;
        let repPct = parseInt(value["RepVote"]) * 100 / totalVote;

        if (repPct > demPct) {
            repWinCount += 1
            repWinLead += repPct - demPct
        } else {
            demWinCount += 1
            demWinLead += demPct - repPct
        }
        if (index === 0) totalVote2016 = totalVote;
        if (index === 3) totalVote2012 = totalVote;
        if (index === 4) totalVote2001 = totalVote;
    });
    return {
        "WinnerParty": (repWinCount >= 3 ? 'Republican' : 'Democratic'),
        "WinnerCount": (repWinCount >= 3 ? repWinCount : 5 - repWinCount),
        "WinnerLead": (repWinCount >= 3 ? repWinLead / repWinCount : demWinLead / demWinCount),
        "LastNumVotes": totalVote2016,
        "NumVoteChangePct2001": 100 * ((totalVote2016 / totalVote2001) - 1),
        "NumVoteChangePct2012": 100 * ((totalVote2012 / totalVote2001) - 1),
    };
}


export function isGDPDataValid(gdpData) {
    if (gdpData === undefined || gdpData === C.PLACEHOLDER_GDP_DATA || gdpData.includes(null) || gdpData.length !== 18) {
        return false;
    }
    for (const gdpDatum of gdpData) {
        if (isNaN(gdpDatum) || gdpDatum <= 0) {
            return false;
        }
    }
    return true;
}

export function isElectionDataValid(electionData) {
    console.log(electionData)
    if (electionData === undefined || electionData === C.PLACEHOLDER_ELECTION_RESULT || electionData.includes(null) || electionData.length !== 5) {
        return false;
    }
    for (const electionDatum of electionData) {
        if (electionDatum["TotalVote"] <= 0) {
            return false;
        }
    }
    return true;
}

export function getTotalGDP(gdpData) {
    return `$${(gdpData[gdpData.length - 1] / 1E6).toFixed(1)} bn`;
}

export function getGDPCAGR(gdpData) {
    return `${(100 * (Math.pow((gdpData[gdpData.length - 1] / gdpData[0]), 1 / (gdpData.length)) - 1)).toFixed(2)}%`;
}

export function getGrowthChartData(gdpData) {
    let growthChartData = [[{type: 'string', label: 'Year'}, {type: 'number', label: 'Growth'}]];
    for (let i = 1; i < gdpData.length; i++) {
        growthChartData.push([(2001 + i) + "", 100 * ((gdpData[i] / gdpData[i - 1]) - 1)]);
    }
    return growthChartData;
}


export function getTileData(data, INDUSTRY_ICON_PATH) {
    return [
        [
            {"id": "total-gdp-number", "type": "value", "title": "GDP\n\n(2018)", "value": getTotalGDP(data.gdpData)},
            {
                "id": "gdp-cagr-number",
                "type": "value",
                "title": "Avg. Annual Growth\n(2001-2018)",
                "value": getGDPCAGR(data.gdpData)
            },
            {
                "id": "top-industry-icon",
                "type": "icon",
                "title": "Top Industry",
                "caption": data.topIndustry[0]["Description"],
                "src": `${INDUSTRY_ICON_PATH}/${INDUSTRY_ICON[data.topIndustry[0]["Description"]]}`
            }
        ],
        [
            {"id": "state-gdp-rank", "type": "value", "title": "State GDP Rank", "value": data.stateGDPRank},
            {
                "id": "gdp-growth-percentile",
                "type": "value",
                "title": "Avg. Annual Growth National Percentile",
                "value": data.GDPGrowthPercentile
            },
            {
                "id": "growing-industry-icon",
                "type": "icon",
                "title": "Fastest Growing Industry",
                "caption": data.fastestGrowingIndustry[0]["Description"],
                "src": `${INDUSTRY_ICON_PATH}/${INDUSTRY_ICON[data.fastestGrowingIndustry[0]["Description"]]}`
            },
        ]
    ];
}
