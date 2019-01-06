import React from "react";
import ReactDOM from "react-dom";
import CalcTable from "./calcTable";

export default class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  inputClick(data) {
    this.setState({
      result: data
    });
  }

  render() {
    return <CalcTable />;
  }
}

ReactDOM.render(<MainComponent />, document.getElementById("mainContent"));
