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
    units
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
    dosage: String
    dosageType: MedicationDosageType!
    dosagePerReadingTime: JSON
    timeTaken: String!
    readingTime: [ReadingTiming!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: ID!
  }

  type MedicationsByMealType {
    BEFORE_BREAKFAST: [Medication]
    AFTER_BREAKFAST: [Medication]
    BEFORE_LUNCH: [Medication]
    AFTER_LUNCH: [Medication]
    BEFORE_DINNER: [Medication]
    AFTER_DINNER: [Medication]
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
    dateTime: DateTime!
    notes: String
    glucoseLevel: Int!
    readingTime: ReadingTiming!
    foods: [Food]
    exercisedToday: Boolean!
    exerciseDetails: [ExerciseDetail]
    medications: [Medication]
    createdAt: DateTime!
    updatedAt: DateTime!
    requiredMedications: [Medication]
    missedMedications: [Medication]
  }

  type ReadingsGroupedByMeal {
    Breakfast: [Reading]
    Lunch: [Reading]
    Dinner: [Reading]
  }

  type DashboardReadingsResult {
    readingDate: String
    readings: ReadingsGroupedByMeal
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
    dosage: String
    dosageType: MedicationDosageType!
    dosagePerReadingTime: JSON
    timeTaken: String
    readingTime: [ReadingTiming!]!
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
    notes: String
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
    getAllMedicationsByMealType: MedicationsByMealType

    getAllExercises: [Exercise]

    getAllPostMealTimes: [PostMealTime]

    getReadingById(id: ID!): Reading
    getAllReadings: [Reading]
    getTodaysOrLatestGroupedReadings: DashboardReadingsResult

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
