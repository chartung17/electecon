import React, { useEffect, useState } from 'react';
import { StateFinder } from './StateFinder';
import {getStateElectionResult, getStateGDPData, getStateIndustryGDP} from './TrendsApi';
import TrendsContainer from './TrendsContainer';

function StateTrends() {
    const [currentState, setCurrentState] = useState(null);
    const [industry, setIndustry] = useState(null);
    const [electionData, setElectionData] = useState(null);
    const [gdpData, setGDPdata] = useState(null);
    const [industryGDP, setIndustryGDP] = useState(null);

    useEffect(() => {
        getStateElectionResult(currentState).then(electionData => {
            setElectionData(electionData);
        });
        getStateGDPData(currentState).then(gdpData => {
            setGDPdata(gdpData);
        });
        getStateIndustryGDP(currentState, industry).then(data => {
            setIndustryGDP(data);
        });
    }, [currentState, industry]);

    if (currentState) {
        return (
            <div id="StateTrends">
                <div id="Finder" >
                    <StateFinder getNewState={setCurrentState}/>
                </div>
                <TrendsContainer electionData={electionData} gdpData={gdpData} industry={industry} industryGDP={industryGDP} setIndustry={setIndustry}/>
            </div>
        );
    } else {
        return (
            <div id="Finder" >
                <StateFinder getNewState={setCurrentState}/>
            </div>
        )
    }
}

export default StateTrends;