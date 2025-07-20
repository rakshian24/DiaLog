import gql from "graphql-tag";

export const REGISTER_USER_MUTATION = gql`
  mutation Mutation($input: RegisterInput) {
    registerUser(input: $input) {
      token
      user {
        _id
        username
        email
        birthYear
        initialSetupDone
        postMealPreferences {
          _id
          userId
          updatedAt
          unit
          value
          createdAt
        }
        gender
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Mutation($input: LoginInput) {
    loginUser(input: $input) {
      token
      user {
        _id
        username
        email
        birthYear
        initialSetupDone
        postMealPreferences {
          _id
          userId
          updatedAt
          unit
          value
          createdAt
        }
        gender
      }
    }
  }
`;

export const ADD_POST_MEAL_TIME_MUTATION = gql`
  mutation Mutation($input: [PostMealTimeInput]) {
    addPostMealTime(input: $input) {
      _id
      value
      unit
      createdAt
      updatedAt
      userId
    }
  }
`;

export const UPDATE_SETUP_PROGRESS = gql`
  mutation Mutation($input: UpdateUserSetupProgressInput!) {
    updateUserSetupProgress(input: $input) {
      userId
      progress
      completedAt
      createdAt
      updatedAt
    }
  }
`;

export const ADD_MEDICATION = gql`
  mutation Mutation($input: MedicationInput) {
    addMedication(input: $input) {
      _id
      name
      type
      dosage
      timeTaken
      readingTime
      createdAt
      updatedAt
      userId
      dosageType
      dosagePerReadingTime
    }
  }
`;

export const ADD_READING = gql`
  mutation Mutation($input: ReadingInput) {
    addReading(input: $input) {
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
        durationMinutes
        exerciseId
      }
    }
  }
`;

export const ADD_FOOD = gql`
  mutation Mutation($input: FoodInput) {
    createFood(input: $input) {
      _id
      name
      userId
      createdAt
      updatedAt
    }
  }
`;
