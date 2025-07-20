import mongoose, { Document, Schema, Types } from "mongoose";
import { ReadingTiming } from "../types";

export enum MedicationType {
  tablet = "tablet",
  insulin = "insulin",
}

export enum MedicationDosageType {
  mg = "mg",
  unit = "units",
}

export interface IMedication extends Document {
  userId: Types.ObjectId;
  name: string;
  type: MedicationType;
  dosage?: string;
  dosageType: MedicationDosageType;
  timeTaken?: string;
  readingTime: ReadingTiming[];
  dosagePerReadingTime?: Record<ReadingTiming, string>;
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
    dosage: { type: String },
    dosageType: {
      type: String,
      enum: Object.values(MedicationDosageType),
      required: [true, "Medication doasge type is required!"],
    },
    dosagePerReadingTime: {
      type: Map,
      of: String,
    },
    timeTaken: {
      type: String,
    },
    readingTime: {
      type: [String],
      enum: Object.values(ReadingTiming),
      required: [true, "At least one reading time is required!"],
      validate: {
        validator: function (value: string[]) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "You must specify at least one reading time.",
      },
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
