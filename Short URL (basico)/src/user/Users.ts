import express from "express";
import { Request, Response } from "express";
import { checkSchema } from "express-validator";
import CreateUserSchema from "./schema/createUserSchema";
import LoginSchema from "./schema/loginSchema";
import VerifyUserSchema from "./schema/verifyUserSchema";
import CreateUrlSchema from "./schema/createUrlSchema";
import validateRequest from "../utils/validateRequest";
import createUserService from "./services/createUserService";
import loginService from "./services/loginService";
import verifyUserService from "./services/verifyUserService";

const Users = express.Router();

Users.use(express.json());

// 1. Register User - POST /users/register
Users.post(
  "/register",
  checkSchema(CreateUserSchema),
  validateRequest,
  async (req: Request, res: Response) => {
    const { status, ...rest } = await createUserService(req.body);
    res.status(status).json(rest);
  }
);

// 2. Login - POST /users/login
Users.post(
  "/login",
  checkSchema(LoginSchema),
  validateRequest,
  async (req: Request, res: Response) => {
    const { status, ...rest } = await loginService(req.body);
    res.status(status).json(rest);
  }
);

// 3. Verify User - POST /users/verify
Users.post(
  "/verify",
  checkSchema(VerifyUserSchema),
  validateRequest,
  async (req: Request, res: Response) => {
    const { status, ...rest } = await verifyUserService(req.body);
    res.status(status).json(rest);
  }
);

export default Users;
