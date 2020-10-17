import React from 'react';
import {ENDPOINT} from './Map';

export default class CmpInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 0
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      val: e.target.value
    });
    this.props.handleValChange(e.target.value);
  }

  render() {
    return (
      <div className='dropdown'>
        <input type='number' min='-9999999' max='-9999999' name='cmp-input' value={this.state.val} onChange={this.handleChange}/>
        <label for='cmp-input'>%</label>
      </div>
    );
  }
}
