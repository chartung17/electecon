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
                <div className="card">
                    <div className="card-body">
                    <IndustrySelector handleUpdate={props.setIndustry} />
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div id="industrypanel" >
            <div className="card">
                <div className="card-body">
                    <IndustrySelector handleUpdate={props.setIndustry} />
                </div>
            </div>
            <IndustryGraph industryGDP={props.industryGDP} gdp={props.gdp}/>
        </div>
    );
}