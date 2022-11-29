import { LightMode, DarkMode, ShoppingCart, LocalMall, Person, Add, PeopleOutlineOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import RightTop from "./RightTop";
import axios from "axios";
import { format_money } from "../../utils/utils";

// SERVICES
import * as AdminLogService from "../../service/AdminLogService";
import * as TableBookingService from "../../service/TableBookingService";
import * as RoomService from "../../service/RoomService";
import * as PartyHallService from "../../service/PartyHallService";
import * as EmployeeService from "../../service/EmployeeService";

const Container = styled.div`
    margin-top: 1.4rem;
`

const Info = styled.div`

`

const ProfilePhoto = styled.div`
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    overflow: hidden;
`

const Img = styled.img`
object-fit: cover;
width: 100%;
height: 100%;
`

const Small = styled.small`

`

// RECENT UPDATES
const RecentUpdates = styled.div`
    margin-top: 1rem;
`

const H2 = styled.h2`
    margin-bottom: 0.8rem;
`

const Updates = styled.div`
    background: var(--color-white);
    padding: var(--card-padding);
    border-radius: var(--card-border-radius);
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
    &:hover {
        box-shadow: none;
    }
`

const Update = styled.div`
    display: flex;
    grid-template-columns: 2.6rem auto;
    gap: 1rem;
    margin-bottom: 1rem;
`

const Message = styled.div`
    width: 80%;
`

// Sales Analytics
const SalesAnalytics = styled.div`
    margin-top: 2rem;
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

const Right = () => {
    // Các state cần thiết
    const [adminLogList, setAdminLogList] = useState([]);
    const [soDonHang, setSoDonHang] = useState("");
    const [doanhThuHomNay, setDoanhThuHomNay] = useState("");
    const [donCanDuyetHomNay, setDonCanDuyetHomNay] = useState("");

    const [roomQuantity, setRoomQuantity] = useState();
    const [partyHallQuantity, setPartyHallQuantity] = useState();
    const [quantityTableBooking, setQuantityTableBooking] = useState();
    const [employeeQuantity, setEmployeeQuantity] = useState();

    useEffect(() => {
        const getAdminLogs = async () => {
            try {
                const adminLogRes = await AdminLogService.getTop5AdminLogs();
                setAdminLogList(adminLogRes.data.data);
            } catch (err) {
                console.log("Lỗi khi lấy Adminlog: ", err.response);
            }
        }
        const getRoomQuantity = async () => {
            try {
                const roomQuantityRes = await RoomService.getQuantityRooms();
                setRoomQuantity(roomQuantityRes.data.data.quantityRoom);
            } catch (err) {
                console.log("Lỗi: ", err.response);
            }
        }
        const getPartyHallQuantity = async () => {
            try {
                const partyHallQuantityRes = await PartyHallService.getQuantityPartyHall();
                setPartyHallQuantity(partyHallQuantityRes.data.data.quantityPartyHall);
            } catch (err) {
                console.log("Lỗi: ", err.response);
            }
        }
        const getQuantityTableBooking = async () => {
            try {
                const quantityTableBookingRes = await TableBookingService.getQuantityTableBooking();
                setQuantityTableBooking(quantityTableBookingRes.data.data.quantityTableBooking);
            } catch (err) {
                console.log("Lỗi: ", err);
            }
        }
        const getEmployeeQuantity = async () => {
            try {
                const employeeQuantityRes = await EmployeeService.getQuantityEmployee();
                setEmployeeQuantity(employeeQuantityRes.data.data.quantityEmployee);
            } catch (err) {
                console.log("Lỗi: ", err.response);
            }
        }
        getEmployeeQuantity();
        getQuantityTableBooking();
        getRoomQuantity();
        getPartyHallQuantity();
        getAdminLogs();
        return () => {
            setSoDonHang("");
        }
    }, [])
    return (
        <Container>
            <RightTop />
            {/* END OF TOP */}

            <RecentUpdates>
                <H2>Nhật ký Hoạt động</H2>
                <Updates>
                    {
                        adminLogList
                            ?
                            adminLogList.map((adminLog, key) => {
                                return (
                                    <Update>
                                        <ProfilePhoto>
                                            <Img src={adminLog.employee_image} />
                                        </ProfilePhoto>
                                        <Message>
                                            {/* <p><b>Monkey D Luffy</b> received his order of Hoàng Long tech GPS drone</p> */}
                                            <p>{adminLog.employee_first_name + " " + adminLog.employee_last_name + adminLog.admin_log_content}</p>
                                            <Small class="text-muted">{adminLog.admin_log_date}</Small>
                                        </Message>
                                    </Update>
                                );
                            })
                            : null
                    }
                </Updates>
            </RecentUpdates>
            {/* END OF RECENT UPDATES */}

            <SalesAnalytics>
                <H2>Quy mô Nhà hàng Khách sạn</H2>
                <Item className="online">
                    <Icon>
                        <ShoppingCart />
                    </Icon>
                    <ItemRight>
                        <Info>
                            <h3>SỐ PHÒNG - KHÁCH SẠN</h3>
                            <small class="text-muted">24 giờ trước</small>
                        </Info>
                        <h5 className="success">+39%</h5>
                        <h3><span style={{ textDecoration: "underline" }}><b>{roomQuantity ? roomQuantity : "Chưa có"}</b></span></h3>
                    </ItemRight>
                </Item>
                <Item className="offline">
                    <Icon>
                        <LocalMall />
                    </Icon>
                    <ItemRight>
                        <Info>
                            <h3>SỐ SẢNH - NHÀ HÀNG</h3>
                            <small class="text-muted">24 giờ trước</small>
                        </Info>
                        <h5 className="danger">-17%</h5>
                        <h3><span style={{ textDecoration: "underline" }}><b>{partyHallQuantity ? partyHallQuantity : "Chưa có"}</b></span></h3>
                    </ItemRight>
                </Item>
                <Item className="customers">
                    <Icon>
                        <Person />
                    </Icon>
                    <ItemRight>
                        <Info>
                            <h3>SỐ BÀN ĂN - NHÀ HÀNG</h3>
                            <small class="text-muted">24 giờ trước</small>
                        </Info>
                        <h5 className="success">+25%</h5>
                        <h3><h3><span style={{ textDecoration: "underline" }}><b>{quantityTableBooking ? quantityTableBooking : "Chưa có"}</b></span></h3></h3>
                    </ItemRight>
                </Item>
                <Item className="add-product">
                    <PeopleOutlineOutlined />
                    <h3>Cùng với tập thể gồm: {employeeQuantity ? employeeQuantity : ""} Nhân viên</h3>
                </Item>
            </SalesAnalytics>

        </Container>
    );
};

export default Right;