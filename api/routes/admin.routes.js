import express from "express";
import {
  getPendingListings,
  approveListing,
  rejectListing,
  getAllListingsAdmin,
  getAllUsers,
  blockUser,
  adminStats,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin); // all below require admin

router.get("/stats", adminStats);
router.get("/listings/pending", getPendingListings);
router.put("/listings/:id/approve", approveListing);
router.put("/listings/:id/reject", rejectListing);
router.get("/listings", getAllListingsAdmin);
router.get("/users", getAllUsers);
router.patch("/users/:id/block", blockUser);

export default router;
