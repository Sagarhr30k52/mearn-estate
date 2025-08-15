import React, { useEffect, useRef, useState } from "react";
import {useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'

function UpdateListing() {  
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
  });
  const [error, setError] = useState(false);
  const [loading , setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const {currentUser} = useSelector((state)=>state.user.user);

  const navigate = useNavigate();
  const params = useParams();

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const fetchListing = async () => {
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if(data.success === false){
            console.log(data.message);
            return;
        }
        setFormData(data);
        setImageUrls(data.images);
    }
    fetchListing();
  }, []);

  // Handle text/checkbox inputs
  const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData, type: e.target.id,
      })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData, [e.target.id]: e.target.checked
      })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData, [e.target.id]: e.target.value,
      })
      }  
    };

  // Handle image upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }
    if (files.length + imageUrls.length > 6) {
      setError("You can upload a maximum of 6 images.");
      return;
    }
    const largeFile = files.find(file => file.size > 2 * 1024 * 1024); // 2MB in bytes

    if (largeFile) {
        setError(`File "${largeFile.name}" is larger than 2MB. Please choose a smaller file.`);
        return;
    }

    setUploading(true);
    try {
      const uploadedUrls = [];

      for (let file of files) {
        const formDataObj = new FormData();
        formDataObj.append("file", file);
        formDataObj.append("upload_preset", uploadPreset);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formDataObj }
        );

        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }

      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // resets the actual input
    }
    } catch (error) {
      setError(error);
    } finally {
      setUploading(false);
    }
  };

  // Handle final form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrls.length === 0) {
      setError("Please upload at least one image before creating the listing.");
      return;
    }

    const finalData = {
      ...formData,
      userRef : currentUser._id,
      images: imageUrls,
    };

    try{
      if(finalData.regularPrice < finalData.discountPrice){
        setError("Regular price should be greater than discount price");
        return;
      }
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          },
        body : JSON.stringify(finalData),
      })
      const data = await res.json();
      setLoading(false);
      if(data.success === false){
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch{
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value = {formData.name}
          />
          <textarea
            placeholder="description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value = {formData.description}

          />
          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value = {formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            {["sale", "rent", "parking", "furnished", "offer"].map((option) => (
              <div key={option} className="flex gap-2">
                <input
                  type="checkbox"
                  id={option}
                  className="w-5"
                  onChange={handleChange}
                  checked = {formData.option}
                />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value = {formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value = {formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
                min='50'
                max="100000"
                onChange={handleChange}
                value = {formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ per month)</span>
              </div>
            </div>
            {formData.offer? <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
                min='0'
                max="100000"
                onChange={handleChange}
                value = {formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ per month)</span>
              </div>
            </div> : null}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              the first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
                ref={fileInputRef}
              onChange={(e) => setFiles(Array.from(e.target.files))}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Show uploaded images */}
          <div className="flex flex-wrap gap-3">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt="listing"
                  className="w-24 h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImageUrls((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          <button
          disabled = {loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            type="submit"
          >
            {loading ? "Loading...": "Update Listing"}
          </button>
          {error? <p className="text-red-700 text-sm">{error}</p> : null}
        </div>
      </form>
    </main>
  );
}

export default UpdateListing;