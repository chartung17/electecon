import React from 'react';

export default class CmpDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operators: [],
      selectedOp: 'gt'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // add operators to dropdown
  componentDidMount() {
    var operators = [];
    operators.push(<option value='gt' selected>&gt;</option>);
    operators.push(<option value='lt'>&lt;</option>);
    this.setState({
      operators: operators
    });
  }

  // handle change in state
  handleChange(e) {
    this.setState({
      selectedOp: e.target.value
    });
    this.props.handleOpChange(e.target.value);
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
        <label for='operators'>Comparison: </label>
        <select name='operators' value={this.state.selectedOp} onChange={this.handleChange}>
          {this.state.operators}
        </select>
      </div>
    );
  }
}
