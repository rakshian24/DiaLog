import mongoose, { Document, Schema, Types } from "mongoose";
import Medication from "./Medication";
import { ReadingTiming } from "../types";

export interface IReading extends Document {
  userId: Types.ObjectId;
  dateTime: string;
  glucoseLevel: number;
  readingTime: ReadingTiming;
  foods?: Types.ObjectId[];
  exercisedToday?: boolean;
  exerciseDetails?: Types.ObjectId[];
  medications?: Types.ObjectId[];
}

const readingSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    dateTime: { type: String, required: true },
    glucoseLevel: { type: Number, required: true },
    readingTime: {
      type: String,
      enum: Object.values(ReadingTiming),
      required: [true, "Reading timing type is required!"],
    },
    foods: [
      {
        type: Types.ObjectId,
        ref: "Food",
        required: false,
      },
    ],
    exercisedToday: {
      type: Boolean,
      default: false,
    },
    exerciseDetails: [
      {
        type: Types.ObjectId,
        ref: "Exercise",
        required: false,
      },
    ],
    medications: [
      {
        type: Types.ObjectId,
        ref: "Medication",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

readingSchema.pre("validate", async function (next) {
  const reading = this;

  // 1. Validate food for after-meal
  const isAfterMeal =
    reading.readingTime === ReadingTiming.AFTER_BREAKFAST ||
    reading.readingTime === ReadingTiming.AFTER_LUNCH ||
    reading.readingTime === ReadingTiming.AFTER_DINNER;

  if (isAfterMeal && (!reading.foods || reading.foods.length === 0)) {
    reading.invalidate(
      "foods",
      "Food(s) must be provided for after-meal readings"
    );
  }

  // 2. Validate exercise details if exercisedToday is true
  if (
    reading.exercisedToday === true &&
    (!reading.exerciseDetails || reading.exerciseDetails.length === 0)
  ) {
    reading.invalidate(
      "exerciseDetails",
      "Exercise details must be provided when exercisedToday is true"
    );
  }

  // 3. Medication Validation
  try {
    const requiredMeds = await Medication.find({
      readingTime: reading.readingTime,
    });

    if (
      requiredMeds.length > 0 &&
      (!reading.medications || reading.medications.length === 0)
    ) {
      reading.invalidate(
        "medications",
        `Medication(s) are required for "${reading.readingTime}" reading based on your prescribed plan`
      );
    }
    next();
  } catch (err: any) {
    return next(err);
  }

  next();
});

const Reading = mongoose.model("Reading", readingSchema);

export default Reading;
