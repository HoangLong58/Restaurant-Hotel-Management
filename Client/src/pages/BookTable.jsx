import React, { useEffect, useState } from 'react';
import BookTableMain from '../components/BookTable/BookTableMain';
import Footer from '../components/Footer';
import HomeServices from '../components/Home/HomeServices';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import RestaurantLanding from '../components/Restaurant/RestaurantLanding';

const BookTable = () => {
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
            <BookTableMain />
            <HomeServices />
            <Footer />
          </>
      }
    </div>
  )
}

export default BookTable