import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [Landlord , setLandlord] = React.useState(null);
    const [message , setMessage] = React.useState("");

    useEffect(() => {
        const fetchLandlord = async () => {
            try {   
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            }
            catch (error) {
                console.error("❌ Fetch landlord error:", error);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);


    const onChange = (e) => setMessage(e.target.value);


  return (
    <>
      {Landlord && (
        <div className="mt-6 p-4 border-2 border-gray-300 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contact Landlord</h2>
          <p>
            Contact <span className="font-semibold">{Landlord.username}</span>
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea className='w-full border p-3 rounded-lg' name="message" id="message" rows={2} value={message} onChange={onChange} placeholder='message'></textarea>
          <Link to={`mailto:${Landlord.email}?Subject=Regarding${listing.name}&body=${message}`}>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Send Message
            </button>
          </Link>
        </div>
      )}
    </>
  );
}
