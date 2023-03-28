import { Exercise } from "./Exercise";

export interface Day {
  id?: number;
  name: string;
  description: string;
  exercises?: Exercise[];
}

export interface CreateDayModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  reload: any;
}

export interface DeleteDayModalProps {
  day: Day;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  reload: any;
}
