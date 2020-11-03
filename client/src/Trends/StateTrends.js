import React, { useEffect, useState } from 'react';
import ElectionGraph from './ElectionGraph';
import { StateFinder } from './StateFinder';
import {getStateElectionResult} from './TrendsApi';

function StateTrends() {
    const [currentState, setCurrentState] = useState(null);
    const [electionData, setElectionData] = useState(null);

    useEffect(() => {
        if (currentState != null) {
            getStateElectionResult(currentState.STATE).then(electionData => {
                setElectionData(electionData);
            })
        }
    }, [currentState]);

    if (currentState && electionData) {
        return (
            <div id="StateTrends">
                <div id="Finder" >
                    <StateFinder getNewState={setCurrentState}/>
                </div>
                <div id="StateGraphs" >
                    <ElectionGraph data={electionData} />
                </div>
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