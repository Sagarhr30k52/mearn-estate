import React, { useState } from "react";
import {useDispatch,  useSelector } from "react-redux";
import {updateUserStart, updateUserFailure, updateUserSuccess} from "../redux/user/userSlice.js"

function Profile() {
  const currentUser = useSelector((state) => state.user.user.currentUser);
  const {loading, error} = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState(currentUser || {});
  const [updateSuccess, setUpdateSuccess] = useState(false);

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

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.success == false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

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
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading? "loading..." : "Update"}
          
        </button>
        <p className="text-red-700 text-center"> {error? "*"+ error+"*" : ""}</p>
        <p className="text-green-700 text-center"> {updateSuccess? "user updated successfully" : ""}</p>
      </form>

      <div className="flex justify-between mt-3">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">sign-out</span>
      </div>
    </div>
  );
}

export default Profile;
