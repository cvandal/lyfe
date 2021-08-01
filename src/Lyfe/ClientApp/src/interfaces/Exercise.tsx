export enum DayOfWeek {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

export interface Exercise {
    id?: number;
    userId: string;
    name: string;
    weight: null | number;
    reps: null | number;
    sets: null | number;
    dayOfWeek: null | DayOfWeek;
}
