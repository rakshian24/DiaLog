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

export enum MedicationType {
  tablet = "tablet",
  insulin = "insulin",
}

export enum MedicationDosageType {
  mg = "mg",
  units = "units",
}

export enum ReadingTiming {
  BEFORE_BREAKFAST = "BEFORE_BREAKFAST",
  AFTER_BREAKFAST = "AFTER_BREAKFAST",
  BEFORE_LUNCH = "BEFORE_LUNCH",
  AFTER_LUNCH = "AFTER_LUNCH",
  BEFORE_DINNER = "BEFORE_DINNER",
  AFTER_DINNER = "AFTER_DINNER",
}

export type Medication = {
  _id: string;
  name: string;
  type: MedicationType;
  dosage: string;
  dosageType: MedicationDosageType;
  timeTaken: string;
  readingTime: ReadingTiming[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  dosagePerReadingTime?: Record<ReadingTiming, string>;
};
