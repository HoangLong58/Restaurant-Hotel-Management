import React, { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'

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
            <Navbar />
          </>
      }


    </div>
  )
}

export default Home