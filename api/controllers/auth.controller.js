import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  try {
    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Allow only buyer or user from public signup
    const allowedRoles = ["buyer", "user"];
    const finalRole = allowedRoles.includes(role) ? role : "buyer";

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: finalRole,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const signin = async(req , res , next) => {
   const {email , password} = req.body;

   try {
     const validUser = await User.findOne({ email });
     if (!validUser) return next(errorHandler(404, "User not found"));

     // 🔒 BLOCK CHECK AT LOGIN
     if (validUser.isBlocked) {
       return next(
         errorHandler(403, "Your account is blocked. Contact support.")
       );
     }
     
     const validPassword = bcryptjs.compareSync(password, validUser.password);
     if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
     const token = jwt.sign(
       { id: validUser._id, role: validUser.role },
       process.env.JWT_SECRET,
       { expiresIn: "7d" }
     );

     // ✅ Exclude password before sending response
     const { password: pass, ...rest } = validUser._doc;

     // ✅ Send response with cookie
     // after token creation
     const cookieOptions = {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production", // false in dev
       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
     };
     res.cookie("access_token", token, cookieOptions).status(200).json(rest);
   } catch (error) {
      next(error)
   }
}



export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // ✅ If user already exists — sign and return token
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }

    // ✅ If new user — create account
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    // ✅ Username cleanup (remove spaces, lowercase, add random tail)
    const cleanUsername =
      req.body.name
        .split(" ")
        .join("")
        .toLowerCase() + Math.random().toString(36).slice(-4);

    const newUser = new User({
      username: cleanUsername,
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
      role: "buyer",
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).json({ success: true, message: "Logged Out" });
  } catch (error) {
    next(error);
  }
};


