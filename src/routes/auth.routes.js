import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  resendVerificationEmail,
  refreshAccessToken,
  forgotPasswordrequest,
  resetPassword,
  getProfile,
} from "../controllers/auth.controllers.js";

import { validate } from "../middlewares/validator.middleware.js";
import isLoggedin from "../middlewares/auth.middleware.js";

import {
  userRegistrationValidator,
  userLoginValidator,
  ResetPasswordValidator,
  forgotPasswordValidator,
  emailvalidator,
} from "../validators/index.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(
    userRegistrationValidator(),
    validate,
    upload.single("avatar"),
    registerUser,
  );
router.route("/verify/:token").get(verifyEmail);
router.route("/login").post(userLoginValidator(), validate, loginUser);
router.route("/logout").get(isLoggedin, logoutUser);
router.route("/profile").get(isLoggedin, getProfile);
router
  .route("/resendVerificationEmail")
  .post(emailvalidator(), validate, resendVerificationEmail);
router
  .route("/forgotPassword")
  .post(forgotPasswordValidator(), validate, forgotPasswordrequest);
router
  .route("/reset-password/:token")
  .post(ResetPasswordValidator(), validate, resetPassword);
router.route("/RefreshTokens").get(refreshAccessToken);

// ye bracket wale system ko factory pattern kahte hai

export default router;
