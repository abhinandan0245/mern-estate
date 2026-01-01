import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FETCH USER FROM DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // ✅ BLOCK CHECK
    if (user.isBlocked) {
      return next(
        errorHandler(403, "Your account is blocked. Contact support.")
      );
    }

    // ✅ ATTACH FULL USER
    req.user = user;
    next();
  } catch (err) {
    return next(errorHandler(403, "Forbidden"));
  }
};
