import { gql } from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  scalar IntOrString

  enum GenderType {
    male
    female
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

  type Query {
    me: User
  }

  type Mutation {
    registerUser(input: RegisterInput): AuthResponse
    loginUser(input: LoginInput): AuthResponse
  }
`;
