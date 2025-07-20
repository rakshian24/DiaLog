import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Reading, { IReading } from "../../models/Reading";
import { IExerciseDetail, ReadingTiming } from "../../types";
import { Types } from "mongoose";

interface ReadingInput {
  dateTime: string;
  notes?: string;
  glucoseLevel: number;
  readingTime: ReadingTiming;
  foods?: Types.ObjectId[];
  exercisedToday?: boolean;
  exerciseDetails?: IExerciseDetail[];
  medications?: Types.ObjectId[];
}

const resolvers = {
  Mutation: {
    async addReading(
      _: unknown,
      {
        input: {
          dateTime,
          glucoseLevel,
          readingTime,
          foods,
          exerciseDetails,
          exercisedToday,
          medications,
          notes,
        },
      }: { input: ReadingInput },
      ctx: any
    ): Promise<IReading> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const authenticatedUserId = loggedInUserId?.userId;

      if (!authenticatedUserId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const newReading = new Reading({
        dateTime,
        glucoseLevel,
        readingTime,
        foods,
        exerciseDetails,
        exercisedToday,
        medications,
        userId: authenticatedUserId,
        notes,
      });

      const response = (await newReading.save()) as unknown as IReading;

      return response;
    },
  },
  Query: {
    async getReadingById(
      _: unknown,
      args: { id: Types.ObjectId },
      ctx: any
    ): Promise<IReading | null> {
      if (!Types.ObjectId.isValid(args.id)) {
        throw new ApolloError("Invalid Reading ID", "INVALID_ID");
      }

      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const reading = await Reading.findOne({
        _id: args.id,
        userId,
      });

      if (!reading) {
        throw new ApolloError("Reading not found", "NOT_FOUND");
      }

      return reading as unknown as IReading;
    },

    async getAllReadings(
      _: unknown,
      args: {},
      ctx: any
    ): Promise<IReading | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const readings = (await Reading.find({
        userId,
      })) as unknown as IReading;

      return readings;
    },
  },
};

export default resolvers;
