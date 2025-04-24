import { asyncHandler } from "../utils/async-handler.js";
import User from "../models/user.models.js";
import sendMail from "../utils/mail.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, fullname } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(402, "user already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    fullname,
  });

  if (!user) {
    throw new ApiError(402, "user not registered");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save();

  await sendMail({
    username: user.username,
    email: user.email,
    url: `${process.env.BASE_URL}/api/v1/auth/verify/${unHashedToken}`,
    subject: "Email verification ",
    mailType: "verify",
  });

  res.status(200).json(new ApiResponse(200, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "incorrect email or password");
  }

  const ismatched = await user.isPasswordCorrect(password);

  if (!ismatched) {
    throw new ApiError(400, "incorrect email or password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // mili sec to sec (24 hours)
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // milisec to sec to min to hour to day (7days)
  });

  res.status(200).json(new ApiResponse(200, "user logged in succcessfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log("hello");

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  res.status(200).json(200, "user logged out successfully");
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "invalid token");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "invalid token");
  }

  user.isEmailVerified = true;
  user.emailVerificationExpiry = undefined;
  user.emailVerificationToken = undefined;

  await user.save();
  res.status(200).json(new ApiResponse(200, "email verified successfully"));
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    return res.status(200).json(200, "email is already verified");
  }

  if (user.emailVerificationExpiry < Date.now()) {
    res.status(200).json(200, "email already sent");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save();

  sendMail({
    username: user.username,
    email: user.email,
    url: `${process.env.BASE_URL}/api/v1/users/verify/${unHashedToken}`,
    subejct: "email verification",
    mailType: "verify",
  });

  res.status(200).json(new ApiResponse(200, "user registered successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "refresh token not available");
  }

  const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  req.user = decode;

  const newaccessToken = jwt.sign(
    { id: decode._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "20s" },
  );

  res.cookie("accessToken", newaccessToken, {});

  res.status(200).json(200, "access token refreshed");
});

const forgotPasswordrequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save();

  await sendMail({
    name: user.username,
    email: user.email,
    url: `${process.env.BASE_URL}/api/v1/auth/reset-password/${unHashedToken}`,
    subject: "password reset",
    mailType: "reset",
  });

  res.status(200).json(new ApiResponse(200, "email sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    throw new ApiError(200, "invaild token");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "invalid token");
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  res.status(200).json(200, "password changed successfully");
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  res.status(200).json(new ApiResponse(200, `${user.username}`, user));
});

export {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  resendVerificationEmail,
  refreshAccessToken,
  forgotPasswordrequest,
  resetPassword,
  getProfile,
};
