import gql from "graphql-tag";

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
      _id
      name
      type
      dosage
      dosageType
      timeTaken
      readingTime
      createdAt
      updatedAt
      userId
      dosagePerReadingTime
    }
  }
`;

export const GET_ALL_MEDICATIONS_BY_MEAL_TYPE = gql`
  query GetAllMedicationsByMealType {
    getAllMedicationsByMealType {
      BEFORE_BREAKFAST {
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
      AFTER_BREAKFAST {
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
      BEFORE_LUNCH {
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
      AFTER_LUNCH {
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
      BEFORE_DINNER {
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
      AFTER_DINNER {
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
    }
  }
`;

export const GET_ALL_READINGS = gql`
  query GetAllReadings {
    getAllReadings {
      _id
      userId
      dateTime
      glucoseLevel
      readingTime
      foods
      exercisedToday
      medications
      createdAt
      updatedAt
      exerciseDetails {
        exerciseId
        durationMinutes
      }
    }
  }
`;

export const GET_ALL_FOODS = gql`
  query GetAllFoods {
    getAllFoods {
      name
      userId
      createdAt
      updatedAt
      _id
    }
  }
`;

export const GET_TODAYS_OR_LATEST_READINGS = gql`
  query GetTodaysOrLatestReadings {
    getTodaysOrLatestGroupedReadings {
      readingDate
      readings {
        Breakfast {
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
            _id
            name
            userId
            createdAt
            updatedAt
          }
          exerciseDetails {
            exerciseId
            durationMinutes
          }
          medications {
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
        }
        Lunch {
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
            _id
            name
            userId
            createdAt
            updatedAt
          }
          exerciseDetails {
            exerciseId
            durationMinutes
          }
          medications {
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
        }
        Dinner {
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
            _id
            name
            userId
            createdAt
            updatedAt
          }
          exerciseDetails {
            exerciseId
            durationMinutes
          }
          medications {
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
        }
      }
    }
  }
`;
