import { Schema } from "express-validator";

const CreateUrlSchema: Schema = {
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
  originalUrl: {
    in: "body",
    isURL: true,
    errorMessage: "Original URL must be a valid URL",
  },
  customCode: {
    in: "body",
    optional: true,
    isLength: {
      options: { min: 3, max: 20 },
    },
    matches: {
      options: /^[a-zA-Z0-9_-]+$/,
    },
    errorMessage:
      "Custom code must be between 3 and 20 characters and only contain letters, numbers, hyphens, and underscores",
  },
};

export default CreateUrlSchema;
