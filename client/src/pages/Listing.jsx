import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle'

function Listing() {
    SwiperCore.use([Navigation]);

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try{
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json();
                if(data.success === false){
                    setLoading(false);
                    setError(true);
                    return;
                }
                setError(false);
                setLoading(false);
                setListing(data);
            }catch(error){
                setLoading(false);
                setError(true);
            }
        }
        fetchListing();
    }, [params.listingId])
  return (
    <main>
      {loading&&<p className='text-center my-7 text-2xl'>loading...</p>}
      {error&&<p className='text-center my-7 text-2xl'>Something went wrong</p>}
      {listing && !loading && !error && (
        <>
            <Swiper navigation>
                {listing.images.map((url) => (
                    <SwiperSlide key={url}>
                        <div className='h-[500px]' style= {{background:`url(${url}) center no-repeat`, backgroundSize: "cover"}}>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
      ) }
    </main>
  )
}

export default Listing
