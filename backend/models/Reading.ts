import mongoose, { Document, Schema, Types } from "mongoose";
import Medication from "./Medication";
import { IExerciseDetail, ReadingTiming } from "../types";

export interface IReading extends Document {
  userId: Types.ObjectId;
  dateTime: string;
  glucoseLevel: number;
  readingTime: ReadingTiming;
  foods?: Types.ObjectId[];
  exercisedToday?: boolean;
  exerciseDetails?: IExerciseDetail[];
  medications?: Types.ObjectId[];
  notes?: string;
}

const readingSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    dateTime: { type: Date, required: true },
    notes: { type: String },
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
        exerciseId: { type: Types.ObjectId, ref: "Exercise", required: true },
        durationMinutes: { type: Number, required: true },
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

  // 1. Restrict duplicate readingTime for same user & day
  const readingDate = new Date(reading.dateTime).toISOString().split("T")[0]; // Get just YYYY-MM-DD

  const existing = await Reading.findOne({
    userId: reading.userId,
    readingTime: reading.readingTime,
    dateTime: {
      $gte: new Date(`${readingDate}T00:00:00.000Z`),
      $lte: new Date(`${readingDate}T23:59:59.999Z`),
    },
    _id: { $ne: reading._id }, // Exclude current if updating
  });

  if (existing) {
    return next(
      new Error(
        `You already have a "${reading.readingTime}" reading for this day.`
      )
    );
  }

  // 2. Validate food for after-meal
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

  // 3. Validate exercise details if exercisedToday is true
  if (
    reading.exercisedToday === true &&
    (!reading.exerciseDetails || reading.exerciseDetails.length === 0)
  ) {
    reading.invalidate(
      "exerciseDetails",
      "Exercise details must be provided when exercisedToday is true"
    );
  }

  // 4. Medication Validation
  try {
    const requiredMeds = await Medication.find({
      readingTime: reading.readingTime,
      userId: reading.userId,
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
