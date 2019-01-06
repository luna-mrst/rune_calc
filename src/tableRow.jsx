import React from "react";
import PropTypes from "prop-types";

export default class TableRow extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  focus(idx) {
    this[`val_${idx}`].focus();
  }

  render() {
    const rows = this.props.values.map((v, i) => (
      <tr className={v.use ? 'use' : ''} key={i}>
        <td>
          <button onClick={() => this.props.deleteRow(i)}>×</button>
        </td>
        <td>
          <input
            type="number"
            min="27.000"
            max="33.000"
            step="0.001"
            value={v.value}
            onChange={e => this.props.changeEvent(e, i)}
            onBlur={e => this.props.blurEvent(e, i)}
            onKeyUp={e => this.props.enterEvent(e, i)}
            autoFocus={i == 0}
            ref={node => this[`val_${i}`] = node}
          />
        </td>
        <td onClick={() => this.props.checkEvent(i)}>
          <input
            type="checkbox"
            checked={v.same}
            readOnly
          />
        </td>
        <td>{v.rise}</td>
      </tr>
    ));
    return <tbody id="tbody">{rows}</tbody>;
  }
}
