import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation} from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem.jsx';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {useSelector, useDispatch} from 'react-redux'
import {updateUserSuccess} from '../redux/user/userSlice.js'

function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  const {currentUser} = useSelectore((state) => state.user);
  const dispatch = useDispatch();
  const [sortedRent, setSortedRent] = useState([]);
  const [sortedSale, setSortedSale] = useState([]);
  const [sortedOffer, setSortedOffer] = useState([]);


  useEffect(() => {
    const fetchOfferListings = async () => {
      try{
        const res = await fetch(`api/listing/get?offer=true&limit=5`);
        const data = await res.json();
        setOfferListings(data);

        fetchRentListings();
      
      }catch(error){
        console.log(error);
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`api/listing/get?type=rent&limit=5`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`api/listing/get?type=sale&limit=5`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, []);

  const sortListings = (listings, order) => {
    if(!order || order.length === 0) return listings;
    const orderMap = new Map(order.map((id, index) => [id, index]));
    retrun [...listings].sort((a, b) => {
      const aIndex = orderMap.get(a._id);
      const bIndex = orderMap.get(b._id);
      if(aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
      if(aIndex !== undefined) return -1;
      if(bIndex !== undefined) return 1;
      return 0;
    })
  }

  useEffect(() => {
    if(currentUser) {
      setSortedRent(sortListings(rentListings, currentUser.rentlistingOrder));
      setSortedSale(sortListings(saleListings, currentUser.saleListingOrder));
      setSortedOffer(sortListings(offerListings, currentUser.offerListingOrder));
    } else{
      setSortedRent(rentListings);
      setSortedSale(saleListings);
      setSortedOffer(offerListings);
    }
  }, [rentListings, saleListings, offerListings, currentUser]);

  const handleOnGragEnd = async (result) => {
    const {source, destination} = result;
    if(!destination) return;
    if(!currentUser) return;

    let listType;
    if(source.droppableId === 'rentListings') listType = 'rent';
    else if(source.droppableId === 'saleListings') listType = 'sale';
    else if(source.droppableId === 'offerListings') listType = 'offer';
    else return;

    const listMap = {
      rent: {items: sortedRent, setter: setSortedRent},
      sale: {items: sortedSale, setter: setSortedSale},
      offer: {items: sortedOffer, setter: setSortedOffer},
    };
    const {items, setter} = listMap[listType];

    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);

    setter(reorderedItems);

    const newIdOrder = reorderedItems.map((item) => item._id);

    try{
      const  res = await fetch(`api/user/update-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({
          listType: listType,
          order: newIdOrder,
        }),
      });
      const data = await res.json();
      if(data.success === false){
        setter(items);
      } else{
        dispatch(updateUserSuccess(data));
      }
    }
    }catch(error){
      setter(items);
    }
  }
  
  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your next <span className='text-slate-500'>perfect</span> <br /> place with ease</h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.
          <br />
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque faucibus ex. Adipiscing elit quisque faucibus ex sapien vitae pellentesque.
        </div>

        <Link to={'/search'} className='text-sm text-blue-800 font-bold hover:underline'>Lets get started...</Link>
      </div>
      
      {/* swiper */}
      <Swiper navigation>

      {
        offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide>
            <div style={{background: `url(${listing.images[0]}) center no-repeat`, backgroundSize:"cover"}} className="h-[500px]" key={listing._id}></div>
          </SwiperSlide>
        ))
      }
      </Swiper>
      
      {/* listing results */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {
                  offerListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}></ListingItem>
                  ))
                }
              </div>
            </div>
          )
        }
        {
          rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {
                  rentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}></ListingItem>
                  ))
                }
              </div>
            </div>
          )
        }
        {
          saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                Show more places for sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {
                  saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}></ListingItem>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home
