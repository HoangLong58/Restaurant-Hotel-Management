import React, { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel';
import picture5 from '../../img/5.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Fade from 'react-reveal/Fade';

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
                                                <h4>"Chilling out on the bed in your hotel room watching television, while wearing your own pajamas, is sometimes the best part of a vacation."</h4>
                                                <h6>Jason Salvatore</h6>
                                            </Fade>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <div className="quote-sep">
                                            <Fade top cascade>
                                                <h4>"Every good day starts off with a cappuccino, and there's no place better to enjoy some frothy caffeine than at the Thalia Hotel."</h4>
                                                <h6>Terry Mitchell</h6>
                                            </Fade>
                                        </div>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <div className="quote-sep">
                                            <Fade top cascade>
                                                <h4>"I still enjoy traveling a lot. I mean, it amazes me that I still get excited in hotel rooms just to see what kind of shampoo they've left me."</h4>
                                                <h6>Michael Brighton</h6>
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