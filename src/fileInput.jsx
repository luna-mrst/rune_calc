import React from "react";

export default class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <p>
        <input type="file" id="file" accept="image/*" multiple ref={node => this.files = node} />
        <button onClick={() => { this.props.loadFiles(this.files.files) }}>SSから読み込む</button>
      </p>
    );
  }
}
