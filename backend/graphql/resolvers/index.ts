import userResolvers from "./users";
import foodResolvers from "./food";
import medicationResolvers from "./medication";

export default {
  Query: {
    ...userResolvers.Query,
    ...foodResolvers.Query,
    ...medicationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...foodResolvers.Mutation,
    ...medicationResolvers.Mutation,
  },
};
