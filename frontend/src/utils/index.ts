import { PmtTrackingOption, TimeFrequency } from "../types";

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
