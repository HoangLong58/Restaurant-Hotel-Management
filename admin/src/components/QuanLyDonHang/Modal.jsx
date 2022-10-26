import {format_money} from "../../utils/utils";
import styled from "styled-components";
import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import "../../css/main.css";
import axios from "axios";
import { useSelector } from 'react-redux';

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

const Table = styled.table`
    background: var(--color-white);
    width: 100%;
    border-radius: var(--card-border-radius);
    padding: var(--card-padding);
    text-align: center;
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
    &:hover {
        box-shadow: none;
    }
`

const Thead = styled.thead`
    background-color: var(--color-primary);
`

const Tr = styled.tr`
    &:last-child td {
        border: none;
    }
    &:hover {
        background: var(--color-light);
    }
`

const Th = styled.th`

`

const Tbody = styled.tbody`

`

const Td = styled.td`
    height: 2.8rem;
    border-bottom: 1px solid var(--color-light);
`

const Total = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 30px 0 0;
    background: var(--color-white);
    width: 400px;
    border-radius: var(--card-border-radius);
    padding: var(--card-padding);
    text-align: center;
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
    font-size: 1rem;
    &:hover {
        box-shadow: none;
    }
`

const TotalItem = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`

const Modal = ({ showModal, setShowModal, type, donhang, setReRenderData, handleClose, showToastFromOut }) => {
    // Lấy admin từ redux
    const admin = useSelector((state) => state.admin.currentAdmin);

    // Hàm đóng mở modal
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

    // ========== Xử lý Xem chi tiết thú cưng ===============
    const handleCloseChiTiet = () => {
        setShowModal(prev => !prev);
    }

    // Các state khởi tạo
    const [donHangModal, setDonHangModal] = useState();
    const [tenTrangThaiDatHangModal, setTenTrangThaiDatHangModal] = useState();
    const [maDatHangModal, setMaDatHangModal] = useState();
    const [ngayDatHangModal, setNgayDatHangModal] = useState();
    const [hoTenNhanVienModal, setHoTenNhanVienModal] = useState();
    const [emailDatHangModal, setEmailDatHangModal] = useState();
    const [soDienThoaiDatHangModal, setSoDienThoaiDatHangModal] = useState();
    const [hoTenDatHangModal, setHoTenDatHangModal] = useState();
    const [diaChiDatHangModal, setDiaChiDatHangModal] = useState();
    const [ghiChuDatHangModal, setGhiChuDatHangModal] = useState();
    const [chiTietDatHangModal, setChiTietDatHangModal] = useState([]);
    const [tongTienDatHangModal, setTongTienDatHangModal] = useState();
    useEffect(() => {
        const getChiTietDonHang = async () => {
            try {
                const chitietdonhangres = await axios.post("http://localhost:3001/api/order/getChiTietDonHang", { madathang: donhang.madathang });
                console.log("Kết quả chi tiết đơn hàng: ", chitietdonhangres);
                setDonHangModal(chitietdonhangres.data);
                setTenTrangThaiDatHangModal(chitietdonhangres.data[0].tentrangthaidathang);
                setMaDatHangModal(chitietdonhangres.data[0].madathang);
                setNgayDatHangModal(chitietdonhangres.data[0].ngaydathang.substring(0, 10));
                setHoTenNhanVienModal(chitietdonhangres.data[0].hotennhanvien);
                setEmailDatHangModal(chitietdonhangres.data[0].emaildathang);
                setSoDienThoaiDatHangModal(chitietdonhangres.data[0].sodienthoaidathang);
                setHoTenDatHangModal(chitietdonhangres.data[0].hotendathang);
                setDiaChiDatHangModal(chitietdonhangres.data[0].diachidathang + ", " + chitietdonhangres.data[0].tenxa + ", " + chitietdonhangres.data[0].tenquanhuyen + ", " + chitietdonhangres.data[0].tenthanhpho);
                setGhiChuDatHangModal(chitietdonhangres.data[0].ghichudathang);
                setTongTienDatHangModal(format_money((chitietdonhangres.data[0].tongtiendathang).toString()));
            } catch (err) {
                console.log("Lỗi lấy đơn đặt mua: ", err);
            }
        }
        const getThuCungChiTiet = async () => {
            try {
                const thucungchitietres = await axios.post("http://localhost:3001/api/order/getChiTietThuCung", { madathang: donhang.madathang });
                console.log("Kết quả thucungchitietres: ", thucungchitietres);
                setChiTietDatHangModal(thucungchitietres.data);
            } catch (err) {
                console.log("Lỗi lấy chi tiết thú cưng đặt hàng: ", err);
            }
        }
        getThuCungChiTiet();
        getChiTietDonHang();
    }, [donhang])
    console.log("chiTietDatHangModal: ", chiTietDatHangModal);

    // DUYỆT ĐƠN
    const DuyetDon = async ({ tentrangthaidathang, madathang, manhanvien, hotennhanvien, hinhdaidiennhanvien }) => {
        console.log("Mã đặt hàng, mã nhân viên: ", tentrangthaidathang, madathang, manhanvien);
        if (tentrangthaidathang === "Chờ xác nhận") {
            const duyetdonres = await axios.post("http://localhost:3001/api/order/duyetDon", { madathang, manhanvien, hotennhanvien, hinhdaidiennhanvien });
            if (duyetdonres.data.message === "Duyệt đơn thành công") {
                const dataShow = { message: "Duyệt đơn hàng có mã " + madathang + " thành công!", type: "success" };
                showToastFromOut(dataShow);
                setShowModal(prev => !prev);
                setReRenderData(prev => !prev);
                handleClose();  //Đóng thanh tìm kiếm
            } else {
                const dataShow = { message: "Có lỗi khi duyệt đơn đặt mua có mã " + madathang, type: "danger" };
                showToastFromOut(dataShow);
                setShowModal(prev => !prev);
                setReRenderData(prev => !prev);
                handleClose();  //Đóng thanh tìm kiếm
            }
        } else {
            const dataShow = { message: "Đơn đặt mua " + madathang + " đã được duyệt rồi ", type: "danger" };
            showToastFromOut(dataShow);
            setShowModal(prev => !prev);
            setReRenderData(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm
        }
    }

    // TỪ CHỐI ĐƠN
    const TuChoiDon = async ({ tentrangthaidathang, madathang, manhanvien, hotennhanvien, hinhdaidiennhanvien }) => {
        const tuchoidonres = await axios.post("http://localhost:3001/api/order/tuChoiDon", { madathang, manhanvien, hotennhanvien, hinhdaidiennhanvien });
        if (tuchoidonres.data.message === "Từ chối đơn thành công") {
            const dataShow = { message: "Bạn đã từ chối đơn đặt mua có mã " + madathang, type: "success" };
            showToastFromOut(dataShow);
            setShowModal(prev => !prev);
            setReRenderData(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm
        } else {
            const dataShow = { message: "Có lỗi khi từ chối đơn đặt mua có mã " + madathang, type: "danger" };
            showToastFromOut(dataShow);
            setShowModal(prev => !prev);
            setReRenderData(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm
        }
    }
    // ================================================================
    //  =============== Xem chi tiết thú cưng ===============
    if (type === "chitietdonhang") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Đơn đặt mua</H1>
                            <ModalForm>
                                <div style={{ display: "flex", marginTop: "15px", flexDirection: "column" }}>
                                    <div style={{ display: "flex" }}>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Mã đặt hàng:</FormSpan>
                                            <FormInput type="text" value={maDatHangModal} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Ngày đặt hàng:</FormSpan>
                                            <FormInput type="text" value={ngayDatHangModal} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Trạng thái đơn đặt hàng:</FormSpan>
                                            <FormInput type="text" value={tenTrangThaiDatHangModal} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Nhân viên duyệt đơn:</FormSpan>
                                            <FormInput type="text" value={hoTenNhanVienModal} readOnly />
                                        </ModalChiTietItem>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Email đặt mua:</FormSpan>
                                            <FormInput type="text" value={emailDatHangModal} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Số điện thoại đặt mua:</FormSpan>
                                            <FormInput type="text" value={soDienThoaiDatHangModal} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Họ tên:</FormSpan>
                                            <FormInput type="text" value={hoTenDatHangModal} readOnly />
                                        </ModalChiTietItem>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Địa chỉ:</FormSpan>
                                            <FormInput type="text" value={diaChiDatHangModal} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Ghi chú:</FormSpan>
                                            <FormTextArea rows={1} value={ghiChuDatHangModal} readOnly />
                                        </ModalChiTietItem>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Thú cưng đã được đặt mua:</FormSpan>
                                            <Table>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Mã thú cưng</Th>
                                                        <Th>Tiêu đề</Th>
                                                        <Th>Tên thú cưng</Th>
                                                        <Th>Số lượng</Th>
                                                        <Th>Đơn giá</Th>
                                                        <Th>Tổng tiền</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        chiTietDatHangModal.length > 0
                                                            ?
                                                            chiTietDatHangModal.map((thucung, key) => {
                                                                return (
                                                                    <Tr>
                                                                        <Td>{thucung.mathucung}</Td>
                                                                        <Td>{thucung.tieude}</Td>
                                                                        <Td>{thucung.tenthucung}</Td>
                                                                        <Td>{thucung.soluongchitietdathang}</Td>
                                                                        <Td>{thucung.giamgia ? format_money((thucung.giamgia).toString()) : null}</Td>
                                                                        <Td>{thucung.tongtienchitietdathang ? format_money((thucung.tongtienchitietdathang).toString()) : null}</Td>
                                                                    </Tr>
                                                                );
                                                            })
                                                            : null
                                                    }
                                                </Tbody>
                                            </Table>
                                        </ModalChiTietItem>
                                    </div>
                                    <div style={{ display: "flex" }}>
                                        <div style={{ flex: "1" }}>

                                        </div>
                                        <Total style={{ flex: "1" }}>
                                            <TotalItem style={{ paddingBottom: "9px" }}>
                                                <p>Tổng tiền thú cưng</p>
                                                <p>{tongTienDatHangModal} VNĐ</p>
                                            </TotalItem>
                                            <TotalItem style={{ paddingBottom: "9px" }}>
                                                <p>Phí vận chuyển</p>
                                                <p>0.00 VNĐ</p>
                                            </TotalItem>
                                            <TotalItem>
                                                <p style={{ color: "var(--color-primary)", fontWeight: "bold" }}>Tổng cộng</p>
                                                <p style={{ color: "var(--color-primary)", fontWeight: "bold" }}>{tongTienDatHangModal} VNĐ</p>
                                            </TotalItem>
                                        </Total>
                                    </div>
                                </div>
                            </ModalForm>
                            <ButtonUpdate>
                                {
                                    admin
                                        ?
                                        admin.machucvu === 5 || admin.machucvu === 1
                                            ?
                                            <>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={() => {
                                                            DuyetDon({
                                                                tentrangthaidathang: tenTrangThaiDatHangModal,
                                                                madathang: maDatHangModal,
                                                                manhanvien: admin ? admin.manhanvien : null,
                                                                hotennhanvien: admin ? admin.hotennhanvien : null,
                                                                hinhdaidiennhanvien: admin ? admin.hinhdaidiennhanvien : null,
                                                            });
                                                        }}
                                                    >Duyệt đơn này</ButtonClick>
                                                </ButtonContainer>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={() => {
                                                            TuChoiDon({
                                                                tentrangthaidathang: tenTrangThaiDatHangModal,
                                                                madathang: maDatHangModal,
                                                                manhanvien: admin ? admin.manhanvien : null,
                                                                hotennhanvien: admin ? admin.hotennhanvien : null,
                                                                hinhdaidiennhanvien: admin ? admin.hinhdaidiennhanvien : null,
                                                            });
                                                        }}
                                                    >Từ chối đơn này</ButtonClick>
                                                </ButtonContainer>
                                            </>
                                            : null
                                        :null
                                }
                                {/* // <ButtonContainer>
                                //     <ButtonClick
                                //         onClick={() => {
                                //             DuyetDon({
                                //                 tentrangthaidathang: tenTrangThaiDatHangModal,
                                //                 madathang: maDatHangModal,
                                //                 manhanvien: admin ? admin.manhanvien : null,
                                //                 hotennhanvien: admin ? admin.hotennhanvien : null,
                                //                 hinhdaidiennhanvien: admin ? admin.hinhdaidiennhanvien : null,
                                //             });
                                //         }}
                                //     >Duyệt đơn này</ButtonClick>
                                // </ButtonContainer>
                                // <ButtonContainer>
                                //     <ButtonClick
                                //         onClick={() => {
                                //             TuChoiDon({
                                //                 tentrangthaidathang: tenTrangThaiDatHangModal,
                                //                 madathang: maDatHangModal,
                                //                 manhanvien: admin ? admin.manhanvien : null,
                                //                 hotennhanvien: admin ? admin.hotennhanvien : null,
                                //                 hinhdaidiennhanvien: admin ? admin.hinhdaidiennhanvien : null,
                                //             });
                                //         }}
                                //     >Từ chối đơn này</ButtonClick>
                                // </ButtonContainer> */}
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
};

export default Modal;