import React, { useEffect, useState } from 'react';
import ElectionGraph from './ElectionGraph';
import GDPGraph from './GDPGraph';
import { StateFinder } from './StateFinder';
import {getStateElectionResult, getStateGDPData} from './TrendsApi';

function StateTrends() {
    const [currentState, setCurrentState] = useState(null);
    const [electionData, setElectionData] = useState(null);
    const [gdpData, setGDPdata] = useState(null);

    useEffect(() => {
        if (currentState != null) {
            getStateElectionResult(currentState.STATE).then(electionData => {
                setElectionData(electionData);
            });
            getStateGDPData(currentState.STATE).then(gdpData => {
                setGDPdata(gdpData);
            });
        }
    }, [currentState]);

    if (currentState) {
        return (
            <div id="StateTrends">
                <div id="Finder" >
                    <StateFinder getNewState={setCurrentState}/>
                </div>
                <div id="StateGraphs" >
                    <ElectionGraph data={electionData} />
                    <GDPGraph gdpData={gdpData}/>
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