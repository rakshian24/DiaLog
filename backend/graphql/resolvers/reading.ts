import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import Reading, { IReading } from "../../models/Reading";
import { IExerciseDetail, ReadingTiming } from "../../types";
import { Types } from "mongoose";
import dayjs from "dayjs";
import { groupReadingsByMeal } from "../../utils";

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

type GroupedReadings = {
  Breakfast: IReading[];
  Lunch: IReading[];
  Dinner: IReading[];
};

interface DashboardReadingsResult {
  readingDate: string;
  readings: GroupedReadings;
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

      const response = (
        await (await newReading.save()).populate("foods")
      ).populate("medications") as unknown as IReading;

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

    async getTodaysOrLatestGroupedReadings(
      _: unknown,
      __: {},
      ctx: any
    ): Promise<DashboardReadingsResult> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const todayStart = dayjs().startOf("day").toDate();
      const todayEnd = dayjs().endOf("day").toDate();

      let readings = await Reading.find({
        userId,
        dateTime: { $gte: todayStart, $lte: todayEnd },
      })
        .populate("foods")
        .populate("medications")
        .lean();

      let readingDate = "";

      if (readings.length > 0) {
        readingDate = dayjs().format("MMMM D, YYYY");
      } else {
        const latestReading = await Reading.findOne({ userId })
          .sort({ dateTime: -1 })
          .lean();

        if (!latestReading) {
          return {
            readingDate: "",
            readings: {
              Breakfast: [],
              Lunch: [],
              Dinner: [],
            },
          };
        }

        const latestStart = dayjs(latestReading.dateTime)
          .startOf("day")
          .toDate();
        const latestEnd = dayjs(latestReading.dateTime).endOf("day").toDate();
        readingDate = dayjs(latestReading.dateTime).format("MMMM D, YYYY");

        readings = await Reading.find({
          userId,
          dateTime: { $gte: latestStart, $lte: latestEnd },
        })
          .populate("foods")
          .populate("medications")
          .lean();
      }

      const cleanedReadings = (readings as unknown as IReading[]).map((r) => ({
        ...r,
        foods: (r.foods || []).filter((f) => f !== null),
        medications: (r.medications || []).filter((m) => m !== null),
      }));

      return {
        readingDate,
        readings: groupReadingsByMeal(cleanedReadings as unknown as IReading[]),
      };
    },
  },
};

export default resolvers;
