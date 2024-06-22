import { Router } from "express";
import authController from "../modules/auth/controllers/authController.js";

const authRouter = Router();

authRouter.post("/test", authController.test);

export default authRouter;
