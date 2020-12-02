import React from 'react';

export default class CmpInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 0,
      filterLabel: '%'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // handle change in state
  handleChange(e) {
    this.setState({
      val: e.target.value
    });
    this.props.handleValChange(e.target.value);
  }

  // update graph when new info received from parent component
  componentDidUpdate(prevProps) {
    if (this.props === prevProps) {
      return;
    }
    this.setState({
      filterLabel: this.props.filterLabel
    });
    this.forceUpdate();
  }

  render() {
    return (
      <div className='cmp-dropdown'>
      <input type='number' min='-9999999' max='-9999999' name='cmp-input' value={this.state.val} onChange={this.handleChange}/>
      <label htmlFor='cmp-input'>{this.state.filterLabel}</label>
      </div>
    );
  }
}
