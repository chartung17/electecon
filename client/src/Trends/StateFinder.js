import React, { useEffect, useState } from 'react';
import { getStates } from './TrendsApi';

export function StateFinder(props) {
    const [states, setStates] = useState(null);

    // fetch states
    useEffect(() => {
        getStates().then(result => {
            setStates(result);
        })
    }, []);

    if (states) {
        return (
            <div className={"state-finder container"}>
                <div id={"state-finder"} className={"row"}>
                    <h2><b>Find a state:</b></h2>
                </div>
                <div className={"row"}>
                    <table>
                        <tbody>
                            <tr id={"state-finder-state-container"}>
                                <td><b>State</b></td>
                                <td>
                                    {
                                        states.map((state, index) => {
                                            return (
                                                <div className={"btn btn-state"}
                                                key={index}
                                                onClick={() => props.getNewState(state)}
                                                id={`btn-state-${state}`}>
                                                {state.STATE}    
                                                </div>
                                            )
                                        })
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    } else {
        return (
            <div id = "StateFinder">
                Loading States
            </div>
        )
    }
}