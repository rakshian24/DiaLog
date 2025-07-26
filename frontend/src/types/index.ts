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

export enum MedicationViewType {
  LIST_VIEW = "LIST_VIEW",
  BY_MEAL_TYPE = "BY_MEAL_TYPE",
  ADD_READING = "ADD_READING",
}

export type MedicationsByMealType = {
  BEFORE_BREAKFAST: [Medication];
  AFTER_BREAKFAST: [Medication];
  BEFORE_LUNCH: [Medication];
  AFTER_LUNCH: [Medication];
  BEFORE_DINNER: [Medication];
  AFTER_DINNER: [Medication];
};

export type Food = {
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
};

export type ExerciseDetails = {
  exerciseId: string;
  durationMinutes: string;
};

export type Reading = {
  _id: string;
  userId: string;
  dateTime: string;
  notes: string;
  glucoseLevel: number;
  readingTime: ReadingTiming;
  foods: Food[];
  exercisedToday: string;
  medications: Medication[];
  exerciseDetails: ExerciseDetails;
  createdAt: string;
  updatedAt: string;
  requiredMedications: Medication[];
  missedMedications: Medication[];
};

export type GroupedReadings = {
  Breakfast: Reading[];
  Lunch: Reading[];
  Dinner: Reading[];
};

export type DashboardGroupedReadings = {
  readings: GroupedReadings;
  readingDate: string;
};
