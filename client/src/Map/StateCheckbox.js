import React from 'react';

export default class StateCheckbox extends React.Component {
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
    this.props.handleLevelChange(reverse);
  }

  render() {
    return (
      <div className='checkbox'>
        <label htmlFor='aggregate'>Aggregate by state</label>
        <input type='checkbox' name='aggregate' value='Aggregate' checked={this.state.checked} onChange={this.handleChange} />
      </div>
    );
  }
}
