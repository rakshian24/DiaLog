import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar IntOrString
  scalar JSON

  enum GenderType {
    male
    female
  }

  enum MedicationType {
    tablet
    insulin
  }

  enum MedicationDosageType {
    mg
    unit
  }

  enum TimeFrequency {
    hours
    minutes
  }

  enum ReadingTiming {
    BEFORE_BREAKFAST
    AFTER_BREAKFAST
    BEFORE_LUNCH
    AFTER_LUNCH
    BEFORE_DINNER
    AFTER_DINNER
  }

  enum SetupSteps {
    trackingPreferences
    medications
  }

  type UserSetupProgress {
    userId: ID!
    progress: JSON
    completedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PostMealTime {
    _id: ID!
    value: Int!
    unit: TimeFrequency!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: ID!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    birthYear: String!
    postMealPreferences: [PostMealTime]
    gender: GenderType!
    initialSetupDone: Boolean!
    setupProgressDetails: UserSetupProgress
  }

  type AuthResponse {
    user: User
    token: String
  }

  type Food {
    _id: ID!
    name: String!
    userId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Medication {
    _id: ID!
    name: String!
    type: MedicationType!
    dosage: Int!
    dosageType: MedicationDosageType!
    timeTaken: String!
    readingTime: ReadingTiming!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: ID!
  }

  type Exercise {
    _id: ID!
    type: String!
    userId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ExerciseDetail {
    exerciseId: ID
    durationMinutes: Int
  }

  type Reading {
    _id: ID!
    userId: ID!
    dateTime: String!
    glucoseLevel: Int!
    readingTime: ReadingTiming!
    foods: [ID]
    exercisedToday: Boolean!
    exerciseDetails: [ExerciseDetail]
    medications: [ID]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
    birthYear: Int!
    gender: GenderType!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input FoodInput {
    name: String!
  }

  input MedicationInput {
    name: String!
    type: MedicationType!
    dosage: Int!
    dosageType: MedicationDosageType!
    timeTaken: String!
    readingTime: ReadingTiming!
  }

  input ExerciseInput {
    type: String!
  }

  input PostMealTimeInput {
    value: Int!
    unit: TimeFrequency!
  }

  input ExerciseDetailInput {
    exerciseId: ID!
    durationMinutes: Int!
  }

  input ReadingInput {
    dateTime: String!
    glucoseLevel: Int!
    readingTime: ReadingTiming!
    foods: [ID]
    exercisedToday: Boolean
    exerciseDetails: ExerciseDetailInput
    medications: [ID]
  }

  input UpdateInitialSetupDoneForUserInput {
    userId: ID!
    initialSetupDone: Boolean!
  }

  input UpdateUserSetupProgressInput {
    step: SetupSteps!
    isProgressComplete: Boolean!
  }

  type Query {
    me: User

    getAllFoods: [Food]

    getMedicationById(id: ID!): Medication
    getAllMedications: [Medication]

    getAllExercises: [Exercise]

    getAllPostMealTimes: [PostMealTime]

    getReadingById(id: ID!): Reading
    getAllReadings: [Reading]

    getUserSetupProgress: UserSetupProgress
  }

  type Mutation {
    registerUser(input: RegisterInput): AuthResponse
    loginUser(input: LoginInput): AuthResponse

    createFood(input: FoodInput): Food
    addMedication(input: MedicationInput): Medication
    addExercise(input: ExerciseInput): Exercise
    addPostMealTime(input: [PostMealTimeInput]): [PostMealTime]
    addReading(input: ReadingInput): Reading

    updateInitialSetupDoneForUser(
      input: UpdateInitialSetupDoneForUserInput
    ): User

    updateUserSetupProgress(
      input: UpdateUserSetupProgressInput!
    ): UserSetupProgress
  }
`;
