import React, { useEffect, useState } from 'react';
import { getCountyElectionResult, getCountyNameState } from '../County/CountyApi';
import {getCountyGDPData, getCountyIndustryGDP} from './TrendsApi';
import CountyFinder from '../County/CountyFinder';
import TrendsContainer from './TrendsContainer';
import 'bootstrap/dist/css/bootstrap.css';

function CountyTrends() {
    const [fips, setFips] = useState(null);
    const [countyName, setCountyName] = useState(null);
    const [stateName, setStateName] = useState(null);
    const [industry, setIndustry] = useState(null);
    const [electionData, setElectionData] = useState(null);
    const [gdpData, setGDPdata] = useState(null);
    const [industryGDP, setIndustryGDP] = useState(null);

    // if fips changes, fetch new election results, new gdp data
    useEffect(() => {
        // fetch new election results
        getCountyElectionResult(fips)
        .then(electionData => {
            setElectionData(electionData["electionResult"]);
        });
        getCountyNameState(fips).then(data => {
            setCountyName(data["countyName"]);
            setStateName(data["countyState"]);
        })
        // fetch new county gdp data
        getCountyGDPData(fips)
            .then(data => setGDPdata(data));
        getCountyIndustryGDP(fips, industry)
            .then(data => setIndustryGDP(data));
    }, [fips, industry]);

    if (fips) {
        return (
            <div id="CountyTrends">
                <div id="Finder" >
                <CountyFinder getNewCounty={setFips}/>
                </div>
                <h2>County: {countyName}, {stateName}</h2>
                <TrendsContainer electionData={electionData} gdpData={gdpData} industry={industry} industryGDP={industryGDP} setIndustry={setIndustry}/>
            </div>
        );
    } else {
        return (
            <div id="Finder" >
            <CountyFinder getNewCounty={setFips}/>
            </div>
        );
    }
}

export default CountyTrends;
