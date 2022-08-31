import React from 'react'
import pictureRoom from '../../img/rooms.png'

const HomeDescription = () => {
    return (
        <div className="section padding-top-bottom over-hide">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 align-self-center">
                        <div className="row justify-content-center">
                            <div className="col-10">
                                <div className="subtitle text-center mb-4">Hotel Hoàng Long</div>
                                <h2 className="text-center" style={{fontSize: "40px"}}>Tận hưởng cuộc sống!</h2>
                                <p className="text-center mt-5">
                                    Đến với Hoàng Long Hotel &amp; Restaurant quý khách không khỏi ngỡ ngàng bởi vẻ đẹp xung quanh với những hàng cây xanh hài hòa, với quy mô 604 phòng nghỉ và 44 villa, Hoàng Long Hotel &amp; Restaurant đạt tiêu chuẩn 5 sao Quốc tế.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-4 mt-md-0">
                        <div className="img-wrap">
                            <img src={pictureRoom} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeDescription