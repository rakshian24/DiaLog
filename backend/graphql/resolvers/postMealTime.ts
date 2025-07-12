import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import PostMealTime, { IPostMealTime } from "../../models/PostMealTime";
import { TimeFrequency } from "../../models/PostMealTime";
import User from "../../models/User";

interface ExerciseInput {
  value: number;
  unit: TimeFrequency;
}

const resolvers = {
  Mutation: {
    async addPostMealTime(
      _: unknown,
      { input: { value, unit } }: { input: ExerciseInput },
      ctx: any
    ): Promise<IPostMealTime> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const authenticatedUserId = loggedInUserId?.userId;

      if (!authenticatedUserId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }
      const postMealTimeExists = await PostMealTime.findOne({
        value,
        unit,
        userId: authenticatedUserId,
      });

      if (postMealTimeExists) {
        throw new ApolloError(
          `You already have added ${value} ${unit} as your post meal time.`,
          "POST_MEAL_TIME_ALREADY_EXISTS"
        );
      }

      const newPostMealTime = new PostMealTime({
        value,
        unit,
        userId: authenticatedUserId,
      });

      // Update the user's postMealPreferences array
      await User.findByIdAndUpdate(
        authenticatedUserId,
        { $push: { postMealPreferences: newPostMealTime._id } },
        { new: true }
      );

      const response =
        (await newPostMealTime.save()) as unknown as IPostMealTime;

      return response;
    },
  },
  Query: {
    async getAllPostMealTimes(
      _: unknown,
      args: {},
      ctx: any
    ): Promise<IPostMealTime | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const postMealTimes = (await PostMealTime.find({
        userId,
      })) as unknown as IPostMealTime;

      return postMealTimes;
    },
  },
};

export default resolvers;
