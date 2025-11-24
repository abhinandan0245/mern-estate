import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserFailure, signoutUserStart, signoutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { set } from "mongoose";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch()
  const { currentUser , loading , error} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([])

  const handleShowListing = async() => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if(data.success === false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
      console.log("User Listings:", data);
    } catch (error) {
      setShowListingsError(true);
    }
  };  

  const [formData, setFormData] = useState({});
   console.log("formData",formData)
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
         setFormData({...formData , [e.target.id]: e.target.value})
  }

 const handleSubmit = async (e) => {
   e.preventDefault();
   console.log("Form submitted ✅"); // add this line

   try {
     dispatch(updateUserStart());
     console.log("Update started..."); // add this too

     const res = await fetch(`/api/user/update/${currentUser._id}`, {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       credentials: "include", // ✅ must include for cookies
       body: JSON.stringify(formData),
     });

     const data = await res.json();
     if (data.success === false) {
       dispatch(updateUserFailure(data.message));
       return;
     }
     dispatch(updateUserSuccess(data));
     setUpdateSuccess(true)
   } catch (error) {
     dispatch(updateUserFailure(error.message));
   }
 };


 const handleDeleteUser = async() => {
   try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
   } catch (error) {
    dispatch(deleteUserFailure(error.message));
   }
 };


 const handleSignoutUser = async() => {
  try {
    dispatch(signoutUserStart());
    const res = await fetch('/api/auth/signout');
    const data = await res.json();
    if(data.success === false){
      dispatch(signoutUserFailure(data.message));
      return;
    }
    dispatch(signoutUserSuccess(data));
  } catch (error) {
    dispatch(signoutUserFailure(data.message));
  }
 }


 const handleListingDelete = async (listingId) => {
   // const listingId = e.target.closest('li').getAttribute('key');
   try {
    const res = await fetch(`/api/listing/delete/${listingId}`, {
       method: "DELETE",
     });
     const data = await res.json();
      if (data.success === false) { 
        console.error("Listing delete error:", data.message);
        return; 
      }

     setUserListings((prev) =>
       prev.filter((listing) => listing._id !== listingId)
     );
   } catch (error) {
     console.error("Listing delete error:", error.message);
   }
 };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 ">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-center cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error uploading image</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-500">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          placeholder="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          delete account
        </span>
        <span
          onClick={handleSignoutUser}
          className="text-red-700 cursor-pointer"
        >
          sign out
        </span>
      </div>
      <p className="text-red-500 mt-5">{error ? error : ""}</p>
      <p className="text-green-500 mt-5">
        {updateSuccess ? "user is updated successfully!" : ""}
      </p>

      <button
        onClick={handleShowListing}
        className="text-green-700 text-center w-full font-semibold capitalize"
      >
        show listings
      </button>
      <p className="text-red-500 mt-5">
        {showListingsError ? "You can only access your own listings!" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="mt-5">
          <h2 className="text-2xl font-semibold mb-3">Your Listings:</h2>
          <ul className="list-disc list-inside">
            {userListings.map((listing) => (
              <li
                key={listing._id}
                className="mb-2 flex items-center bg-white gap-3 justify-between p-3 border border-gray-400 rounded-lg "
              >
                <Link to={`/listings/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  className="font-semibold flex-1 hover:underline truncate"
                  to={`/listing/${listing._id}`}
                >
                  <span>{listing.name}</span>
                </Link>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700  border border-red-500 p-2 bg-red-500/10  rounded-sm font-semibold capitalize"
                  >
                    delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 border border-green-700 p-2 rounded-sm bg-green-500/10  font-semibold capitalize">
                      edit
                    </button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
