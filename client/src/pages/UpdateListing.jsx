import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: "",
    discountPrice: "",
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
  });

  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  // FIXED: Add dependency array to prevent infinite loop
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          alert("Failed to fetch listing data");
          navigate("/");
          return;
        }

        // Set form data
        setFormData({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          regularPrice: data.regularPrice || "",
          discountPrice: data.discountPrice || "",
          bathrooms: data.bathrooms || 1,
          bedrooms: data.bedrooms || 1,
          furnished: data.furnished || false,
          parking: data.parking || false,
          type: data.type || "rent",
          offer: data.offer || false,
        });

        // Set existing images
        setExistingImages(data.imageUrls || []);
        setImageUrls(data.imageUrls || []);
      } catch (error) {
        console.error("Error fetching listing:", error);
        alert("Failed to fetch listing data");
        navigate("/");
      }
    };
    fetchListing();
  }, [params.listingId, navigate]); // FIXED: Added dependencies

  // File select handler
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImageUploadError("");

    if (selectedFiles.length === 0) {
      return;
    }

    // Maximum 10 files check (including existing)
    if (
      selectedFiles.length + existingImages.length - imagesToDelete.length >
      10
    ) {
      setImageUploadError(
        `Maximum 10 images allowed. You have ${
          existingImages.length - imagesToDelete.length
        } existing and trying to add ${selectedFiles.length} new.`
      );
      return;
    }

    // File size check (5MB max)
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 20 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      const oversizedNames = oversizedFiles.map((f) => f.name).join(", ");
      setImageUploadError(`These files exceed 5MB limit: ${oversizedNames}`);
      return;
    }

    // All files are valid
    setFiles(selectedFiles);
    generateImagePreviews(selectedFiles);

    // Success message
    setTimeout(() => {
      setImageUploadError(
        `✅ ${selectedFiles.length} files selected successfully!`
      );
      setTimeout(() => setImageUploadError(""), 3000);
    }, 100);
  };

  // Generate image previews
  const generateImagePreviews = (files) => {
    const newUrls = files
      .map((file) => {
        if (!file.type.startsWith("image/")) {
          console.warn(`Skipping non-image file: ${file.name}`);
          return null;
        }
        return URL.createObjectURL(file);
      })
      .filter((url) => url !== null);

    setImageUrls([
      ...existingImages.filter((img) => !imagesToDelete.includes(img)),
      ...newUrls,
    ]);
  };

  // Remove existing image
  const handleRemoveExistingImage = (imageUrl) => {
    if (imagesToDelete.includes(imageUrl)) {
      // Restore image
      setImagesToDelete(imagesToDelete.filter((img) => img !== imageUrl));
    } else {
      // Mark for deletion
      setImagesToDelete([...imagesToDelete, imageUrl]);
    }

    // Update preview
    setImageUrls([
      ...existingImages.filter(
        (img) => img !== imageUrl && !imagesToDelete.includes(img)
      ),
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

  };

  // Remove new image
 const handleRemoveNewImage = (index) => {
   const updatedFiles = files.filter((_, i) => i !== index);
   setFiles(updatedFiles);

   const updatedNewUrls = imageUrls.filter((url) => !url.startsWith("blob:"));
   const newPreviewUrls = updatedFiles.map((file) => URL.createObjectURL(file));

   setImageUrls([...existingImages, ...updatedNewUrls, ...newPreviewUrls]);
 };


  // Form change handler
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");

    const droppedFiles = Array.from(e.dataTransfer.files);
    const fakeEvent = {
      target: {
        files: e.dataTransfer.files,
      },
    };
    handleFileChange(fakeEvent);
  };

  // FIXED: Update Listing Submit Handler
  // FIXED: Update Listing Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setImageUploadError("Please login to update a listing");
      return;
    }

    if (imageUrls.length < 1) {
      setImageUploadError("Please keep at least one image");
      return;
    }

    if (+formData.regularPrice < +formData.discountPrice) {
      setImageUploadError("Discount price must be less than regular price");
      return;
    }

    setIsSubmitting(true);
    setImageUploadError("");

    try {
      const formDataToSend = new FormData();

      // FIXED: Add new images properly
      files.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // FIXED: Add images to delete as separate fields
      imagesToDelete.forEach((imgUrl) => {
        formDataToSend.append("deleteImages", imgUrl);
      });

      // FIXED: Add other form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "imageUrls") {
          // Convert numbers properly
          if (
            key === "regularPrice" ||
            key === "discountPrice" ||
            key === "bathrooms" ||
            key === "bedrooms"
          ) {
            formDataToSend.append(key, formData[key].toString());
          } else if (
            key === "furnished" ||
            key === "parking" ||
            key === "offer"
          ) {
            formDataToSend.append(key, formData[key].toString());
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Debug: Check what's being sent
      console.log("📤 Sending FormData:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PUT",
        body: formDataToSend,
        // FIXED: Don't set Content-Type header for FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("✅ Listing updated successfully!", data);
      alert("Listing updated successfully!");
      navigate(`/listing/${data.data._id}`);
    } catch (error) {
      console.error("❌ Update error:", error);
      setImageUploadError(error.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">Please login to update a listing</p>
          <button
            onClick={() => navigate("/sign-in")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center py-8 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Update Listing
          </h1>
          <p className="text-gray-600">
            Update your property listing information
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* LEFT SECTION - Form Fields */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Property Details
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. Luxury Villa by the Lake"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    required
                    value={formData.description}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe the property features, amenities, and location advantages..."
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    required
                    value={formData.address}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Full property address"
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      value={formData.bedrooms}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      onChange={handleChange}
                      min={1}
                      max={20}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      value={formData.bathrooms}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      onChange={handleChange}
                      min={1}
                      max={20}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Pricing & Features
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Listing Type
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    onChange={handleChange}
                  >
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Regular Price (₹)
                    </label>
                    <input
                      type="number"
                      id="regularPrice"
                      required
                      value={formData.regularPrice}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      id="discountPrice"
                      value={formData.discountPrice}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200">
                    <div>
                      <span className="font-semibold text-gray-800">
                        Furnished
                      </span>
                      <p className="text-sm text-gray-600">
                        Property comes with furniture
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="furnished"
                        checked={formData.furnished}
                        className="sr-only peer"
                        onChange={handleChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200">
                    <div>
                      <span className="font-semibold text-gray-800">
                        Parking Available
                      </span>
                      <p className="text-sm text-gray-600">
                        Dedicated parking space
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="parking"
                        checked={formData.parking}
                        className="sr-only peer"
                        onChange={handleChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200">
                    <div>
                      <span className="font-semibold text-gray-800">
                        Special Offer
                      </span>
                      <p className="text-sm text-gray-600">
                        Discount available
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="offer"
                        checked={formData.offer}
                        className="sr-only peer"
                        onChange={handleChange}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* IMAGE UPLOAD SECTION - UPDATED */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Property Images
              </h2>

              <div className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      Existing Images (
                      {existingImages.length - imagesToDelete.length} remaining)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {existingImages.map((imgUrl, index) => (
                        <div
                          key={index}
                          className={`relative group rounded-lg border-2 overflow-hidden ${
                            imagesToDelete.includes(imgUrl)
                              ? "border-red-500 opacity-60"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(imgUrl)}
                            className={`absolute top-1 right-1 rounded-full w-6 h-6 flex items-center justify-center text-white ${
                              imagesToDelete.includes(imgUrl)
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                            title={
                              imagesToDelete.includes(imgUrl)
                                ? "Restore image"
                                : "Delete image"
                            }
                          >
                            {imagesToDelete.includes(imgUrl) ? "↶" : "×"}
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                            {imagesToDelete.includes(imgUrl)
                              ? "Will be deleted"
                              : "Existing"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drag & Drop Area for New Images */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-all duration-200 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-lg font-semibold text-gray-700">
                        Add More Images
                      </span>
                      <p className="text-gray-500 text-sm mt-1">
                        Click to browse or drag and drop
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        PNG, JPG, WEBP up to 5MB (Max 10 images total)
                      </p>
                    </div>
                  </label>
                </div>

                {/* New Image Previews */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      New Images to Upload ({files.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg border border-gray-200 overflow-hidden"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                            title="Remove image"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                            New
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Summary */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-blue-800">
                        Image Summary
                      </span>
                      <p className="text-xs text-blue-600 mt-1">
                        Total: {imageUrls.length}/10 images • Existing:{" "}
                        {existingImages.length - imagesToDelete.length} • New:{" "}
                        {files.length} • To Delete: {imagesToDelete.length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {imageUploadError && (
                  <div
                    className={`p-3 rounded-lg text-sm border ${
                      imageUploadError.includes("✅") ||
                      imageUploadError.includes("successfully")
                        ? "bg-green-100 border-green-400 text-green-700"
                        : "bg-red-100 border-red-400 text-red-700"
                    }`}
                  >
                    {imageUploadError}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="col-span-1 lg:col-span-2 mt-6">
            <button
              type="submit"
              disabled={isSubmitting || imageUrls.length === 0}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating Listing...
                </>
              ) : (
                `Update Listing (${imageUrls.length} images)`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
