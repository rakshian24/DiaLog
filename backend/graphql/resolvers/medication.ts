import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import { Types } from "mongoose";
import Medication, {
  IMedication,
  MedicationDosageType,
  MedicationType,
} from "../../models/Medication";
import { ReadingTiming } from "../../types";

interface MedicationInput {
  name: string;
  type: MedicationType;
  dosage?: string;
  dosageType: MedicationDosageType;
  timeTaken?: string;
  readingTime: ReadingTiming[];
  dosagePerReadingTime?: Record<ReadingTiming, string>;
}

const resolvers = {
  Mutation: {
    async addMedication(
      _: unknown,
      {
        input: {
          name,
          type,
          dosage,
          dosageType,
          timeTaken,
          readingTime,
          dosagePerReadingTime,
        },
      }: { input: MedicationInput },
      ctx: any
    ): Promise<IMedication> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const authenticatedUserId = loggedInUserId?.userId;

      if (!authenticatedUserId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }
      const medicationExists = await Medication.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        userId: authenticatedUserId,
      });

      if (medicationExists) {
        throw new ApolloError(
          `You already have added ${name} as your medication.`,
          "MEDICATION_ALREADY_EXISTS"
        );
      }

      const newMedication = new Medication({
        name: name.trim(),
        userId: authenticatedUserId,
        type,
        dosageType,
        timeTaken,
        readingTime,
        ...(type === MedicationType.insulin
          ? { dosagePerReadingTime }
          : { dosage }),
      });

      const response = await newMedication.save();

      return response as unknown as IMedication;
    },
  },
  Query: {
    async getMedicationById(
      _: unknown,
      args: { id: Types.ObjectId },
      ctx: any
    ): Promise<IMedication | null> {
      if (!Types.ObjectId.isValid(args.id)) {
        throw new ApolloError("Invalid Medication ID", "INVALID_ID");
      }

      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const medication = await Medication.findOne({
        _id: args.id,
        userId,
      });

      if (!medication) {
        throw new ApolloError("Medication not found", "NOT_FOUND");
      }

      return medication as unknown as IMedication;
    },

    async getAllMedications(
      _: unknown,
      args: {},
      ctx: any
    ): Promise<IMedication[]> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const medications = await Medication.find({ userId }).sort({
        createdAt: -1,
      });

      return medications as unknown as IMedication[];
    },
  },
};

export default resolvers;
