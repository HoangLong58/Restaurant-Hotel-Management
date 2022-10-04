import { Star } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import svg1 from '../../img/1.svg';
import svg2 from '../../img/2.svg';
import svg3 from '../../img/3.svg';
import svg4 from '../../img/4.svg';
import svg5 from '../../img/5.svg';
import svg6 from '../../img/6.svg';
import picture3 from '../../img/room3.jpg';
import picture4 from '../../img/room4.jpg';
import picture5 from '../../img/room5.jpg';
import picture6 from '../../img/room6.jpg';

// Service
import * as RoomService from "../../service/RoomService";

const HomeRooms = () => {
	// State
	const [roomList, setRoomList] = useState([]);

	useEffect(() => {
		const getRooms = async () => {
			const res = await RoomService.getRooms();
			setRoomList(res.data.data);
			console.log(res);
		};
		getRooms();
	}, []);

	return (
		<div className="section padding-top-bottom over-hide background-grey">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-8 align-self-center">
						<div className="subtitle with-line text-center mb-4">luxury</div>
						<h3 className="text-center padding-bottom-small">Những loại phòng của chúng tôi</h3>
					</div>
					<div className="section clearfix"></div>
					{
						roomList ?
							roomList.map((room, key) => {
								return (
									<div className="col-md-6 mt-4">
										<div className="room-box background-white">
											<div className="room-name">{room.floor_name}</div>
											<div className="room-per">
												<Star style={{ color: "yellow" }} />
												<Star style={{ color: "yellow" }} />
												<Star style={{ color: "yellow" }} />
												<Star style={{ color: "yellow" }} />
												<Star style={{ color: "yellow" }} />
											</div>
											<img src={room.room_image_content} alt="" style={{ height: "360px", objectFit: "cover", objectPosition: "center" }} />
											<div className="room-box-in">
												<h5 className="">{room.room_type_name}</h5>
												<p className="mt-3" style={{ overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: "3" }}>{room.room_description}</p>
												<a className="mt-1 btn btn-primary" href="rooms-gallery.html">Đặt ngay {room.room_price}$</a>
												<div className="room-icons mt-4 pt-4">
													<img src={svg5} alt="" />
													<img src={svg2} alt="" />
													<img src={svg3} alt="" />
													<img src={svg1} alt="" />
													<a href="rooms-gallery.html">Xem chi tiết</a>
												</div>
											</div>
										</div>
									</div>
								);
							})
							: null
					}

					{/* <div className="col-md-6">
						<div className="room-box background-white">
							<div className="room-name">suite tanya</div>
							<div className="room-per">
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
							</div>
							<img src={picture3} alt="" />
							<div className="room-box-in">
								<h5 className="">Phòng Suite</h5>
								<p className="mt-3">Phòng Suite thường được thiết kế, bố trí ở tầng cao nhất, là loại phòng có diện tích lớn nhất, được trang bị đầy đủ thiết bị tiện nghi, nội thất, vật dụng cao cấp và các dịch vụ đặc biệt.</p>
								<a className="mt-1 btn btn-primary" href="rooms-gallery.html">Đặt ngay 130$</a>
								<div className="room-icons mt-4 pt-4">
									<img src={svg5} alt="" />
									<img src={svg2} alt="" />
									<img src={svg3} alt="" />
									<img src={svg1} alt="" />
									<a href="rooms-gallery.html">Xem chi tiết</a>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6 mt-4 mt-md-0">
						<div className="room-box background-white">
							<div className="room-name">suite helen</div>
							<div className="room-per">
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<i className="fa fa-star-o"></i>
							</div>
							<img src={picture4} alt="" />
							<div className="room-box-in">
								<h5 className="">Phòng Standard</h5>
								<p className="mt-3">Trang thiết bị và nội thất phòng Standard phong cách hiện đại, nội thất sang trọng, trang nhã sạch sẽ mang lại sự thư giãn tối đa cho quý khách hàng trong thời gian lưu trú. </p>
								<a className="mt-1 btn btn-primary" href="rooms-gallery.html">Đặt ngay 80$</a>
								<div className="room-icons mt-4 pt-4">
									<img src={svg4} alt="" />
									<img src={svg2} alt="" />
									<img src={svg6} alt="" />
									<img src={svg3} alt="" />
									<a href="rooms-gallery.html">Xem chi tiết</a>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6 mt-4">
						<div className="room-box background-white">
							<div className="room-name">suite andrea</div>
							<div className="room-per">
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
							</div>
							<img src={picture5} alt="" />
							<div className="room-box-in">
								<h5 className="">Phòng Executive Suite</h5>
								<p className="mt-3">Phòng Executive Suite có diện tích phòng lớn 65m², nằm trên 2 tầng cao nhất của khách sạn. Trang thiết bị hiện đại, phòng khách sang trọng, phòng tắm rộng rãi và phòng ngủ riêng mang đến trải nghiệm thư giãn đẳng cấp.</p>
								<a className="mt-1 btn btn-primary" href="rooms-gallery.html">Đặt ngay 110$</a>
								<div className="room-icons mt-4 pt-4">
									<img src={svg5} alt="" />
									<img src={svg2} alt="" />
									<img src={svg3} alt="" />
									<img src={svg6} alt="" />
									<a href="rooms-gallery.html">Xem chi tiết</a>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6 mt-4">
						<div className="room-box background-white">
							<div className="room-name">suite diana</div>
							<div className="room-per">
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
								<Star style={{ color: "yellow" }} />
							</div>
							<img src={picture6} alt="" />
							<div className="room-box-in">
								<h5 className="">Phòng Bungalow</h5>
								<p className="mt-3">Bên ngoài đơn giản, bên trong đầy đủ tiện nghi với các khu vực như phòng ngủ, phòng tắm, phòng khách,… và các trang thiết bị hiện đại. Hồ bơi, khu giải trí, phòng xông hơi còn được tích hợp trong khuôn viên Bungalow.</p>
								<a className="mt-1 btn btn-primary" href="rooms-gallery.html">Đặt ngay 160$</a>
								<div className="room-icons mt-4 pt-4">
									<img src={svg5} alt="" />
									<img src={svg2} alt="" />
									<img src={svg3} alt="" />
									<img src={svg6} alt="" />
									<a href="rooms-gallery.html">Xem chi tiết</a>
								</div>
							</div>
						</div>
					</div> */}
				</div>
			</div>
		</div>
	)
}

export default HomeRooms