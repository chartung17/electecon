import React, { useEffect, useState } from 'react';
import { getIndustries } from './TrendsApi';

/**
 * 
 * @param { handleUpdate} props 
 * handleUpdate : callback for when industry state changes
 */
 export function IndustrySelector(props) {

    const [industry, setIndustry] = useState(null);
    const [industries, setIndustries] = useState(null);

    let updateIndustry = props.handleUpdate;

    useEffect(() => {
        updateIndustry(industry);
            // populate our industry list to render
        let industryList = [];
        getIndustries().then(data => {
            for (let entry of data) {
                industryList.push(<option key={entry.INDUSTRY_ID } value={entry.INDUSTRY_ID}>{entry.NAME}</option>);
            }
            setIndustries(industryList);
        })
    }, [industry, updateIndustry]);



    return (
        <div className='dropdown'>
            <label htmlFor='industry'>Choose an industry: </label>
            <select name='industry' value={industry || ""} onChange={e => setIndustry(e.target.value)}>
                {industries}
            </select>
        </div>
    );
 }