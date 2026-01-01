import express from 'express'
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUser,
  getUserStats,
} from "../controllers/user.controller.js";
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test' , test);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);

router.get("/:id/stats", verifyToken, getUserStats);


export default router;