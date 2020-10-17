import React from 'react';
import {ENDPOINT} from './Map';

export default class CmpDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      operators: [],
      selectedOp: 'gt'
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    var operators = [];
    operators.push(<option value='gt' selected>&gt;</option>);
    operators.push(<option value='lt'>&lt;</option>);


    this.setState({
      operators: operators
    });
  }

  handleChange(e) {
    this.setState({
      selectedOp: e.target.value
    });
    this.props.handleOpChange(e.target.value);
  }

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
