import React from 'react';

export default class FilterCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // handle change in state
  handleChange(e) {
    let reverse = !(this.state.checked);
    this.setState({
      checked: reverse
    });
    this.props.handleFilterChange(reverse);
  }

  render() {
    return (
      <div className='checkbox'>
        <label htmlFor='filter'>Filter</label>
        <input type='checkbox' name='filter' value='Filter' checked={this.state.checked} onChange={this.handleChange} />
      </div>
    );
  }
}
