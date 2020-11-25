import React from 'react';
import { IndustrySelector } from './IndustrySelector';
import IndustryGraph from './IndustryGraph';

/**
 * 
 * @param {*} props 
 */
export function IndustryPanel(props) {

    if (!props.industry) {
        return(
            <div id="industrypanel">
            <IndustrySelector handleUpdate={props.setIndustry} />
            </div>
        );
    }

    return(
        <div id="industrypanel" >
            <IndustrySelector handleUpdate={props.setIndustry} />
            <IndustryGraph industryGDP={props.industryGDP} gdp={props.gdp}/>
        </div>
    );
}