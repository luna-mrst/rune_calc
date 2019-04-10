import { ChangeEvent, FocusEvent, KeyboardEvent } from "react";
import RuneStatus from "../model/runeStatus";

export default interface TableRowProps {
  changeEvent: (e: ChangeEvent<HTMLInputElement>, idx: number) => void;
  blurEvent: (e: FocusEvent<HTMLInputElement>, idx: number) => void;
  checkEvent: (idx: number) => void;
  enterEvent: (e: KeyboardEvent<HTMLInputElement>, idx: number) => void;
  deleteRow: (idx: number) => void;
  values: RuneStatus[];
  focusIdx: number;
}