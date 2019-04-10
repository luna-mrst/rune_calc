import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ModalComponentProps from "../props/modalComponentProps";
import LoadingResource from '../model/loadIngResource';
import ModalContent from './modalContent';

declare function OCRAD(img: HTMLImageElement, callback?: (text: string) => void): void;

interface Replacer {
  [key: string]: string;
}

const replacer: Replacer = { z: '2', o: '0', T: '7', _: '4' };

export default (props: ModalComponentProps): JSX.Element => {
  const [isLoading, setLoading] = React.useState(true);
  const [dispData, setDispData] = React.useState<LoadingResource[]>([]);

  React.useMemo(() => {
    let count = 0;

    const dispData: LoadingResource[] = [];
    Array.prototype.forEach.call(props.files, (file: File) => {
      const reader = new FileReader();
      reader.onload = _ => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const data: LoadingResource = {
            imgSrc: img.src,
            values: []
          };
          OCRAD(img, txt => {
            const matches = txt.replace(/[zoT_]/g, c => (replacer[c])).match(/[\di_]{2}\.[\di_]{3}/g);
            if (matches !== null) {
              matches.reduce((a, v) => {
                const value = {
                  value: v !== '44.444' ? v : '',
                  same: false
                }
                a.push(value);
                return a;
              }, data.values);
              while (data.values.length % 4 !== 0) data.values.push({ value: '', same: false });
              dispData.push(data);
            };
            if (--count === 0) {
              setLoading(false);
              setDispData(dispData);
            }
          });
        }
      }
      reader.readAsDataURL(file);
      count++;
    });
  }, [props.files]);

  const changeEvent = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>, dataIdx: number, valueIdx: number) => {
    const data = dispData.slice();
    data[dataIdx].values[valueIdx].value = evt.target.value;
    setDispData(data);
  }, [dispData]);

  const checkEvent = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>, dataIdx: number, valueIdx: number) => {
    const data = dispData.slice();
    data[dataIdx].values[valueIdx].same = evt.target.checked;
    setDispData(data);
  }, [dispData]);

  const getExecValues = React.useCallback(() => {
    const execValues = dispData.reduce<{ value: string, same: boolean }[]>((a, v) => {
      const values = v.values
        .filter(v => v.value.match(/\d{2}\.\d{3}/));
      a.push(...values);
      return a;
    }, []);
    return execValues
      .sort((v1, v2) => parseFloat(v1.value) - parseFloat(v2.value));
  }, [dispData]);

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {isLoading && <div className="loading" />}
        {isLoading ||
          [<ModalContent
            key="content"
            changeEvent={changeEvent}
            checkEvent={checkEvent}
            dispData={dispData}
          />,
          <div key="btn" className="buttons">
            <button onClick={() => props.onExec(getExecValues())}>読み込む</button>
            <button onClick={props.onCancel}>読み込まない</button>
          </div>
          ]
        }
      </div>
    </div>
    , document.body
  );
}
