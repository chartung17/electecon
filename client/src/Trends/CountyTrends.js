import React, { useEffect, useState } from 'react';
import { getCountyElectionResult } from '../County/CountyApi';
import CountyFinder from '../County/CountyFinder';
import ElectionGraph from './ElectionGraph';

function CountyTrends() {
    let ERR_HANDLER = (err) => {
        console.log(err)
    };

    const [fips, setFips] = useState(null);
    const [electionData, setElectionData] = useState(null);

    // if fips changes, fetch new election results
    useEffect(() => {
        // call api to get election results
        getCountyElectionResult(fips, ERR_HANDLER).then(electionData => {
            setElectionData(electionData);
        })
    }, [fips]);

    return (
        <div >
            <CountyFinder getNewCounty={setFips}></CountyFinder>
            <ElectionGraph data={electionData} />
        </div>
    );
}

export default CountyTrends;