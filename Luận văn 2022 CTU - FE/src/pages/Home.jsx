import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import HomeComment from '../components/Home/HomeComment';
import HomeContact from '../components/Home/HomeContact';
import HomeConvenience from '../components/Home/HomeConvenience';
import HomeDescription from '../components/Home/HomeDescription';
import HomeLanding from '../components/Home/HomeLanding';
import HomeRestaurant from '../components/Home/HomeRestaurant';
import HomeRooms from '../components/Home/HomeRooms';
import HomeServices from '../components/Home/HomeServices';
import HomeVideoPresentation from '../components/Home/HomeVideoPresentation';
import HomeView from '../components/Home/HomeView';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import "../css/bootstrap.css";
import "../css/style.css";

const Home = () => {
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
            <Navbar pageName="Home" />
            <HomeLanding />
            <HomeDescription />
            <HomeView />
            <HomeServices />
            <HomeConvenience />
            <HomeRooms />
            <HomeComment />
            <HomeVideoPresentation />
            <HomeRestaurant />
            <HomeContact />
            <Footer />
          </>
      }


    </div>
  )
}

export default Home