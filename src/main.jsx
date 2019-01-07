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

let lastTouchEnd = new Date().getTime();
document.documentElement.addEventListener(
  "touchend",
  e => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 500) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  },
  { capture: false, passive: false }
);