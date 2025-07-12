import mongoose, { Document, Schema, Types } from "mongoose";

export enum TimeFrequency {
  hours = "hours",
  minutes = "minutes",
}

export interface IPostMealTime extends Document {
  userId: Types.ObjectId;
  value: number;
  unit: TimeFrequency;
}

const postMealTimeSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    value: {
      type: Number,
      required: [true, "Post meal time is required!"],
    },
    unit: {
      type: String,
      enum: Object.values(TimeFrequency),
      default: TimeFrequency.hours,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique postMealTime name per user, value and unit
postMealTimeSchema.index({ userId: 1, value: 1, unit: 1 }, { unique: true });

const PostMealTime = mongoose.model("PostMealTime", postMealTimeSchema);

export default PostMealTime;
