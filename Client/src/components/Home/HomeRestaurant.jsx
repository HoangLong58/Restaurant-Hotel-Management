import React from 'react';
import Fade from 'react-reveal/Fade';
import { Link } from 'react-router-dom';
import pictureRestaurant1 from '../../img/rest-1.jpg';
import pictureRestaurant2 from '../../img/rest-2.jpg';

const HomeRestaurant = () => {
	return (
		<div className="section padding-top-bottom background-grey over-hide">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-8 align-self-center">
						<div className="subtitle with-line text-center mb-4">Nhà hàng tuyệt vời</div>
						<h3 className="text-center padding-bottom-small">Hội nghị &amp; Tiệc cưới</h3>
					</div>
					<div className="section clearfix"></div>
				</div>
				<div className="row background-white p-0 m-0">
					<div className="col-xl-6 p-0">
						<div className="img-wrap" id="rev-3">
							<Fade left>
								<img src={pictureRestaurant1} alt="" />
							</Fade>
						</div>
					</div>
					<div className="col-xl-6 p-0 align-self-center">
						<div className="row justify-content-center">
							<div className="col-9 pt-4 pt-xl-0 pb-5 pb-xl-0 text-center">
								<h5 className="">Hội nghị</h5>
								<p className="mt-3">Grand Palace tọa lạc trong khu vực yên tĩnh, an ninh tuyệt đối, thuận tiện cho giao thông vào những giờ cao điểm. Đặc biệt với kiến trúc Châu Âu sang trọng cùng thiết kế sảnh theo...</p>
								<Link to="/restaurant">
									<a className="mt-1 btn btn-primary" href="#">Khám phá</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="row background-white p-0 m-0">
					<div className="col-xl-6 p-0 align-self-center">
						<div className="row justify-content-center">
							<div className="col-9 pt-4 pt-xl-0 pb-5 pb-xl-0 text-center">
								<h5 className="">Tiệc cưới</h5>
								<p className="mt-3">Sảnh Platin với kích thước 386 m2 được bày trí theo phong cách Châu Âu sang trọng sẽ thật sự phù hợp cho một hôn lễ ấm cúng với số lượng khách mời trong khoảng 20 đến 26 bàn...</p>
								<Link to="/restaurant">
									<a className="mt-1 btn btn-primary" href="#">Khám phá</a>
								</Link>
							</div>
						</div>
					</div>
					<div className="col-xl-6 order-first order-xl-last p-0">
						<div className="img-wrap" id="rev-4">
							<Fade right>
								<img src={pictureRestaurant2} alt="" />
							</Fade>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomeRestaurant