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
export const HEADSHOTS_LINKS = {
    "Donald Trump": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
    "Hillary Clinton": "https://pbs.twimg.com/profile_images/1291192333199958017/SvH8J8_P_400x400.jpg",
    "Barack Obama": "https://pbs.twimg.com/profile_images/822547732376207360/5g0FC8XX_400x400.jpg",
    "Mitt Romney": "https://pbs.twimg.com/profile_images/964489716622966784/xbtCe2td_400x400.jpg",
    "John McCain": "https://pbs.twimg.com/profile_images/898243253362929664/y1gCTcz1_400x400.jpg",
    "John Kerry": "https://pbs.twimg.com/profile_images/1205176184906092545/fI6BP6PK_400x400.jpg",
    "George W. Bush": "https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-0/p370x247/14322372_1221565084552548_1092844472382230015_n.jpg?_nc_cat=108&_nc_sid=85a577&_nc_ohc=Yd5f9oCtMucAX-rkcHL&_nc_ht=scontent-lga3-1.xx&tp=6&oh=671b5fc6d878b5e9642158b8a44442f9&oe=5FA462D6",
    "Al Gore": "https://pbs.twimg.com/profile_images/1288163528340320257/ieQgrnv8_400x400.jpg",
}
export const INDUSTRY_ICON_LINKS = {
    "Agriculture, forestry, fishing and hunting": "https://img.icons8.com/pastel-glyph/2x/corn.png",
    "Mining, quarrying, and oil and gas extraction": "https://img.icons8.com/pastel-glyph/2x/oil-pump-jack.png",
    "Utilities": "https://img.icons8.com/pastel-glyph/2x/electricity.png",
    "Construction": "https://img.icons8.com/pastel-glyph/2x/worker-male.png",
    "Durable goods manufacturing": "https://img.icons8.com/pastel-glyph/2x/factory.png",
    "Nondurable goods manufacturing": "https://img.icons8.com/pastel-glyph/2x/factory.png",
    "Wholesale trade": "https://img.icons8.com/pastel-glyph/2x/warehouse.png",
    "Retail trade": "https://img.icons8.com/pastel-glyph/2x/shopping-cart.png",
    "Transportation and warehousing": "https://img.icons8.com/pastel-glyph/2x/truck.png",
    "Information": "https://img.icons8.com/pastel-glyph/2x/monitor.png",
    "Finance and insurance": "https://img.icons8.com/pastel-glyph/2x/investment.png",
    "Real estate and rental and leasing": "https://img.icons8.com/pastel-glyph/2x/home.png",
    "Professional, scientific, and technical services": "https://img.icons8.com/pastel-glyph/2x/online-support.png",
    "Management of companies and enterprises": "https://img.icons8.com/pastel-glyph/2x/business-group.png",
    "Administrative and support and waste management and remediation services": "https://img.icons8.com/pastel-glyph/2x/trust.png",
    "Educational services": "https://img.icons8.com/pastel-glyph/2x/teacher.png",
    "Health care and social assistance": "https://img.icons8.com/pastel-glyph/2x/clinic.png",
    "Arts, entertainment, and recreation": "https://img.icons8.com/pastel-glyph/2x/theatre-mask.png",
    "Accommodation and food services": "https://img.icons8.com/pastel-glyph/2x/meal.png",
    "Other services (except government and government enterprises)": "https://img.icons8.com/pastel-glyph/2x/trust.png",
    "Government and government enterprises": "https://img.icons8.com/pastel-glyph/2x/obelisk.png",
}
export const STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
    "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
    "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
    "AS", "GU", "MP", "PR", "VI"
];
