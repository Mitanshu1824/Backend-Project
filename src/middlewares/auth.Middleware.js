import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

// when res is not used then we can use hash(_)
export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.
      replace("Bearer", "")

    if (!token) {
      throw new ApiError(401, "Unautorization request")
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

    if (!user) {
      // discuss about frontend
      throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
});