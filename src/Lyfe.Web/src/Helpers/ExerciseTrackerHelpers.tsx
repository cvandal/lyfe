import { Day } from "../Interfaces/Day";

export function daysSortedByName(days: Day[]) {
  const map: { [key: string]: number } = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  return days.sort((a, b) => {
    return map[a.name] - map[b.name];
  });
}
