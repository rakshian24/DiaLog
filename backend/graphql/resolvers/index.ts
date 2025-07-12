import userResolvers from "./users";
import foodResolvers from "./food";
import medicationResolvers from "./medication";
import exerciseResolvers from "./exercise";
import postMealTimeResolvers from "./postMealTime";
import readingResolvers from "./reading";

export default {
  Query: {
    ...userResolvers.Query,
    ...foodResolvers.Query,
    ...medicationResolvers.Query,
    ...exerciseResolvers.Query,
    ...postMealTimeResolvers.Query,
    ...readingResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...foodResolvers.Mutation,
    ...medicationResolvers.Mutation,
    ...exerciseResolvers.Mutation,
    ...postMealTimeResolvers.Mutation,
    ...readingResolvers.Mutation,
  },
};
