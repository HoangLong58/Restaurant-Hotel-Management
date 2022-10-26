import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { PersonOutlineOutlined, PetsOutlined, GridViewOutlined, InventoryOutlined, AssignmentIndOutlined, LogoutOutlined, CategoryOutlined, ConnectedTvOutlined, DiscountOutlined, DomainAddOutlined } from "@mui/icons-material";
import styled from "styled-components";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { logout } from '../../redux/callsAPI';
import { useDispatch, useSelector } from 'react-redux';

const Container = styled.aside`
    height: 100vh;
`;
const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.4rem;
`;

const Logo = styled.div`
    display: flex;
    gap: 0.8rem;
`;

const Img = styled.img`
    width: 5rem;
    height: 5rem;
`;

const H2 = styled.h2`
    color: var(--color-primary);
    font-size: 1.4rem;
`;

const Close = styled.div`
    display: none;
`;

// SIDE BAR
const SideBar = styled.div`
    display: flex;
    flex-direction: column;
    height: 86vh;
    position: relative;
    top: 3rem;
`;

const IconSpan = styled.span`
    fontSize: 1.6rem;
    transition: all 300ms ease;

`

const LinkStyled = styled(Link)`
    display: flex;
    color: var(--color-info-dark);
    margin-left: 2rem;
    gap: 1rem;
    align-items: center;
    position: relative;
    height: 3.7rem;
    transition: all 300ms ease;
    &:last-child {
        position: absolute;
        bottom: 2rem;
        width: 100%;
    }
    &.active {
        background: var(--color-light);
        color: var(--color-primary);
        margin-left: 0;
        ${IconSpan} {
            color: var(--color-primary);
            margin-left: calc(1rem - 3px);
        }
        &:before {
            content: "";
            width: 6px;
            height: 100%;
            background: var(--color-primary);
        }
    }
    &:hover {
        color: var(--color-primary);
        cursor: pointer;
        ${IconSpan} {
            margin-left: 1rem;
        }
    }
`;

const H3 = styled.h3`
    font-size: 0.87rem;
`;

const Aside = (props) => {

    // Dashboard
    const [isDashBoardActive, setDashBoardIsActive] = useState(props.active === "dashboard" ? true : false);
    const handleClickDashBoard = () => {
        setDashBoardIsActive(true);
        setDeviceTypeIsActive(false);
        setThuCungIsActive(false);
        setKhachHangIsActive(false);
        setNhanVienIsActive(false);
        setDonHangIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
    }

    // Quản lý Thiết bị
    const [isDeviceActive, setDeviceIsActive] = useState(props.active === "manageDevice" ? true : false);
    const handleClickDevice = () => {
        setDeviceIsActive(true);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setThuCungIsActive(false);
        setKhachHangIsActive(false);
        setNhanVienIsActive(false);
        setDonHangIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
    }

    // Quản lý Loại thiết bị
    const [isDeviceTypeActive, setDeviceTypeIsActive] = useState(props.active === "manageDeviceType" ? true : false);
    const handleClickDeviceType = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(true);
        setThuCungIsActive(false);
        setKhachHangIsActive(false);
        setNhanVienIsActive(false);
        setDonHangIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
    }
    // Quản lý Mã giảm giá
    const [isDiscountActive, setDiscountIsActive] = useState(props.active === "manageDiscount" ? true : false);
    const handleClickDiscount = () => {
        setDiscountIsActive(true);
        setDeviceTypeIsActive(false);
        setDashBoardIsActive(false);
        setThuCungIsActive(false);
        setKhachHangIsActive(false);
        setNhanVienIsActive(false);
        setDonHangIsActive(false);
        setDeviceIsActive(false);
        setFloorIsActive(false);
    }
    // Quản lý Tầng
    const [isFloorActive, setFloorIsActive] = useState(props.active === "manageFloor" ? true : false);
    const handleClickFloor = () => {
        setFloorIsActive(true);
        setDiscountIsActive(false);
        setDeviceTypeIsActive(false);
        setDashBoardIsActive(false);
        setThuCungIsActive(false);
        setKhachHangIsActive(false);
        setNhanVienIsActive(false);
        setDonHangIsActive(false);
        setDeviceIsActive(false);
    }



    // Quản lý Thú cưng
    const [isThuCungActive, setThuCungIsActive] = useState(props.active === "quanlythucung" ? true : false);
    const handleClickThuCung = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setThuCungIsActive(true);
        setKhachHangIsActive(false);
        setNhanVienIsActive(false);
        setDonHangIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
    }

    // Quản lý Khách hàng
    const [isKhachHangActive, setKhachHangIsActive] = useState(props.active === "quanlykhachhang" ? true : false);
    const handleClickKhachHang = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setThuCungIsActive(false);
        setKhachHangIsActive(true);
        setNhanVienIsActive(false);
        setDonHangIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
    }

    // Quản lý Nhân viên
    const [isNhanVienActive, setNhanVienIsActive] = useState(props.active === "quanlynhanvien" ? true : false);
    const handleClickNhanVien = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setThuCungIsActive(false);
        setKhachHangIsActive(false);
        setNhanVienIsActive(true);
        setDonHangIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
    }

    // Quản lý Đơn hàng
    const [isDonHangActive, setDonHangIsActive] = useState(props.active === "quanlydonhang" ? true : false);
    const handleClickDonHang = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setThuCungIsActive(false);
        setKhachHangIsActive(false);
        setNhanVienIsActive(false);
        setDonHangIsActive(true);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
    }

    // Đăng xuất
    const admin = useSelector((state) => state.admin.currentAdmin);
    const dispatch = useDispatch();
    const handleDangXuat = () => {
        logout(dispatch, admin);
    }
    return (
        <Container>
            <Top>
                <Logo>
                    <Img src="https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/2048px-Logo_Dai_hoc_Can_Tho.svg.png" />
                    <H2>Hoàng Long <span style={{ color: "var(--color-dark)" }}>- ADMIN</span></H2>
                </Logo>
                <Close>
                    <CloseOutlinedIcon></CloseOutlinedIcon>
                </Close>
            </Top>
            <SideBar>
                <LinkStyled to={"/"} className={isDashBoardActive ? "active" : null} onClick={handleClickDashBoard}>
                    <IconSpan>
                        <GridViewOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Dashboard</H3>
                </LinkStyled>
                <LinkStyled to={"/manageDevice"} className={isDeviceActive ? "active" : null} onClick={handleClickDevice}>
                    <IconSpan>
                        <ConnectedTvOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Quản lý Thiết bị - Khách sạn</H3>
                </LinkStyled>
                <LinkStyled to={"/manageDeviceType"} className={isDeviceTypeActive ? "active" : null} onClick={handleClickDeviceType}>
                    <IconSpan>
                        <CategoryOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Quản lý Loại thiết bị - Khách sạn</H3>
                </LinkStyled>
                <LinkStyled to={"/manageDiscount"} className={isDiscountActive ? "active" : null} onClick={handleClickDiscount}>
                    <IconSpan>
                        <DiscountOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Quản lý Mã giảm giá</H3>
                </LinkStyled>
                <LinkStyled to={"/manageFloor"} className={isFloorActive ? "active" : null} onClick={handleClickFloor}>
                    <IconSpan>
                        <DomainAddOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Quản lý Tầng</H3>
                </LinkStyled>



                <LinkStyled to={"/quanlythucung"} className={isThuCungActive ? "active" : null} onClick={handleClickThuCung}>
                    <IconSpan>
                        <PetsOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Quản lý Thú cưng</H3>
                </LinkStyled>
                <LinkStyled to={"/quanlykhachhang"} className={isKhachHangActive ? "active" : null} onClick={handleClickKhachHang}>
                    <IconSpan>
                        <PersonOutlineOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Quản lý Khách hàng</H3>
                </LinkStyled>
                <LinkStyled to={"/quanlynhanvien"} className={isNhanVienActive ? "active" : null} onClick={handleClickNhanVien}>
                    <IconSpan>
                        <AssignmentIndOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Quản lý Nhân viên</H3>
                </LinkStyled>
                <LinkStyled to={"/quanlydonhang"} className={isDonHangActive ? "active" : null} onClick={handleClickDonHang}>
                    <IconSpan>
                        <InventoryOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Quản lý Đơn hàng</H3>
                </LinkStyled>

                <LinkStyled to={"/"} onClick={() => handleDangXuat()}>
                    <IconSpan >
                        <LogoutOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                    </IconSpan>
                    <H3>Đăng xuất</H3>
                </LinkStyled>
            </SideBar>
        </Container>

    );
};

export default Aside;