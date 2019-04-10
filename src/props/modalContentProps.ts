import { ChangeEvent } from "react";
import LoadingResource from "../model/loadIngResource";

export default interface ModalContentProps {
  changeEvent: (e: ChangeEvent<HTMLInputElement>, dataIdx: number, valueIdx: number) => void;
  checkEvent: (e: ChangeEvent<HTMLInputElement>, dataIdx: number, valueIdx: number) => void;
  dispData: LoadingResource[];
}