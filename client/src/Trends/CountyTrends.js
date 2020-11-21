import React, { useEffect, useState } from 'react';
import { getCountyElectionResult } from '../County/CountyApi';
import {getCountyGDPData} from './TrendsApi';
import CountyFinder from '../County/CountyFinder';
import ElectionGraph from './ElectionGraph';
import GDPGraph from './GDPGraph';

function CountyTrends() {
    const [fips, setFips] = useState(null);
    const [electionData, setElectionData] = useState(null);
    const [gdpData, setGDPdata] = useState(null);

    // if fips changes, fetch new election results
    useEffect(() => {
        getCountyElectionResult(fips)
        .then(electionData => {
            setElectionData(electionData["electionResult"]);
        });
        getCountyGDPData(fips)
            .then(data => setGDPdata(data));
    }, [fips]);

    if (fips && electionData) {
        return (
            <div id="CountyTrends">
                <div id="Finder" >
                <CountyFinder getNewCounty={setFips}/>
                </div>
                <div id="CountyGraphs" >
                <ElectionGraph data={electionData} />
                <GDPGraph gdpData={gdpData} />
                </div>
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
