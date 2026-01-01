import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  // File select handler - FIXED VERSION
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImageUploadError("");

    console.log("📁 Selected files:", selectedFiles.length);

    if (selectedFiles.length === 0) {
      console.log("❌ No files selected");
      return;
    }

    // Maximum 10 files check
    if (selectedFiles.length > 10) {
      setImageUploadError(
        `You selected ${selectedFiles.length} files. Maximum 10 files allowed.`
      );
      const limitedFiles = selectedFiles.slice(0, 10);
      setFiles(limitedFiles);
      generateImagePreviews(limitedFiles);
      return;
    }

    // File size check (5MB max)
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 20 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      const oversizedNames = oversizedFiles.map((f) => f.name).join(", ");
      setImageUploadError(`These files exceed 5MB limit: ${oversizedNames}`);

      const validFiles = selectedFiles.filter(
        (file) => file.size <= 5 * 1024 * 1024
      );

      if (validFiles.length > 0) {
        setFiles(validFiles);
        generateImagePreviews(validFiles);
      } else {
        setFiles([]);
        setImageUrls([]);
      }
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

  // Generate image previews - FIXED VERSION
  const generateImagePreviews = (files) => {
    // Pehle existing URLs ko clean karo
    imageUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.log("Error revoking URL:", error);
      }
    });

    const newUrls = [];

    files.forEach((file, index) => {
      try {
        // File type validation
        if (!file.type.startsWith("image/")) {
          console.warn(`Skipping non-image file: ${file.name}`);
          return;
        }

        const url = URL.createObjectURL(file);
        console.log(`🖼️ Created preview URL for: ${file.name}`);
        newUrls.push(url);
      } catch (error) {
        console.error(`❌ Error creating URL for ${file.name}:`, error);
      }
    });

    setImageUrls(newUrls);
    console.log(`🖼️ Total preview URLs generated: ${newUrls.length}`);
  };

  // Image remove handler - FIXED
  const handleRemoveImage = (index) => {
    console.log(`🗑️ Removing image at index: ${index}`);

    // URL revoke karo
    if (imageUrls[index]) {
      try {
        URL.revokeObjectURL(imageUrls[index]);
      } catch (error) {
        console.log("Error revoking URL:", error);
      }
    }

    const newFiles = files.filter((_, i) => i !== index);
    const newUrls = imageUrls.filter((_, i) => i !== index);

    setFiles(newFiles);
    setImageUrls(newUrls);

    setImageUploadError(
      `✅ Image removed! ${newFiles.length} files remaining.`
    );
    setTimeout(() => setImageUploadError(""), 2000);
  };

  // Form change handler
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Drag and drop functionality - NEW
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

    // Create a fake event object for handleFileChange
    const fakeEvent = {
      target: {
        files: e.dataTransfer.files,
      },
    };

    handleFileChange(fakeEvent);
  };

  // FORM SUBMIT - MULTER COMPATIBLE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setImageUploadError("Please login to create a listing");
      return;
    }

    if (files.length < 1) {
      setImageUploadError("Please upload at least one image");
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

      // Images add karo
      files.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Form fields add karo
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch("/api/listing/create", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("✅ Listing created successfully!", data);
      alert("Listing created successfully!");
      navigate(`/listing/${data.data._id}`);

      // Form reset karo
      setFormData({
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
      setFiles([]);
      setImageUrls([]);
    } catch (error) {
      console.error("❌ Submit error:", error);
      setImageUploadError(error.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Agar user logged in nahi hai
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">Please login to create a listing</p>
          <button
            onClick={() => (window.location.href = "/sign-in")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Create New Listing
            </h1>
            <p className="text-gray-600">
              List your property and reach potential buyers/renters
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

              {/* IMAGE UPLOAD SECTION - FIXED */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Property Images
                </h2>

                <div className="space-y-4">
                  {/* Drag & Drop Area */}
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
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer block"
                    >
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
                          Upload Images
                        </span>
                        <p className="text-gray-500 text-sm mt-1">
                          Click to browse or drag and drop
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          PNG, JPG, WEBP up to 5MB (Max 10 images)
                        </p>
                        <p className="text-green-600 text-xs mt-2 font-medium">
                          ✓ Multiple selection enabled - Press Ctrl/Cmd to
                          select multiple files
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Image Preview Section - IMPROVED */}
                  {imageUrls.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Preview ({imageUrls.length}/10 images)
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            {/* Image with proper error handling */}
                            <div className="aspect-square bg-gray-100 relative">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                                onLoad={() =>
                                  console.log(`✅ Image ${index + 1} loaded`)
                                }
                                onError={(e) => {
                                  console.error(
                                    `❌ Error loading image ${index + 1}`
                                  );
                                  e.target.style.display = "none";
                                  // Show error placeholder
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />

                              {/* Fallback agar image load na ho */}
                              <div
                                className="absolute inset-0 hidden items-center justify-center bg-red-50 flex-col p-2"
                                style={{ display: "none" }}
                              >
                                <svg
                                  className="w-8 h-8 text-red-400 mb-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                  />
                                </svg>
                                <span className="text-xs text-red-600 text-center">
                                  Failed to load
                                </span>
                              </div>
                            </div>

                            {/* Image info overlay */}
                            <div className="p-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                  {index + 1}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {(files[index]?.size / (1024 * 1024)).toFixed(
                                    2
                                  )}
                                  MB
                                </span>
                              </div>
                              <p
                                className="text-xs text-gray-600 truncate"
                                title={files[index]?.name}
                              >
                                {files[index]?.name || `Image ${index + 1}`}
                              </p>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg transform group-hover:scale-110"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Selected files summary */}
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-green-800">
                              {files.length} file(s) selected
                            </span>
                            <p className="text-xs text-green-600 mt-1">
                              Total size:{" "}
                              {(
                                files.reduce(
                                  (acc, file) => acc + file.size,
                                  0
                                ) /
                                (1024 * 1024)
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFiles([]);
                              setImageUrls([]);
                              setImageUploadError("All images cleared");
                              setTimeout(() => setImageUploadError(""), 2000);
                            }}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-200"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

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
                disabled={isSubmitting || files.length === 0}
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
                    Creating Listing...
                  </>
                ) : (
                  `Create Listing ${
                    files.length > 0 ? `(${files.length} images)` : ""
                  }`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
