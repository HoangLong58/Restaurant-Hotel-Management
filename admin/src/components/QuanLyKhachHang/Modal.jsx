import styled from "styled-components";
import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import "../../css/main.css";
import axios from "axios";

const Background = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;


    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    animation: fadeIn linear 0.1s;
`

const ModalWrapper = styled.div`
    width: 500px;
    height: auto;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: var(--color-white);
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    z-index: 10;
    border-radius: 10px;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
`

const ThemThuCungWrapper = styled.div`
    width: auto;
    height: auto;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: var(--color-white);
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    z-index: 10;
    border-radius: 10px;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
`

const ChiTietWrapper = styled.div`
    width: 70%;
    height: auto;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: var(--color-white);
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    z-index: 10;
    border-radius: 10px;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
`

const ModalImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 10px 0 0 10px;
    background: var(--color-dark);
`

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #141414;

    p {
        margin-bottom: 1rem;
    }
`

const CloseModalButton = styled.span`
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
`

const Button = styled.div`
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
`

const H1 = styled.h1`
margin-top: 30px;
`

const ModalForm = styled.form`
width: 100%;    
height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: var(--card-border-radius);
    padding: var(--card-padding);
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
    &:hover {
        box-shadow: none;
    }
`

const ModalFormItem = styled.div`
margin: 10px 30px;
display: flex;
flex-direction: column;
`

const ModalChiTietItem = styled.div`
margin: 2px 30px;
display: flex;
flex-direction: column;
`

const FormSpan = styled.span`
font-size: 1.2rem;
height: 600;
color: var(--color-dark-light);
margin-bottom: 3px;
`
const FormInput = styled.input`
background-color: var(--color-white);
color: var(--color-dark);
width: auto;
padding: 12px 20px;
margin: 8px 0;
display: inline-block;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
&:focus {
    border: 1px solid var(--color-success);
    box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
}
`

const ButtonUpdate = styled.div`
    width: 100%;
    margin: 18px 0px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
`

const ButtonContainer = styled.div`
    position: relative;
    float: right;
    margin: 0 22px 22px 0;
    &::after {
        content: "";
        border: 2px solid black;
        position: absolute;
        top: 5px;
        left: 5px;
        right: 20px;
        background-color: transperent;
        width: 95%;
        height: 95%;
        z-index: -1;
    }
`

const ButtonClick = styled.button`
    padding: 10px;
    border: 2px solid black;
    background-color: black;
    color: white;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        background-color: #fe6430;
    }
    &:active {
        background-color: #333;
        transform: translate(5px, 5px);
        transition: transform 0.25s;
    }
`

const FormImg = styled.img`
    margin: auto;
    width: 50%;
    object-fit: cover;
    height: 200px;
`

const ChiTietHinhAnh = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin: auto;
`

const ImageWrapper = styled.div`
    display: flex;
    flex-direction: row;
    &img {
        margin: 0px 20px;
    }
`

const FormSelect = styled.select`
    background-color: var(--color-white);
    color: var(--color-dark);
    width: auto;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    &:focus {
        border: 1px solid var(--color-success);
        box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
    }
`

const FormOption = styled.option`
    margin: auto;
`

const FormLabel = styled.label`
    display: flex;
    flex-directory: row;
    // justify-content: center;
    align-items: center;
`

const FormCheckbox = styled.input`
    appearance: auto;
    margin-right: 10px;
`

const FormTextArea = styled.textarea`
    background-color: var(--color-white);
    color: var(--color-dark);
    width: auto;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    &:focus {
        border: 1px solid var(--color-success);
        box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
    }
`

const Modal = ({ showModal, setShowModal, type, khachhang, setReRenderData, handleClose, showToastFromOut }) => {
    const modalRef = useRef();
    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            setShowModal(false);
        }
    }

    const keyPress = useCallback(
        (e) => {
            if (e.key === 'Escape' && showModal) {
                setShowModal(false);
            }
        },
        [setShowModal, showModal]
    );

    useEffect(
        () => {
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);
        },
        [keyPress]
    );
    // =============== Xử lý xóa thú cưng ===============
    const handleXoaKhachHang = async ({ manguoimua, hotennguoimua }) => {
        if (manguoimua !== "") {
            try {
                const deletekhachhangres = await axios.post("http://localhost:3001/api/user/deleteKhachHang", { manguoimua });
                console.log("KQ trả về delete: ", deletekhachhangres);
                setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
                setShowModal(prev => !prev);
                handleClose();  //Đóng thanh tìm kiếm
                const dataShow = { message: "Đã xóa khách hàng " + hotennguoimua + " thành công!", type: "success" };
                showToastFromOut(dataShow);
            } catch (err) {
                console.log("Lỗi Delete khách hàng err: ", err);
            }
        }
    }

    // =============== Xử lý Xem chi tiết thú cưng ===============
    const handleCloseChiTiet = () => {
        setShowModal(prev => !prev);
    }

    const [tenXaHuyenThanhPho, setTenXaHuyenThanhPho] = useState();
    useEffect(() => {
        const getXaPhuongThanhPho = async () => {
            try {
                const xaphuongthanhphores = await axios.post("http://localhost:3001/api/user/getXaPhuongThanhPho", {maxa: khachhang.maxa});
                setTenXaHuyenThanhPho(", " + xaphuongthanhphores.data.tenxa + ", " + xaphuongthanhphores.data.tenquanhuyen + ", " + xaphuongthanhphores.data.tenthanhpho);
            } catch(err) {
                console.log("Lấy xã phường thị trấn, tp thất bại");
            }
        }
        getXaPhuongThanhPho();
    }, [khachhang])
    // ================================================================
    //  =============== Xem chi tiết khách hàng ===============
    if (type === "chitietkhachhang") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết khách hàng</H1>
                            <ModalForm>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <ImageWrapper>
                                            <ChiTietHinhAnh src={khachhang.hinhdaidien} />
                                        </ImageWrapper>
                                    </ModalChiTietItem>
                                    <div style={{ display: "flex", flex: "1" }}>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Họ tên khách hàng:</FormSpan>
                                            <FormInput type="text" value={khachhang.hotennguoimua} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Ngày sinh:</FormSpan>
                                            <FormInput type="text" value={khachhang.ngaysinhnguoimua.substring(0,10)} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Giới tính:</FormSpan>
                                            <FormInput type="text" value={khachhang.gioitinhnguoimua} readOnly />
                                        </ModalChiTietItem>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flex: "1" }}>
                                    <ModalChiTietItem style={{ flex: "1", marginLeft: "26%" }}>
                                        <FormSpan>Địa chỉ khách hàng:</FormSpan>
                                        <FormInput type="text" value={khachhang.diachinguoimua + tenXaHuyenThanhPho} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Email:</FormSpan>
                                        <FormInput type="text" value={khachhang.emailnguoimua} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Số điện thoại:</FormSpan>
                                        <FormInput type="text" value={khachhang.sdtnguoimua} readOnly />
                                    </ModalChiTietItem>
                                </div>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={handleCloseChiTiet}
                                    >Đóng</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={handleCloseChiTiet}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ChiTietWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // // =============== Xóa khách hàng ===============
    if (type === "xoakhachhang") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>Bạn muốn xóa khách hàng <span style={{ color: `var(--color-primary)` }}>{khachhang.hotennguoimua}</span></h1>
                                <p>Thông tin khách hàng không thể khôi phục. Bạn có chắc chắn?</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleXoaKhachHang({ manguoimua: khachhang.manguoimua, hotennguoimua: khachhang.hotennguoimua }) }}
                                        >Đồng ý</ButtonClick>
                                    </ButtonContainer>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => setShowModal(prev => !prev)}
                                        >Hủy bỏ</ButtonClick>
                                    </ButtonContainer>
                                </Button>
                            </ModalContent>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => setShowModal(prev => !prev)}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
};

export default Modal;