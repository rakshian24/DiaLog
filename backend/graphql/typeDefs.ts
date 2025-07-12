import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar IntOrString

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

  type User {
    _id: ID!
    username: String!
    email: String!
    birthYear: String!
    postMealPreferences: [ID]
    gender: GenderType!
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

  type PostMealTime {
    _id: ID!
    value: Int!
    unit: TimeFrequency!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: ID!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
    birthYear: String!
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

  type Query {
    me: User

    getAllFoods: [Food]

    getMedicationById(id: ID!): Medication
    getAllMedications: [Medication]

    getAllExercises: [Exercise]

    getAllPostMealTimes: [PostMealTime]
  }

  type Mutation {
    registerUser(input: RegisterInput): AuthResponse
    loginUser(input: LoginInput): AuthResponse

    createFood(input: FoodInput): Food
    addMedication(input: MedicationInput): Medication
    addExercise(input: ExerciseInput): Exercise
    addPostMealTime(input: PostMealTimeInput): PostMealTime
  }
`;
