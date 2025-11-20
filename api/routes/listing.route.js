import express from 'express';
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from '../utils/verifyUser.js';
import {uploadAndCompress, uploadImages  } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post("/create", verifyToken , uploadImages, uploadAndCompress  , createListing);
router.delete("/delete/:id", verifyToken , deleteListing);
router.put("/update/:id", verifyToken ,uploadImages, uploadAndCompress , updateListing);
router.get("/get/:id" , getListing);

export default router;

  