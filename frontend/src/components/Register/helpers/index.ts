import { GenderType } from "../../../types";

export interface IRegisterFormValueTypes {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthYear: string;
  gender: GenderType | null;
}

export const InitialRegisterFormValues: IRegisterFormValueTypes = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  birthYear: "",
  gender: null,
};
