require('chromedriver');
const webdriver = require('selenium-webdriver')
const By = webdriver.By, until = webdriver.until;
const assert = require('assert');
const data = require('./Constants');

const ENDPOINT = `http://localhost:3000/county`
const TIMEOUT = 60000;

async function getDriver() {
    return new webdriver.Builder().forBrowser('chrome') .build();
}

describe('County Page Tests', () => {
    let driver;

    beforeEach(async () => {
        driver = await getDriver();
    }, TIMEOUT)
    afterEach(async () => {
        if (driver) await driver.quit();
    }, TIMEOUT)

    it("it should have correct title", async () => {
        await driver.get(ENDPOINT);
        let title = await driver.getTitle();
        assert(title === 'County Details');
    }, TIMEOUT);

    it('should display the fifty states in County Finder', async () => {
        await driver.get(ENDPOINT);
        await driver.findElements(By.className("btn-state"))
            .then(async (elements) => {
                let states = [];
                for (const el of elements) {
                    await el.getText().then((stateName) => {
                        states.push(stateName)
                    });
                }
                assert(data.STATES.every(state => states.includes(state)));
                assert(states.includes('DC'))
            });
    }, TIMEOUT);

    it('should load all county of the state in County Finder panel', async () => {
        let dataset = [
            {"State": "RI", "Counties": ["Bristol", "Kent", "Newport", "Providence", "Washington"]},
            {
                "State": "MA", "Counties": [
                    "Barnstable", "Berkshire", "Bristol", "Dukes", "Essex", "Franklin", "Hampden",
                    "Hampshire", "Middlesex", "Nantucket", "Norfolk", "Plymouth", "Suffolk", "Worcester"
                ]
            },
        ]
        for (const data of dataset) {
            await driver.get(ENDPOINT);
            await driver.wait(until.elementLocated(By.id(`btn-state-${data["State"]}`)), TIMEOUT);
            await driver.findElement(By.id(`btn-state-${data["State"]}`))
                .then(async (element) => {
                    element.click();
                })
            await driver.wait(until.elementLocated(By.id(`btn-county-${data["Counties"][0]}`)), TIMEOUT);
            await driver.findElements(By.className("btn-county")).then(
                async (elements) => {
                    let actual = [];
                    for (let element of elements) {
                        await element.getText().then((countyName) => actual.push(countyName));
                    }
                    assert(data["Counties"].every(county => actual.includes(county)));
                    assert(actual.includes(data["Counties"][0]));
                }
            )
        }
    }, TIMEOUT);

    it('should load the correct data', async () => {
        let dataset = [
            {
                "FIPS": "15003",
                "State": "HI",
                "County": "Honolulu",
                "CountyTitle": "Honolulu, HI",
                "GDPAggr": "$69.3 bn",
                "GDPGrowth": "4.22%",
                "StateGDPRank": "1 / 3",
                "GDPGrowthPercentile": "73.5%",
                "Top5Industry": {
                    "Government and government enterprises": "22.5",
                    "Real estate and rental and leasing": "17.8",
                    "Accommodation and food services": "7.1",
                    "Health care and social assistance": "7.0",
                    "Retail trade": "6.0",
                },
                "GrowingIndustries": {
                    "Mining, quarrying, and oil and gas extraction": "6.3",
                    "Construction": "6.0",
                    "Transportation and warehousing": "5.5",
                    "Management of companies and enterprises": "4.9",
                    "Real estate and rental and leasing": "4.8"
                },
                "BulletPoints": {
                    0: "Democratic candidates won 5 out of the last 5 general elections in Honolulu County, HI.",
                    1: "The Democratic winners, on average, lead by 25.6 percentage point.",
                    2: "285790 in Honolulu County voted 2016 election, a 16.6% increase to that of 2012, a 11.6% increase to that of 2001.",
                    3: "Honolulu County joins 3 other counties in HI that pre-dominantly voted for Democratic candidate in 2016, out of the 3 counties in the HI."
                },
                "ElectionResult": {
                    0: {"DemPct": "61.5%", "RepPct": "31.6%", "DemVote": "175696", "RepVote": "90326"},
                    1: {"DemPct": "68.9%", "RepPct": "29.8%", "DemVote": "204349", "RepVote": "88461"},
                    2: {"DemPct": "69.8%", "RepPct": "28.7%", "DemVote": "214239", "RepVote": "88164"},
                    3: {"DemPct": "51.1%", "RepPct": "48.3%", "DemVote": "152500", "RepVote": "144157"},
                    4: {"DemPct": "54.5%", "RepPct": "39.6%", "DemVote": "139618", "RepVote": "101310"}
                }
            },
        ];

        let keySelector = {
            "CountyTitle": "#county-name",
            "GDPAggr": "#total-gdp-number",
            "GDPGrowth": "#gdp-cagr-number",
            "StateGDPRank": "#state-gdp-rank",
            "GDPGrowthPercentile": "#gdp-growth-percentile",
        }

        for (const data of dataset) {
            await driver.get(ENDPOINT.concat(`/${data["FIPS"]}`));
            await driver.wait(until.elementLocated(By.css(keySelector["CountyTitle"])), TIMEOUT)

            for (let key of Object.keys(keySelector)) {
                await driver.wait(until.elementLocated(By.css(keySelector[key])), TIMEOUT)
                assert(data[key] === await driver.findElement(By.css(keySelector[key]), TIMEOUT).getText())
            }

            for (const i of Array(5).keys()) {
                let selector1 = `#top-gdp-desc-${i}`;
                let selector2 = `#top-gdp-value-${i}`;
                let d = data['Top5Industry'];
                await driver.wait(until.elementLocated(By.css(selector1)), TIMEOUT)
                await driver.wait(until.elementLocated(By.css(selector2)), TIMEOUT)
                assert(Object.keys(d)[i] === await driver.findElement(By.css(selector1), TIMEOUT).getText())
                assert(d[Object.keys(d)[i]] === await driver.findElement(By.css(selector2), TIMEOUT).getText())
            }

            for (const i of Array(5).keys()) {
                let selector1 = `#growing-industry-desc-${i}`;
                let selector2 = `#growing-industry-value-${i}`;
                let d = data['GrowingIndustries'];
                await driver.wait(until.elementLocated(By.css(selector1)), TIMEOUT)
                await driver.wait(until.elementLocated(By.css(selector2)), TIMEOUT)
                assert(Object.keys(d)[i] === await driver.findElement(By.css(selector1), TIMEOUT).getText())
                assert(d[Object.keys(d)[i]] === await driver.findElement(By.css(selector2), TIMEOUT).getText())
            }

            for (const i of Array(4).keys()) {
                let selector = `#elec-points-${i}`;
                let d = data['BulletPoints'];
                await driver.wait(until.elementLocated(By.css(selector)), TIMEOUT)
                assert(d[i] === await driver.findElement(By.css(selector), TIMEOUT).getText())
            }
            for (const i of Array(4).keys()) {
                let selector0 = `#elec-dem-pct-${i}`;
                let selector1 = `#elec-dem-vote-${i}`;
                let selector2 = `#elec-rep-pct-${i}`;
                let selector3 = `#elec-rep-vote-${i}`;
                let d = data['ElectionResult'][i];
                await driver.wait(until.elementLocated(By.css(selector0)), TIMEOUT)
                await driver.wait(until.elementLocated(By.css(selector1)), TIMEOUT)
                await driver.wait(until.elementLocated(By.css(selector2)), TIMEOUT)
                await driver.wait(until.elementLocated(By.css(selector3)), TIMEOUT)
                assert(d["DemPct"] === await driver.findElement(By.css(selector0), TIMEOUT).getText())
                assert(`(${d["DemVote"]})` === await driver.findElement(By.css(selector1), TIMEOUT).getText())
                assert(`  ${d["RepPct"]}` === await driver.findElement(By.css(selector2), TIMEOUT).getText())
                assert(`  (${d["RepVote"]})` === await driver.findElement(By.css(selector3), TIMEOUT).getText())
            }
        }
    }, TIMEOUT);
});
