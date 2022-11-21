import { AssignmentIndOutlined, BadgeOutlined, BakeryDiningOutlined, CakeOutlined, CategoryOutlined, ClassOutlined, ConnectedTvOutlined, DiscountOutlined, DomainAddOutlined, FastfoodOutlined, FoodBankOutlined, ForumOutlined, GridViewOutlined, InventoryOutlined, LiquorOutlined, LogoutOutlined, MeetingRoomOutlined, MenuBookOutlined, MicExternalOnOutlined, PendingActionsOutlined, PersonOutlineOutlined, RamenDiningOutlined, SpaOutlined, SportsBarOutlined, TableRestaurantOutlined, VrpanoOutlined } from "@mui/icons-material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import styled from "styled-components";
import { logout } from '../../redux/callsAPI';

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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
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
        setFoodTypeIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Loại món ăn
    const [isFoodTypeActive, setFoodTypeIsActive] = useState(props.active === "manageFoodType" ? true : false);
    const handleClickFoodType = () => {
        setFoodTypeIsActive(true);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setFoodIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Món ăn
    const [isFoodActive, setFoodIsActive] = useState(props.active === "manageFood" ? true : false);
    const handleClickFood = () => {
        setFoodIsActive(true);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setFoodVoteIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Bình luận - Đánh giá Món ăn - Nhà hàng
    const [isFoodVoteActive, setFoodVoteIsActive] = useState(props.active === "manageFoodVote" ? true : false);
    const handleClickFoodVote = () => {
        setFoodVoteIsActive(true);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setPartyBookingTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Loại Đặt tiệc - Nhà hàng
    const [isPartyBookingTypeActive, setPartyBookingTypeIsActive] = useState(props.active === "managePartyBookingType" ? true : false);
    const handleClickPartyBookingType = () => {
        setPartyBookingTypeIsActive(true);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Loại Sảnh tiệc - Nhà hàng
    const [isPartyHallTypeActive, setPartyHallTypeIsActive] = useState(props.active === "managePartyHallType" ? true : false);
    const handleClickPartyHallType = () => {
        setPartyHallTypeIsActive(true);
        setPartyBookingTypeIsActive(false);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setPartyServiceTypeIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Loại Dịch vụ tiệc - Nhà hàng
    const [isPartyServiceTypeActive, setPartyServiceTypeIsActive] = useState(props.active === "managePartyServiceType" ? true : false);
    const handleClickPartyServiceType = () => {
        setPartyServiceTypeIsActive(true);
        setPartyHallTypeIsActive(false);
        setPartyBookingTypeIsActive(false);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setTableTypeIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Loại bàn - Nhà hàng
    const [isTableTypeActive, setTableTypeIsActive] = useState(props.active === "manageTableType" ? true : false);
    const handleClickTableType = () => {
        setTableTypeIsActive(true);
        setPartyServiceTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyBookingTypeIsActive(false);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setSetMenuIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Set menu - Nhà hàng
    const [isSetMenuActive, setSetMenuIsActive] = useState(props.active === "manageSetMenu" ? true : false);
    const handleClickSetMenu = () => {
        setSetMenuIsActive(true);
        setTableTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyBookingTypeIsActive(false);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setPartyServiceIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Dịch vụ Tiệc - Nhà hàng
    const [isPartyServiceActive, setPartyServiceIsActive] = useState(props.active === "managePartyService" ? true : false);
    const handleClickPartyService = () => {
        setPartyServiceIsActive(true);
        setSetMenuIsActive(false);
        setTableTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyBookingTypeIsActive(false);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setPartyHallIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Sảnh Tiệc - Nhà hàng
    const [isPartyHallActive, setPartyHallIsActive] = useState(props.active === "managePartyHall" ? true : false);
    const handleClickPartyHall = () => {
        setPartyHallIsActive(true);
        setPartyServiceIsActive(false);
        setSetMenuIsActive(false);
        setTableTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyBookingTypeIsActive(false);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setTableBookingIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Bàn ăn - Nhà hàng
    const [isTableBookingActive, setTableBookingIsActive] = useState(props.active === "manageTableBooking" ? true : false);
    const handleClickTableBooking = () => {
        setTableBookingIsActive(true);
        setPartyHallIsActive(false);
        setPartyServiceIsActive(false);
        setSetMenuIsActive(false);
        setTableTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyBookingTypeIsActive(false);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setPartyBookingIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Đặt tiệc - Nhà hàng
    const [isPartyBookingActive, setPartyBookingIsActive] = useState(props.active === "managePartyBooking" ? true : false);
    const handleClickPartyBooking = () => {
        setPartyBookingIsActive(true);
        setTableBookingIsActive(false);
        setPartyHallIsActive(false);
        setPartyServiceIsActive(false);
        setSetMenuIsActive(false);
        setTableTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyBookingTypeIsActive(false);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
        setDeviceIsActive(false);
        setDiscountIsActive(false);
        setFloorIsActive(false);
        setRoomTypeIsActive(false);
        setServiceIsActive(false);
        setPositionIsActive(false);
        setTableBookingOrderIsActive(false);
    }
    // Quản lý Đặt bàn - Nhà hàng
    const [isTableBookingOrderActive, setTableBookingOrderIsActive] = useState(props.active === "manageTableBookingOrder" ? true : false);
    const handleClickTableBookingOrder = () => {
        setTableBookingOrderIsActive(true);
        setPartyBookingIsActive(false);
        setTableBookingIsActive(false);
        setPartyHallIsActive(false);
        setPartyServiceIsActive(false);
        setSetMenuIsActive(false);
        setTableTypeIsActive(false);
        setPartyServiceTypeIsActive(false);
        setPartyHallTypeIsActive(false);
        setPartyBookingTypeIsActive(false);
        setFoodVoteIsActive(false);
        setFoodIsActive(false);
        setFoodTypeIsActive(false);
        setDashBoardIsActive(false);
        setDeviceTypeIsActive(false);
        setRoomIsActive(false);
        setCustomerIsActive(false);
        setEmployeeIsActive(false);
        setRoomBookingIsActive(false);
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
                    <LinkStyled to={"/manageFoodType"} className={isFoodTypeActive ? "active" : null} onClick={handleClickFoodType}>
                        <IconSpan>
                            <FastfoodOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Loại món ăn - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageFood"} className={isFoodActive ? "active" : null} onClick={handleClickFood}>
                        <IconSpan>
                            <RamenDiningOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Món ăn - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageFoodVote"} className={isFoodVoteActive ? "active" : null} onClick={handleClickFoodVote}>
                        <IconSpan>
                            <ForumOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Bình luận - Đánh giá Món ăn</H3>
                    </LinkStyled>
                    <LinkStyled to={"/managePartyBookingType"} className={isPartyBookingTypeActive ? "active" : null} onClick={handleClickPartyBookingType}>
                        <IconSpan>
                            <CakeOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Loại Đặt tiệc - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/managePartyHallType"} className={isPartyHallTypeActive ? "active" : null} onClick={handleClickPartyHallType}>
                        <IconSpan>
                            <FoodBankOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Loại Sảnh tiệc - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/managePartyHall"} className={isPartyHallActive ? "active" : null} onClick={handleClickPartyHall}>
                        <IconSpan>
                            <BakeryDiningOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Sảnh tiệc - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/managePartyServiceType"} className={isPartyServiceTypeActive ? "active" : null} onClick={handleClickPartyServiceType}>
                        <IconSpan>
                            <MicExternalOnOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Loại Dịch vụ tiệc - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/managePartyService"} className={isPartyServiceActive ? "active" : null} onClick={handleClickPartyService}>
                        <IconSpan>
                            <PendingActionsOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Dịch vụ Tiệc - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageSetMenu"} className={isSetMenuActive ? "active" : null} onClick={handleClickSetMenu}>
                        <IconSpan>
                            <MenuBookOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Set Menu - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageTableType"} className={isTableTypeActive ? "active" : null} onClick={handleClickTableType}>
                        <IconSpan>
                            <VrpanoOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Loại bàn ăn - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageTableBooking"} className={isTableBookingActive ? "active" : null} onClick={handleClickTableBooking}>
                        <IconSpan>
                            <TableRestaurantOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Bàn ăn - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/managePartyBooking"} className={isPartyBookingActive ? "active" : null} onClick={handleClickPartyBooking}>
                        <IconSpan>
                            <LiquorOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Đặt tiệc - Nhà hàng</H3>
                    </LinkStyled>
                    <LinkStyled to={"/manageTableBookingOrder"} className={isTableBookingOrderActive ? "active" : null} onClick={handleClickTableBookingOrder}>
                        <IconSpan>
                            <SportsBarOutlined style={{ fontSize: "1.6rem", transition: "all 300ms ease" }} />
                        </IconSpan>
                        <H3>Quản lý Đặt bàn - Nhà hàng</H3>
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