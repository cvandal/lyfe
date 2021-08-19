import {Weight} from "./Weight";
import {Exercise} from "./Exercise";

export interface User {
    id: string;
    givenName: string;
    familyName: string;
    weights: Weight[];
    exercises: Exercise[];
}
