import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import { deleteFile } from "../utils/fileDelete.js";

export const createListing = async (req, res, next) => {
  try {
    console.log("Request body:", req.body);
    console.log("Files processed:", req.body.images);

    // Multiple images → stored in req.body.images
    const imageUrls = req.body.images || [];

    const listing = await Listing.create({
      ...req.body,
      imageUrls,
      userRef: req.user.id, // Always trust token, not client body
    });

    return res.status(201).json({
      success: true,
      data: listing,
      message: "Listing created successfully",
    });
  } catch (error) {
    console.error("Create listing error:", error);
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));
    if (listing.userRef !== req.user.id)
      return next(errorHandler(401, "You can only delete your own listings!"));
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Listing has been deleted!",
    });
  } catch (error) {
    next(error);
  }
};




export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));

    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(401, "Only the owner can update this listing."));
    }

    let updatedImages = [...listing.imageUrls];

    //  DELETE SELECTED IMAGES
    if (req.body.deleteImages && Array.isArray(req.body.deleteImages)) {
      req.body.deleteImages.forEach((img) => {
        updatedImages = updatedImages.filter((i) => i !== img);
        deleteFile(img); // remove from disk
      });
    }

    //  ADD NEW IMAGES (from multer/sharp)
    if (req.body.images) {
      updatedImages = [...updatedImages, ...req.body.images];
    }

    //  FULL REPLACE MODE (overwrite all images)
    if (req.body.replaceImages === "true" || req.body.replaceImages === true) {
      // delete old files
      listing.imageUrls.forEach((old) => deleteFile(old));

      // replace with new
      updatedImages = req.body.images || [];
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          imageUrls: updatedImages,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedListing,
      message: "Listing updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};
