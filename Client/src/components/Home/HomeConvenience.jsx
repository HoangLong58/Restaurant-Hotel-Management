import React from 'react';
import { Link } from 'react-router-dom';
import picture1 from '../../img/1.svg';
import picture2 from '../../img/2.svg';
import picture4 from '../../img/4.svg';
import picture5 from '../../img/5.svg';
import picture6 from '../../img/6.svg';
import picture3 from '../../img/spa.svg';

const HomeConvenience = () => {
	return (
		<div className="section padding-top-bottom over-hide">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-8 align-self-center">
						<div className="subtitle with-line text-center mb-4">Phòng Suite</div>
						<h3 className="text-center padding-bottom-small">Những dịch vụ sang trọng</h3>
					</div>
					<div className="section clearfix"></div>
					<div className="col-sm-6 col-lg-4">
						<div className="services-box text-center">
							<img src={picture1} alt="" />
							<h5 className="mt-2">Phòng không hút thuốc</h5>
							<p className="mt-3">Mang đến một môi trường trong lành.
								Tạo dựng hình ảnh một khách sạn, nhà hàng sang trọng, lịch sự, sạch sẽ.
								Đảm bảo vấn đề sức khỏe cho quý khách và nhân viên.</p>
							<Link to="/hotel">
								<a className="mt-1 btn btn-primary" href="#">Xem thêm</a>
							</Link>
						</div>
					</div>
					<div className="col-sm-6 col-lg-4 mt-5 mt-sm-0">
						<div className="services-box text-center">
							<img src={picture2} alt="" />
							<h5 className="mt-2">king beds</h5>
							<p className="mt-3">Giường king size có kích thước thông thường là 1.8m x 2m. Đảm bảo giấc ngủ ngon, thoải mái khách hàng là nhiệm vụ cực kỳ quan trọng, hàng đầu của khách sạn.</p>
							<Link to="/hotel">
								<a className="mt-1 btn btn-primary" href="#">Xem thêm</a>
							</Link>
						</div>
					</div>
					<div className="col-sm-6 col-lg-4 mt-5 mt-lg-0">
						<div className="services-box text-center">
							<img src={picture3} alt="" />
							<h5 className="mt-2">Spa</h5>
							<p className="mt-3">Mang đến cho kỳ du lịch nghỉ dưỡng của quý khách những phút giây thư giãn thoải mái. Cam kết mang lại cho khách hàng sự hài lòng cao nhất về chất lượng dịch vụ hoàn hảo.</p>
							<Link to="/hotel">
								<a className="mt-1 btn btn-primary" href="#">Xem thêm</a>
							</Link>
						</div>
					</div>
					<div className="col-sm-6 col-lg-4 mt-5">
						<div className="services-box text-center">
							<img src={picture4} alt="" />
							<h5 className="mt-2">welcome drink</h5>
							<p className="mt-3">Thức uống chào mừng miễn phí dùng để phục vụ khách trong quá trình chờ làm thủ tục check-in nhận phòng.</p>
							<Link to="/hotel">
								<a className="mt-1 btn btn-primary" href="#">Xem thêm</a>
							</Link>
						</div>
					</div>
					<div className="col-sm-6 col-lg-4 mt-5">
						<div className="services-box text-center">
							<img src={picture5} alt="" />
							<h5 className="mt-2">Hồ bơi</h5>
							<p className="mt-3">Được bao quanh bởi khu vườn nhỏ xinh, là nơi thích hợp để làm mới bản thân và thả mình thư giãn trong dòng nước mát lạnh.</p>
							<Link to="/hotel">
								<a className="mt-1 btn btn-primary" href="#">Xem thêm</a>
							</Link>
						</div>
					</div>
					<div className="col-sm-6 col-lg-4 mt-5">
						<div className="services-box text-center">
							<img src={picture6} alt="" />
							<h5 className="mt-2">Buffet sáng</h5>
							<p className="mt-3">Buffet sáng miễn phí, ngon miệng, hấp dẫn sẽ là dấu ấn đậm nét giúp du khách có ấn tượng đẹp về Hoàng Long Hotel &amp; Restaurant.</p>
							<Link to="/hotel">
								<a className="mt-1 btn btn-primary" href="#">Xem thêm</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomeConvenience