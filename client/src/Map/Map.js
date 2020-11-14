import React from 'react';
import './Map.css';
import Choropleth from './Choropleth';
import YearDropdown from './YearDropdown';
import CmpDropdown from './CmpDropdown';
import CmpInput from './CmpInput';
import VariableDropdown from './VariableDropdown';
import FilterCheckbox from './FilterCheckbox';
import StateCheckbox from './StateCheckbox';
require('dotenv').config()

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    document.title = 'Map';
    this.state = {
      year: '2016',
      nextYear: '2016',
      queryURL: '/rep-dem-diff',
      nextVar: '',
      filter: false,
      nextFilter: false,
      filterYear: '2016',
      nextFilterYear: '2016',
      filterVar: 'none',
      nextFilterVar: 'RepDemDiff',
      filterLabel: '%',
      op: 'gt',
      nextOp: 'gt',
      val: 0,
      nextVal: 0,
      industry: 1,
      nextIndustry: 1,
      errorMsg: '',
      aggregate: false,
      nextAggregate: false
    }
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleVarChange = this.handleVarChange.bind(this);
    this.handleFilterYearChange = this.handleFilterYearChange.bind(this);
    this.handleFilterVarChange = this.handleFilterVarChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleOpChange = this.handleOpChange.bind(this);
    this.handleValChange = this.handleValChange.bind(this);
    this.handleLevelChange = this.handleLevelChange.bind(this);
  }

  // handle state change in year dropdown
  handleYearChange(year) {
    this.setState({
      nextYear: year
    });
  }

  // handle state change in variable drowdown
  handleVarChange(newVar) {
    this.setState({
      nextVar: newVar
    });
    if (newVar.startsWith('Industry')) {
      let indID = Number(newVar.substr(8));
      this.setState({
        nextIndustry: indID
      });
    }
  }

  // handle state change in filter checkbox
  handleFilterChange(newFilter) {
    this.setState({
      nextFilter: newFilter
    });
  }

  // handle state change in state checkbox
  handleLevelChange(newAggregate) {
    this.setState({
      nextAggregate: newAggregate
    });
  }

  // handle state change in operand
  handleOpChange(newOp) {
    this.setState({
      nextOp: newOp
    });
  }

  // handle state change in comparison value
  handleValChange(newVal) {
    this.setState({
      nextVal: newVal
    });
  }

  // handle state change in filter year dropdown
  handleFilterYearChange(year) {
    this.setState({
      nextFilterYear: year
    });
  }

  // handle state change in filter variable drowdown
  handleFilterVarChange(newVar) {
    this.setState({
      nextFilterVar: newVar
    });
    if (newVar === 'TotalGDP') {
      this.setState({
        filterLabel: 'million dollars'
      });
    } else {
      this.setState({
        filterLabel: '%'
      });
    }
  }

  // when submit button is clicked, update state in order to re-render map
  handleClick = () => {
    let electionYears = ['2000', '2004', '2008', '2012', '2016'];
    if ((this.state.nextVar === 'TotalGDP') || (this.state.nextVar.includes('Industry'))) {
      if (this.state.nextYear === '2000') {
        this.setState({
          errorMsg: 'GDP data is not available for the year 2000'
        });
        return;
      }
    } else {
      if (!electionYears.includes(this.state.nextYear)) {
        this.setState({
          errorMsg: 'Election data is not available for the year ' + this.state.nextYear
        });
        return;
      }
    }
    if (this.state.nextFilter) {
      if ((this.state.nextFilterVar === 'TotalGDP') || (this.state.nextFilterVar.includes('Industry'))) {
        if (this.state.nextFilterYear === '2000') {
          this.setState({
            errorMsg: 'GDP data is not available for the year 2000'
          });
          return;
        }
      } else {
        if (!electionYears.includes(this.state.nextFilterYear)) {
          this.setState({
            errorMsg: 'Election data is not available for the year ' + this.state.nextFilterYear
          });
          return;
        }
      }
    }
    let queryURL = this.state.queryURL;
    if (this.state.nextVar === 'Democrat') {
      queryURL = '/dem-votes';
    } else if (this.state.nextVar === 'Republican') {
      queryURL = '/rep-votes';
    } else if (this.state.nextVar === 'Other') {
      queryURL = '/other-votes';
    } else if (this.state.nextVar === 'RepDemDiff') {
      queryURL = '/rep-dem-diff';
    } else if (this.state.nextVar === 'TotalGDP') {
      queryURL = '/total-gdp';
    } else if (this.state.nextVar.startsWith('Industry')) {
      queryURL = '/industry-gdp';
    }
    else if (this.state.nextVar === 'TopIndustry') {
      queryURL = '/top-industry';
    }
    if (this.state.nextFilter) {
      this.setState({
        year: this.state.nextYear,
        filter: this.state.nextFilter,
        filterYear: this.state.nextFilterYear,
        filterVar: this.state.nextFilterVar,
        op: this.state.nextOp,
        val: this.state.nextVal,
        queryURL: queryURL,
        industry: this.state.nextIndustry,
        errorMsg: '',
        aggregate: this.state.nextAggregate
      });
    } else {
      this.setState({
        year: this.state.nextYear,
        filter: this.state.nextFilter,
        filterYear: this.state.nextFilterYear,
        filterVar: 'none',
        op: this.state.nextOp,
        val: this.state.nextVal,
        queryURL: queryURL,
        industry: this.state.nextIndustry,
        errorMsg: '',
        aggregate: this.state.nextAggregate
      });
    }
  };


  render() {
    return (
      <div className='map'>
        <Choropleth
          year={this.state.year}
          filter={this.state.filterVar}
          filterYear={this.state.filterYear}
          operand={this.state.op}
          val={this.state.val}
          queryURL={this.state.queryURL}
          industry={this.state.industry}
          level={this.state.aggregate ? 'state' : 'county'}
        />
        <p className='error'>{this.state.errorMsg}</p>
        <p>Select a year and variable, then click "Submit" to update the map.</p>
        <section className='selector'>
          <YearDropdown
            id='year-dropdown'
            handleYearChange={this.handleYearChange}
          />
          <VariableDropdown
            id='variable-dropdown'
            handleVarChange={this.handleVarChange}
            includeCategorical={true}
          />
          <StateCheckbox
            id='aggregate'
            checked={this.state.aggregate}
            handleLevelChange={this.handleLevelChange}
          />
          <button id='submit' onClick={this.handleClick}>Submit</button>
        </section>
        <p>Optional: select a filter variable and year. If selected, only those counties that meet the stated condition will be mapped.</p>
        <section className='filter'>
          <FilterCheckbox
            id='filter'
            checked={this.state.filter}
            handleFilterChange={this.handleFilterChange}
          />
          <YearDropdown
            id='filter-year-dropdown'
            handleYearChange={this.handleFilterYearChange}
          />
          <VariableDropdown
            id='filter-variable-dropdown'
            handleVarChange={this.handleFilterVarChange}
          />
          <CmpDropdown
            id='cmp-dropdown'
            handleOpChange={this.handleOpChange}
          />
          <CmpInput
            id='cmp-input'
            handleValChange={this.handleValChange}
            filterLabel={this.state.filterLabel}
          />
        </section>
        <p>Note: Election data is only available for election years (2000, 2004, 2008, 2012, and 2016). GDP data is not available for the year 2000.</p>
      </div>
    );
  }
}
