import React from 'react';
import { Link } from 'react-router-dom';
import partyPicture from '../../img/party.jpg';
import reservedPicture from '../../img/reserved.jpg';
import roomServicePicture from '../../img/roomservice.jpg';

const RestaurantButton = () => {
    return (
        <div className="section background-dark over-hide">
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-sm-6 col-lg-4 pt-4 pt-sm-0">
                        <Link to={'/order-food'}>
                            <div className="img-wrap services-wrap">
                                <img src={roomServicePicture} alt="" style={{ maxHeight: "214px", objectFit: "cover" }} />
                                <div className="services-text-over">Gọi món</div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-sm-6 col-lg-4 pt-4 pt-lg-0">
                        <Link to={'/book-table'}>
                            <div className="img-wrap services-wrap">
                                <img src={reservedPicture} alt="" style={{ maxHeight: "214px", objectFit: "cover" }} />
                                <div className="services-text-over">Đặt bàn</div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-sm-6 col-lg-4 pt-4 pt-lg-0">
                        <Link to={'/book-party'}>
                            <div className="img-wrap services-wrap">
                                <img src={partyPicture} alt="" style={{ maxHeight: "214px", objectFit: "cover" }} />
                                <div className="services-text-over">Hội nghị &amp; Tiệc</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantButton