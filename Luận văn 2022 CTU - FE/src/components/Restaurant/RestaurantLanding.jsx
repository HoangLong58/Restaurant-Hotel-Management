import React from 'react'
import videoRestaurant from '../../video/restaurant.mp4';

const RestaurantLanding = () => {
    return (
        <div class="section big-55-height over-hide z-bigger">

            <div id="poster_background-res"></div>
            <div id="video-wrap" class="parallax-top">
                <video id="video_background" preload="auto" autoPlay loop="loop" muted="muted">
                    <source src={videoRestaurant} type="video/mp4" />
                </video>
            </div>
            <div class="dark-over-pages"></div>

            <div class="hero-center-section pages">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-12 parallax-fade-top">
                            <div class="hero-text">Nhà hàng</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantLanding