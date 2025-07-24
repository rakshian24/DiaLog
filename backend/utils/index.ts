import jwt from "jsonwebtoken";
import { IReading } from "../models/Reading";
import { GroupedReadings, ReadingTiming } from "../types";

export const generateToken = async (user: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
          accounts: user.accounts,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "365d",
        }
      );
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
};

export const groupReadingsByMeal = (readings: IReading[]): GroupedReadings => {
  const grouped: GroupedReadings = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
  };

  const sortOrder = [
    ReadingTiming.BEFORE_BREAKFAST,
    ReadingTiming.AFTER_BREAKFAST,
    ReadingTiming.BEFORE_LUNCH,
    ReadingTiming.AFTER_LUNCH,
    ReadingTiming.BEFORE_DINNER,
    ReadingTiming.AFTER_DINNER,
  ];

  const sorted = [...readings].sort(
    (a, b) =>
      sortOrder.indexOf(a.readingTime) - sortOrder.indexOf(b.readingTime)
  );

  for (const reading of sorted) {
    if (reading.readingTime.includes("BREAKFAST")) {
      grouped.Breakfast.push(reading);
    } else if (reading.readingTime.includes("LUNCH")) {
      grouped.Lunch.push(reading);
    } else if (reading.readingTime.includes("DINNER")) {
      grouped.Dinner.push(reading);
    }
  }

  return grouped;
};
