import dayjs from "dayjs";
import {
  GroupedReadings,
  PmtTrackingOption,
  ReadingTiming,
  TimeFrequency,
} from "../types";
import { colors } from "../constants";

export const textInputRegex =
  /^(?!\s+$)[~!\s@#$%^&*()_+=[\]{}|;':",./<>?a-zA-Z0-9-]+$/;

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const NumberRegex = /^[1-9]\d*$/;

export const Windows1252Regex =
  /^(?!\s+$)[~!\s@#$%^&*()_+=[\]{}|;':",./<>?a-zA-Z0-9-]+$/;

export const isRunningStandalone = () => {
  return window.matchMedia("(display-mode: standalone)").matches;
};

export const isAppRunningOnIos16 = (): boolean => {
  const userAgent = window?.navigator.userAgent || "";
  return userAgent.includes("iPhone OS 16");
};

export const isStandAloneAndRunningOnIos16 = () =>
  isRunningStandalone() && isAppRunningOnIos16();

export const getInitials = (str: string = "") => {
  if (!str) return "RS";

  const initials = str
    .split(" ")
    .map(
      (name, index, arr) => (index === 0 || index === arr.length - 1) && name[0]
    )
    .filter((initial) => initial)
    .join("");

  return initials.toUpperCase() || "RS";
};

export const capitalizeFirstLetter = (name: string = ""): string => {
  if (!name) return name;

  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const pmtTrackingOptions: PmtTrackingOption[] = [
  {
    value: "1_hour",
    label: "1 Hour After Meals",
    description: "Track glucose levels 1 hour post-meal",
  },
  {
    value: "2_hours",
    label: "2 Hours After Meals",
    description: "Track glucose levels 2 hours post-meal",
  },
  {
    value: "both",
    label: "Both 1 & 2 Hours",
    description: "Comprehensive tracking at both intervals",
  },
];

export const createPmtMutationPayload = (
  selectedValue: string,
  pmtTrackingOptions: PmtTrackingOption[]
) => {
  if (selectedValue === "both") {
    return [
      { value: 1, unit: TimeFrequency.hours },
      { value: 2, unit: TimeFrequency.hours },
    ];
  }

  const matched = pmtTrackingOptions.find((opt) => opt.value === selectedValue);
  const matchedValue = matched?.value || "";
  const unit =
    matchedValue?.includes("hours") || matchedValue?.includes("hour")
      ? TimeFrequency.hours
      : TimeFrequency.minutes;

  return [
    {
      value: parseInt(matchedValue.split("_")[0], 10),
      unit,
    },
  ];
};

export const readingTimingLabels: Record<string, string> = {
  BEFORE_BREAKFAST: "Before breakfast",
  AFTER_BREAKFAST: "After breakfast",
  BEFORE_LUNCH: "Before lunch",
  AFTER_LUNCH: "After lunch",
  BEFORE_DINNER: "Before dinner",
  AFTER_DINNER: "After dinner",
};

export const medicationTypeLabels: Record<string, string> = {
  tablet: "Tablet",
  insulin: "Insulin",
};

export const readingTimesRequiringFoodInput = [
  ReadingTiming.AFTER_BREAKFAST,
  ReadingTiming.AFTER_LUNCH,
  ReadingTiming.AFTER_DINNER,
];

export const chipBgColorMap: Record<string, string> = {
  BEFORE_BREAKFAST: "#FEFBEB",
  AFTER_BREAKFAST: "#FFF7ED",
  BEFORE_LUNCH: "#FEFCE8",
  AFTER_LUNCH: "#F6FEE7",
  BEFORE_DINNER: "#FAF5FF",
  AFTER_DINNER: "#EEF2FF",
};

export const chipColorMap: Record<string, string> = {
  BEFORE_BREAKFAST: "#B4530A",
  AFTER_BREAKFAST: "#EA580B",
  BEFORE_LUNCH: "#CA8A03",
  AFTER_LUNCH: "#65A20C",
  BEFORE_DINNER: "#9333E9",
  AFTER_DINNER: "#4F45E4",
};

export const stripTypename = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map(stripTypename) as unknown as T;
  }

  if (typeof data === "object" && data !== null) {
    const newObj: Record<string, any> = {};
    for (const key in data) {
      if (key !== "__typename") {
        newObj[key] = stripTypename((data as Record<string, any>)[key]);
      }
    }
    return newObj as T;
  }

  return data;
};

export const getDayLabel = (dateTime: string): "Today" | "Yesterday" | null => {
  const inputDate = dayjs(dateTime);
  const today = dayjs();
  const yesterday = dayjs().subtract(1, "day");

  if (inputDate.isSame(today, "day")) {
    return "Today";
  }

  if (inputDate.isSame(yesterday, "day")) {
    return "Yesterday";
  }

  return null;
};

export const getMealTime = (
  afterMealDateTime?: string,
  beforeMealDateTime?: string,
  hoursToSubtract: number = 2
): string | null => {
  if (!afterMealDateTime && !beforeMealDateTime) {
    return null;
  } else if (afterMealDateTime) {
    return dayjs(afterMealDateTime)
      .subtract(hoursToSubtract, "hour")
      .format("h:mm A");
  }
  return dayjs(beforeMealDateTime).format("h:mm A");
};

export const isToday = (dateString: string): boolean => {
  return dayjs(dateString).isSame(dayjs(), "day");
};

export const calculateAverageGlucoseLevel = (
  readings: GroupedReadings
): number | null => {
  if (!readings) return null;

  const glucoseLevels: number[] = [];

  Object.values(readings).forEach((mealReadings) => {
    mealReadings.forEach((reading) => {
      if (typeof reading.glucoseLevel === "number") {
        glucoseLevels.push(reading.glucoseLevel);
      }
    });
  });

  if (glucoseLevels.length === 0) return null;

  const total = glucoseLevels.reduce((sum, level) => sum + level, 0);
  const average = total / glucoseLevels.length;

  return Math.round(average);
};

export const getAverageGlucoseStyle = (
  isTodaysReading: boolean,
  averageGlucoseLevel: number | null | undefined
): {
  bgColor: string;
  textColor: string;
  label: string;
  borderColor: string;
} => {
  if (!isTodaysReading || averageGlucoseLevel == null) {
    return {
      bgColor: colors.orangeBg1,
      textColor: colors.orange,
      label: "No data today",
      borderColor: colors.orangeBg1Border,
    };
  }

  if (averageGlucoseLevel < 90) {
    return {
      bgColor: colors.primaryBg,
      textColor: colors.primary,
      label: `Average: ${averageGlucoseLevel} mg/dL`,
      borderColor: colors.primaryBorder,
    };
  }

  if (averageGlucoseLevel <= 140) {
    return {
      bgColor: colors.successBg,
      textColor: colors.success,
      label: `Average: ${averageGlucoseLevel} mg/dL`,
      borderColor: colors.successBorder,
    };
  }

  if (averageGlucoseLevel <= 160) {
    return {
      bgColor: colors.warningBg,
      textColor: colors.warning,
      label: `Average: ${averageGlucoseLevel} mg/dL`,
      borderColor: colors.warningBorder,
    };
  }

  return {
    bgColor: colors.dangerBg,
    textColor: colors.danger,
    label: `Average: ${averageGlucoseLevel} mg/dL`,
    borderColor: colors.dangerBorder,
  };
};
