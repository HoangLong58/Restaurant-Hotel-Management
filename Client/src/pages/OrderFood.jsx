import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import HomeServices from '../components/Home/HomeServices';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Foods from '../components/OrderFood/Foods';
import RestaurantLanding from '../components/Restaurant/RestaurantLanding';

const OrderFood = () => {
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
            <RestaurantLanding name="Gọi món" type="noneBooking" />
            <Foods />
            <HomeServices />
            <Footer />
          </>
      }
    </div>
  )
}

export default OrderFood