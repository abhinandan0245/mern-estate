import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import {
  FaCamera,
  FaUser,
  FaEnvelope,
  FaLock,
  FaTrash,
  FaSignOutAlt,
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
  });

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.error("Upload error:", error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignoutUser = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess());
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Your Profile</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your account settings, update your information, and control your preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              {/* Profile Image Section */}
              <div className="relative group">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={formData.avatar || currentUser?.avatar}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => fileRef.current.click()}
                      className="bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                    >
                      <FaCamera className="text-2xl" />
                    </button>
                  </div>
                </div>
                
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                />

                {/* Upload Progress */}
                <div className="mt-6">
                  {filePerc > 0 && filePerc < 100 && (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${filePerc}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-center text-gray-600">
                        Uploading... {filePerc}%
                      </p>
                    </div>
                  )}

                  {fileUploadError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm flex items-center gap-2">
                        <FaExclamationTriangle />
                        Error uploading image
                      </p>
                    </div>
                  )}

                  {filePerc === 100 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-600 text-sm flex items-center gap-2">
                        <FaCheckCircle />
                        Image successfully uploaded!
                      </p>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="mt-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">{currentUser?.username}</h2>
                  <p className="text-gray-600 mt-1">{currentUser?.email}</p>
                  <div className="inline-block mt-3 px-4 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-medium">
                    {currentUser?.role === "admin" ? "Administrator" : "Member"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <FaUser className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
                  <p className="text-gray-600">Update your personal details</p>
                </div>
              </div>

              {/* Success/Error Messages */}
              {updateSuccess && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 font-medium flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    User updated successfully!
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 font-medium flex items-center gap-2">
                    <FaExclamationTriangle />
                    {error}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaUser className="text-gray-400" />
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    defaultValue={currentUser?.username}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaEnvelope className="text-gray-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue={currentUser?.email}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaLock className="text-gray-400" />
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter new password"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave blank if you don't want to change the password
                  </p>
                </div>

                {/* Update Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaSave />
                      Update Profile
                    </span>
                  )}
                </button>
              </form>

              {/* Action Buttons */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Delete Account */}
                  <button
                    onClick={handleDeleteUser}
                    className="flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-200">
                      <FaTrash className="text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Delete Account</p>
                      <p className="text-sm text-red-500">Permanently remove account</p>
                    </div>
                  </button>

                  {/* Sign Out */}
                  <button
                    onClick={handleSignoutUser}
                    className="flex items-center justify-center gap-3 p-4 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-200">
                      <FaSignOutAlt className="text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Sign Out</p>
                      <p className="text-sm text-gray-500">End current session</p>
                    </div>
                  </button>
                </div>

                {/* Info Note */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Changes to your profile information will be reflected across all PropZen platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}