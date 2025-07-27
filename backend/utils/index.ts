import jwt from "jsonwebtoken";
import { IReading } from "../models/Reading";
import {
  GroupedReadings,
  ReadingReportEntry,
  ReadingTiming,
  ReportDateEntry,
  ReportMealTimings,
} from "../types";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../constants";

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

export const groupReadingsForReport = (
  readings: IReading[]
): ReportDateEntry[] => {
  const grouped: Record<string, Partial<ReportMealTimings>> = {};

  readings.forEach((r) => {
    const dateKey = dayjs(r.dateTime).format(DATE_FORMAT);

    if (!grouped[dateKey]) {
      grouped[dateKey] = {};
    }

    const entry: ReadingReportEntry = {
      glucoseLevel: r.glucoseLevel,
      time: dayjs(r.dateTime).format("h:mm A"),
      meals:
        Array.isArray(r.foods) && r.foods.length > 0
          ? r.foods.map((f: any) => (f.name ? f.name : "")).filter(Boolean)
          : [],
    };

    switch (r.readingTime) {
      case "BEFORE_BREAKFAST":
        grouped[dateKey][ReadingTiming.BEFORE_BREAKFAST] = entry;
        break;
      case "AFTER_BREAKFAST":
        grouped[dateKey][ReadingTiming.AFTER_BREAKFAST] = entry;
        break;
      case "BEFORE_LUNCH":
        grouped[dateKey][ReadingTiming.BEFORE_LUNCH] = entry;
        break;
      case "AFTER_LUNCH":
        grouped[dateKey][ReadingTiming.AFTER_LUNCH] = entry;
        break;
      case "BEFORE_DINNER":
        grouped[dateKey][ReadingTiming.BEFORE_DINNER] = entry;
        break;
      case "AFTER_DINNER":
        grouped[dateKey][ReadingTiming.AFTER_DINNER] = entry;
        break;
    }
  });

  return Object.entries(grouped).map(([date, readings]) => {
    const finalReadings: ReportMealTimings = {
      [ReadingTiming.BEFORE_BREAKFAST]:
        readings[ReadingTiming.BEFORE_BREAKFAST] ?? null,
      [ReadingTiming.AFTER_BREAKFAST]:
        readings[ReadingTiming.AFTER_BREAKFAST] ?? null,
      [ReadingTiming.BEFORE_LUNCH]:
        readings[ReadingTiming.BEFORE_LUNCH] ?? null,
      [ReadingTiming.AFTER_LUNCH]: readings[ReadingTiming.AFTER_LUNCH] ?? null,
      [ReadingTiming.BEFORE_DINNER]:
        readings[ReadingTiming.BEFORE_DINNER] ?? null,
      [ReadingTiming.AFTER_DINNER]:
        readings[ReadingTiming.AFTER_DINNER] ?? null,
    };

    return {
      date: dayjs(date).format("MMMM D, YYYY"),
      readings: finalReadings,
    };
  });
};
