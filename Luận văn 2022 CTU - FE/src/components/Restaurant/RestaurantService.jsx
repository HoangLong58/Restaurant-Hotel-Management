import React from 'react'
import picture1 from '../../img/res-1.png'
import picture2 from '../../img/res-2.png'
import picture3 from '../../img/res-3.png'

const RestaurantService = () => {
    return (
        <div className="section padding-top over-hide">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="services-box restaurant text-center">
                            <img src={picture1} alt="" />
                            <h5 className="mt-3">High quality foods</h5>
                            <p className="mt-3">Sed ut perspiciatis unde omnis iste natus error sit, totam rem aperiam.</p>
                            <a className="mt-1 btn btn-primary" href="services.html">read more</a>
                        </div>
                    </div>
                    <div className="col-md-4 mt-5 mt-md-0">
                        <div className="services-box restaurant text-center">
                            <img src={picture2} alt="" />
                            <h5 className="mt-3">Inspiring recipes</h5>
                            <p className="mt-3">Sed ut perspiciatis unde omnis iste natus error sit, totam rem aperiam.</p>
                            <a className="mt-1 btn btn-primary" href="services.html">read more</a>
                        </div>
                    </div>
                    <div className="col-md-4 mt-5 mt-md-0">
                        <div className="services-box restaurant text-center">
                            <img src={picture3} alt="" />
                            <h5 className="mt-3">Salutary meals</h5>
                            <p className="mt-3">Sed ut perspiciatis unde omnis iste natus error sit, totam rem aperiam.</p>
                            <a className="mt-1 btn btn-primary" href="services.html">read more</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantService