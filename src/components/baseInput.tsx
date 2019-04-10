import * as React from 'react';
import BaseInputProps from "../props/baseInputProps";
import { Logic } from '../lib/logic';

export default (props: BaseInputProps): JSX.Element => {
  const [value, setValue] = React.useState('');
  const clickCalc = React.useCallback(() => props.calculate(value), [value]);
  const blurInput = React.useCallback(() => setValue(Logic.valueFormat(value)), [value]);
  const handleChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => setValue(evt.target.value), []);

  return (
    <p className="baseInputArea">
      強化元魔力値：<input type="number" id="base" min="27.001" max="33.000" step="0.001"
        value={value} onChange={handleChange} onBlur={blurInput} />
      <button onClick={clickCalc}>計算する</button>&nbsp;<span className="calcResult">{props.result}</span>
    </p>
  )
};