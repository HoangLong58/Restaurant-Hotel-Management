import React from 'react'
import picture1 from '../../img/res-1.png'
import picture2 from '../../img/res-2.png'
import picture3 from '../../img/res-3.png'

const RestaurantService = () => {
    return (
        <div className="section padding-top over-hide" style={{paddingBottom: "75px"}}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="services-box restaurant text-center">
                            <img src={picture1} alt="" />
                            <h5 className="mt-3">Món ăn chất lượng cao</h5>
                            <p className="mt-3">Các món ăn được trau chuốt sắc hương mỹ vị bởi các đầu bếp chuyên nghiệp sẽ mang lại sự hài lòng của quý khách.</p>
                            <a className="mt-1 btn btn-primary" href="services.html">Xem thêm</a>
                        </div>
                    </div>
                    <div className="col-md-4 mt-5 mt-md-0">
                        <div className="services-box restaurant text-center">
                            <img src={picture2} alt="" />
                            <h5 className="mt-3">Đầu bếp thượng hạng</h5>
                            <p className="mt-3"> Với kinh nghiệm làm việc cùng cái tâm nghề nghiệp sẽ mang đến quý khách hàng những món ăn tuyệt vời nhất.</p>
                            <a className="mt-1 btn btn-primary" href="services.html">Xem thêm</a>
                        </div>
                    </div>
                    <div className="col-md-4 mt-5 mt-md-0">
                        <div className="services-box restaurant text-center">
                            <img src={picture3} alt="" />
                            <h5 className="mt-3">Nguyên liệu tươi mới</h5>
                            <p className="mt-3">Nguyên liệu đầu vào sạch sẽ, có xuất xứ và hạn sử dụng rõ ràng để món ăn làm ra luôn được tươi mới.</p>
                            <a className="mt-1 btn btn-primary" href="services.html">Xem thêm</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantService