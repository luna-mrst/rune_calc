import * as React from "react";
import FileInputProps from "../props/fileInputProps";

export default (props: FileInputProps): JSX.Element => {
  const input: React.LegacyRef<HTMLInputElement> = React.useRef(null);
  const loadFiles = React.useCallback(() => {
    if (input.current != null && input.current.files != null)
      props.loadFiles(input.current.files);
  }, [input]);

  return (
    <p>
      <input type="file" id="file" accept="image/*" multiple ref={input} />
      <button onClick={() => loadFiles()}>SSから読み込む</button>
    </p>
  )
};