import React from 'react';
import ElectionGraph from './ElectionGraph';
import GDPGraph from './GDPGraph';
import { IndustryPanel } from './IndustryPanel';

/**
 * Holds the components of the container body page
 * @param {*} props - electionData, gdpData, industry, industryGDP, setIndustry
 */
function TrendsContainer(props) {

    return(
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col-lg-6"}>
                    <div className="card">
                        <div className="card-body">
                            <ElectionGraph data={props.electionData} />
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <GDPGraph gdpData={props.gdpData} />
                        </div>
                    </div>
                </div>
                <div className={"col-lg-6"}>
                    <IndustryPanel industry={props.industry} industryGDP={props.industryGDP} gdp={props.gdpData} setIndustry={props.setIndustry} />
                </div>
            </div>
        </div>
    );
}

export default TrendsContainer;