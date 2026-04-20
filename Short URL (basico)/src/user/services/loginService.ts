import { ServiceWithProps } from "../../utils/types";
import UserDAL from "../DAL/UserDAL";
import { safeUser } from "../types/User";
import bcrypt from "bcrypt";

const loginService: ServiceWithProps<safeUser, { email: string; password: string }> = async (
  payload,
) => {
  try {
    const user = await UserDAL.findOne({ where: { email: payload.email } });

    if (!user) {
      return {
        message: "Invalid email or password",
        status: 401,
      };
    }

    if (!user.isVerified) {
      return {
        message: "User is not verified",
        status: 403,
      };
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordValid) {
      return {
        message: "Invalid email or password",
        status: 401,
      };
    }

    const { password: _, verificationCode: __, ...safeUser } = user;

    return {
      message: "Login successful",
      status: 200,
      data: safeUser,
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      message: "Error during login",
      status: 500,
    };
  }
};

export default loginService;
