import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Food, { IFood } from "../../models/Food";

interface FoodInput {
  name: string;
}

const resolvers = {
  Mutation: {
    async createFood(
      _: unknown,
      { input: { name } }: { input: FoodInput },
      ctx: any
    ): Promise<IFood> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const authenticatedUserId = loggedInUserId?.userId;

      if (!authenticatedUserId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }
      const foodExists = await Food.findOne({
        name: name.trim().toLocaleLowerCase(),
        userId: authenticatedUserId,
      });

      if (foodExists) {
        throw new ApolloError(
          `You already have added ${name} as your food.`,
          "FOOD_ALREADY_EXISTS"
        );
      }

      const newFood = new Food({
        name,
        userId: authenticatedUserId,
      });

      const response = (await newFood.save()) as unknown as IFood;

      return response;
    },
  },
  Query: {
    async getAllFoods(_: unknown, args: {}, ctx: any): Promise<IFood | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const foods = (await Food.find({
        userId,
      })) as unknown as IFood;

      return foods;
    },
  },
};

export default resolvers;
