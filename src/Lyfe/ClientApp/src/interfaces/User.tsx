import {Weight} from "./Weight";
import {Exercise} from "./Exercise";

export interface User {
    id: string;
    username: string;
    weights: Weight[];
    exercises: Exercise[];
}
