import { Router } from "express";
import authController from "../modules/auth/controllers/authController.js";
import authValidations from "../validations/authValidations.js";
import { validateReqBody } from "../common/utils/authUtils.js";

const authRouter = Router();

authRouter.post("/signup", validateReqBody(authValidations.signUp), authController.signUp);

export default authRouter;
