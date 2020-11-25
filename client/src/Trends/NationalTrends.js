import React, { useEffect, useState} from 'react';
import TrendsContainer from './TrendsContainer';
import { getNationalElectionResult, getNationalGDPData, getNationalIndustryGDP} from './TrendsApi';

function NationalTrends() {

    const [electionData, setElectionData] = useState(null);
    const [industry, setIndustry] = useState(null);
    const [gdpData, setGDPdata] = useState(null);
    const [industryGDP, setIndustryGDP] = useState(null);

    useEffect(() => {
        getNationalElectionResult().then(electionData => {
            setElectionData(electionData);
        });
        getNationalGDPData().then(gdpData => {
            setGDPdata(gdpData);
        });
        getNationalIndustryGDP(industry).then(data => {
            setIndustryGDP(data);
        })
    }, [industry]);

    return(
        <div id="NationalTrends">
            <TrendsContainer electionData={electionData} gdpData={gdpData} industry={industry} industryGDP={industryGDP} setIndustry={setIndustry}/>
        </div>
    );
}

export default NationalTrends;