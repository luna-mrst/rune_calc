import React from 'react';
import render from 'react-dom';
import inputBase from "./inputBase";
import InputBase from './inputBase';

export default class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <InputBase></InputBase>
    );
  }
}

ReactDOM.render(
  <MainComponent />,
  document.getElementById('mainContent')
);