import React from "react";
import ReactDOM from "react-dom";
import ModalContents from "./modalContents";
import OCRAD from './ocrad';

export default class ModalComponent extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      isLoading: true,
      dispData: []
    };
    this.loadFiles();
  }

  loadFiles() {
    let count = 0;

    const dispData = [];
    [].forEach.call(this.props.files, f => {
      const reader = new FileReader();
      reader.onload = re => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const data = {
            imgSrc: reader.result,
            values: []
          };
          OCRAD(img, txt => {
            const matches = txt.replace(/[zoT]/g, c => ({ z: '2', o: '0', T: '7' }[c])).match(/[\di_]{2}\.[\di_]{3}/g);
            matches.reduce((a, v) => {
              const value = {
                value: v,
                same: false
              }
              a.push(value);
              return a;
            },
              data.values)
            while (data.values.length % 4 !== 0) data.values.push({ value: '', same: false });
            dispData.push(data);
            if (--count === 0) {
              this.setState({
                isLoading: false,
                dispData: dispData
              });
            }
          });
        };
      };
      reader.readAsDataURL(f);
      count++;
    });
  }

  changeEvent(e, i, j) {
    const data = this.state.dispData;
    data[i].values[j].value = e.target.value;
    this.setState({
      dispData: data
    });
  }

  checkEvent(e, i, j) {
    const data = this.state.dispData;
    data[i].values[j].same = e.target.checked;
    this.setState({
      dispData: data
    });
  }

  getExecValues() {
    const execValues = this.state.dispData.reduce((a, v) => {
      const values = v.values.filter(v => v.value.match(/\d{2}\.\d{3}/));
      a.push(...values);
      return a;
    }, []);
    return execValues;
  }

  render() {
    return ReactDOM.createPortal(
      <div className="modal-overlay">
        <div className="modal-content">
          {this.state.isLoading && <div className="loading" />}
          {this.state.isLoading ||
            <ModalContents
              changeEvent={this.changeEvent.bind(this)}
              checkEvent={this.checkEvent.bind(this)}
              dispData={this.state.dispData}
            />
          }
          {this.state.isLoading ||
            <div className="buttons">
              <button onClick={() => this.props.onExec(this.getExecValues())}>読み込む</button>
              <button onClick={this.props.onCancel}>読み込まない</button>
            </div>
          }
        </div>
      </div>,
      document.getElementById("root")
    );
  }
}
