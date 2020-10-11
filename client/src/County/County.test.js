const chromedriver = require('chromedriver');
const webdriver = require('selenium-webdriver')
const assert = require('assert');
const data = require('./Constants');

const SERVER_ROOT = `http://${process.env.HOST}:${process.env.PORT}`
const COUNTY_ENDPOINT = SERVER_ROOT + "/county"

let driver;
const args = ["--headless", "--no-sandbox", "--disable-gpu"];


describe('County Page Tests', () => {
    beforeEach(async () => {
        driver = new webdriver.Builder().forBrowser('chrome').build();
    })
    afterEach(async () => {
        chromedriver.stop();
        driver.quit();
    })
    it('should load all county of the state in County Finder panel', async () => {
        chromedriver.start(args, true).then(
            async () => {
                await driver.get(COUNTY_ENDPOINT).then(async () => {
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
                            await driver.wait(until.elementLocated(By.id(`btn-state-${data["State"]}`)), 5000);
                            await driver.findElement(By.id(`btn-state-${data["State"]}`))
                                .then(async (element) => {
                                    element.click();
                                })
                            await driver.wait(until.elementLocated(By.id(`btn-county-${data["Counties"][0]}`)), 5000);
                            await driver.findElements(By.className("btn-county")).then(
                                async (elements) => {
                                    let actual = [];
                                    for (let element of elements) {
                                        await element.getText().then((countyName) => actual.push(countyName));
                                    }
                                    assert(actual.every(county => data["Counties"].includes(county)));
                                }
                            )
                        }
                    }
                );
            }
        );
    });
    it('should show placeholder value on start', async () => {
        chromedriver.start(args, true).then(
            async () => {
                await driver.get(COUNTY_ENDPOINT).then(async () => {
                    await driver.wait(until.elementLocated(By.className(`county-name`)), 5000);
                    await driver.findElement(By.className(`county-name`)).getText()
                        .then(async (text) => {
                            assert(text === "County Name, State")
                        })

                    await driver.wait(until.elementLocated(By.className(`total-gdp-number`)), 5000);
                    await driver.findElement(By.className(`total-gdp-number`)).getText()
                        .then(async (text) => {
                            assert(text === "$0.0 bn")
                        })

                    await driver.wait(until.elementLocated(By.className(`gdp-cagr-number`)), 5000);
                    await driver.findElement(By.className(`gdp-cagr-number`)).getText()
                        .then(async (text) => {
                            assert(text === "N/A %")
                        })

                    await driver.wait(until.elementLocated(By.className(`top-gdp-bar`)), 5000);
                    await driver.findElements(By.className(`top-gdp-bar`)).then(
                        async (elements) => {
                            for (const element of elements) {
                                await element.getCssValue("width")
                                    .then(async (width) => {
                                        assert(width === "0px")
                                    })
                            }
                        }
                    )
                })
            });
    });
    it('should load all the states in County Finder panel', async () => {
        chromedriver.start(args, true).then(async () => {
            await driver.get(COUNTY_ENDPOINT).then(
                async () => {
                    await driver.findElements(By.className("btn-state"))
                        .then(async (elements) => {
                            let states = [];
                            for (const el of elements) {
                                await el.getText().then((stateName) => {
                                    states.push(stateName)
                                });
                            }
                            assert(states.every(state => data.states.includes(state)));
                        });
                }
            );
        });
    });
});
