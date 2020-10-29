import React from 'react';
/**
 * Display a graph of election data
 * @param  {} props ElectionData object
 */
function ElectionGraph(props) {
    
    if (!props.data) {
        return (
            <div id="ElectionGraph">No election data found.</div>
        )
    }

    return(
        <div>ElectionGraph</div>
    );
}

export default ElectionGraph;