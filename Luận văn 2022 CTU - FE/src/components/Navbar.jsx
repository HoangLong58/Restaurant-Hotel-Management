import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../img/logos/logo.png';

const Container = styled.div`

`

const NavbarWrapper = styled.nav`
    &.hide {
        margin-top: 0;
        -webkit-transform: translateY(-52px);
        -ms-transform: translateY(-52px);
        transform: translateY(-52px);
        background-color: rgba(21,21,21,.92);
        -webkit-transition : all 0.3s ease-out;
        -moz-transition : all 0.3s ease-out;
        -o-transition :all 0.3s ease-out;
        transition : all 0.3s ease-out;
        z-index: 99999;
    }
`

// Navbar Top
const NavbarTop = styled.div`
    &.hide {
        margin-top: 0;
        -webkit-transform: translateY(-52px);
        -ms-transform: translateY(-52px);
        transform: translateY(-52px);
        background: rgba(21,21,21,.92);
        -webkit-transition : all 0.3s ease-out;
        -moz-transition : all 0.3s ease-out;
        -o-transition :all 0.3s ease-out;
        transition : all 0.3s ease-out;
    }
`

const NavbarTopContainer = styled.div`

`

const NavbarTopRow = styled.div`

`

const NavbarTopLeft = styled.div`


`

const NavbarPhoneSpan = styled.span`

`

const NavbarPhoneA = styled.a`

`

const NavbarTopRight = styled.div`

`

const NavbarTopRightA = styled.a`

`

const NavbarTopRightLanguage = styled.div`

`

const NavbarTopRightLanguageUl = styled.ul`

`

const NavbarTopRightLanguageLi = styled.li`

`

const NavbarTopRightLanguageLiA = styled.a`

`

// Navbar Bottom
const NavbarBottom = styled.div`
`

const NavbarBottomA = styled.a`
`

const NavbarBottomLogo = styled.div`

`

const NavbarBottomLogoImg = styled.img`

`

const NavbarBottomUl = styled.ul`

`

const NavbarBottomItem = styled.li`
`

const NavbarBottomItemA = styled.a`

`

const NavbarBottomItemUl = styled.ul`
    ${NavbarBottomItem}:hover & {
        display: block;
        opacity: 1;
    }
`

const NavbarBottomItemLi = styled.li`

`

const NavbarBottomItemLiA = styled.a`

`



const Navbar = (props) => {

    const [isVisible, setIsVisible] = useState(true);
    const [height, setHeight] = useState(0)

    useEffect(() => {
        window.addEventListener("scroll", listenToScroll);
        return () =>
            window.removeEventListener("scroll", listenToScroll);
    }, [])

    const listenToScroll = () => {
        let heightToHideFrom = 200;
        const winScroll = document.body.scrollTop ||
            document.documentElement.scrollTop;
        setHeight(winScroll);

        if (winScroll > heightToHideFrom) {
            isVisible && setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    };

    return (
        <Container>
            <NavbarWrapper id="menu-wrap" className={isVisible ? "menu-back cbp-af-header" : "menu-back cbp-af-header hide"}>
                <NavbarTop className={isVisible ? "menu-top background-black" : "menu-top background-black hide"}>
                    <NavbarTopContainer className="container">
                        <NavbarTopRow className="row">
                            <NavbarTopLeft className="col-6 px-0 px-md-3 pl-1 py-3">
                                <NavbarPhoneSpan className="call-top">Liên hệ: </NavbarPhoneSpan>
                                <NavbarPhoneA href="#" className="call-top">(+84)929 4411 58</NavbarPhoneA>
                            </NavbarTopLeft>
                            <NavbarTopRight className="col-6 px-0 px-md-3 py-3 text-right">
                                <NavbarTopRightA href="#" className="social-top">Đăng ký</NavbarTopRightA>
                                <NavbarTopRightA href="#" className="social-top">Đăng nhập</NavbarTopRightA>
                                <NavbarTopRightLanguage className="lang-wrap">
                                    ENG
                                    <NavbarTopRightLanguageUl>
                                        <NavbarTopRightLanguageLi>
                                            <NavbarTopRightLanguageLiA href="#">GER</NavbarTopRightLanguageLiA>
                                            <NavbarTopRightLanguageLiA href="#">RUS</NavbarTopRightLanguageLiA>
                                            <NavbarTopRightLanguageLiA href="#">CN</NavbarTopRightLanguageLiA>
                                        </NavbarTopRightLanguageLi>
                                    </NavbarTopRightLanguageUl>
                                </NavbarTopRightLanguage>
                            </NavbarTopRight>
                        </NavbarTopRow>
                    </NavbarTopContainer>
                </NavbarTop>
                <NavbarBottom className="menu">
                    <NavbarBottomA href="index.html">
                        <NavbarBottomLogo className="logo">
                            <NavbarBottomLogoImg src={logo} />
                        </NavbarBottomLogo>
                    </NavbarBottomA>
                    <NavbarBottomUl>
                        <NavbarBottomItem>
                            <Link to={"/home"} className={props.pageName === "Home" ? "curent-page" : ""}>
                                Trang chủ
                            </Link>
                        </NavbarBottomItem>

                        <NavbarBottomItem className='menu-dropdown-icon'>
                            <Link to={"/hotel"} className={props.pageName === "Hotel" ? "curent-page" : ""}>
                                Khách sạn
                            </Link>
                        </NavbarBottomItem>

                        <NavbarBottomItem className='menu-dropdown-icon'>
                            <Link to={"/restaurant"} className={props.pageName === "Restaurant" ? "curent-page" : ""}>
                                Nhà hàng
                            </Link>
                            <NavbarBottomItemUl className='normal-sub'>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href='/'>
                                        <Link to={"/order-food"}>
                                            Gọi món
                                        </Link>
                                    </NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href='/'>
                                        <Link to={"/book-table"}>
                                            Đặt bàn
                                        </Link>
                                    </NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href='/'>
                                        <Link to={"/book-party"}>
                                            Hội nghị &amp; Tiệc cưới
                                        </Link>
                                    </NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                            </NavbarBottomItemUl>
                        </NavbarBottomItem>

                        <NavbarBottomItem className='menu-dropdown-icon'>
                            <NavbarBottomItemA href="#">Pages</NavbarBottomItemA>
                            <NavbarBottomItemUl className='normal-sub'>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="explore.html">Explore</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="search.html">Search</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="tandc.html">Terms &amp; Condition</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="services.html">Services</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="restaurant.html">Restaurant</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="testimonials.html">Testimonials</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="gallery.html">Gallery</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                            </NavbarBottomItemUl>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="about.html">Về chúng tôi</NavbarBottomItemA>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="contact.html">Liên hệ</NavbarBottomItemA>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="search.html"><span>Đặt phòng ngay</span></NavbarBottomItemA>
                        </NavbarBottomItem>
                    </NavbarBottomUl>
                </NavbarBottom>
            </NavbarWrapper>
        </Container>
    )
}

export default Navbar