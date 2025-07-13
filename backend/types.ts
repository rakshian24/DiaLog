import { Document, Types } from "mongoose";
import { IUser } from "./models/User";

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
