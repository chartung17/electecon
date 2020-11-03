import React, { useEffect, useState} from 'react';
import ElectionGraph from './ElectionGraph';
import { getNationalElectionResult } from './TrendsApi';

function NationalTrends() {

    const [electionData, setElectionData] = useState(null);

    useEffect(() => {
        getNationalElectionResult().then(electionData => {
            setElectionData(electionData);
        })
    }, []);

    return(
        <div id="NationalTrends">
            <ElectionGraph data={electionData} />
        </div>
    );
}

export default NationalTrends;