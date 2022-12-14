import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import HomeServices from '../components/Home/HomeServices';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import RestaurantButton from '../components/Restaurant/RestaurantButton';
import RestaurantLanding from '../components/Restaurant/RestaurantLanding';
import RestaurantMeals from '../components/Restaurant/RestaurantMeals';
import RestaurantService from '../components/Restaurant/RestaurantService';
import RestaurantVideoPresentation from '../components/Restaurant/RestaurantVideoPresentation';

const Restaurant = () => {
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
            <RestaurantLanding />
            <RestaurantVideoPresentation />
            <RestaurantButton />
            <RestaurantService />
            <RestaurantMeals />
            <HomeServices />
            <Footer />
          </>
      }
    </div>
  )
}

export default Restaurant