import { Document, Types } from "mongoose";
import { IUser } from "./models/User";
import { IReading } from "./models/Reading";

export enum ReadingTiming {
  BEFORE_BREAKFAST = "BEFORE_BREAKFAST",
  AFTER_BREAKFAST = "AFTER_BREAKFAST",
  BEFORE_LUNCH = "BEFORE_LUNCH",
  AFTER_LUNCH = "AFTER_LUNCH",
  BEFORE_DINNER = "BEFORE_DINNER",
  AFTER_DINNER = "AFTER_DINNER",
}

export interface IExerciseDetail {
  exerciseId: Types.ObjectId;
  durationMinutes: number;
}

export enum SetupSteps {
  TRACKING_PREFERENCES = "trackingPreferences",
  MEDICATIONS = "medications",
}

export type IUserLean = Omit<IUser, keyof Document> & {
  _id: Types.ObjectId;
};

export type GroupedReadings = {
  Breakfast: IReading[];
  Lunch: IReading[];
  Dinner: IReading[];
};

export type ReadingReportEntry = {
  glucoseLevel: number;
  time: string;
  meals: string[];
};

export type ReportMealTimings = {
  [ReadingTiming.BEFORE_BREAKFAST]: ReadingReportEntry | null;
  [ReadingTiming.AFTER_BREAKFAST]: ReadingReportEntry | null;
  [ReadingTiming.BEFORE_LUNCH]: ReadingReportEntry | null;
  [ReadingTiming.AFTER_LUNCH]: ReadingReportEntry | null;
  [ReadingTiming.BEFORE_DINNER]: ReadingReportEntry | null;
  [ReadingTiming.AFTER_DINNER]: ReadingReportEntry | null;
};

export type ReportDateEntry = {
  date: string;
  readings: ReportMealTimings;
};
