import { generatePasswordHash } from "../../utils/password";
import { ServiceWithProps } from "../../utils/types";
import UserDAL from "../DAL/UserDAL";
import { createUserDTO, safeUser, User } from "../types/User";
import { generateShortCode } from "../../utils/shortCodeGenerator";

const createUserService: ServiceWithProps<safeUser, createUserDTO> = async (
  userPayload,
) => {
  try {
    const existingUser = await UserDAL.findOne({ where: { email: userPayload.email } });
    if (existingUser) {
      return {
        message: "Email already exists",
        status: 400,
      };
    }

    const encryptedPassword = await generatePasswordHash(userPayload.password);
    const verificationCode = generateShortCode(10);

    const user = await UserDAL.create({
      email: userPayload.email,
      password: encryptedPassword,
      name: userPayload.name,
      isVerified: false,
      verificationCode,
    });

    const savedUser = await UserDAL.save(user);

    const { password: _, verificationCode: __, ...safeUser } = savedUser;

    return {
      message: "User created successfully. Check your email for verification code.",
      status: 201,
      data: safeUser,
    };
  } catch (error) {
    console.error("Error saving user:", error);
    return {
      message: "Error creating user",
      status: 500,
    };
  }
};

export default createUserService;
