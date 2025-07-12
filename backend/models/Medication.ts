import mongoose, { Document, Schema } from "mongoose";
import { ReadingTiming } from "./Reading";

export enum MedicationType {
  tablet = "tablet",
  insulin = "insulin",
}

export enum MedicationDosageType {
  mg = "mg",
  unit = "unit",
}

export interface IMedication extends Document {
  name: string;
  type: MedicationType;
  dosage: MedicationDosageType;
  timeTaken: string;
  readingTime: ReadingTiming;
}

const medicationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Medication name is required!"],
    },
    type: {
      type: String,
      enum: Object.values(MedicationType),
      required: [true, "Medication type is required!"],
    },
    dosage: {
      type: String,
      enum: Object.values(MedicationDosageType),
      required: [true, "Medication doasge type is required!"],
    },
    timeTaken: {
      type: String,
      required: [true, "Medication time is required!"],
    },
    readingTime: {
      type: String,
      enum: Object.values(ReadingTiming),
      required: [true, "Medication timing type is required!"],
    },
  },
  {
    timestamps: true,
  }
);

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
