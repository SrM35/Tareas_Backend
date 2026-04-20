import { User as UserEntity } from "../../db/emtity/User";

export type User = UserEntity;

export type safeUser = Omit<User, "password" | "verificationCode">;

export type createUserDTO = Pick<User, "name" | "email" | "password">;
