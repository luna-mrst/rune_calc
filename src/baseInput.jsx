import React from 'react';
import { valueFormat } from './define';

export default class BaseInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  clickEvent(e) {
    this.props.calculate(this.state.value);
  }

  blurEvent(e) {
    this.setState({ value: valueFormat(this.state.value) });
  }

  handleChange(e) {
    this.setState(
      { value: e.target.value }
    );
  }

  render() {
    return (
      <p>
        強化元魔力値：<input type="number" id="base" min="27.001" max="33.000" step="0.001"
          value={this.state.value} onChange={this.handleChange.bind(this)} onBlur={this.blurEvent.bind(this)} />
        <button onClick={this.clickEvent.bind(this)}>計算する</button>&nbsp;<span>{this.props.result}</span>
      </p>
    )
  }
}

