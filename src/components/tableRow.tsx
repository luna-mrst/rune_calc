import * as React from 'react';
import TableRowProps from "../props/tableRowProps";

export default (props: TableRowProps): JSX.Element => {
  const rows = props.values.map((val, idx) => (
    <tr className={val.use ? 'use' : ''} key={idx}>
      <td><button onClick={() => props.deleteRow(idx)}>×</button></td>
      <td><input
        type="number"
        min="27.000"
        max="33.000"
        step="0.001"
        value={val.value}
        onChange={e => {console.log(e);props.changeEvent(e, idx);}}
        onBlur={e => props.blurEvent(e, idx)}
        onKeyUp={e => props.enterEvent(e, idx)}
        autoFocus={idx === props.focusIdx}
      /></td>
      <td onClick={() => props.checkEvent(idx)}>
        <input type="checkbox"
          checked={val.same}
          readOnly
        />
      </td>
      <td>{val.rise}</td>
    </tr>
  ));
  return <tbody id="tbody">{rows}</tbody>
}