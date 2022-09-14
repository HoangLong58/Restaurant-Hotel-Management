import React, { useEffect, useState } from 'react';
import BookPartyMain from '../components/BookParty/BookPartyMain';
import Footer from '../components/Footer';
import HomeServices from '../components/Home/HomeServices';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import RestaurantLanding from '../components/Restaurant/RestaurantLanding';

const BookParty = () => {
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
            <Navbar pageName="Restaurant" />
            <RestaurantLanding name="Đặt bàn" type="noneBooking" />
            <BookPartyMain />
            <HomeServices />
            <Footer />
          </>
      }
    </div>
  )
}

export default BookParty