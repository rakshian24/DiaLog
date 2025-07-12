import { ApolloError } from "apollo-server-errors";
import User, { GenderType, IUser } from "../../models/User";
import getLoggedInUserId from "../../middleware/getLoggedInUserId";
import { generateToken } from "../../utils";
import { Types } from "mongoose";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthYear: string;
  gender: GenderType;
}

interface LoginInput {
  email: string;
  password: string;
}
interface UpdateInitialSetupDoneForUserInput {
  userId: Types.ObjectId;
  initialSetupDone: boolean;
}

const resolvers = {
  Mutation: {
    async registerUser(
      _: unknown,
      {
        input: {
          username,
          email,
          password,
          confirmPassword,
          birthYear,
          gender,
        },
      }: { input: RegisterInput },
      ctx: any
    ): Promise<{ user: IUser; token: string }> {
      const userExists = await User.findOne({ email });

      if (userExists) {
        throw new ApolloError(
          `A user is already registered with the email ${email}`,
          "USER_ALREADY_EXISTS"
        );
      }

      const newUser = new User({
        username,
        email,
        password,
        confirmPassword,
        birthYear,
        gender,
        postMealPreferences: [],
      });

      const token = await generateToken(newUser);
      const res = (await newUser.save()) as unknown as IUser;
      const response = { user: res, token };

      return response;
    },

    async loginUser(
      _: unknown,
      { input: { email, password } }: { input: LoginInput },
      ctx: any
    ): Promise<{ user: IUser; token: string }> {
      const user = (await User.findOne({ email }).populate(
        "postMealPreferences"
      )) as IUser;

      if (user && (await user.matchPassword(password))) {
        const token = await generateToken(user);
        const response = { user, token };

        return response;
      } else {
        throw new ApolloError(
          `Invalid email or password`,
          "INVALID_EMAIL_OR_PASSWORD"
        );
      }
    },

    async updateInitialSetupDoneForUser(
      _: unknown,
      {
        input: { initialSetupDone },
      }: { input: UpdateInitialSetupDoneForUserInput },
      ctx: any
    ): Promise<IUser> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { initialSetupDone },
        { new: true }
      ).populate("postMealPreferences");

      if (!updatedUser) {
        throw new ApolloError("User not found", "USER_NOT_FOUND");
      }

      return updatedUser as unknown as IUser;
    },
  },
  Query: {
    async me(_: unknown, args: {}, ctx: any): Promise<IUser | null> {
      const loggedInUserId = getLoggedInUserId(ctx);
      const userId = loggedInUserId?.userId;

      if (!userId) {
        throw new ApolloError("User not authenticated", "NOT_AUTHENTICATED");
      }

      const user = (await User.findById(userId).populate(
        "postMealPreferences"
      )) as IUser;

      return user;
    },
  },
};

export default resolvers;
