import express from 'express';
import {
  createListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from '../utils/verifyUser.js';
import {uploadAndCompress, uploadImages  } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post("/create", verifyToken , uploadImages, uploadAndCompress  , createListing);
router.delete("/delete/:id", verifyToken , deleteListing);

export default router;

  