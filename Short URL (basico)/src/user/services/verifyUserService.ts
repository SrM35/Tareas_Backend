import { ServiceWithProps } from "../../utils/types";
import UserDAL from "../DAL/UserDAL";
import { safeUser } from "../types/User";

const verifyUserService: ServiceWithProps<safeUser, { email: string; code: string }> = async (
  payload,
) => {
  try {
    const user = await UserDAL.findOne({ where: { email: payload.email } });

    if (!user) {
      return {
        message: "User not found",
        status: 404,
      };
    }

    if (user.isVerified) {
      return {
        message: "User is already verified",
        status: 400,
      };
    }

    if (user.verificationCode !== payload.code) {
      return {
        message: "Invalid verification code",
        status: 400,
      };
    }

    user.isVerified = true;
    user.verificationCode = null;

    const updatedUser = await UserDAL.save(user);

    const { password: _, verificationCode: __, ...safeUser } = updatedUser;

    return {
      message: "User verified successfully",
      status: 200,
      data: safeUser,
    };
  } catch (error) {
    console.error("Error verifying user:", error);
    return {
      message: "Error verifying user",
      status: 500,
    };
  }
};

export default verifyUserService;
