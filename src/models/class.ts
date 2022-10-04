import { Student } from "./student";

export interface Class {
  id: number;

  school: string;
  year: number;

  students?: Student[];
}