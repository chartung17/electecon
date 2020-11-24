import React, { useEffect, useState} from 'react';
import ElectionGraph from './ElectionGraph';
import GDPGraph from './GDPGraph';
import { getNationalElectionResult, getNationalGDPData} from './TrendsApi';

function NationalTrends() {

    const [electionData, setElectionData] = useState(null);
    const [gdpData, setGDPdata] = useState(null);

    useEffect(() => {
        getNationalElectionResult().then(electionData => {
            setElectionData(electionData);
        });
        getNationalGDPData().then(gdpData => {
            setGDPdata(gdpData);
        })
    }, []);

    return(
        <div id="NationalTrends">
            <ElectionGraph data={electionData} />
            <GDPGraph gdpData={gdpData} />
        </div>
    );
}

export default NationalTrends;