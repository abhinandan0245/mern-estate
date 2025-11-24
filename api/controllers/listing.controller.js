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

    // Authorization — only owner can update
    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(401, "Not allowed to update this listing."));
    }

    // -----------------------------
    // 1️⃣ START WITH EXISTING IMAGES
    // -----------------------------
    let finalImages = [...listing.imageUrls];

    // -----------------------------
    // 2️⃣ HANDLE DELETE IMAGES
    // -----------------------------
    let deleteImages = [];

    if (req.body.deleteImages) {
      if (typeof req.body.deleteImages === "string") {
        deleteImages = [req.body.deleteImages];
      } else if (Array.isArray(req.body.deleteImages)) {
        deleteImages = req.body.deleteImages;
      }
    }

    // Remove from array + delete from disk
    deleteImages.forEach((img) => {
      finalImages = finalImages.filter((i) => i !== img);
      deleteFile(img);
    });

    // -----------------------------
    // 3️⃣ HANDLE NEW UPLOADED IMAGES
    // -----------------------------
    // Your compress middleware puts final compressed image URLs in req.body.images
    if (req.body.images) {
      const newImages = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];

      finalImages.push(...newImages);
    }

    // -----------------------------
    // 4️⃣ UPDATE THE LISTING
    // -----------------------------
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          imageUrls: finalImages,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedListing,
      message: "Listing updated successfully",
    });
  } catch (error) {
    console.error("❌ Update listing error:", error);
    next(error);
  }
};





export const getListing = async (req, res, next) => {
  try {
    

    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));
    res.status(200).json(listing);
  }
    catch (error) {
    next(error);
    }
};


export const getListings = async (req, res, next) => {
  try {

    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order === "desc";


    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer: offer, 
      furnished: furnished,
      parking: parking,
      type: type, 
    })
      .sort({ [sort]: order ? -1 : 1 })
      .skip(startIndex)
      .limit(limit);
    res.status(200).json(listings);

  } catch (error) {
    next(error);
  } 

};
