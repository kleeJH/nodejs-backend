
import { Router } from "express";
import authController from "../../modules/auth/controllers/authController.js";
import authValidations from "../../validations/authValidations.js";
import { validateReqBody, validateJwtAccessToken, validateJwtRefreshToken, validateModulePermission } from "../../middlewares/authMiddleware.js";
import { MODULE_TYPE } from "../../common/enums/authEnumTypes.js";

const authRouter = Router();

authRouter.post("/signup/password", validateReqBody(authValidations.signUp), authController.signUpPassword);
authRouter.post("/login/password", validateReqBody(authValidations.logIn), authController.logInPassword);
authRouter.get("/refresh", validateJwtRefreshToken(), authController.refreshToken);
authRouter.post("/logout", validateJwtRefreshToken(), authController.logOut);

authRouter.get("/test", [validateJwtAccessToken(), validateModulePermission(MODULE_TYPE.USER_AUTH_MODULE)], authController.test);


export default authRouter;
