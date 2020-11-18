import React, { useEffect, useState } from 'react';
import { getCountyElectionResult } from '../County/CountyApi';
import CountyFinder from '../County/CountyFinder';
import ElectionGraph from './ElectionGraph';

function CountyTrends() {
    const [fips, setFips] = useState(null);
    const [electionData, setElectionData] = useState(null);

    // if fips changes, fetch new election results
    useEffect(() => {
        getCountyElectionResult(fips).then(electionData => {
            setElectionData(electionData["electionResult"]);
        })
    }, [fips]);

    if (fips && electionData) {
        return (
            <div id="CountyTrends">
                <div id="Finder" >
                <CountyFinder getNewCounty={setFips}/>
                </div>
                <div id="CountyGraphs" >
                <ElectionGraph data={electionData} />
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
