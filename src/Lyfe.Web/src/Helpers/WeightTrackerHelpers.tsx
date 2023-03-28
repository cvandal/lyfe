import { Weight } from "../Interfaces/Weight";

export function dateFormatter(d: Date) {
  const date = new Date(d);
  const month = date.toLocaleDateString("en-AU", { month: "short" }); // Jan
  const day = date.toLocaleDateString("en-AU", { day: "2-digit" }); // 01

  return `${month} ${day}`; // Jan 01
}

export function dataFormatter(w: Weight[]) {
  return w.map((weight) => ({
    "Date": dateFormatter(weight.currentDate),
    "Weight": weight.currentWeight,
    "Goal Weight": weight.goalWeight
  }));
}

export function latestRecord(w: Weight[]) {
  return w.at(-1); // Get the last element from the array
}

export function minValue(w: Weight[]) {
  return Math.min(...w.map((weight) => weight.goalWeight)) - 2;;
}

export function maxValue(w: Weight[]) {
  return Math.max(...w.map((weight) => weight.currentWeight)) + 2;
}

export function diff(w: Weight[]) {
  return (latestRecord(w)!.currentWeight - latestRecord(w)!.goalWeight).toFixed(2);
}
