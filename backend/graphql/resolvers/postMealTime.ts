import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import PostMealTime, { IPostMealTime } from "../../models/PostMealTime";
import { TimeFrequency } from "../../models/PostMealTime";
import User from "../../models/User";

interface PostMealTimeInput {
  value: number;
  unit: TimeFrequency;
}

const resolvers = {
  Mutation: {
    async addPostMealTime(
      _: unknown,
      { input }: { input: PostMealTimeInput[] },
      ctx: any
    ): Promise<IPostMealTime[]> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const authenticatedUserId = loggedInUserId?.userId;

      if (!authenticatedUserId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const createdPostMealTimes: IPostMealTime[] = [];

      for (const { value, unit } of input) {
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

        const saved =
          (await newPostMealTime.save()) as unknown as IPostMealTime;

        // Update the user's postMealPreferences array
        await User.findByIdAndUpdate(
          authenticatedUserId,
          { $push: { postMealPreferences: saved._id } },
          { new: true }
        );

        createdPostMealTimes.push(saved);
      }

      return createdPostMealTimes;
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
