import React from "react";

export default class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  clickEvent(e) {
    this.props.loadFiles(this.files.files);
  }

  render() {
    return (
      <p>
        <input type="file" id="file" accept="image/*" multiple ref={node => this.files = node} />
        <button onClick={this.clickEvent.bind(this)}>SSから読み込む</button>
      </p>
    );
  }
}
