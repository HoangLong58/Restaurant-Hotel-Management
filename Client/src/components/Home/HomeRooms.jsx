import { Star } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Service
import * as RoomService from "../../service/RoomService";
import { format_money } from '../../utils/utils';

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
							roomList.map((roomItem, key) => {
								const room = roomItem.room;
								const service = roomItem.service;
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
												<Link to="/hotel">
													<a className="mt-1 btn btn-primary" style={{ color: "white" }}>
														Đặt ngay {format_money(room.room_price)}$
													</a>
												</Link>
												<div className="room-icons mt-4 pt-4">
													{
														service.map((serviceItem, key) => {
															return (
																<img src={serviceItem.service_image} style={{ width: "30px", marginLeft: "3px" }} alt="" />
															)
														})
													}
													<Link to="/hotel">
														<a>Xem chi tiết</a>
													</Link>
												</div>
											</div>
										</div>
									</div>
								);
							})
							: null
					}
				</div>
			</div>
		</div>
	)
}

export default HomeRooms