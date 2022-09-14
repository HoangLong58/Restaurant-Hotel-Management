import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import HomeServices from '../components/Home/HomeServices';
import HotelLanding from '../components/Hotel/HotelLanding';
import HotelRooms from '../components/Hotel/HotelRooms';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';

const Hotel = () => {
  const [isLoading, setIsLoading] = useState(true);

  // This will run one time after the component mounts
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);

  return (
    <div>
      {
        isLoading
          ?
          <Loader />
          :
          <>
            <Navbar pageName="Hotel" />
            <HotelLanding />
            <HotelRooms />
            <HomeServices />
            <Footer />
          </>
      }
    </div>
  )
}

export default Hotel