import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";

function Profile() {
  const currentUser = useSelector((state) => state.user.user.currentUser);
  const { loading, error } = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState(currentUser || {});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (currentUser) {
      setFormData(currentUser);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      if (data.success == false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error));
    }
  };

  const showListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success == false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch(error){
      console.log(error);
      setShowListingError(true);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-5">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {formData?.avatar ? (
          <img
            src={formData.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          />
        ) : (
          ""
        )}
        <input
          type="text"
          placeholder="Avatar url"
          id="avatar"
          defaultValue={formData.avatar}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Username"
          id="username"
          defaultValue={formData.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="Email"
          id="email"
          defaultValue={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "Update"}
        </button>

        <Link
          to={"/create-listing"}
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>

        <p className="text-red-700 text-center">
          {" "}
          {error ? "*" + error + "*" : ""}
        </p>
        <p className="text-green-700 text-center">
          {" "}
          {updateSuccess ? "user updated successfully" : ""}
        </p>
      </form>

      <div className="flex justify-between mt-3">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          sign-out
        </span>
      </div>
      <button onClick={showListings} className="text-green-700 w-full">
        Show Listings
      </button>

      {showListingError ? (
        <p className="text-red-700 text-center">
          their is some error in showing the list
        </p>
      ) : null}

      {userListings && userListings.length > 0 && (
        <>
          <h1 className="text-center my-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div key={listing._id} className="flex flex-col gap-2">
              <div className="border rounded-lg p-3 flex justify-between items-center my-2 gap-4">
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.images[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  />
                </Link>
                <Link
                  to={`/listing/${listing._id}`}
                  className="flex-1 text-slate-700 font-semibold hover:underline truncate"
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button className="text-red-700 uppercase">delete</button>
                  <button className="text-green-700 uppercase">edit</button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Profile;
