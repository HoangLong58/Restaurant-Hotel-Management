import React from 'react'
import pictureGallery1 from '../../img/gallery/1-s.jpg';
import pictureGallery2 from '../../img/gallery/2-s.jpg';
import pictureGallery3 from '../../img/gallery/3-s.jpg';
import pictureGallery4 from '../../img/gallery/4-s.jpg';
import pictureGallery5 from '../../img/gallery/5-s.jpg';
import pictureGallery6 from '../../img/gallery/6-s.jpg';
import pictureGallery7 from '../../img/gallery/7-s.jpg';
import pictureGallery8 from '../../img/gallery/8-s.jpg';
import pictureGallery9 from '../../img/gallery/9-s.jpg';
import pictureGallery10 from '../../img/gallery/10-s.jpg';
// Multi carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const HomeContact = () => {
    // Responsive Multi Carousel
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 7,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };
    return (
        <>
            <div className="section padding-top z-bigger">
                <div className="container">
                    <div className="row justify-content-center padding-bottom-smaller">
                        <div className="col-md-8">
                            <div className="subtitle with-line text-center mb-4">get in touch</div>
                            <h3 className="text-center padding-bottom-small">drop us a line</h3>
                        </div>
                        <div className="section clearfix"></div>
                        <div className="col-md-6 col-lg-4">
                            <div className="address">
                                <div className="address-in text-left">
                                    <p className="color-black">Địa chỉ:</p>
                                </div>
                                <div className="address-in text-right">
                                    <p>61Đ Đinh Tiên Hoàng</p>
                                </div>
                            </div>
                            <div className="address">
                                <div className="address-in text-left">
                                    <p className="color-black">Thành phố:</p>
                                </div>
                                <div className="address-in text-right">
                                    <p>Vĩnh Long</p>
                                </div>
                            </div>
                            <div className="address">
                                <div className="address-in text-left">
                                    <p className="color-black">Ngày đặt phòng:</p>
                                </div>
                                <div className="address-in text-right">
                                    <p>14:00 pm</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="address">
                                <div className="address-in text-left">
                                    <p className="color-black">Số điện thoại:</p>
                                </div>
                                <div className="address-in text-right">
                                    <p>+84 929 44 1158</p>
                                </div>
                            </div>
                            <div className="address">
                                <div className="address-in text-left">
                                    <p className="color-black">Email:</p>
                                </div>
                                <div className="address-in text-right">
                                    <p>longb1809368@student.ctu.edu.vn</p>
                                </div>
                            </div>
                            <div className="address">
                                <div className="address-in text-left">
                                    <p className="color-black">Ngày trả phòng:</p>
                                </div>
                                <div className="address-in text-right">
                                    <p>11:00 am</p>
                                </div>
                            </div>
                        </div>
                        <div className="section clearfix"></div>
                        <div className="col-md-8 text-center mt-5" data-scroll-reveal="enter bottom move 50px over 0.7s after 0.2s">
                            <p className="mb-0"><em>available at: 8am - 10pm</em></p>
                            <h2 className="text-opacity">+84 929 44 1158</h2>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="subscribe-home">
                                <input type="text" placeholder="Email của quý khách là" />
                                <button data-lang="en">Gửi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Carousel
                swipeable={false}
                draggable={false}
                showDots={false}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="transform 500ms ease 0s"
                transitionDuration={1500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                deviceType="desktop"
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                arrows={false}
                rewindWithAnimation={true}
            >
                <div className="item">
                    <a href="img/gallery/1.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery1} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/2.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery2} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/3.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery3} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/4.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery4} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/5.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery5} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/6.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery6} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/7.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery7} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/8.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery8} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/9.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery9} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/10.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery10} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/1.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery1} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/2.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery2} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/3.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery3} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/4.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery4} alt="" />
                        </div>
                    </a>
                </div>
                <div className="item">
                    <a href="img/gallery/5.jpg" data-fancybox="gallery">
                        <div className="img-wrap gallery-small">
                            <img src={pictureGallery5} alt="" />
                        </div>
                    </a>
                </div>
            </Carousel>
        </>
    )
}

export default HomeContact