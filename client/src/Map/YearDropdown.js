import React from 'react';

let years = [];

let y;
for (y = 2000; y <= 2018; y++) {
  let y_str = y.toString();
  years.push(<option value={y_str} key={y_str}>{y_str}</option>);
}

export default class YearDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      years: [],
      selectedYear: '2016'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // add years to dropdown
  componentDidMount() {
    this.setState({
      years: years
    });
  }

  // handle change in state
  handleChange(e) {
    this.setState({
      selectedYear: e.target.value
    });
    this.props.handleYearChange(e.target.value);
  }

  // force update when props change
  componentDidUpdate(prevProps) {
    if (this.props === prevProps) {
      return;
    }
    this.forceUpdate();
  }

  render() {
    return (
      <div className='dropdown'>
        <label htmlFor='years'>Year: </label>
        <select name='years' value={this.state.selectedYear} onChange={this.handleChange}>
          {this.state.years}
        </select>
      </div>
    );
  }
}
