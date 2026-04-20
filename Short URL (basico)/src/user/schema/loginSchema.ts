import { Schema } from "express-validator";

const LoginSchema: Schema = {
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
  password: {
    in: "body",
    isLength: {
      options: { min: 8 },
    },
    errorMessage: "Password must be at least 8 characters",
  },
};

export default LoginSchema;
