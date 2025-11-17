import Listing from "../models/listing.model.js";

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
