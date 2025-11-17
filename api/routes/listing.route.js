import express from 'express';
import { createListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import {uploadAndCompress, uploadImages } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post("/create", verifyToken , uploadImages, uploadAndCompress  , createListing);

export default router;

  