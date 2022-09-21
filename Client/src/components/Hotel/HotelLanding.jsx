import React from 'react';
import pictureLanding1 from '../../img/rooms.jpg';

const HotelLanding = () => {
    return (
        <div class="section big-55-height over-hide z-bigger">
            <div class="parallax parallax-top" style={{ backgroundImage: `url(${pictureLanding1})` }}></div>
            <div class="dark-over-pages"></div>

            <div class="hero-center-section pages">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-12 parallax-fade-top">
                            <div class="hero-text">Khách sạn</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HotelLanding