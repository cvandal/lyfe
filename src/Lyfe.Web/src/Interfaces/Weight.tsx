export interface Weight {
  id?: number;
  currentDate: Date;
  currentWeight: number;
  goalWeight: number;
}

export interface WeightTrackerProps {
  showCreateWeightModal: boolean;
  setShowCreateWeightModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CreateWeightModalProps {
  weights: Weight[];
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  reload: any;
}
