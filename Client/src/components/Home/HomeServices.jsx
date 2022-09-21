import React from 'react';
import pictureService1 from '../../img/ser-1.jpg';
import pictureService2 from '../../img/ser-2.jpg';
import pictureService3 from '../../img/ser-3.jpg';
import pictureService4 from '../../img/ser-4.jpg';

const HomeServices = () => {
	return (
		<div className="section background-dark over-hide">
			<div className="container-fluid py-4">
				<div className="row">
					<div className="col-sm-6 col-lg-3">
						<a href="services.html">
							<div className="img-wrap services-wrap">
								<img src={pictureService1} alt="" />
								<div className="services-text-over">spa salon</div>
							</div>
						</a>
					</div>
					<div className="col-sm-6 col-lg-3 pt-4 pt-sm-0">
						<a href="services.html">
							<div className="img-wrap services-wrap">
								<img src={pictureService2} alt="" />
								<div className="services-text-over">Nhà hàng</div>
							</div>
						</a>
					</div>
					<div className="col-sm-6 col-lg-3 pt-4 pt-lg-0">
						<a href="services.html">
							<div className="img-wrap services-wrap">
								<img src={pictureService3} alt="" />
								<div className="services-text-over">Hồ bơi</div>
							</div>
						</a>
					</div>
					<div className="col-sm-6 col-lg-3 pt-4 pt-lg-0">
						<a href="services.html">
							<div className="img-wrap services-wrap">
								<img src={pictureService4} alt="" />
								<div className="services-text-over">Hoạt động khác</div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HomeServices