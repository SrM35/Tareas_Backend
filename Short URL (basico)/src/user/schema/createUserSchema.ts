import { Schema } from "express-validator";

const CreateUserSchema: Schema = {
  name: {
    in: "body",
    isString: true,
    optional: false,
    errorMessage: "Name es mandatorio y debe ser una cadena de texto",
  },
  email: {
    in: "body",
    isEmail: true,
    optional: false,
    normalizeEmail: {
      options: {
        gmail_remove_dots: false,
      },
    },
    errorMessage: "Email es mandatorio y debe ser un email válido",
  },
  password: {
    in: "body",
    isLength: {
      options: { min: 8 },
    },
    optional: false,
    errorMessage: "Password es mandatorio y debe tener al menos 8 caracteres",
  },
};

export default CreateUserSchema;
