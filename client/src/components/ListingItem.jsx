import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.images[0] || "https://th.bing.com/th/id/R.cc5bea8aed5ed4ba231b2fa24a25ef46?rik=MyKIXaVYRGEVbA&riu=http%3a%2f%2f3.bp.blogspot.com%2f_Dv90SGLTTYs%2fTO2z5lyAKFI%2fAAAAAAAAAO8%2f7p62igFBY80%2fs1600%2fbiltmore-estate-exterior.jpg&ehk=EWXebcd1xa2GHfXpif13s9c6L6%2bLu%2bdWkkHRDZgLOqs%3d&risl=&pid=ImgRaw&r=0"}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />

        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700"></MdLocationOn>
            <p className="truncate text-sm text-gray-600 w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-gray-600">
            {listing.description.length > 80
              ? `${listing.description.slice(0, 70)}...`
              : listing.description}
          </p>
          <p className="mt-2 font-semibold text-slate-500">
            {listing.offer
              ? `$${listing.discountPrice?.toLocaleString("en-US")}`
              : `$${listing.regularPrice?.toLocaleString("en-US")}`}
            {listing.type === "rent" ? " / month" : null}
          </p>

          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListingItem;
