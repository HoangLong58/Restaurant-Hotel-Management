import React from 'react'
import "../css/main.css"

const Navbar = () => {
    return (
        <nav id="menu-wrap" class="menu-back cbp-af-header">
            <div class="menu-top background-black">
                <div class="container">
                    <div class="row">
                        <div class="col-6 px-0 px-md-3 pl-1 py-3">
                            <span class="call-top">call us:</span> <a href="#" class="call-top">(381) 60 422 4256</a>
                        </div>
                        <div class="col-6 px-0 px-md-3 py-3 text-right">
                            <a href="#" class="social-top">fb</a>
                            <a href="#" class="social-top">tw</a>
                            <div class="lang-wrap">
                                eng
                                <ul>
                                    <li><a href="#">ger</a></li>
                                    <li><a href="#">rus</a></li>
                                    <li><a href="#">ser</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="menu">
                <a href="index.html" >
                    <div class="logo">
                        <img src="img/logo.png" alt=""/>
                    </div>
                </a>
                <ul>
                    <li>
                        <a class="curent-page" href="#" >home</a>
                        <ul>
                            <li><a class="curent-page" href="index.html">Flip Slider</a></li>
                            <li><a href="index-1.html">Video Background</a></li>
                            <li><a href="index-2.html">Moving Image</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" >rooms</a>
                        <ul>
                            <li><a href="rooms.html">Our Rooms</a></li>
                            <li><a href="rooms-gallery.html">Room Gallery</a></li>
                            <li><a href="rooms-video.html">Room Video</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" >pages</a>
                        <ul>
                            <li><a href="explore.html">Explore</a></li>
                            <li><a href="search.html">Search</a></li>
                            <li><a href="tandc.html">Terms &amp; Conditions</a></li>
                            <li><a href="services.html">Services</a></li>
                            <li><a href="restaurant.html">Restaurant</a></li>
                            <li><a href="testimonials.html">Testimonials</a></li>
                            <li><a href="gallery.html">Gallery</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="about.html">about us</a>
                    </li>
                    <li>
                        <a href="blog.html">news</a>
                    </li>
                    <li>
                        <a href="contact.html">contact</a>
                    </li>
                    <li>
                        <a href="search.html"><span>book now</span></a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar