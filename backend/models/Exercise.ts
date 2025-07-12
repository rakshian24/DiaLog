import mongoose, { Document, Schema, Types } from "mongoose";

export interface IExercise extends Document {
  userId: Types.ObjectId;
  type: string;
  durationMinutes: number;
}

const exerciseSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      required: [true, "Exercise type is required!"],
    },
    durationMinutes: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
