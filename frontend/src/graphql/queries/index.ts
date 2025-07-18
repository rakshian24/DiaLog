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
    }
  }
`;
