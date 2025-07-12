import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFood extends Document {
  userId: Types.ObjectId;
  name: string;
}

const foodSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Food name is required!"],
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique food name per user and type
foodSchema.index({ userId: 1, name: 1 }, { unique: true });

const Food = mongoose.model("Food", foodSchema);

export default Food;
