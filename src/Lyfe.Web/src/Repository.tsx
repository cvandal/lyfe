import { Day } from "./Interfaces/Day";
import { Exercise } from "./Interfaces/Exercise";
import { Weight } from "./Interfaces/Weight";

export async function getRecord(url: string, token: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.ok ? await response.json() : alert("FUCK");
}

export async function postRecord(
  url: string,
  token: string,
  body: Day | Exercise | Weight
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.ok ? await response.json() : alert("FUCK");
}

export async function patchRecord(
  url: string,
  token: string,
  body: Day | Exercise | Weight
) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.ok ? await response.json() : alert("FUCK");
}

export async function deleteRecord(url: string, token: string) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  !response.ok && alert("FUCK");
}
