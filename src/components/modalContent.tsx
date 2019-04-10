import * as React from 'react';
import ModalContentProps from "../props/modalContentProps";

export default (props: ModalContentProps): JSX.Element => {
  const modalBody = props.dispData.map((data, dIdx) => {
    const values = data.values.map((val, vIdx) => [
      <input
        key={`txt_${dIdx}_${vIdx}`}
        type="text"
        value={val.value}
        className={val.value.match(/\d{2}\.\d{3}/) ? 'valid' : 'invalid'}
        onChange={e => props.changeEvent(e, dIdx, vIdx)}
      />,
      <input
        key={`ck_${dIdx}_${vIdx}`}
        type="checkbox"
        checked={val.same}
        onChange={e => props.checkEvent(e, dIdx, vIdx)}
      />
    ]);
    return (
      <div key={dIdx}>
        <img src={data.imgSrc} alt="image" />
        <div className="grid">
          {values}
        </div>
      </div>
    );
  });

  return <div>{modalBody}</div>;
}