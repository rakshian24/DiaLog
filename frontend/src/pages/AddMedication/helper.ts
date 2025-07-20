import { MedicationType, ReadingTiming } from "../../types";

export interface IAddMedicationFormValueTypes {
  name: string;
  type: MedicationType | null;
  dosage?: string;
  timeTaken: string;
  readingTime: ReadingTiming[] | [];
  dosagePerReadingTime?: Record<ReadingTiming, string> | {};
}

export const InitAddMedicationFormValues: IAddMedicationFormValueTypes = {
  name: "",
  type: null,
  dosage: "",
  timeTaken: "",
  readingTime: [],
  dosagePerReadingTime: {},
};
