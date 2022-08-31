import React, { useEffect, useState } from 'react'
import picture1 from '../img/logos/1.png';
import picture2 from '../img/logos/2.png';
import picture3 from '../img/logos/3.png';
import logo from '../img/logos/logo.png';

const Footer = () => {
    // --Scroll to top--
    const [isVisible, setIsVisible] = useState(false);
    // Top: 0 takes us all the way back to the top of the page
    // Behavior: smooth keeps it smooth!
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    useEffect(() => {
        // Button is displayed after scrolling for 500 pixels
        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <>
            <div className="section padding-top-bottom-small background-black over-hide footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 text-center text-md-left">
                            <img src={logo} alt="" />
                            <p className="color-grey mt-4">61Đ Đinh Tiên Hoàng, Phường 8<br />Thành phố Vĩnh Long</p>
                            {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.3426612985463!2d105.951818923517!3d10.233923048413503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a82ba46978b57%3A0xfcc947a24c2e60f9!2zNjEgxJBpbmggVGnDqm4gSG_DoG5nLCBQaMaw4budbmcgOCwgVsSpbmggTG9uZywgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1661685139945!5m2!1sen!2s" width="600" height="450" style={{border: "0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
                        </div>
                        <div className="col-md-4 text-center text-md-left">
                            <h6 className="color-white mb-3">Thông tin</h6>
                            <a href="tandc.html">Terms &amp; Conditions</a>
                            <a href="services.html">Dịch vụ</a>
                            <a href="restaurant.html">Khách sạn</a>
                            <a href="testimonials.html">Nhà hàng</a>
                            <a href="gallery.html">Gallery &amp; Hình ảnh</a>
                        </div>
                        <div className="col-md-5 mt-4 mt-md-0 text-center text-md-left logos-footer">
                            <h6 className="color-white mb-3">Về chúng tôi</h6>
                            <p className="color-grey mb-4">Hoàng Long Hotel &amp; Restaurant là thương hiệu nhà hàng khách sạn lớn nhất Việt Nam. Hoàng Long sở hữu chuỗi thương hiệu nhà hàng, khách sạn đẳng cấp 5 sao theo tiêu chuẩn quốc tế toạ lạc tại những danh thắng du lịch nổi tiếng nhất của Việt Nam.</p>
                            <img src={picture1} alt="" />
                            <img src={picture2} alt="" />
                            <img src={picture3} alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="section py-4 background-dark over-hide footer-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-left mb-2 mb-md-0">
                            <p>2022 © Hoàng Long. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-center text-md-right">
                            <a href="#" className="social-footer-bottom">Facebook</a>
                            <a href="#" className="social-footer-bottom">Twitter</a>
                            <a href="#" className="social-footer-bottom">Instagram</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="scroll-to-top"
                onClick={scrollToTop}
                style={{ display: isVisible ? 'block' : 'none' }}
            ></div>
        </>
    )
}

export default Footer