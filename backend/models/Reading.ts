import mongoose, { Document, Schema } from "mongoose";
import Medication from "./Medication";
import { IExerciseDetail, ReadingTiming } from "../types";

const ObjectId = mongoose.Types.ObjectId;

export interface IReading extends Document {
  userId: mongoose.Types.ObjectId;
  dateTime: Date;
  glucoseLevel: number;
  readingTime: ReadingTiming;
  foods?: mongoose.Types.ObjectId[];
  exercisedToday?: boolean;
  exerciseDetails?: IExerciseDetail[];
  medications?: mongoose.Types.ObjectId[];
  notes?: string;
  requiredMedications?: mongoose.Types.ObjectId[];
  missedMedications?: mongoose.Types.ObjectId[];
}

const readingSchema = new Schema<IReading>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
        type: Schema.Types.ObjectId,
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
        exerciseId: {
          type: Schema.Types.ObjectId,
          ref: "Exercise",
          required: true,
        },
        durationMinutes: { type: Number, required: true },
      },
    ],
    medications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medication",
        required: false,
      },
    ],
    requiredMedications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Medication",
        required: false,
      },
    ],
    missedMedications: [
      {
        type: Schema.Types.ObjectId,
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
  const reading = this as unknown as IReading;

  const readingDate = new Date(reading.dateTime).toISOString().split("T")[0];

  const existing = await Reading.findOne({
    userId: reading.userId,
    readingTime: reading.readingTime,
    dateTime: {
      $gte: new Date(`${readingDate}T00:00:00.000Z`),
      $lte: new Date(`${readingDate}T23:59:59.999Z`),
    },
    _id: { $ne: reading._id },
  });

  if (existing) {
    return next(
      new Error(
        `You already have a "${reading.readingTime}" reading for this day.`
      )
    );
  }

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

  if (
    reading.exercisedToday === true &&
    (!reading.exerciseDetails || reading.exerciseDetails.length === 0)
  ) {
    reading.invalidate(
      "exerciseDetails",
      "Exercise details must be provided when exercisedToday is true"
    );
  }

  try {
    const requiredMeds = await Medication.find({
      readingTime: reading.readingTime,
      userId: reading.userId,
    });

    if (requiredMeds.length === 0) {
      reading.requiredMedications = [];
      reading.missedMedications = [];
    } else {
      const requiredMedIds = requiredMeds.map((med) => med._id.toString());
      const takenMedIds = (reading.medications || []).map((m) => m.toString());

      const missedMedIds = requiredMedIds.filter(
        (id) => !takenMedIds.includes(id)
      );

      reading.requiredMedications = requiredMeds.map((m) => m._id);
      reading.missedMedications = missedMedIds.map((id) => new ObjectId(id));
    }

    next();
  } catch (err: any) {
    return next(err);
  }
});

const Reading = mongoose.model<IReading>("Reading", readingSchema);

export default Reading;
