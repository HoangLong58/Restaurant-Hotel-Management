import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { PersonOutlineOutlined, PetsOutlined, GridViewOutlined, InventoryOutlined, AssignmentIndOutlined, LogoutOutlined, CategoryOutlined, ConnectedTvOutlined, DiscountOutlined, DomainAddOutlined, ClassOutlined, MeetingRoomOutlined, SpaOutlined, BadgeOutlined } from "@mui/icons-material";
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
    height: 76vh;
    position: relative;
    top: 3rem;
`;

const IconSpan = styled.span`
    font-size: 1.6rem;
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
    /* &:last-child {
        position: absolute;
        bottom: 2rem;
        width: 100%;
    } */
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

const SideBarTop = styled.div`
    height: 70vh;
    overflow-y: scroll;
    &::-webkit-scrollbar {
    /* display: none; */
    width: 2px;
}
`;
const SideBarBottom = styled.div`
    position: fixed;
    bottom: 10px;
    left: 30px;
`;

const Aside = (props) => {

    // Dashboard
    const [isDashBoardActive, setDashBoardIsActive] = useState(props.active === "dashboard" ? true : false);
    const handleClickDashBoard = () => {
        setDashBoardIsActive(true);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }

    // Quản lý Thiết bị
    const [isDeviceActive, setDeviceIsActive] = useState(props.active === "manageDevice" ? true : false);
    const handleClickDevice = () => {
        setDeviceIsActive(true);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }

    // Quản lý Loại thiết bị
    const [isDeviceTypeActive, setDeviceTypeIsActive] = useState(props.active === "manageDeviceType" ? true : false);
    const handleClickDeviceType = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(true);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }
    // Quản lý Mã giảm giá
    const [isDiscountActive, setDiscountIsActive] = useState(props.active === "manageDiscount" ? true : false);
    const handleClickDiscount = () => {
        setDiscountIsActive(true);
        setDeviceTypeIsActive(false);
        setDashBoardIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setDeviceIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }
    // Quản lý Tầng
    const [isFloorActive, setFloorIsActive] = useState(props.active === "manageFloor" ? true : false);
    const handleClickFloor = () => {
        setFloorIsActive(true);
        setDiscountIsActive(false);
        setDeviceTypeIsActive(false);
        setDashBoardIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setDeviceIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }
    // Quản lý Dịch vụ
    const [isServiceActive, setServiceIsActive] = useState(props.active === "manageService" ? true : false);
    const handleClickService = () => {
        setServiceIsActive(true);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }
    // Quản lý Loại phòng - Khách sạn
    const [isRoomTypeActive, setRoomTypeIsActive] = useState(props.active === "manageRoomType" ? true : false);
    const handleClickRoomType = () => {
        setRoomTypeIsActive(true);
        setFloorIsActive(false);
        setDiscountIsActive(false);
        setDeviceTypeIsActive(false);
        setDashBoardIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setDeviceIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }
    // Quản lý Phòng
    const [isRoomActive, setRoomIsActive] = useState(props.active === "manageRoom" ? true : false);
    const handleClickRoom = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(true);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }
    // Quản lý Khách hàng
    const [isCustomerActive, setCustomerIsActive] = useState(props.active === "manageCustomer" ? true : false);
    const handleClickCustomer = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(true);
        setEmployeeIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }
    // Quản lý Nhân viên
    const [isEmployeeActive, setEmployeeIsActive] = useState(props.active === "manageEmployee" ? true : false);
    const handleClickEmployee = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(true);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setRoomBookingIsActive(false);
    }
    // Quản lý Chức vụ nhân viên
    const [isPositionActive, setPositionIsActive] = useState(props.active === "managePosition" ? true : false);
    const handleClickPosition = () => {
        setPositionIsActive(true);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setRoomBookingIsActive(false);
    }
    // Quản lý Đặt phòng
    const [isRoomBookingActive, setRoomBookingIsActive] = useState(props.active === "manageRoomBooking" ? true : false);
    const handleClickRoomBooking = () => {
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(true);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
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
                <SideBarTop>

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
                    <LinkStyled to={"/manageService"} className={isServiceActive ? "active" : null} onClick={handleClickService}>
                        <IconSpan>
                            <SpaOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Dịch vụ - Khách sạn</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageRoomType"} className={isRoomTypeActive ? "active" : null} onClick={handleClickRoomType}>
                        <IconSpan>
                            <ClassOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Loại phòng - Khách sạn</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageRoom"} className={isRoomActive ? "active" : null} onClick={handleClickRoom}>
                        <IconSpan>
                            <MeetingRoomOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Phòng - Khách sạn</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageCustomer"} className={isCustomerActive ? "active" : null} onClick={handleClickCustomer}>
                        <IconSpan>
                            <PersonOutlineOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Khách hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/managePosition"} className={isPositionActive ? "active" : null} onClick={handleClickPosition}>
                        <IconSpan>
                            <BadgeOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Chức vụ nhân viên</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageEmployee"} className={isEmployeeActive ? "active" : null} onClick={handleClickEmployee}>
                        <IconSpan>
                            <AssignmentIndOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Nhân viên</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageRoomBooking"} className={isRoomBookingActive ? "active" : null} onClick={handleClickRoomBooking}>
                        <IconSpan>
                            <InventoryOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Đặt phòng</H3>
                    </LinkStyled>



                </SideBarTop>
            



                <SideBarBottom>
                    <LinkStyled to={"/"} onClick={() => handleDangXuat()}>
                        <IconSpan >
                            <LogoutOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Đăng xuất</H3>
                    </LinkStyled>
                </SideBarBottom>
            </SideBar>
        </Container>

    );
};

export default Aside;