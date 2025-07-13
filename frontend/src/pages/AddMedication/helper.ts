import {
  MedicationDosageType,
  MedicationType,
  ReadingTiming,
} from "../../types";

export interface IAddMedicationFormValueTypes {
  name: string;
  type: MedicationType | null;
  dosage: string;
  dosageType: MedicationDosageType | null;
  timeTaken: string;
  readingTime: ReadingTiming | null;
}

export const InitAddMedicationFormValues: IAddMedicationFormValueTypes = {
  name: "",
  type: null,
  dosage: "",
  dosageType: null,
  timeTaken: "",
  readingTime: null,
};
