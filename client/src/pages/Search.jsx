import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    }
  }, [value, delay]);
  return debouncedValue;
}
function Search() {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [priceLimits, setPriceLimits] = useState({minPrice: 0, maxPrice: 0});
  const [currentValue, setCurrentValue] = useState(0);
  const debouncedPrice = useDebounce(currentValue, 400);

  useEffect(() => {
      const fetchLimits = async () => {
      try {
        const res = await fetch("api/listing/getprice-Limits");
      const data = await res.json();
      if(data){
        setPriceLimits(data);
        const urlParams = new URLSearchParams(location.search);
        const maxPriceFromUrl = urlParams.get("maxPrice");
        setCurrentValue(maxPriceFromUrl || data.maxPrice);
      }
      console.log(data);
      }
      catch (error) {
        console.error("Error fetching listing limits:", error);
      }
    }
    fetchLimits();
    }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const maxPriceFromUrl = urlParams.get("maxPrice");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      maxPriceFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
      if (priceLimits.maxPrice > 0) {
        setCurrentValue(maxPriceFromUrl || priceLimits.maxPrice);
      }
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false); 
      const searchQuerry = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuerry}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search, priceLimits.maxPrice]);

  useEffect(() => {
    if(priceLimits.maxPrice === 0) return;
    const urlParams = new URLSearchParams(location.search);
    const currentUrlMaxPrice = urlParams.get("maxPrice");
    if(String(debouncedPrice) !== currentUrlMaxPrice){
      urlParams.set("minPrice", priceLimits.minPrice);
      urlParams.set("maxPrice", debouncedPrice);
      navigate(`/search?${urlParams.toString()}`);
    }
  }, [debouncedPrice, navigate, location.search, priceLimits]);

  const handleSliderChange = (e) => {
    setCurrentValue(Number(e.target.value));
  }
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true'? true : false });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    urlParams.set("minPrice", priceLimits.minPrice);
    urlParams.set("maxPrice", currentValue);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuerry = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuerry}`)
    const data = await res.json();
    if(data.length < 9){
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen md:sticky md:top-20 md:h-screen overflow-y-auto md:border-b-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="font-semibold whitespace-nowrap">
              Search term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="search.."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap itmes-center">
            <label className="font-semibold">type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>rent & sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap itmes-center">
            <label className="font-semibold">amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>parking lot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              name=""
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
          <input id="slider" type="range" min={priceLimits.minPrice} max={priceLimits.maxPrice} step="10" value ={currentValue}  onChange={handleSliderChange} />
          </div>
          <div className="flex justify-between gap-3">
            <div className="border border-gray-300 rounded-md px-3 py-2 min-w-[80px] text-center">
              <div className="text-xs text-gray-600">Min Price</div>
              <div className="text-base font-bold">${priceLimits.minPrice}</div>
            </div>
            <div className="border border-gray-300 rounded-md px-3 py-2 min-w-[80px] text-center">
              <div className="text-xs text-gray-600">Current Price</div>
              <div className="text-base font-bold">${currentValue}</div>
            </div>
            <div className="border border-gray-300 rounded-md px-3 py-2 min-w-[80px] text-center">
              <div className="text-xs text-gray-600">Max Price</div>
              <div className="text-base font-bold">${priceLimits.maxPrice}</div>
            </div>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4 justify-center">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">no listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">Loading....</p>
          )}

          {!loading && listings && listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing}></ListingItem>
          ))}

          {showMore && (
            <button onClick={onShowMoreClick} className="text-green-700 hover:underline p-7 w-full text-center">
              Show more...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
