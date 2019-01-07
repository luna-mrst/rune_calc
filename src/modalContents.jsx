import React from "react";

export default class ModalContents extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  render() {
    const modalBody = this.props.dispData.map((d, i) => {
      const values = d.values.map((v, j) =>
        [
          <input
            type="text" value={v.value}
            className={v.value.match(/\d{2}\.\d{3}/) ? 'valid' : 'invalid'}
            onChange={e => this.props.changeEvent(e, i, j)}
          />,
          <input
            type="checkbox"
            checked={v.same}
            onChange={e => this.props.checkEvent(e, i, j)}
          />
        ]
      );
      return (
        <div key={i}>
          <img src={d.imgSrc} />
          <div className="grid">
            {values}
          </div>
        </div>
      );
    });

    return (
      <div>
        {modalBody}
      </div>
    );
  }
}
