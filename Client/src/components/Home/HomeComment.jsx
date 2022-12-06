import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Fade from 'react-reveal/Fade';
import picture5 from '../../img/5.jpg';

const HomeComment = () => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    return (
        <div className="section padding-top-bottom-big over-hide">
            <div className="parallax" style={{ backgroundImage: `url(${picture5})` }}></div>
            <div className="section z-bigger">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div id="owl-sep-1" className="owl-carousel owl-theme">
                                <Carousel activeIndex={index} onSelect={handleSelect} controls={false}>
                                    <Carousel.Item>

                                        <div className="quote-sep">
                                            <Fade top cascade>
                                                <h4>“Để chạm đến ước mơ, tôi phải là người trải nghiệm bản thân và tự bước đi trên con đường của mình.”</h4>
                                                <h6>Sơn Tùng - MTP</h6>
                                            </Fade>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <div className="quote-sep">
                                            <Fade top cascade>
                                                <h4>“Chúng ta sinh ra để thành công, đừng do dự đừng ngần ngại.”</h4>
                                                <h6>Sơn Tùng - MTP</h6>
                                            </Fade>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <div className="quote-sep">
                                            <Fade top cascade>
                                                <h4>“Theo tôi, hạnh phúc là được làm điều mình yêu, thành công là yêu được điều mình làm.”</h4>
                                                <h6>Sơn Tùng - MTP</h6>
                                            </Fade>
                                        </div>
                                    </Carousel.Item>
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeComment