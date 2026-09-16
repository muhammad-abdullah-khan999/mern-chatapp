import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { errorHandler } from "../utils/errorHandler.utils.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  //Fetching JWT token from cookies
  const token =
    req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");
  if (!token) {
    return next(new errorHandler("Invalid Token", 400));
  }

  //Verifying JWT and sending it to next()
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = tokenData;
  console.log("req.user: ", req.user)
  next();
});
