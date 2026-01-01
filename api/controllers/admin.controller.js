import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

export const getPendingListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

export const approveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    listing.status = "approved";
    await listing.save();
    res
      .status(200)
      .json({ success: true, message: "Listing approved", data: listing });
  } catch (err) {
    next(err);
  }
};

export const rejectListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    listing.status = "rejected";
    await listing.save();
    res
      .status(200)
      .json({ success: true, message: "Listing rejected", data: listing });
  } catch (err) {
    next(err);
  }
};

export const getAllListingsAdmin = async (req, res, next) => {
  try {
    const listings = await Listing.find()
      .populate("userRef", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    console.log("ADMIN HIT USERS API:", req.user.email);

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};



export const blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot block admin",
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      isBlocked: user.isBlocked,
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
    });
  } catch (error) {
    next(error);
  }
};


export const adminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const pendingListings = await Listing.countDocuments({ status: "pending" });
    const approvedListings = await Listing.countDocuments({
      status: "approved",
    });

    res
      .status(200)
      .json({ totalUsers, totalListings, pendingListings, approvedListings });
  } catch (err) {
    next(err);
  }
};
