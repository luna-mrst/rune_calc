import * as React from 'react';
import * as ReactDOM from "react-dom";
import CalcTable from "./components/calcTable";

const MainComponent = () => <CalcTable />;

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