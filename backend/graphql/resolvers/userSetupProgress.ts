import { ApolloError } from "apollo-server-errors";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import UserSetupProgress from "../../models/UserSetupProgress";
import { SetupSteps } from "../../types";

interface UpdateUserSetupProgressInput {
  step: SetupSteps;
  isProgressComplete: boolean;
}

const resolvers = {
  Query: {
    async getUserSetupProgress(_: unknown, __: {}, ctx: any) {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;
      if (!userId)
        throw new ApolloError("Not authenticated", "UNAUTHENTICATED");

      const progress = await UserSetupProgress.findOne({ userId });
      return progress;
    },
  },

  Mutation: {
    async updateUserSetupProgress(
      _: unknown,
      {
        input: { step, isProgressComplete },
      }: { input: UpdateUserSetupProgressInput },
      ctx: any
    ) {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;
      if (!userId)
        throw new ApolloError("Not authenticated", "UNAUTHENTICATED");

      let progressDoc = await UserSetupProgress.findOne({ userId });

      if (!progressDoc) {
        progressDoc = new UserSetupProgress({
          userId,
          progress: {
            [step]: isProgressComplete,
          },
        });
      } else {
        progressDoc.progress.set(step, isProgressComplete);
      }

      // Check if all steps are completed
      const allSteps = Object.values(SetupSteps);
      const completed = allSteps.every(
        (s) => progressDoc.progress.get(s) === true
      );
      if (completed) {
        progressDoc.completedAt = new Date();
      }

      await progressDoc.save();

      return progressDoc;
    },
  },
};

export default resolvers;
