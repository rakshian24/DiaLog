import mongoose, { Document, Schema, Types } from "mongoose";

export interface IExercise extends Document {
  userId: Types.ObjectId;
  type: string;
}

const exerciseSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      required: [true, "Exercise type is required!"],
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique exercise name per user and type
exerciseSchema.index({ userId: 1, type: 1 }, { unique: true });

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
