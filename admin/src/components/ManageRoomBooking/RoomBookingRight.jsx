import { Add, CategoryOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import RightTop from "../Dashboard/RightTop";
import Toast from "../Toast";
import Modal from "./Modal";

// SERVICES
import * as RoomBookingOrderService from "../../service/RoomBookingOrderService";

const Container = styled.div`
margin-top: 1.4rem;
`

// Sales Analytics
const SalesAnalytics = styled.div`
    margin-top: 2rem;
`

const H2 = styled.h2`
    margin-bottom: 0.8rem;
`

const Info = styled.div`

`

const Icon = styled.div`
    padding: 0.6rem;
    color: var(--color-white);
    border-radius: 50%;
    background: var(--color-primary);
    display: flex;
`

const Item = styled.div`
    background: var(--color-white);
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.7rem;
    padding: 1.4rem var(--card-padding);
    border-radius: var(--border-radius-3);
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
    &:hover {
        box-shadow: none;
    }
    &.offline ${Icon} {
        background: var(--color-danger);
        
    }
    &.customers ${Icon} {
        background: var(--color-success);
    }
    &.add-product {
        background-color: transparent;
        border: 2px dashed var(--color-primary);
        color: var(--color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
            background: var(--color-primary);
            color: white;
            cursor: pointer;
        }
        & div {
            display: flex;
            justify-items: center;
            gap: 0.6rem;
        }
    }
`

const ItemRight = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin: 0;
    width: 100%;
`

const RoomBookingRight = ({ reRenderData, setReRenderData }) => {
    // Thứ ngày tháng
    let today = new Date();
    let todayday = today.getDay();
    let thu;
    switch (todayday) {
        case 1: thu = "hai"; break;
        case 2: thu = "ba"; break;
        case 3: thu = "tư"; break;
        case 4: thu = "năm"; break;
        case 5: thu = "sáu"; break;
        case 6: thu = "bảy"; break;
        case 7: thu = "chủ nhật"; break;
        default: thu = "chủ nhật";
    }
    let ngaythangnam = "Thứ " + thu + ", " + today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

    // Số lượng Đặt phòng
    const [roomBookingOrderQuantity, setRoomBookingOrderQuantity] = useState();
    useEffect(() => {
        const getRoomBookingOrderQuantity = async () => {
            try {
                const roomQuantityRes = await RoomBookingOrderService.getQuantityRoomBooking();
                setRoomBookingOrderQuantity(roomQuantityRes.data.data.quantityRoomBooking);
            } catch (err) {
                console.log("Lỗi: ", err.response);
            }
        }
        getRoomBookingOrderQuantity();
    }, [reRenderData]);
    console.log("Số lượng Đặt phòng: ", roomBookingOrderQuantity);

    // ===== Modal =====
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("")

    const openModal = (modal) => {
        setShowModal(prev => !prev);
        setTypeModal(modal.type);
    }

    // ===== TOAST =====
    const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
    const toastRef = useRef(null);  // useRef có thể gọi các hàm bên trong của Toast
    // bằng các dom event, javascript, ...

    const showToastFromOut = (dataShow) => {
        console.log("showToastFromOut da chay", dataShow);
        setDataToast(dataShow);
        toastRef.current.show();
    }

    // PHÂN QUYỀN
    const admin = useSelector((state) => state.admin.currentAdmin);
    const authorizationAdmin = (admin) => {
        if (!admin) return;
        const positionId = admin.position_id;
        switch (positionId) {
            case 1:
                // Quản trị viên
                return (
                    <>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBooking" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Đặt phòng Từng thành phố dựa vào Doanh thu cả năm</h3>
                        </Item>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBookingTotal" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn</h3>
                        </Item>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBookingByType" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn của Loại phòng</h3>
                        </Item>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBookingByCustomer" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn của Khách hàng</h3>
                        </Item>
                    </>
                );
            case 11:
                // Giám đốc
                return (
                    <>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBooking" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Đặt phòng Từng thành phố dựa vào Doanh thu cả năm</h3>
                        </Item>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBookingTotal" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn</h3>
                        </Item>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBookingByType" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn của Loại phòng</h3>
                        </Item>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBookingByCustomer" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn của Khách hàng</h3>
                        </Item>
                    </>
                );
            case 7:
                // Quản lý Khách sạn
                return (
                    <>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBooking" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Đặt phòng Từng thành phố dựa vào Doanh thu cả năm</h3>
                        </Item>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBookingTotal" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn</h3>
                        </Item>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBookingByType" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn của Loại phòng</h3>
                        </Item>
                        <Item className="add-product"
                            onClick={() => openModal({ type: "statisticRoomBookingByCustomer" })}
                        >
                            <Add />
                            <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn của Khách hàng</h3>
                        </Item>
                    </>
                );
            default: return null;
        }
    }

    return (
        <Container>
            <RightTop />
            <SalesAnalytics>
                <H2>Phân tích Đặt phòng</H2>
                <Item className="online">
                    <Icon>
                        <CategoryOutlined />
                    </Icon>
                    <ItemRight>
                        <Info>
                            <h3>SỐ LƯỢNG ĐẶT PHÒNG</h3>
                            <small class="text-muted">{ngaythangnam}</small>
                        </Info>
                        <h3 className="success" style={{ fontSize: "1.2rem" }}>{roomBookingOrderQuantity}</h3>
                    </ItemRight>
                </Item>

                {authorizationAdmin(admin)}
                {/* <Item className="add-product"
                    onClick={() => openModal({ type: "statisticRoomBooking" })}
                >
                    <Add />
                    <h3>Tìm kiếm &amp; Thống kê Đặt phòng Từng thành phố dựa vào Doanh thu cả năm</h3>
                </Item>
                <Item className="add-product"
                    onClick={() => openModal({ type: "statisticRoomBookingTotal" })}
                >
                    <Add />
                    <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn</h3>
                </Item>
                <Item className="add-product"
                    onClick={() => openModal({ type: "statisticRoomBookingByType" })}
                >
                    <Add />
                    <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn của Loại phòng</h3>
                </Item>
                <Item className="add-product"
                    onClick={() => openModal({ type: "statisticRoomBookingByCustomer" })}
                >
                    <Add />
                    <h3>Tìm kiếm &amp; Thống kê Doanh thu Đặt phòng - Khách sạn của Khách hàng</h3>
                </Item> */}
            </SalesAnalytics>

            {/* ==== MODAL ==== */}
            <Modal
                showModal={showModal}   //state Đóng mở modal
                setShowModal={setShowModal} //Hàm Đóng mở modal
                type={typeModal}    //Loại modal
                setReRenderData={setReRenderData}   //Hàm rerender khi dữ liệu thay đổi
                showToastFromOut={showToastFromOut} //Hàm Hiện toast
            />

            {/* ==== TOAST ==== */}
            <Toast
                ref={toastRef}
                dataToast={dataToast}   // Thông tin cần hiện lên: Đối tượng { message,type }
            />
        </Container >
    );
};

export default RoomBookingRight;