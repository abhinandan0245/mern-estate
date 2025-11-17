import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase"; // Firebase config import karo
import { useSelector } from "react-redux"; // Redux se current user lena hai
import React, { useState, useEffect } from "react";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

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
    imageUrls: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  console.log("Current User:", currentUser);
  console.log("formData", formData);

  // User check karo
  useEffect(() => {
    if (!currentUser) {
      setImageUploadError("Please login to create a listing");
    }
  }, [currentUser]);

  // Firebase me images upload karne ka function
  const handleImageSubmit = () => {
    if (!currentUser) {
      setImageUploadError("Please login to upload images");
      return;
    }

    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError("");

      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError("");
          setFiles([]);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          console.error("Error uploading images:", error);
        })
        .finally(() => {
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      // Current user check karo
      if (!currentUser || !currentUser._id) {
        reject(new Error("User not authenticated"));
        return;
      }

      const storage = getStorage(app);
      const fileName = `${currentUser.uid}-${
        file.name
      }-${new Date().getTime()}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length + formData.imageUrls.length > 6) {
      setImageUploadError("You can only upload 6 images maximum");
      return;
    }

    // File size check (2MB max)
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 2 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setImageUploadError("Some files are larger than 2MB");
      return;
    }

    setFiles(selectedFiles);
    setImageUploadError("");

    // Local preview banane ke liye
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setFormData({
      ...formData,
      imageUrls: [...formData.imageUrls, ...urls],
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id === "regularPrice" || id === "discountPrice") {
      setFormData({
        ...formData,
        [id]: value,
      });
    } else {
      setFormData({
        ...formData,
        [id]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setImageUploadError("Please login to create a listing");
      return;
    }

    if (formData.imageUrls.length < 1) {
      setImageUploadError("Please upload at least one image");
      return;
    }

    if (+formData.regularPrice < +formData.discountPrice) {
      setImageUploadError("Discount price must be less than regular price");
      return;
    }

    setIsSubmitting(true);

    try {
      // Yahan API call karenge
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser.uid,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        setImageUploadError(data.message);
        return;
      }

      // Success case
      alert("Listing created successfully!");

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
        imageUrls: [],
      });
      setFiles([]);
    } catch (error) {
      setImageUploadError("Something went wrong!");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Agar user logged in nahi hai toh message show karo
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
          {/* LEFT SECTION */}
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

            {/* IMAGE UPLOAD SECTION */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Property Images
              </h2>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-all duration-200">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
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
                        PNG, JPG, WEBP up to 2MB (Max 6 images)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Upload Button */}
                <button
                  type="button"
                  disabled={uploading || files.length === 0}
                  onClick={handleImageSubmit}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  {uploading
                    ? "Uploading..."
                    : `Upload ${files.length} Image(s) to Firebase`}
                </button>

                {/* Error Message */}
                {imageUploadError && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {imageUploadError}
                  </div>
                )}

                {/* Image Preview */}
                {formData.imageUrls.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">
                      Preview ({formData.imageUrls.length}/6 images)
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {formData.imageUrls.map((url, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={url}
                            className="w-full h-24 object-cover rounded-lg shadow-sm group-hover:opacity-75 transition-all duration-200"
                            alt={`Preview ${i + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="col-span-1 lg:col-span-2 mt-6">
            <button
              type="submit"
              disabled={isSubmitting || uploading}
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
                "Create Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
