export const PLACEHOLDER_GDP_DATA = Array(18).fill(0);
export const PLACEHOLDER_TOP_INDUSTRY = Array.from({length: 5}).fill({"Description": "", "GDP": 0});
export const PLACEHOLDER_GROWING_INDUSTRY = Array.from({length: 5}).fill({"Description": "", "Growth": "0"});
export const PLACEHOLDER_ELECTION_RESULT = [
    {
        "Year": 2016, "DemCandidate": "Hillary Clinton",
        "RepCandidate": "Donald Trump", "DemVote": 0, "RepVote": 0, "TotalVote": 0
    },
    {
        "Year": 2012, "DemCandidate": "Barack Obama",
        "RepCandidate": "Mitt Romney", "DemVote": 0, "RepVote": 0, "TotalVote": 0
    },
    {
        "Year": 2008, "DemCandidate": "Barack Obama",
        "RepCandidate": "John McCain", "DemVote": 0, "RepVote": 0, "TotalVote": 0
    },
    {
        "Year": 2004, "DemCandidate": "John Kerry",
        "RepCandidate": "George W. Bush", "DemVote": 0, "RepVote": 0, "TotalVote": 0
    },
    {
        "Year": 2000, "DemCandidate": "Al Gore",
        "RepCandidate": "George W. Bush", "DemVote": 0, "RepVote": 0, "TotalVote": 0
    },
];
export const PLACEHOLDER_STATE_GDP_RANK = "N/A";
export const PLACEHOLDER_GDP_GROWTH_PERCENTILE = "N/A";

export const CANDIDATE_IMAGE = {
    "Donald Trump": "donald_trump.jpg",
    "Hillary Clinton": "hillary_clinton.jpg",
    "Barack Obama": "barack_obama.jpg",
    "Mitt Romney": "mitt_romney.jpg",
    "John McCain": "john_mccain.jpg",
    "John Kerry": "john_kerry.jpg",
    "George W. Bush": "george_bush.jpg",
    "Al Gore": "al_gore.jpg",
}
export const INDUSTRY_ICON = {
    "Agriculture, forestry, fishing and hunting": "industry_02.png",
    "Mining, quarrying, and oil and gas extraction": "industry_03.png",
    "Utilities": "industry_04.png",
    "Construction": "industry_05.png",
    "Durable goods manufacturing": "industry_07.png",
    "Nondurable goods manufacturing": "industry_08.png",
    "Wholesale trade": "industry_09.png",
    "Retail trade": "industry_10.png",
    "Transportation and warehousing": "industry_11.png",
    "Information": "industry_12.png",
    "Finance and insurance": "industry_14.png",
    "Real estate and rental and leasing": "industry_15.png",
    "Professional, scientific, and technical services": "industry_17.png",
    "Management of companies and enterprises": "industry_18.png",
    "Administrative and support and waste management and remediation services": "industry_19.png",
    "Educational services": "industry_21.png",
    "Health care and social assistance": "industry_22.png",
    "Arts, entertainment, and recreation": "industry_24.png",
    "Accommodation and food services": "industry_25.png",
    "Other services (except government and government enterprises)": "industry_26.png",
    "Government and government enterprises": "industry_27.png",
}
export const STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
    "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
    "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];
