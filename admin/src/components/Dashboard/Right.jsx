import { LightMode, DarkMode, ShoppingCart, LocalMall, Person, Add } from "@mui/icons-material";
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import RightTop from "./RightTop";
import axios from "axios";
import {format_money} from "../../utils/utils";

// SERVICES
import * as AdminLogService from "../../service/AdminLogService";

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
   
    useEffect(() => {
        const getAdminLogs = async () => {
            try {
                const adminLogRes = await AdminLogService.getTop5AdminLogs();
                setAdminLogList(adminLogRes.data.data);
            } catch (err) {
                console.log("Lỗi khi lấy Adminlog: ", err.response);
            }
        }
        // // SỐ ĐƠN HÀNG HÔM NAY
        // const getSoDonHangHomNay = async () => {
        //     try {
        //         const sodonhanghomnayres = await axios.post("http://localhost:3001/api/products/getSoDonHangHomNay", {});
        //         console.log("sodonhanghomnayres: ", sodonhanghomnayres);
        //         setSoDonHang(sodonhanghomnayres.data[0].soluongdathang);
        //     } catch (err) {
        //         console.log("Lỗi khi lấy sodonhanghomnayres");
        //     }
        // }
        // // SỐ ĐƠN HÀNG HÔM NAY
        // const getDoanhThuHomNay = async () => {
        //     try {
        //         const doanhthuhomnayres = await axios.post("http://localhost:3001/api/products/getDoanhThuHomNay", {});
        //         console.log("doanhthuhomnayres: ", doanhthuhomnayres);
        //         setDoanhThuHomNay(format_money((doanhthuhomnayres.data[0].tongtien).toString()));
        //     } catch (err) {
        //         console.log("Lỗi khi lấy doanhthuhomnayres");
        //     }
        // }
        // // SỐ ĐƠN HÀNG HÔM NAY
        // const getDonCanDuyetuHomNay = async () => {
        //     try {
        //         const doncanduyetres = await axios.post("http://localhost:3001/api/products/getDonCanDuyetuHomNay", {});
        //         console.log("doncanduyetres: ", doncanduyetres);
        //         setDonCanDuyetHomNay(doncanduyetres.data[0].sodonchoduyet);
        //     } catch (err) {
        //         console.log("Lỗi khi lấy doncanduyetres");
        //     }
        // }
        getAdminLogs();
        // getSoDonHangHomNay();
        // getDoanhThuHomNay();
        // getDonCanDuyetuHomNay();
        return () => {
            setSoDonHang("");

        }
    }, [])
    return (
        <Container>
            <RightTop />
            {/* END OF TOP */}

            <RecentUpdates>
                <H2>Recent Updates</H2>
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
                <H2>Sales Analytics</H2>
                <Item className="online">
                    <Icon>
                        <ShoppingCart />
                    </Icon>
                    <ItemRight>
                        <Info>
                            <h3>TODAY ORDERS</h3>
                            <small class="text-muted">Last 24 Hours</small>
                        </Info>
                        <h5 className="success">+39%</h5>
                        <h3>{soDonHang === "" ? "Chưa có" : soDonHang}</h3>
                    </ItemRight>
                </Item>
                <Item className="offline">
                    <Icon>
                        <LocalMall />
                    </Icon>
                    <ItemRight>
                        <Info>
                            <h3>TODAY SALES</h3>
                            <small class="text-muted">Last 24 Hours</small>
                        </Info>
                        <h5 className="danger">-17%</h5>
                        <h3>{doanhThuHomNay === "" ? "Chưa có" : doanhThuHomNay} <span style={{ textDecoration: "underline" }}><b>đ</b></span></h3>
                    </ItemRight>
                </Item>
                <Item className="customers">
                    <Icon>
                        <Person />
                    </Icon>
                    <ItemRight>
                        <Info>
                            <h3>ĐƠN CẦN DUYỆT</h3>
                            <small class="text-muted">Last 24 Hours</small>
                        </Info>
                        <h5 className="success">+25%</h5>
                        <h3>{ donCanDuyetHomNay === "" ? "Chưa có" : donCanDuyetHomNay }</h3>
                    </ItemRight>
                </Item>
                <Item className="add-product">
                    <Add />
                    <h3>Thêm thú cưng</h3>
                </Item>
            </SalesAnalytics>

        </Container>
    );
};

export default Right;