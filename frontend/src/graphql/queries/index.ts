import gql from "graphql-tag";

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      birthYear
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
