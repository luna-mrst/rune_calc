import React from "react";

export default class ModalContents extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  render() {
    return (
      <div className="buttons">
        <button id="modalLoad">読み込む</button>
        <button onClick={this.props.onClose}>読み込まない</button>
      </div>
    );
  }
}
