import * as React from 'react';
import { Logic } from "../lib/logic";
import RuneStatus from '../model/runeStatus';
import BaseInput from './baseInput';
import FileInput from './fileInput';
import TableRow from './tableRow';
import Summary from './summary';
import ModalComponent from './modalComponent';

const legacy_strageKey = "strage_value";
const strageKey = "strage_value2";

export default () => {
  const [values, setValues] = React.useState([new RuneStatus()]);
  const [result, setResult] = React.useState("");
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [files, setFiles] = React.useState<FileList | null>(null);
  const [focusIdx, setFocusIdx] = React.useState(0);

  const calculate = React.useCallback((value: string) => {
    const vals = values.slice();
    let base = parseFloat(value) * 1000;
    if (isNaN(base)) return;
    const riseList = vals.reduce<number[]>((a, val) => {
      const rise = Logic.riseCalc(val.value, val.same, base > 30000) * 1000;
      if (!isNaN(rise)) a.push(rise);
      return a;
    }, []);
    const limit = base <= 30000 ? 30000 : 33000;
    const ans = Logic.calc(riseList, limit, base);
    vals.forEach((val, idx) => {
      if (ans.includes(idx)) {
        val.use = true;
        base += riseList[idx];
      } else {
        val.use = false;
      }
    });
    setValues(vals);
    setResult(`強化後の値は${Logic.rounding(base / 1000)}`);
  }, [values]);

  const inputMaterial = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const vals = values.slice();
    vals[idx].value = evt.target.value;
    setValues(vals);
  }, [values]);

  const blurMaterial = React.useCallback((evt: React.FocusEvent<HTMLInputElement>, idx: number) => {
    const value = Logic.valueFormat(evt.target.value);
    const rise = Logic.riseCalc(value, values[idx].same, false);
    const vals = values.slice();

    if (isNaN(rise)) {
      vals[idx] = new RuneStatus();
    } else {
      vals[idx].value = value;
      vals[idx].rise = Logic.rounding(rise).toString();
    }
    setValues(vals);
  }, [values]);

  const checkSame = React.useCallback((idx: number) => {
    const vals = values.slice();
    const state = vals[idx];
    state.same = !state.same;
    if (state.value !== '') {
      state.rise = Logic.rounding(Logic.riseCalc(state.value, state.same, false)).toString();
    }
    setValues(vals);
  }, [values]);

  const pressEnter = React.useCallback((evt: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (evt.key !== "Enter") return;
    if (idx === values.length - 1) {
      addRow();
    } else {
      const nextRow = document
        .querySelector<HTMLInputElement>(`#tbody tr:nth-child(${idx + 2}) input[type="number"]`);
      if (nextRow != null) nextRow.focus();
    }
  }, [values]);

  const addRow = React.useCallback(() => {
    const vals = values.slice();
    vals.push(new RuneStatus);
    setValues(vals);
    setFocusIdx(vals.length - 1);
  }, [values]);

  const deleteRow = React.useCallback((idx: number) => {
    setValues(values.filter((_, i) => i !== idx));
  }, [values]);

  const saveValues = React.useCallback(() => {
    if (
      localStorage.getItem(strageKey) &&
      !confirm("既に保存されている内容があるけど上書きしちゃって良いです？")
    ) return;

    const saveValue = values.reduce<{ value: string, same: boolean }[]>((a, val) => {
      if (val.value !== '') a.push({ value: val.value, same: val.same });
      return a;
    }, []);
    localStorage.setItem(strageKey, JSON.stringify(saveValue));
    confirm("保存したよ！");
  }, [values]);

  const loadValues = React.useCallback(() => {
    const strValues = localStorage.getItem(strageKey);
    if (strValues == null) {
      const legacy = localStorage.getItem(legacy_strageKey);
      if (legacy != null)
        legacyLoad(legacy);
      else
        confirm("値が保存されてないよ。。。？");
      return;
    }

    const saveValues = JSON.parse(strValues) as { value: string, same: boolean }[];
    const values = saveValues.map(item => {
      const rune = new RuneStatus();
      rune.value = item.value;
      rune.same = item.same;
      rune.rise = Logic.rounding(Logic.riseCalc(item.value, item.same, false)).toString();
      return rune;
    });
    setValues(values.filter(val => val.rise !== 'NaN'));
  }, [values]);

  const legacyLoad = React.useCallback((strValues: string) => {
    const saveValues = strValues.split(",");
    const stateValues = saveValues.map(v => {
      const rune = new RuneStatus();
      rune.value = v;
      rune.rise = Logic.rounding(Logic.riseCalc(v, false, false)).toString();
      return rune;
    });
    setValues(stateValues);
  }, []);

  const deleteValues = React.useCallback(() => {
    localStorage.removeItem(legacy_strageKey);
    localStorage.removeItem(strageKey);
    confirm("消したよ！");
  }, []);

  const loadFiles = React.useCallback((files: FileList) => {
    if (files.length === 0) {
      alert('画像選んで出直してこい？');
      return;
    }
    setModalOpen(true);
    setFiles(files);
  }, [files]);

  const loadFileModalCancel = React.useCallback(() => {
    setModalOpen(false);
    setFiles(null);
  }, []);

  const loadFileModalExec = React.useCallback((inputs: { value: string, same: boolean }[]) => {
    const vals = inputs.reduce((a, item) => {
      const rune = new RuneStatus();
      rune.value = item.value;
      rune.same = item.same;
      rune.rise = Logic.rounding(Logic.riseCalc(item.value, item.same, false)).toString();
      if (rune.rise !== 'NaN') a.push(rune);
      return a;
    }, values);
    setValues(vals);
    setModalOpen(false);
    setFiles(null);
  }, [values]);

  const allCheck = React.useCallback(() => {
    const vals = values.slice();
    vals.forEach(val => {
      val.same = !val.same;
      if (val.value !== '') {
        val.rise = Logic.rounding(Logic.riseCalc(val.value, val.same, false)).toString();
      }
    });
    setValues(vals);
  }, [values]);

  return (
    <div className="container">
      <BaseInput
        calculate={calculate}
        result={result}
      />
      <FileInput loadFiles={loadFiles} />
      <table className="mainTable">
        <thead>
          <tr>
            <th />
            <th>サイズ</th>
            <th>同種</th>
            <th>上昇値</th>
          </tr>
        </thead>
        <TableRow
          changeEvent={inputMaterial}
          blurEvent={blurMaterial}
          checkEvent={checkSame}
          enterEvent={pressEnter}
          deleteRow={deleteRow}
          values={values}
          focusIdx={focusIdx}
        />
      </table>
      <p className="buttons">
        <button onClick={addRow}>入力欄追加</button>
        <button onClick={saveValues}>入力値保存</button>
        <button onClick={loadValues}>保存値読込</button>
        <button onClick={deleteValues}>保存値削除</button>
        <button onClick={allCheck}>チェック反転</button>
      </p>
      <Summary />
      {isModalOpen &&
        <ModalComponent
          onCancel={loadFileModalCancel}
          onExec={loadFileModalExec}
          files={files}
        />
      }
    </div>
  );
}