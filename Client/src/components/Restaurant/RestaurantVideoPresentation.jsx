import { PlayArrow } from '@mui/icons-material';
import React, { useState } from 'react';
import Modal from './Modal';

const RestaurantVideoPresentation = () => {
    // Modal
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("");

    const openModal = (modal) => {
        setShowModal(prev => !prev);
        setTypeModal(modal.type);
    }
    return (
        <div className="section padding-top-bottom-small background-dark-2 over-hide">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h5 className="color-grey">Một vài thước phim về chúng tôi</h5>
                        <p className="color-white mt-3 mb-3"><em>Video dài khoảng 1:45 min</em></p>
                        <div className="video-button"
                            style={{ cursor: "pointer" }}
                            onClick={() => openModal({ type: "showVideoRestaurant" })}
                        >
                            <PlayArrow />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                showModal={showModal}   //state Đóng mở modal
                setShowModal={setShowModal} //Hàm Đóng mở modal
                type={typeModal}    //Loại modal
            />
        </div>
    )
}

export default RestaurantVideoPresentation