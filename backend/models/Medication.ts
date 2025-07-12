import mongoose, { Document, Schema, Types } from "mongoose";
import { ReadingTiming } from "../types";

export enum MedicationType {
  tablet = "tablet",
  insulin = "insulin",
}

export enum MedicationDosageType {
  mg = "mg",
  unit = "unit",
}

export interface IMedication extends Document {
  userId: Types.ObjectId;
  name: string;
  type: MedicationType;
  dosage: number;
  dosageType: MedicationDosageType;
  timeTaken: string;
  readingTime: ReadingTiming;
}

const medicationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for medication"],
    },
    name: {
      type: String,
      required: [true, "Medication name is required!"],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(MedicationType),
      required: [true, "Medication type is required!"],
    },
    dosage: { type: Number, required: true },
    dosageType: {
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

// Enforce unique medication name per user and type
medicationSchema.index({ userId: 1, name: 1 }, { unique: true });

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
