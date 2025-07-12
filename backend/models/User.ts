import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

export enum GenderType {
  male = "male",
  female = "female",
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  birthYear: string;
  postMealPreferences?: Types.ObjectId[];
  gender: GenderType;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "User name is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [5, "Password is shorter than the minimum length(5)"],
    },
    confirmPassword: {
      type: String,
      required: function (this: IUser) {
        return this.isModified("password");
      },
      validate: {
        validator: function (this: IUser, val: string) {
          return val === this.password;
        },
        message: "Passwords don't match",
      },
    },
    birthYear: {
      type: String,
      required: [true, "BirthYear is required!"],
      minLength: [4, "BirthYear is shorter than the minimum length(4)"],
      maxLength: [4, "BirthYear is longer than the maximum length(4)"],
    },
    postMealPreferences: [
      {
        type: Types.ObjectId,
        ref: "PostMealTime",
      },
    ],
    gender: {
      type: String,
      enum: Object.values(GenderType),
      required: [true, "Gender type is required!"],
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before saving it to DB
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

// Match user entered password to the hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
