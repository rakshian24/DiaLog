import { Schema, model, Document, Types } from "mongoose";
import { SetupSteps } from "../types";

export interface IUserSetupProgress extends Document {
  userId: Types.ObjectId;
  progress: Map<SetupSteps, boolean>;
  completedAt?: Date;
}

const userSetupProgressSchema = new Schema<IUserSetupProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    progress: {
      type: Map,
      of: Boolean,
      default: () =>
        new Map([
          [SetupSteps.TRACKING_PREFERENCES, false],
          [SetupSteps.MEDICATIONS, false],
        ]),
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserSetupProgress = model<IUserSetupProgress>(
  "UserSetupProgress",
  userSetupProgressSchema
);

export default UserSetupProgress;
