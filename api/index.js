import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
// import cors from "cors"; // optional if you add it later

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ Optional: CORS for React
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// ✅ Connect MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log(err));

// ✅ Mount routes BEFORE listen
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// ✅ Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start server LAST
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
