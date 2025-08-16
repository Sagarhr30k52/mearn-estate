import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessgae] = useState('');

    const onChange = (e) => {
        setMessgae(e.target.value);
    }

    useEffect(()=> {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if(data.success === false){
                    console.log(data.message);
                    return;
                }
                setLandlord(data); 
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
    }, [listing.userRef])

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
            <p >Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
            <textarea className='border-2 p-3 rounded-lg w-full' name="message" id="message" rows="2" value={message} onChange={onChange} placeholder='enter your message here...'></textarea>

            <Link to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
            Send Messgae
            </Link>
        </div>
      )}
    </>
  )
}

export default Contact
