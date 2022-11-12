import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../img/logos/logo.png';
import { logout } from '../redux/callsAPI';

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
    font-weight: 400;
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
// Right
const Right = styled.div`
    flex: 1;    
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

const MenuItem = styled.div`
    font-size: 14px;
    cursor: pointer;
    margin-left: 25px;
`


const NavbarUserImage = styled.img`
    margin-right: 2px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
`
const NavbarUserName = styled.span`
    margin-left: 4px;
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-white);
    letter-spacing: 2px;
`
const NavbarUserMenu = styled.ul`
    position: absolute;
    z-index: 1;
    padding-left: 0;
    top: calc(100% + 6px);
    right: 0;
    width: 180px;
    border-radius: 2px;
    background-color: white;
    list-style: none;
    display: none;
    box-shadow: 0 1px 3rem 0 rgba(0, 0, 0, 0.2);
    animation: fadeIn ease-in 0.2s;
    &::before {
        content: "";
        border-width: 8px 14px;
        border-style: solid;
        border-color: transparent transparent white transparent;
        position: absolute;
        right: 20px;
        top: -16px;
    }
    &::after {
        content: "";
        display: block;
        position: absolute;
        top: -6px;
        right: 0;
        width: 100%;
        height: 8px;
    }
`
// USER
const NavbarUser = styled.div`
    display: flex;
    justify-items: center;
    position: relative;
    &:hover ${NavbarUserMenu} {
        display: block;
    }
`

const NavbarUserItem = styled.li`
    text-decoration: none;
    color: #333;
    font-size: 1.1rem;
    padding: 6px 0px;
    display: block;
`
const NavbarUserItemLi = styled.li`
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    padding: 8px 0px 8px 0;
    color: black;
    font-weight: 500;
    position: relative;
    &:hover {
        color: white;
        background-color: black;
        text-decoration: none;
        transition: color 0.5s, background-color 0.56s;
        &::after{
            display: block;
        }
    }
    &::after {
        content: "";
        display: none;
        position: absolute;
        top: 0px;
        left: -5px;
        width: 3%;
        height: 43px;
        background-color: var(--color-primary);
    }
`

const ItemInfo = styled.div`
    width: 100%;
    margin-right: 12px;
`;
const ItemHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const ItemName = styled.h5`
    font-size: 1.1rem;
    line-height: 1.2rem;
    max-height: 2.4rem;
    overflow: hidden;
    font-weight: 500;
    color: black;
    margin: 0;
    flex: 1;
    padding-right: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-align: left;
`;

const ItemBody = styled.div`
    display: flex;
    justify-content: space-between;
`;
const ItemDescription = styled.span`
    color: #757575;
    font-size: 1.1rem;
    font-weight: 300;
`;


const Navbar = (props) => {
    const navigate = useNavigate();
    // Customer from Redux
    const customer = useSelector((state) => state.customer.currentCustomer);
    const dispatch = useDispatch();

    // Hide when srolling
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

    // Logout
    const handleClickLogout = () => {
        dispatch(logout, customer);
    }

    return (
        <Container>
            <NavbarWrapper id="menu-wrap" className={isVisible ? "menu-back cbp-af-header" : "menu-back cbp-af-header hide"}>
                <NavbarTop className={isVisible ? "menu-top background-black" : "menu-top background-black hide"}>
                    <NavbarTopContainer className="container">
                        <NavbarTopRow className="row">
                            <NavbarTopLeft className="col-6 px-0 px-md-3 pl-1 py-3">
                                <NavbarPhoneSpan className="call-top">Liên hệ: </NavbarPhoneSpan>
                                <NavbarPhoneA href="" className="call-top">(+84) 929 4411 58</NavbarPhoneA>
                            </NavbarTopLeft>
                            <NavbarTopRight className="col-6 px-0 px-md-3 py-3 text-right">
                                {
                                    customer != null ? (
                                        // Đã đăng nhập thành công
                                        <Right>
                                            <MenuItem >
                                                <NavbarUser>
                                                    <NavbarUserImage src={customer.customer_image ? customer.customer_image : "https://avatars.githubusercontent.com/u/96277352?s=400&u=cad895ff2f6ae2bd57b90ad02c6077d89bc9d55d&v=4"}></NavbarUserImage>
                                                    <NavbarUserName>{customer.customer_first_name + " " + customer.customer_last_name}</NavbarUserName>
                                                    <NavbarUserMenu>
                                                        <NavbarUserItem>
                                                            <Link
                                                                style={{ textDecoration: "none", width: "100%" }}
                                                                to='/capnhatthongtin'>
                                                                <NavbarUserItemLi style={{ marginTop: "10px" }}>
                                                                    Cập nhật thông tin
                                                                </NavbarUserItemLi>
                                                            </Link>
                                                            <Link
                                                                style={{ textDecoration: "none", color: "black" }}
                                                                to='/donmua'>
                                                                <NavbarUserItemLi>
                                                                    Đơn mua của bạn
                                                                </NavbarUserItemLi>
                                                            </Link>
                                                            <NavbarUserItemLi
                                                                onClick={() => handleClickLogout()}
                                                            >Đăng xuất</NavbarUserItemLi>
                                                        </NavbarUserItem>
                                                    </NavbarUserMenu>
                                                </NavbarUser>
                                            </MenuItem>
                                        </Right>

                                    ) : (
                                        <>
                                            <Link to={"/login"}>
                                                <NavbarTopRightA href="" className="social-top">
                                                    Đăng ký
                                                </NavbarTopRightA>
                                            </Link>
                                            <Link to={"/login"}>
                                                <NavbarTopRightA href="" className="social-top">
                                                    Đăng nhập
                                                </NavbarTopRightA>
                                            </Link>
                                        </>
                                    )
                                }
                            </NavbarTopRight>
                        </NavbarTopRow>
                    </NavbarTopContainer>
                </NavbarTop>
                <NavbarBottom className="menu">
                    <NavbarBottomA href="index.html">
                        <NavbarBottomLogo className="logo">
                            <Link to={"/home"} className={props.pageName === "Home" ? "curent-page" : ""}>
                                <NavbarBottomLogoImg src={logo} />
                            </Link>
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
                            <NavbarBottomItemA href="#">Trang khác</NavbarBottomItemA>
                            <NavbarBottomItemUl className='normal-sub'>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="#">Tin tức</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="#">Khám phá</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="#">Quyền lợi &amp; Nghĩa vụ</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="#">Dịch vụ</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="#">Khách sạn &amp; Nhà hàng</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="#">Kho ảnh</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                            </NavbarBottomItemUl>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="#">Về chúng tôi</NavbarBottomItemA>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="#">Liên hệ</NavbarBottomItemA>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA onClick={() => navigate("/hotel")}>
                                    <span>Đặt phòng ngay</span>
                            </NavbarBottomItemA>
                        </NavbarBottomItem>
                    </NavbarBottomUl>
                </NavbarBottom>
            </NavbarWrapper>
        </Container>
    )
}

export default Navbar