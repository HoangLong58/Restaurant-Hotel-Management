import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import HomeServices from '../components/Home/HomeServices';
import HotelLanding from '../components/Hotel/HotelLanding';
import HotelRoomDetail from '../components/Hotel/HotelRoomDetail';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';

const RoomDetail = () => {
    const navigate = useNavigate();
    // -- Receive data from another link
    const location = useLocation();
    // STATE
    const [isLoading, setIsLoading] = useState(true);

    if(location.state === null) {
        navigate("/hotel");
    }
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
                        <HotelRoomDetail data={location.state}/>
                        <HomeServices />
                        <Footer />
                    </>
            }
        </div>
    )
}

export default RoomDetail