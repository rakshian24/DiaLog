import mongoose, { Document, Schema } from "mongoose";

export enum TimeFrequency {
  hours = "hours",
  minutes = "minutes",
}

export interface IPostMealTime extends Document {
  value: number;
  unit: TimeFrequency;
}

const postMealTimeSchema = new Schema(
  {
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

const PostMealTime = mongoose.model("PostMealTime", postMealTimeSchema);

export default PostMealTime;
