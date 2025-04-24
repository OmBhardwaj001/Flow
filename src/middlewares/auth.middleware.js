import { ApiError } from "../utils/api-error.js";
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.models.js";

dotenv.config();

const isLoggedin = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      throw new ApiError(400, "token not found or user is not logged in");
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(400, "user not found");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(400, "token invalid", err);
  }
};

export default isLoggedin;
