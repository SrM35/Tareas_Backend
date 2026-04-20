import { Schema } from "express-validator";

const VerifyUserSchema: Schema = {
  email: {
    in: "body",
    isEmail: true,
    normalizeEmail: {
      options: {
        gmail_remove_dots: false,
      },
    },
    errorMessage: "Email must be a valid email",
  },
  code: {
    in: "body",
    isLength: {
      options: { min: 1 },
    },
    errorMessage: "Verification code is required",
  },
};

export default VerifyUserSchema;
