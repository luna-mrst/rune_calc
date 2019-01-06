import React from "react";
import ReactDOM from "react-dom";
import ModalContents from "./modalContents";

export default class ModalComponent extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  render() {
    return ReactDOM.createPortal(
      <div className="modal-overlay">
        <div className="modal-content">
          {this.props.isLoading && <div className="loading" />}
          {this.props.isLoading || (
            <ModalContents onClose={this.props.onClose} />
          )}
        </div>
      </div>,
      document.getElementById("root")
    );
  }
}
