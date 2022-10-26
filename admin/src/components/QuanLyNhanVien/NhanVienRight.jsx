import styled from "styled-components";
import { Add, CategoryOutlined } from "@mui/icons-material";
import RightTop from "../Dashboard/RightTop";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import Toast from "./Toast";

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

const NhanVienRight = ({ reRenderData, setReRenderData }) => {
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

    // Số lượng thú cưng
    const [soLuongNhanVien, setSoLuongNhanVien] = useState();
    useEffect(() => {
        const getSoLuongNhanVien = async () => {
            try {
                const soluongnhanvienres = await axios.post("http://localhost:3001/api/user/getSoLuongNhanVien");
                setSoLuongNhanVien(soluongnhanvienres.data[0].soluongnhanvien);
            } catch (err) {
                console.log("Lỗi: ", err);
            }
        }
        getSoLuongNhanVien();
    }, [reRenderData]);
    console.log("Số lượng nhân viên: ", soLuongNhanVien);

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

    return (
        <Container>
            <RightTop />
            <SalesAnalytics>
                <H2>Staff Analytics</H2>
                <Item className="online">
                    <Icon>
                        <CategoryOutlined />
                    </Icon>
                    <ItemRight>
                        <Info>
                            <h3>SỐ LƯỢNG NHÂN VIÊN</h3>
                            <small class="text-muted">{ngaythangnam}</small>
                        </Info>
                        <h3 className="success" style={{ fontSize: "1.2rem" }}>{soLuongNhanVien}</h3>
                    </ItemRight>
                </Item>
                <Item className="add-product"
                    onClick={() => openModal({ type: "themnhanvien" })}
                >
                    <Add />
                    <h3>Thêm nhân viên</h3>
                </Item>
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

export default NhanVienRight;