import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Exercise, { IExercise } from "../../models/Exercise";

interface ExerciseInput {
  type: string;
}

const resolvers = {
  Mutation: {
    async addExercise(
      _: unknown,
      { input: { type } }: { input: ExerciseInput },
      ctx: any
    ): Promise<IExercise> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const authenticatedUserId = loggedInUserId?.userId;

      if (!authenticatedUserId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }
      const exerciseExists = await Exercise.findOne({
        type: { $regex: new RegExp(`^${type.trim()}$`, "i") },
        userId: authenticatedUserId,
      });

      if (exerciseExists) {
        throw new ApolloError(
          `You already have added ${type} as your exercise.`,
          "FOOD_ALREADY_EXISTS"
        );
      }

      const newExercise = new Exercise({
        type,
        userId: authenticatedUserId,
      });

      const response = (await newExercise.save()) as unknown as IExercise;

      return response;
    },
  },
  Query: {
    async getAllExercises(
      _: unknown,
      args: {},
      ctx: any
    ): Promise<IExercise | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const exercises = (await Exercise.find({
        userId,
      })) as unknown as IExercise;

      return exercises;
    },
  },
};

export default resolvers;
