import gql from "graphql-tag";

// --- Fragments ---
export const MEDICATION_FIELDS = gql`
  fragment MedicationFields on Medication {
    _id
    name
    type
    dosage
    dosageType
    dosagePerReadingTime
    timeTaken
    readingTime
    createdAt
    updatedAt
    userId
  }
`;

export const FOOD_FIELDS = gql`
  fragment FoodFields on Food {
    _id
    name
    userId
    createdAt
    updatedAt
  }
`;

export const EXERCISE_DETAIL_FIELDS = gql`
  fragment ExerciseDetailFields on ExerciseDetail {
    exerciseId
    durationMinutes
  }
`;

export const READING_FIELDS = gql`
  fragment ReadingFields on Reading {
    _id
    userId
    dateTime
    notes
    glucoseLevel
    readingTime
    exercisedToday
    createdAt
    updatedAt
    foods {
      ...FoodFields
    }
    medications {
      ...MedicationFields
    }
    requiredMedications {
      ...MedicationFields
    }
    missedMedications {
      ...MedicationFields
    }
    exerciseDetails {
      ...ExerciseDetailFields
    }
  }
  ${FOOD_FIELDS}
  ${MEDICATION_FIELDS}
  ${EXERCISE_DETAIL_FIELDS}
`;

// --- Queries ---
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      birthYear
      initialSetupDone
      postMealPreferences {
        userId
        updatedAt
        createdAt
        unit
        value
        _id
      }
      gender
    }
  }
`;

export const GET_USER_SETUP_PROGRESS = gql`
  query GetUserSetupProgress {
    getUserSetupProgress {
      userId
      progress
      completedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_MEDICATIONS = gql`
  query GetAllMedications {
    getAllMedications {
      ...MedicationFields
    }
  }
  ${MEDICATION_FIELDS}
`;

export const GET_ALL_MEDICATIONS_BY_MEAL_TYPE = gql`
  query GetAllMedicationsByMealType {
    getAllMedicationsByMealType {
      BEFORE_BREAKFAST {
        ...MedicationFields
      }
      AFTER_BREAKFAST {
        ...MedicationFields
      }
      BEFORE_LUNCH {
        ...MedicationFields
      }
      AFTER_LUNCH {
        ...MedicationFields
      }
      BEFORE_DINNER {
        ...MedicationFields
      }
      AFTER_DINNER {
        ...MedicationFields
      }
    }
  }
  ${MEDICATION_FIELDS}
`;

export const GET_ALL_READINGS = gql`
  query GetAllReadings {
    getAllReadings {
      ...ReadingFields
    }
  }
  ${READING_FIELDS}
`;

export const GET_ALL_FOODS = gql`
  query GetAllFoods {
    getAllFoods {
      ...FoodFields
    }
  }
  ${FOOD_FIELDS}
`;

export const GET_TODAYS_OR_LATEST_READINGS = gql`
  query GetTodaysOrLatestReadings {
    getTodaysOrLatestGroupedReadings {
      readingDate
      readings {
        Breakfast {
          ...ReadingFields
        }
        Lunch {
          ...ReadingFields
        }
        Dinner {
          ...ReadingFields
        }
      }
    }
  }
  ${READING_FIELDS}
`;
