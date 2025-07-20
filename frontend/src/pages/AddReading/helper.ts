import { ReadingTiming } from "../../types";

export interface IAddReadingFormValueTypes {
  dateTime: string;
  readingTime: ReadingTiming | "";
  glucoseLevel: number;
  notes?: string;
}

export const InitAddReadingFormValues: IAddReadingFormValueTypes = {
  dateTime: "",
  readingTime: "",
  glucoseLevel: 0,
  notes: "",
};
