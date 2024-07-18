import { Router } from "express";
import authController from "../../modules/auth/controllers/authController.js";
import authValidations from "../../validations/authValidations.js";
import { validateReqBody, validateSessionAndJwt } from "../../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/signup", validateReqBody(authValidations.signUp), authController.signUp);
authRouter.post("/login", validateReqBody(authValidations.logIn), authController.logIn);
authRouter.post("/logout", authController.logOut);

authRouter.get("/test", validateSessionAndJwt(), authController.test);


export default authRouter;
