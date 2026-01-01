import { errorHandler } from "./error.js";

export const verifyAdmin = (req, res, next) => {
  // assumes verifyToken ran before and set req.user
  if (!req.user) return next(errorHandler(401, "Unauthorized"));
  if (req.user.role !== "admin")
    return next(errorHandler(403, "Access denied"));
  next();
};
