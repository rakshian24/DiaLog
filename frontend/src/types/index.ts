export enum GenderType {
  male = "male",
  female = "female",
}

export enum TimeFrequency {
  hours = "hours",
  minutes = "minutes",
}

export interface PmtTrackingOption {
  value: string;
  label: string;
  description: string;
}

export enum SetupSteps {
  TRACKING_PREFERENCES = "trackingPreferences",
  MEDICATIONS = "medications",
}
