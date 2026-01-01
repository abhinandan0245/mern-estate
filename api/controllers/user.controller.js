import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";



export const updateUser = async (req, res, next) => {
  console.log("🔹 Update user triggered");
  console.log("req.user:", req.user);
  console.log("req.params.id:", req.params.id);
  console.log("req.body:", req.body);

  if (req.user.id !== req.params.id && req.user.role !== "admin") {
    return next(errorHandler(401, "You can only update your own account!"));
  }


  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    console.log("🔹 Updated user:", updatedUser);

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error("❌ Update error:", error);
    next(error);
  }
};


export const deleteUser = async (req , res , next) => {
 if (req.user.id !== req.params.id && req.user.role !== "admin") {
   return next(
     errorHandler(401, "Only owner or admin can delete this account!")
   );
 }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    console.log("User:", req.user); // Check incoming info

    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return next(errorHandler(401, "Not allowed to view these listings!"));
    }

    const listings = await Listing.find({ userRef: req.params.id });

    return res.status(200).json(listings);
  } catch (error) {
    console.log(error);
    next(error);
  }
};


export const getUser = async (req, res, next) => {
    try { 
      const user = await User.findById(req.params.id)
      if(!user) return next(errorHandler(404, "User not found!"));
       
      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
    }
    catch (error) {
      next(error);
    }
  };


  export const getUserStats = async (req, res, next) => {
    try {
      const userId = req.params.id;
      if (req.user.id !== userId && req.user.role !== "admin")
        return next(errorHandler(403, "Forbidden"));

      const myListings = await Listing.countDocuments({ userRef: userId });
      // favorites, messages — if you have collections for those, count them
      // For now mock or return listing count + maybe approved count:
      const approved = await Listing.countDocuments({
        userRef: userId,
        status: "approved",
      });
      res.status(200).json({ myListings, approved });
    } catch (err) {
      next(err);
    }
  };



