import gql from "graphql-tag";

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
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
`;

export const MEDICATION_FRAGMENT = gql`
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

export const FOOD_FRAGMENT = gql`
  fragment FoodFields on Food {
    _id
    name
    userId
    createdAt
    updatedAt
  }
`;

export const READING_FRAGMENT = gql`
  fragment ReadingFields on Reading {
    _id
    userId
    dateTime
    glucoseLevel
    readingTime
    foods {
      ...FoodFields
    }
    exercisedToday
    medications {
      ...MedicationFields
    }
    createdAt
    updatedAt
    exerciseDetails {
      durationMinutes
      exerciseId
    }
  }
  ${FOOD_FRAGMENT}
  ${MEDICATION_FRAGMENT}
`;

export const POST_MEAL_TIME_FRAGMENT = gql`
  fragment PostMealTimeFields on PostMealTime {
    _id
    value
    unit
    createdAt
    updatedAt
    userId
  }
`;

export const USER_SETUP_PROGRESS_FRAGMENT = gql`
  fragment UserSetupProgressFields on UserSetupProgress {
    userId
    progress
    completedAt
    createdAt
    updatedAt
  }
`;

// --- Mutations ---

export const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($input: RegisterInput) {
    registerUser(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const LOGIN_MUTATION = gql`
  mutation LoginUser($input: LoginInput) {
    loginUser(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const ADD_POST_MEAL_TIME_MUTATION = gql`
  mutation AddPostMealTime($input: [PostMealTimeInput]) {
    addPostMealTime(input: $input) {
      ...PostMealTimeFields
    }
  }
  ${POST_MEAL_TIME_FRAGMENT}
`;

export const UPDATE_SETUP_PROGRESS = gql`
  mutation UpdateUserSetupProgress($input: UpdateUserSetupProgressInput!) {
    updateUserSetupProgress(input: $input) {
      ...UserSetupProgressFields
    }
  }
  ${USER_SETUP_PROGRESS_FRAGMENT}
`;

export const ADD_MEDICATION = gql`
  mutation AddMedication($input: MedicationInput) {
    addMedication(input: $input) {
      ...MedicationFields
    }
  }
  ${MEDICATION_FRAGMENT}
`;

export const ADD_READING = gql`
  mutation AddReading($input: ReadingInput) {
    addReading(input: $input) {
      ...ReadingFields
    }
  }
  ${READING_FRAGMENT}
`;

export const ADD_FOOD = gql`
  mutation AddFood($input: FoodInput) {
    createFood(input: $input) {
      ...FoodFields
    }
  }
  ${FOOD_FRAGMENT}
`;
