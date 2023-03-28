import { Day } from "./Day";

export interface Exercise {
  id?: number;
  dayId: number;
  name: string;
  weight: number;
  reps: number;
  sets: number;
}

export interface ExerciseTrackerProps {
  showCreateDayModal: boolean;
  setShowCreateDayModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CreateExerciseModalProps {
  day: Day;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  reload: any;
}

export interface UpdateExerciseModalProps {
  exercise: Exercise;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  reload: any;
}
