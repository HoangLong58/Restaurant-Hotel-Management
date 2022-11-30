import React from 'react';
import Fade from 'react-reveal/Fade';
import { Link } from 'react-router-dom';
import pictureRoom1 from '../../img/room1.jpg';
import pictureRoom2 from '../../img/room2.jpg';

const HomeView = () => {
    return (
        <div class="section background-grey over-hide">
            <div class="container-fluid px-0">
                <div class="row mx-0">
                    <div class="col-xl-6 px-0">
                        <div class="img-wrap" id="rev-1">
                            <Fade left>
                                <img src={pictureRoom1} alt="" />
                            </Fade>
                            <div class="text-element-over">private pool suite</div>
                        </div>
                    </div>
                    <div class="col-xl-6 px-0 mt-4 mt-xl-0 align-self-center">
                        <div class="row justify-content-center">
                            <div class="col-10 col-xl-8 text-center">
                                <h3 class="text-center">Phòng Suite hồ bơi riêng</h3>
                                <p class="text-center mt-4">Hãy tưởng tượng sự sang trọng của việc có một hồ bơi riêng, bồn tắm nước nóng hoặc bể sục chỉ cách giường của bạn vài bước chân. Hoàn hảo cho một kỳ nghỉ lãng mạn, tuần trăng mật hoặc một kỳ nghỉ gia đình đặc biệt. Hoàng Long Hotel &amp; Restaurant được xếp hạng hàng đầu tốt nhất, nơi bạn có thể đặt phòng suite hoặc biệt thự có hồ bơi.</p>
                                <Link to="/hotel">
                                    <a class="mt-5 btn btn-primary" href="search.html">Tìm kiếm</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mx-0">
                    <div class="col-xl-6 px-0 mt-4 mt-xl-0 pb-5 pb-xl-0 align-self-center">
                        <div class="row justify-content-center">
                            <div class="col-10 col-xl-8 text-center">
                                <h3 class="text-center">Phòng Suite view biển</h3>
                                <p class="text-center mt-4">Khung cảnh đẹp nhất có thể tưởng tượng với tiếng sóng vỗ ngoài cửa sổ suốt đêm cho bài hát ru tuyệt vời nhất. Chúng tôi không thể yêu cầu một kỳ nghỉ đẹp hơn.</p>
                                <Link to="/hotel">
                                    <a class="mt-5 btn btn-primary" href="search.html">Tìm kiếm</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-6 px-0 order-first order-xl-last mt-5 mt-xl-0">
                        <div class="img-wrap" id="rev-2">
                            <Fade right>
                                <img src={pictureRoom2} alt="" />
                            </Fade>
                            <div class="text-element-over">sea view suite</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeView