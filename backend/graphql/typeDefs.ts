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
    _id: String!
    name: String!
    userId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Medication {
    _id: String
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

  type Query {
    me: User
    getAllFoods: [Food]
    getMedicationById(id: ID!): Medication
    getAllMedications: [Medication]
  }

  type Mutation {
    registerUser(input: RegisterInput): AuthResponse
    loginUser(input: LoginInput): AuthResponse

    createFood(input: FoodInput): Food
    addMedication(input: MedicationInput): Medication
  }
`;
