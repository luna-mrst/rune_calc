import React from "react";
import TableRow from "./tableRow";
import { valueFormat, rounding, riseCalc, calc } from "./define";
import BaseInput from "./baseInput";
import FileInput from "./fileInput";
import Summary from "./summary";
import ModalComponent from "./modalComponent";

const strageKey = "strage_value";

export default class CalcTable extends React.Component {
  constructor(prop) {
    super(prop);
    this.defaultValue = {
      value: "",
      same: false,
      rise: "",
      use: false
    };
    this.state = {
      values: [Object.assign({}, this.defaultValue)],
      result: "",
      isModalOpen: false,
      files: []
    };
  }

  calculate(b) {
    let base = parseFloat(b) * 1000;
    if (isNaN(base)) return;
    const riseList = this.state.values.reduce((a, v) => {
      const rise = riseCalc(v.value, v.same, base > 30000) * 1000;
      if (rise !== null) a.push(rise);
      return a;
    }, []);
    const limit = base <= 30000 ? 30000 : 33000;
    const ans = calc(riseList, limit, base);
    const values = this.state.values;
    this.state.values.forEach((v, i) => {
      if (ans.includes(i)) {
        v.use = true;
        base += riseList[i];
      } else {
        v.use = false;
      }
    });
    this.setState({
      values: values,
      result: `強化後の値は${rounding(base / 1000, 3)}`
    });
  }

  changeEvent(e, idx) {
    const values = this.state.values.slice();
    values[idx].value = e.target.value;
    this.setState({
      values: values
    });
  }

  blurEvent(e, idx) {
    const state = this.state.values[idx];
    const value = valueFormat(e.target.value);
    const rise = riseCalc(value, state.same, false);

    if (rise === null) {
      Object.assign(state, this.defaultValue);
    } else {
      state.value = value;
      state.rise = rounding(rise, 3);
    }

    this.setState({
      values: this.state.values
    });
  }

  checkEvent(idx) {
    const state = this.state.values[idx];
    state.same = !state.same;
    if (state.value !== "") {
      state.rise = rounding(riseCalc(state.value, state.same, false), 3);
    }
    this.setState({
      values: this.state.values
    });
  }

  enterEvent(e, idx) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement && e.key === "Enter")) return;
    if (idx === this.state.values.length - 1) {
      this.addRow();
    } else {
      document
        .querySelector(`#tbody tr:nth-child(${idx + 2}) input[type="number"]`)
        .focus();
    }
  }

  deleteRow(idx) {
    this.setState({
      values: this.state.values.filter((v, i) => i !== idx)
    });
  }

  addRow() {
    const values = this.state.values;
    values.push(Object.assign({}, this.defaultValue));
    this.setState(
      {
        values: values
      },
      () => this.rows.focus(values.length - 1)
    );
  }

  saveValues() {
    if (
      localStorage.getItem(strageKey) &&
      !confirm("既に保存されている内容があるけど上書きしちゃうのん？")
    ) {
      return;
    }

    const saveValues = this.state.values.reduce((a, c) => {
      if (c.value !== "") a.push(c.value);
      return a;
    }, []);
    localStorage.setItem(strageKey, saveValues);
    confirm("保存したよ！");
  }

  loadValues() {
    const strValues = localStorage.getItem(strageKey);
    if (strValues == null) {
      confirm("値が保存されてないよ。。。？");
      return;
    }

    const saveValues = strValues.split(",");
    const stateValues = saveValues.map(v =>
      Object.assign({}, this.defaultValue, { value: v })
    );
    this.setState(
      {
        values: stateValues
      },
      this.dispatchBlur
    );
  }

  deleteValues() {
    localStorage.removeItem(strageKey);
    confirm("消したよ！");
  }

  loadFiles(files) {
    if (files.length === 0) {
      alert('画像選んで出直してこい？');
      return;
    }

    this.setState({
      isModalOpen: true,
      files: files
    });
  }

  loadFileModalCancel() {
    this.setState({
      isModalOpen: false,
      files: []
    });
  }

  loadFileModalExec(values) {
    const state = this.state.values;
    values.forEach(v => {
      const value = Object.assign({}, this.defaultValue, { value: v.value, same: v.same });
      state.push(value);
    });
    this.setState(
      {
        isModalOpen: false,
        values: state.filter(v => v.value !== '')
      },
      this.dispatchBlur
    );
  }

  dispatchBlur() {
    const evt = document.createEvent("Event");
    evt.initEvent("blur", true, true);
    [].forEach.call(
      document.querySelectorAll('#tbody input[type="number"]'),
      i => i.dispatchEvent(evt)
    );
  }

  render() {
    return (
      <div className="container">
        <BaseInput
          calculate={this.calculate.bind(this)}
          result={this.state.result}
        />
        <FileInput loadFiles={this.loadFiles.bind(this)} />
        <table>
          <thead>
            <tr>
              <th />
              <th>サイズ</th>
              <th>同種</th>
              <th>上昇値</th>
            </tr>
          </thead>
          <TableRow
            changeEvent={this.changeEvent.bind(this)}
            blurEvent={this.blurEvent.bind(this)}
            checkEvent={this.checkEvent.bind(this)}
            enterEvent={this.enterEvent.bind(this)}
            deleteRow={this.deleteRow.bind(this)}
            values={this.state.values}
            ref={node => (this.rows = node)}
          />
        </table>
        <p className="buttons">
          <button onClick={this.addRow.bind(this)}>入力欄追加</button>
          <button onClick={this.saveValues.bind(this)}>入力値保存</button>
          <button onClick={this.loadValues.bind(this)}>保存値読込</button>
          <button onClick={this.deleteValues}>保存値削除</button>
        </p>
        <Summary />
        {this.state.isModalOpen && (
          <ModalComponent
            onCancel={this.loadFileModalCancel.bind(this)}
            onExec={this.loadFileModalExec.bind(this)}
            files={this.state.files}
          />
        )}
      </div>
    );
  }
}
