import styled from "styled-components";
import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import "../../css/main.css";
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import { async } from "@firebase/util";
const CryptoJS = require("crypto-js");  //Thư viện mã hóa mật khẩu


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

const Modal = ({ showModal, setShowModal, type, nhanvien, setReRenderData, handleClose, showToastFromOut }) => {
    const modalRef = useRef();
    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            setShowModal(false);
            // setThuCungModalHinhAnh([]); //Modal chi tiết thú cưng khi tắt sẽ xóa mảng hình
            setHinhAnhMoi([]);  //Modal thêm thú cưng khi tắt sẽ xóa mảng hình
            setMangQuanHuyen([]);   //Làm rỗng mảng Quận huyện
            setMangXaPhuongThiTran([]); //Làm rỗng mảng Phường xã
        }
    }

    const keyPress = useCallback(
        (e) => {
            if (e.key === 'Escape' && showModal) {
                setShowModal(false);
                // setThuCungModalHinhAnh([]); //Modal chi tiết thú cưng khi tắt sẽ xóa mảng hình
                setHinhAnhMoi([]);  //Modal thêm thú cưng khi tắt sẽ xóa mảng hình
                setMangQuanHuyen([]);   //Làm rỗng mảng Quận huyện
                setMangXaPhuongThiTran([]); //Làm rỗng mảng Phường xã
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

    // =============== Xử lý cập nhật nhân viên ===============
    const handleCapNhatNhanVien = async (
        {
            manhanvien,
            machucvumoi,
            maxamoi,
            matkhaumoi,
            rematkhaumoi,
            hotennhanvienmoi,
            ngaysinhnhanvienmoi,
            gioitinhnhanvienmoi,
            sdtnhanvienmoi,
            diachinhanvienmoi,
            hinhdaidiennhanvienmoi,
            hinhdaidiennhanvienmoichange,
        }
    ) => {
        console.log("Đầu vào Cập nhật nhân viên:", {
            manhanvien,
            machucvumoi,
            maxamoi,
            matkhaumoi,
            rematkhaumoi,
            hotennhanvienmoi,
            ngaysinhnhanvienmoi,
            gioitinhnhanvienmoi,
            sdtnhanvienmoi,
            diachinhanvienmoi,

            hinhdaidiennhanvienmoi,
            hinhdaidiennhanvienmoichange,
        });

        if (
            manhanvien != ""
            && machucvumoi != ""
            && maxamoi != ""
            && matkhaumoi != ""
            && rematkhaumoi != ""
            && hotennhanvienmoi != ""
            && ngaysinhnhanvienmoi != ""
            && gioitinhnhanvienmoi != ""
            && sdtnhanvienmoi != ""
            && diachinhanvienmoi != ""
            && hinhdaidiennhanvienmoi != ""
            // && nhanvienmodalhinhanhdaidiennhanvienchange != ""
        ) {
            // Nếu tồn tại rematkhau thì phải check mật khẩu mới với rematkhau
            if (rematkhaumoi != null) {
                if (matkhaumoi === rematkhaumoi) {
                    try {
                        const sdtres = await axios.post("http://localhost:3001/api/user/checkSdtNhanVienUpdate", { sdtnhanvien: sdtnhanvienmoi, manhanvien: manhanvien });
                        if (sdtres.data.message == "Chưa có sdt nhân viên này!") {
                            try {
                                // setThuCungModalHinhAnhChange([]);
                                if (hinhdaidiennhanvienmoichange != "") {
                                    const updatenhanvienres = await axios.post("http://localhost:3001/api/user/updateNhanVien", { manhanvien, machucvumoi, maxamoi, matkhaumoi, hotennhanvienmoi, ngaysinhnhanvienmoi, gioitinhnhanvienmoi, sdtnhanvienmoi, diachinhanvienmoi, hinhdaidiennhanvienmoi: hinhdaidiennhanvienmoichange });
                                    console.log("KQ trả về update: ", updatenhanvienres);
                                    setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - ThuCungMain & ThuCungRight.jsx
                                    setShowModal(prev => !prev);
                                    handleClose();
                                    const dataShow = { message: "Thay đổi nhân viên có mã " + manhanvien + " thành công!", type: "success" };
                                    showToastFromOut(dataShow);
                                    setNhanVienModalHinhDaiDienNhanVienChange([]);
                                } else {
                                    const updatenhanvienres = await axios.post("http://localhost:3001/api/user/updateNhanVien", { manhanvien, machucvumoi, maxamoi, matkhaumoi, hotennhanvienmoi, ngaysinhnhanvienmoi, gioitinhnhanvienmoi, sdtnhanvienmoi, diachinhanvienmoi, hinhdaidiennhanvienmoi: hinhdaidiennhanvienmoi });
                                    console.log("KQ trả về update: ", updatenhanvienres);
                                    setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - ThuCungMain & ThuCungRight.jsx
                                    setShowModal(prev => !prev);
                                    handleClose();
                                    const dataShow = { message: "Thay đổi nhân viên có mã " + manhanvien + " thành công!", type: "success" };
                                    showToastFromOut(dataShow);
                                    // setThuCungModalHinhAnh([]);
                                }
                            } catch (err) {
                                setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - ThuCungMain & ThuCungRight.jsx
                                setShowModal(prev => !prev);
                                handleClose();
                                const dataShow = { message: "Thất bại! Không thể cập nhật nhân viên có mã " + manhanvien, type: "danger" };
                                showToastFromOut(dataShow);
                            }
                        } else {
                            const dataShow = { message: "Số điện thoại này đã được đăng ký", type: "danger" };
                            showToastFromOut(dataShow); //Hiện toast thông báo
                        }
                    } catch (err) {
                        console.log("Lỗi khi bắt Số điện thoại trùng!");
                    }

                } else {
                    const dataShow = { message: "Mật khẩu không trùng khớp, hãy kiểm tra", type: "danger" };
                    showToastFromOut(dataShow); //Hiện toast thông báo
                }
                // Không tồn tại rematkhau
            } else {
                try {
                    const sdtres = await axios.post("http://localhost:3001/api/user/checkSdtNhanVienUpdate", { sdtnhanvien: sdtnhanvienmoi, manhanvien: manhanvien });
                    if (sdtres.data.message == "Chưa có sdt nhân viên này!") {
                        try {
                            // setThuCungModalHinhAnhChange([]);
                            if (hinhdaidiennhanvienmoichange != "") {
                                const updatenhanvienres = await axios.post("http://localhost:3001/api/user/updateNhanVien", { manhanvien, machucvumoi, maxamoi, matkhaumoi, hotennhanvienmoi, ngaysinhnhanvienmoi, gioitinhnhanvienmoi, sdtnhanvienmoi, diachinhanvienmoi, hinhdaidiennhanvienmoi: hinhdaidiennhanvienmoichange });
                                console.log("KQ trả về update: ", updatenhanvienres);
                                setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - ThuCungMain & ThuCungRight.jsx
                                setShowModal(prev => !prev);
                                handleClose();
                                const dataShow = { message: "Thay đổi nhân viên có mã " + manhanvien + " thành công!", type: "success" };
                                showToastFromOut(dataShow);
                                setNhanVienModalHinhDaiDienNhanVienChange([]);
                            } else {
                                const updatenhanvienres = await axios.post("http://localhost:3001/api/user/updateNhanVien", { manhanvien, machucvumoi, maxamoi, matkhaumoi, hotennhanvienmoi, ngaysinhnhanvienmoi, gioitinhnhanvienmoi, sdtnhanvienmoi, diachinhanvienmoi, hinhdaidiennhanvienmoi: hinhdaidiennhanvienmoi });
                                console.log("KQ trả về update: ", updatenhanvienres);
                                setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - ThuCungMain & ThuCungRight.jsx
                                setShowModal(prev => !prev);
                                handleClose();
                                const dataShow = { message: "Thay đổi nhân viên có mã " + manhanvien + " thành công!", type: "success" };
                                showToastFromOut(dataShow);
                                // setThuCungModalHinhAnh([]);
                            }
                        } catch (err) {
                            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - ThuCungMain & ThuCungRight.jsx
                            setShowModal(prev => !prev);
                            handleClose();
                            const dataShow = { message: "Thất bại! Không thể cập nhật nhân viên có mã " + manhanvien, type: "danger" };
                            showToastFromOut(dataShow);
                        }
                    } else {
                        const dataShow = { message: "Số điện thoại này đã được đăng ký", type: "danger" };
                        showToastFromOut(dataShow); //Hiện toast thông báo
                    }
                } catch (err) {
                    console.log("Lỗi khi bắt Số điện thoại trùng!");
                }

            }
        } else {
            const dataShow = { message: "Bạn chưa nhập thông tin cho nhân viên", type: "danger" };
            showToastFromOut(dataShow); //Hiện toast thông báo
        }
    }
    //  test
    const [nhanVienModal, setNhanVienModal] = useState();
    const [nhanVienModalMaNhanVien, setNhanVienModalMaNhanVien] = useState();
    const [nhanVienModalMaChucVu, setNhanVienModalMaChucVu] = useState();
    const [nhanVienModalMaXa, setNhanVienModalMaXa] = useState();
    const [nhanVienModalEmailNhanVien, setNhanVienModalEmailNhanVien] = useState();
    const [nhanVienModalMatKhau, setNhanVienModalMatKhau] = useState();
    const [nhanVienModalReMatKhau, setNhanVienModalReMatKhau] = useState(null);
    const [nhanVienModalHoTenNhanVien, setNhanVienModalHoTenNhanVien] = useState();
    const [nhanVienModalNgaySinhNhanVien, setNhanVienModalNgaySinhNhanVien] = useState();
    const [nhanVienModalGioiTinhNhanVien, setNhanVienModalGioiTinhNhanVien] = useState();
    const [nhanVienModalSdtNhanVien, setNhanVienModalSdtNhanVien] = useState();
    const [nhanVienModalDiaChiNhanVien, setNhanVienModalDiaChiNhanVien] = useState();
    const [nhanVienModalHinhDaiDienNhanVien, setNhanVienModalHinhDaiDienNhanVien] = useState([]);
    const [nhanVienModalHinhDaiDienNhanVienChange, setNhanVienModalHinhDaiDienNhanVienChange] = useState("");
    const [nhanVienModalTenXa, setNhanVienModalTenXa] = useState();
    const [nhanVienModalTenQuanHuyen, setNhanVienModalTenQuanHuyen] = useState();
    const [nhanVienModalTenThanhPho, setNhanVienModalTenThanhPho] = useState();
    const [nhanVienModalMaQuanHuyen, setNhanVienModalMaQuanHuyen] = useState();
    const [nhanVienModalMaThanhPho, setNhanVienModalMaThanhPho] = useState();

    const [nhanVienModalOld, setNhanVienModalOld] = useState();
    const [nhanVienModalMaNhanVienOld, setNhanVienModalMaNhanVienOld] = useState();
    const [nhanVienModalMaChucVuOld, setNhanVienModalMaChucVuOld] = useState();
    const [nhanVienModalEmailNhanVienOld, setNhanVienModalEmailNhanVienOld] = useState();
    const [nhanVienModalMatKhauOld, setNhanVienModalMatKhauOld] = useState();
    const [nhanVienModalHoTenNhanVienOld, setNhanVienModalHoTenNhanVienOld] = useState();
    const [nhanVienModalNgaySinhNhanVienOld, setNhanVienModalNgaySinhNhanVienOld] = useState();
    const [nhanVienModalGioiTinhNhanVienOld, setNhanVienModalGioiTinhNhanVienOld] = useState();
    const [nhanVienModalSdtNhanVienOld, setNhanVienModalSdtNhanVienOld] = useState();
    const [nhanVienModalDiaChiNhanVienOld, setNhanVienModalDiaChiNhanVienOld] = useState();
    const [nhanVienModalHinhDaiDienNhanVienOld, setNhanVienModalHinhDaiDienNhanVienOld] = useState("");
    const [nhanVienModalTenXaOld, setNhanVienModalTenXaOld] = useState();
    const [nhanVienModalTenQuanHuyenOld, setNhanVienModalTenQuanHuyenOld] = useState();
    const [nhanVienModalTenThanhPhoOld, setNhanVienModalTenThanhPhoOld] = useState();
    const [nhanVienModalMaXaOld, setNhanVienModalMaXaOld] = useState();
    const [nhanVienModalMaQuanHuyenOld, setNhanVienModalMaQuanHuyenOld] = useState();
    const [nhanVienModalMaThanhPhoOld, setNhanVienModalMaThanhPhoOld] = useState();
    useEffect(() => {
        // setThuCungModalHinhAnh([]);
        // setThuCungModalHinhAnhChange([]);
        setHinhAnhMoi([]);
        const getNhanVien = async () => {
            try {
                const nhanvienres = await axios.post("http://localhost:3001/api/user/findNhanVienById", { manhanvien: nhanvien.manhanvien });
                setNhanVienModal(nhanvienres.data);
                setNhanVienModalMaNhanVien(nhanvienres.data[0].manhanvien);
                setNhanVienModalMaChucVu(nhanvienres.data[0].machucvu);
                setNhanVienModalEmailNhanVien(nhanvienres.data[0].emailnhanvien);
                // setNhanVienModalMatKhau(nhanvienres.data[0].matkhau);

                // Giải mã mật khẩu trong CSDL để so sánh với mật khẩu được nhập
                setNhanVienModalMatKhau(CryptoJS.AES.decrypt(
                        nhanvienres.data[0].matkhau,
                        "khoabimat"
                ).toString(CryptoJS.enc.Utf8));

                setNhanVienModalHoTenNhanVien(nhanvienres.data[0].hotennhanvien);
                setNhanVienModalNgaySinhNhanVien(nhanvienres.data[0].ngaysinhnhanvien);
                setNhanVienModalGioiTinhNhanVien(nhanvienres.data[0].gioitinhnhanvien);
                setNhanVienModalSdtNhanVien(nhanvienres.data[0].sdtnhanvien);
                setNhanVienModalDiaChiNhanVien(nhanvienres.data[0].diachinhanvien);
                setNhanVienModalHinhDaiDienNhanVien(nhanvienres.data[0].hinhdaidiennhanvien);
                setNhanVienModalTenXa(nhanvienres.data[0].tenxa);
                setNhanVienModalTenQuanHuyen(nhanvienres.data[0].tenquanhuyen);
                setNhanVienModalTenThanhPho(nhanvienres.data[0].tenthanhpho);
                setNhanVienModalMaXa(nhanvienres.data[0].maxa);
                setNhanVienModalMaQuanHuyen(nhanvienres.data[0].maquanhuyen);
                setNhanVienModalMaThanhPho(nhanvienres.data[0].mathanhpho);


                setNhanVienModalOld(nhanvienres.data);
                setNhanVienModalMaNhanVienOld(nhanvienres.data[0].manhanvien);
                setNhanVienModalMaChucVuOld(nhanvienres.data[0].machucvu);
                setNhanVienModalEmailNhanVienOld(nhanvienres.data[0].emailnhanvien);
                // setNhanVienModalMatKhauOld(nhanvienres.data[0].matkhau);
                setNhanVienModalMatKhauOld(CryptoJS.AES.decrypt(
                    nhanvienres.data[0].matkhau,
                    "khoabimat"
                ).toString(CryptoJS.enc.Utf8));
                setNhanVienModalHoTenNhanVienOld(nhanvienres.data[0].hotennhanvien);
                setNhanVienModalNgaySinhNhanVienOld(nhanvienres.data[0].ngaysinhnhanvien);
                setNhanVienModalGioiTinhNhanVienOld(nhanvienres.data[0].gioitinhnhanvien);
                setNhanVienModalSdtNhanVienOld(nhanvienres.data[0].sdtnhanvien);
                setNhanVienModalDiaChiNhanVienOld(nhanvienres.data[0].diachinhanvien);
                setNhanVienModalHinhDaiDienNhanVienOld(nhanvienres.data[0].hinhdaidiennhanvien);
                setNhanVienModalTenXaOld(nhanvienres.data[0].tenxa);
                setNhanVienModalTenQuanHuyenOld(nhanvienres.data[0].tenquanhuyen);
                setNhanVienModalTenThanhPhoOld(nhanvienres.data[0].tenthanhpho);
                setNhanVienModalMaXaOld(nhanvienres.data[0].maxa);
                setNhanVienModalMaQuanHuyenOld(nhanvienres.data[0].maquanhuyen);
                setNhanVienModalMaThanhPhoOld(nhanvienres.data[0].mathanhpho);
            } catch (err) {
                console.log("Lỗi lấy nhân viên: ", err);
            }
        }
        getNhanVien();
    }, [nhanvien]);
    console.log("Nhân viên modal: ", nhanVienModal);

    // Effect Tỉnh - Huyện - Xã cập nhật
    const [mangTinhThanhPhoUpdate, setMangTinhThanhPhoUpdate] = useState([]);
    const [mangQuanHuyenUpdate, setMangQuanHuyenUpdate] = useState([]);
    const [mangXaPhuongThiTranUpdate, setMangXaPhuongThiTranUpdate] = useState([]);
    useEffect(() => {
        const getTinhThanhPhoUpdate = async () => {
            const thanhphores = await axios.post("http://localhost:3001/api/user/getTinhThanhPho", {});
            setMangTinhThanhPhoUpdate(thanhphores.data);
            console.log("Tỉnh TPUpdate [res]: ", thanhphores.data);
        }
        getTinhThanhPhoUpdate();
    }, [])

    useEffect(() => {
        const getQuanHuyenUpdate = async () => {
            const quanhuyenres = await axios.post("http://localhost:3001/api/user/getQuanHuyen", { mathanhpho: nhanVienModalMaThanhPho });
            setMangQuanHuyenUpdate(quanhuyenres.data);
            console.log("Quận huyện Update [res]: ", quanhuyenres.data);
        }
        getQuanHuyenUpdate();
    }, [nhanVienModalMaThanhPho])

    useEffect(() => {
        const getXaPhuongThiTranUpdate = async () => {
            const xaphuongthitranres = await axios.post("http://localhost:3001/api/user/getXaPhuongThiTran", { maquanhuyen: nhanVienModalMaQuanHuyen });
            setMangXaPhuongThiTranUpdate(xaphuongthitranres.data);
            console.log("Xã phường Update res: ", xaphuongthitranres.data);
        }
        getXaPhuongThiTranUpdate();
    }, [nhanVienModalMaQuanHuyen])

    // Thay đổi hình ảnh
    const handleChangeImg = (hinhmoi) => {
        setNhanVienModalHinhDaiDienNhanVienChange("");
        const hinhanhunique = new Date().getTime() + hinhmoi;
        const storage = getStorage(app);
        const storageRef = ref(storage, hinhanhunique);
        const uploadTask = uploadBytesResumable(storageRef, hinhmoi);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    try {
                        setNhanVienModalHinhDaiDienNhanVienChange(downloadURL);
                    } catch (err) {
                        console.log("Lỗi cập nhật hình ảnh:", err);
                    }
                });
            }
        );
    }


    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal
        // setThuCungModalHinhAnh(thuCungModalHinhAnhOld);

        // setNhanVienModalMaNhanVien(nhanVienModalMaNhanVienOld);
        setNhanVienModalMaChucVu(nhanVienModalMaChucVuOld);
        setNhanVienModalMaXa(nhanVienModalMaXaOld);
        setNhanVienModalEmailNhanVien(nhanVienModalEmailNhanVienOld);
        setNhanVienModalMatKhau(nhanVienModalMatKhauOld);
        setNhanVienModalHoTenNhanVien(nhanVienModalHoTenNhanVienOld);
        setNhanVienModalNgaySinhNhanVien(nhanVienModalNgaySinhNhanVienOld);
        setNhanVienModalGioiTinhNhanVien(nhanVienModalGioiTinhNhanVienOld);
        setNhanVienModalSdtNhanVien(nhanVienModalSdtNhanVienOld);
        setNhanVienModalDiaChiNhanVien(nhanVienModalDiaChiNhanVienOld);
        setNhanVienModalHinhDaiDienNhanVien(nhanVienModalHinhDaiDienNhanVienOld);

        setShowModal(prev => !prev);
        // setHinhAnhMoi([]);  //Đóng modal sẽ xóa mảng hình cũ ở Modal Thêm thú cưng
        // setThuCungModalHinhAnhChange([]);
    }

    // =============== Xử lý thêm nhân viên ===============
    const [maChucVuMoi, setMaChucVuMoi] = useState("1");  //Danh mục mặc định là Chó
    const [maXaMoi, setMaXaMoi] = useState("00001");
    const [emailNhanVienMoi, setEmailNhanVienMoi] = useState("");    //Giới tính mặc định là "Đực"
    const [matKhauMoi, setMatKhauMoi] = useState("");
    const [reMatKhauMoi, setReMatKhauMoi] = useState("");
    const [hoTenNhanVienMoi, setHoTenNhanVienMoi] = useState("");
    const [ngaySinhNhanVienMoi, setNgaySinhNhanVienMoi] = useState("");
    const [gioiTinhNhanVienMoi, setGioiTinhNhanVienMoi] = useState("Nam");
    const [sdtNhanVienMoi, setSdtNhanVienMoi] = useState("");
    const [diaChiNhanVienMoi, setDiaChiNhanVienMoi] = useState("");
    const [hinhAnhMoi, setHinhAnhMoi] = useState();   //Mảng chứa hình ảnh

    // Lấy TỈNH - HUYỆN - XÃ
    const [tinhThanhPho, setTinhThanhPho] = useState();
    const [quanHuyen, setQuanHuyen] = useState();
    const [xaPhuongThiTran, setXaPhuongThiTran] = useState();

    const [mangTinhThanhPho, setMangTinhThanhPho] = useState([]);
    const [mangQuanHuyen, setMangQuanHuyen] = useState([]);
    const [mangXaPhuongThiTran, setMangXaPhuongThiTran] = useState([]);

    useEffect(() => {
        const getTinhThanhPho = async () => {
            const thanhphores = await axios.post("http://localhost:3001/api/user/getTinhThanhPho", {});
            setMangTinhThanhPho(thanhphores.data);
            console.log("Tỉnh TP [res]: ", thanhphores.data);
        }
        getTinhThanhPho();
    }, [])

    useEffect(() => {
        const getQuanHuyen = async () => {
            const quanhuyenres = await axios.post("http://localhost:3001/api/user/getQuanHuyen", { mathanhpho: tinhThanhPho });
            setMangQuanHuyen(quanhuyenres.data);
            console.log("Quận huyện [res]: ", quanhuyenres.data);
        }
        getQuanHuyen();
    }, [tinhThanhPho])

    useEffect(() => {
        const getXaPhuongThiTran = async () => {
            const xaphuongthitranres = await axios.post("http://localhost:3001/api/user/getXaPhuongThiTran", { maquanhuyen: quanHuyen });
            setMangXaPhuongThiTran(xaphuongthitranres.data);
            console.log("Xã phường res: ", xaphuongthitranres.data);
        }
        getXaPhuongThiTran();
    }, [quanHuyen])


    // Thay đổi hình ảnh
    const handleShowImg = (hinhmoi) => {
        // Chạy vòng lặp thêm từng hình trong mảng lên firebase rồi lưu vô mảng [hinhAnhMoi] ở modal Thêm thú cưng
        setHinhAnhMoi([]);
        // console.log("hinh moi: ", hinhmoiarray[i]);
        const hinhanhunique = new Date().getTime() + hinhmoi;
        const storage = getStorage(app);
        const storageRef = ref(storage, hinhanhunique);
        const uploadTask = uploadBytesResumable(storageRef, hinhmoi);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    try {
                        setHinhAnhMoi(downloadURL);
                        console.log("Up thành công 1 hình: ", downloadURL);
                    } catch (err) {
                        console.log("Lỗi show hình ảnh:", err);
                    }
                });
            }
        );
        console.log("Hình mới: ", hinhmoi);
    }

    const handleThemNhanVien = async (
        { machucvumoi,
            maxamoi,
            emailnhanvienmoi,
            matkhaumoi,
            rematkhaumoi,
            hotennhanvienmoi,
            ngaysinhnhanvienmoi,
            gioitinhanhvienmoi,
            sdtnhanvienmoi,
            diachinhanvienmoi,
            hinhdaidiennhanvienmoi  //Hình đại diện nhân viên mới
        }) => {
        console.log("Nhân viên được thêm mới: ", {
            machucvumoi,
            maxamoi,
            emailnhanvienmoi,
            matkhaumoi,
            rematkhaumoi,
            hotennhanvienmoi,
            ngaysinhnhanvienmoi,
            gioitinhanhvienmoi,
            sdtnhanvienmoi,
            diachinhanvienmoi,
            hinhdaidiennhanvienmoi   //Hình đại diện nhân viên mới
        });
        if (machucvumoi !== ""
            && maxamoi !== ""
            && emailnhanvienmoi !== ""
            && matkhaumoi !== ""
            && rematkhaumoi !== ""
            && hotennhanvienmoi !== ""
            && ngaysinhnhanvienmoi !== ""
            && gioitinhanhvienmoi !== ""
            && sdtnhanvienmoi !== ""
            && diachinhanvienmoi !== ""
            && hinhdaidiennhanvienmoi !== ""
        ) {
            if (matkhaumoi === rematkhaumoi) {
                try {
                    const emailres = await axios.post("http://localhost:3001/api/user/checkEmailNhanVien", { emailnhanvien: emailnhanvienmoi });
                    console.log("Email trả về: ", emailres);
                    if (emailres.data.message == "Chưa có email nhân viên này!") {
                        try {
                            const sdtres = await axios.post("http://localhost:3001/api/user/checkSdtNhanVien", { sdtnhanvien: sdtnhanvienmoi });
                            if (sdtres.data.message == "Chưa có sdt nhân viên này!") {
                                try {
                                    const insertnhanvienres = axios.post("http://localhost:3001/api/user/insertNhanVien",
                                        {
                                            machucvu: machucvumoi,
                                            maxa: maxamoi,
                                            emailnhanvien: emailnhanvienmoi,
                                            matkhau: matkhaumoi,
                                            hotennhanvien: hotennhanvienmoi,
                                            ngaysinhnhanvien: ngaysinhnhanvienmoi,
                                            gioitinhnhanvien: gioitinhanhvienmoi,
                                            sdtnhanvien: sdtnhanvienmoi,
                                            diachinhanvien: diachinhanvienmoi,
                                            hinhdaidiennhanvien: hinhdaidiennhanvienmoi
                                        }
                                    );
                                    console.log("KQ trả về update: ", insertnhanvienres);
                                    setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
                                    setShowModal(prev => !prev);
                                    const dataShow = { message: "Thêm nhân viên " + hotennhanvienmoi + " thành công!", type: "success" };
                                    showToastFromOut(dataShow);
                                    setHinhAnhMoi([]);  //Làm rỗng mảng hình
                                    // setMangQuanHuyen([]);   //Làm rỗng mảng Quận huyện
                                    // setMangXaPhuongThiTran([]); //Làm rỗng mảng Phường xã
                                } catch (err) {
                                    console.log("Lỗi insert: ", err);
                                    setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
                                    setShowModal(prev => !prev);
                                    const dataShow = { message: "Đã có lỗi khi thêm nhân viên " + hotennhanvienmoi, type: "danger" };
                                    showToastFromOut(dataShow); //Hiện toast thông báo
                                }
                            } else {
                                const dataShow = { message: "Số điện thoại này đã được đăng ký", type: "danger" };
                                showToastFromOut(dataShow); //Hiện toast thông báo
                            }
                        } catch (err) {
                            console.log("Lỗi khi bắt Số điện thoại trùng!");
                        }
                    } else {
                        const dataShow = { message: "Email này đã tồn tại", type: "danger" };
                        showToastFromOut(dataShow); //Hiện toast thông báo
                    }
                } catch (err) {
                    console.log("Lỗi khi bắt email trùng!");
                }
            } else {
                const dataShow = { message: "Mật khẩu không trùng khớp, hãy kiểm tra", type: "danger" };
                showToastFromOut(dataShow); //Hiện toast thông báo
            }
        } else {
            const dataShow = { message: "Bạn chưa nhập thông tin cho nhân viên", type: "danger" };
            showToastFromOut(dataShow); //Hiện toast thông báo
        }
    }

    // State chứa mảng chức vụ - Lấy về chức vụ để hiện select-option
    const [chucVu, setChucVu] = useState([]);
    useEffect(() => {
        const getChucVu = async () => {
            try {
                const chucvures = await axios.post("http://localhost:3001/api/user/getChucVu", {});
                setChucVu(chucvures.data);
                console.log("Mảng Chức vụ: ", chucVu);
            } catch (err) {
                console.log("Lỗi lấy chức vụ: ", err);
            }
        }
        getChucVu();
    }, [nhanvien])

    // =============== Xử lý xóa nhân viên ===============
    const handleXoaNhanVien = async ({ manhanvien }) => {
        if (manhanvien !== "") {
            try {
                const deletenhanvienres = await axios.post("http://localhost:3001/api/user/deleteNhanVien", { manhanvien });
                console.log("KQ trả về delete: ", deletenhanvienres);
                setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
                setShowModal(prev => !prev);
                handleClose();  //Đóng thanh tìm kiếm
                const dataShow = { message: "Đã xóa nhân viên mã " + manhanvien + " thành công!", type: "success" };
                showToastFromOut(dataShow);
            } catch (err) {
                console.log("Lỗi Delete nhân viên err: ", err);
            }
        }
    }

    // =============== Xử lý Xem chi tiết thú cưng ===============
    const handleCloseChiTiet = () => {
        setShowModal(prev => !prev);
        setHinhAnhMoi([]);  //Đóng modal sẽ xóa mảng hình cũ ở Modal Thêm thú cưng
        setMangQuanHuyen([]);   //Làm rỗng mảng Quận huyện
        setMangXaPhuongThiTran([]); //Làm rỗng mảng Phường xã
    }
    // ================================================================
    //  =============== Xem chi tiết thú cưng ===============
    if (type === "chitietnhanvien") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Nhân viên</H1>
                            <ModalForm>
                                <div style={{ display: "flex", marginTop: "15px" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <ImageWrapper>
                                            <ChiTietHinhAnh src={nhanvien.hinhdaidiennhanvien} />
                                        </ImageWrapper>
                                    </ModalChiTietItem>
                                    <div style={{ display: "flex", flex: "1" }}>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Họ tên nhân viên:</FormSpan>
                                            <FormInput type="text" value={nhanvien.hotennhanvien} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Ngày sinh:</FormSpan>
                                            <FormInput type="text" value={nhanvien.ngaysinhnhanvien.substring(0, 10)} readOnly />
                                        </ModalChiTietItem>
                                        <ModalChiTietItem style={{ flex: "1" }}>
                                            <FormSpan>Giới tính:</FormSpan>
                                            <FormInput type="text" value={nhanvien.gioitinhnhanvien} readOnly />
                                        </ModalChiTietItem>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flex: "1" }}>
                                    <ModalChiTietItem style={{ flex: "1", marginLeft: "265px" }}>
                                        <FormSpan>Địa chỉ nhân viên:</FormSpan>
                                        <FormInput type="text" value={nhanvien.diachinhanvien + ", " + nhanvien.tenxa + ", " + nhanvien.tenquanhuyen + ", " + nhanvien.tenthanhpho} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Email:</FormSpan>
                                        <FormInput type="text" value={nhanvien.emailnhanvien} readOnly />
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex", flex: "1", marginTop: "15px", marginBottom: "10px" }}>
                                    <ModalChiTietItem style={{ flex: "1", marginLeft: "265px" }}>
                                        <FormSpan>Mã nhân viên:</FormSpan>
                                        <FormInput type="text" value={nhanvien.manhanvien} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Chức vụ:</FormSpan>
                                        <FormInput type="text" value={nhanvien.tenchucvu} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Số điện thoại:</FormSpan>
                                        <FormInput type="text" value={nhanvien.sdtnhanvien} readOnly />
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
    //  =============== Thêm thú cưng ===============
    if (type === "themnhanvien") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ThemThuCungWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm nhân viên mới</H1>
                            <ModalForm>
                                <div style={{ display: "flex", marginTop: "15px" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tên nhân viên:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setHoTenNhanVienMoi(e.target.value)} placeholder="Tên của Nhân viên" />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Chức vụ:</FormSpan>
                                        <FormSelect onChange={(e) => { setMaChucVuMoi(e.target.value) }}>
                                            {chucVu.map((chucvu, key) => {
                                                return (
                                                    <FormOption value={chucvu.machucvu}> {chucvu.tenchucvu} </FormOption>
                                                )
                                            })}
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giới tính:</FormSpan>
                                        <FormSelect onChange={(e) => { setGioiTinhNhanVienMoi(e.target.value) }}>
                                            <FormOption value="Nam"> Nam </FormOption>
                                            <FormOption value="Nữ"> Nữ </FormOption>
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Ngày sinh:</FormSpan>
                                        <FormInput type="date" onChange={(e) => setNgaySinhNhanVienMoi(e.target.value)} />
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Thuộc tỉnh:</FormSpan>
                                        <FormSelect onChange={(e) => { setTinhThanhPho(e.target.value) }}>
                                            <FormOption value="">-- Chọn thành phố --</FormOption>
                                            {mangTinhThanhPho.map((tinhthanhpho, key) => {
                                                return (
                                                    <FormOption value={tinhthanhpho.mathanhpho}> {tinhthanhpho.tenthanhpho} </FormOption>
                                                )
                                            })}
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Thuộc huyện:</FormSpan>
                                        <FormSelect onChange={(e) => { setQuanHuyen(e.target.value) }}>
                                            {
                                                mangQuanHuyen.length > 0
                                                    ?
                                                    mangQuanHuyen.map((quanhuyen, key) => {
                                                        return (
                                                            <FormOption value={quanhuyen.maquanhuyen}> {quanhuyen.tenquanhuyen} </FormOption>
                                                        )
                                                    })
                                                    :
                                                    <FormOption value="">-- Bạn chưa chọn Thành phố -- </FormOption>
                                            }
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Thuộc xã:</FormSpan>
                                        <FormSelect onChange={(e) => { setXaPhuongThiTran(e.target.value) }}>
                                            {
                                                mangXaPhuongThiTran.length > 0
                                                    ?
                                                    mangXaPhuongThiTran.map((xaphuong, key) => {
                                                        return (
                                                            <FormOption value={xaphuong.maxa}> {xaphuong.tenxa} </FormOption>
                                                        )
                                                    })
                                                    :
                                                    <FormOption value="">-- Bạn chưa chọn Huyện </FormOption>
                                            }
                                        </FormSelect>
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Địa chỉ:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setDiaChiNhanVienMoi(e.target.value)} placeholder="Địa chỉ của nhân viên" />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Số điện thoại:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setSdtNhanVienMoi(e.target.value)} placeholder="Số điện thoại của nhân viên" />
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Email:</FormSpan>
                                        <FormInput type="email" onChange={(e) => setEmailNhanVienMoi(e.target.value)} placeholder="Email của nhân viên" />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Mật khẩu:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setMatKhauMoi(e.target.value)} placeholder="Mật khẩu" />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Nhập lại mật khẩu:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setReMatKhauMoi(e.target.value)} placeholder="Nhập lại mật khẩu" />
                                    </ModalChiTietItem>
                                </div>
                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleShowImg(e.target.files[0])} />
                                    <ImageWrapper>
                                        {
                                            hinhAnhMoi != ""   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                <ChiTietHinhAnh src={hinhAnhMoi} />
                                                :   //Khi mảng hình trống thì hiện No Available Image
                                                <ChiTietHinhAnh src={"https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} />
                                        }
                                    </ImageWrapper>
                                </ModalChiTietItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleThemNhanVien({
                                            machucvumoi: maChucVuMoi,
                                            maxamoi: xaPhuongThiTran,
                                            emailnhanvienmoi: emailNhanVienMoi,
                                            matkhaumoi: matKhauMoi,
                                            rematkhaumoi: reMatKhauMoi,
                                            hotennhanvienmoi: hoTenNhanVienMoi,
                                            ngaysinhnhanvienmoi: ngaySinhNhanVienMoi,
                                            gioitinhanhvienmoi: gioiTinhNhanVienMoi,
                                            sdtnhanvienmoi: sdtNhanVienMoi,
                                            diachinhanvienmoi: diaChiNhanVienMoi,
                                            hinhdaidiennhanvienmoi: hinhAnhMoi
                                        })}
                                    >Thêm vào</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCloseUpdate()}
                                    >Hủy bỏ</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => handleCloseUpdate()}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ThemThuCungWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // =============== Chỉnh sửa nhân viên ===============
    if (type === "chinhsuanhanvien") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ThemThuCungWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật thông tin nhân viên</H1>
                            <ModalForm>
                                <div style={{ display: "flex", marginTop: "15px" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tên nhân viên:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setNhanVienModalHoTenNhanVien(e.target.value)} value={nhanVienModalHoTenNhanVien} />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Chức vụ:</FormSpan>
                                        <FormSelect onChange={(e) => { setNhanVienModalMaChucVu(e.target.value) }}>
                                            {chucVu.map((chucvu, key) => {
                                                if (chucvu.machucvu === nhanVienModalMaChucVu) {
                                                    return (
                                                        <FormOption value={chucvu.machucvu} selected> {chucvu.tenchucvu} </FormOption>
                                                    )
                                                } else {
                                                    return (
                                                        <FormOption value={chucvu.machucvu}> {chucvu.tenchucvu} </FormOption>
                                                    )
                                                }
                                            })}
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giới tính:</FormSpan>
                                        <FormSelect onChange={(e) => { setNhanVienModalGioiTinhNhanVien(e.target.value) }}>
                                            {
                                                nhanVienModalGioiTinhNhanVien === "Nam"
                                                    ?
                                                    <FormOption value="Nam" selected> Nam </FormOption>
                                                    :
                                                    <FormOption value="Nam"> Nam </FormOption>
                                            }
                                            {
                                                nhanVienModalGioiTinhNhanVien === "Nữ"
                                                    ?
                                                    <FormOption value="Nữ" selected> Nữ </FormOption>
                                                    :
                                                    <FormOption value="Nữ"> Nữ </FormOption>
                                            }
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Ngày sinh:</FormSpan>
                                        <FormInput type="date" onChange={(e) => setNhanVienModalNgaySinhNhanVien(e.target.value)} value={nhanVienModalNgaySinhNhanVien} />
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Thuộc tỉnh:</FormSpan>
                                        <FormSelect onChange={(e) => { setNhanVienModalMaThanhPho(e.target.value) }}>
                                            <FormOption value="">-- Chọn thành phố --</FormOption>
                                            {mangTinhThanhPhoUpdate.map((tinhthanhpho, key) => {
                                                if (tinhthanhpho.tenthanhpho === nhanVienModalTenThanhPho) {
                                                    return (
                                                        <FormOption value={tinhthanhpho.mathanhpho} selected> {tinhthanhpho.tenthanhpho} </FormOption>
                                                    )
                                                } else {
                                                    return (
                                                        <FormOption value={tinhthanhpho.mathanhpho}> {tinhthanhpho.tenthanhpho} </FormOption>
                                                    )
                                                }
                                            })}
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Thuộc huyện:</FormSpan>
                                        <FormSelect onChange={(e) => { setNhanVienModalMaQuanHuyen(e.target.value) }}>
                                            {
                                                mangQuanHuyenUpdate.length > 0
                                                    ?
                                                    mangQuanHuyenUpdate.map((quanhuyen, key) => {
                                                        if (quanhuyen.tenquanhuyen === nhanVienModalTenQuanHuyen) {
                                                            return (
                                                                <FormOption value={quanhuyen.maquanhuyen} selected> {quanhuyen.tenquanhuyen} </FormOption>
                                                            )
                                                        } else {
                                                            return (
                                                                <FormOption value={quanhuyen.maquanhuyen}> {quanhuyen.tenquanhuyen} </FormOption>
                                                            )
                                                        }
                                                    })
                                                    :
                                                    <FormOption value="">-- Bạn chưa chọn Thành phố -- </FormOption>
                                            }
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Thuộc xã:</FormSpan>
                                        <FormSelect onChange={(e) => { setNhanVienModalMaXa(e.target.value) }}>
                                            {
                                                mangXaPhuongThiTranUpdate.length > 0
                                                    ?
                                                    mangXaPhuongThiTranUpdate.map((xaphuong, key) => {
                                                        if (xaphuong.tenxa === nhanVienModalTenXa) {
                                                            return (
                                                                <FormOption value={xaphuong.maxa} selected> {xaphuong.tenxa} </FormOption>
                                                            )
                                                        } else {
                                                            return (
                                                                <FormOption value={xaphuong.maxa}> {xaphuong.tenxa} </FormOption>
                                                            )
                                                        }
                                                    })
                                                    :
                                                    <FormOption value="">-- Bạn chưa chọn Huyện </FormOption>
                                            }
                                        </FormSelect>
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Địa chỉ:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setNhanVienModalDiaChiNhanVien(e.target.value)} value={nhanVienModalDiaChiNhanVien} />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Số điện thoại:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setNhanVienModalSdtNhanVien(e.target.value)} value={nhanVienModalSdtNhanVien} />
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Email:</FormSpan>
                                        <FormInput type="email" value={nhanVienModalEmailNhanVien} disabled />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Mật khẩu:</FormSpan>
                                        <FormInput type="text" onChange={(e) => { setNhanVienModalMatKhau(e.target.value) }} value={nhanVienModalMatKhau} />
                                    </ModalChiTietItem>
                                    {
                                        nhanVienModalMatKhau !== nhanVienModalMatKhauOld
                                            ?
                                            <ModalChiTietItem style={{ flex: "1" }}>
                                                <FormSpan>Nhập lại mật khẩu:</FormSpan>
                                                <FormInput type="text" onChange={(e) => { setNhanVienModalReMatKhau(e.target.value) }} placeholder="Hãy nhập lại mật khẩu" />
                                            </ModalChiTietItem>
                                            : null
                                    }
                                </div>
                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleChangeImg(e.target.files[0])} />
                                    <ImageWrapper>
                                        {
                                            nhanVienModalHinhDaiDienNhanVienChange != ""   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                <ChiTietHinhAnh src={nhanVienModalHinhDaiDienNhanVienChange} />
                                                :   //Khi mảng hình trống thì hiện No Available Image
                                                <ChiTietHinhAnh src={nhanVienModalHinhDaiDienNhanVien} />
                                        }
                                    </ImageWrapper>
                                </ModalChiTietItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        // onClick={() => handleCapNhatThuCung({
                                        //     mathucung: thucung.mathucung,
                                        //     madanhmucmoi: thuCungModalMaDanhMuc,
                                        //     tenthucungmoi: thuCungModalTenThuCung,
                                        //     gioitinhthucungmoi: thuCungModalGioiTinhThuCung,
                                        //     tuoithucungmoi: thuCungModalTuoiThuCung,
                                        //     datiemchungmoi: thuCungModalDaTiemChung,
                                        //     baohanhsuckhoemoi: thuCungModalBaoHanhSucKhoe,
                                        //     tieudemoi: thuCungModalTieuDe,
                                        //     motamoi: thuCungModalMoTa,
                                        //     ghichumoi: thuCungModalGhiChu,
                                        //     soluongmoi: thuCungModalSoLuong,
                                        //     giabanmoi: thuCungModalGiaBan,
                                        //     giamgiamoi: thuCungModalGiamGia,
                                        //     thucungmodalhinganhchange: thuCungModalHinhAnhChange,
                                        //     thucungmodalhinhanh: thuCungModalHinhAnh,
                                        // })}
                                        onClick={() => {
                                            handleCapNhatNhanVien({
                                                manhanvien: nhanVienModalMaNhanVien,
                                                machucvumoi: nhanVienModalMaChucVu,
                                                maxamoi: nhanVienModalMaXa,
                                                matkhaumoi: nhanVienModalMatKhau,
                                                rematkhaumoi: nhanVienModalReMatKhau,
                                                hotennhanvienmoi: nhanVienModalHoTenNhanVien,
                                                ngaysinhnhanvienmoi: nhanVienModalNgaySinhNhanVien,
                                                gioitinhnhanvienmoi: nhanVienModalGioiTinhNhanVien,
                                                sdtnhanvienmoi: nhanVienModalSdtNhanVien,
                                                diachinhanvienmoi: nhanVienModalDiaChiNhanVien,
                                                hinhdaidiennhanvienmoi: nhanVienModalHinhDaiDienNhanVien,
                                                hinhdaidiennhanvienmoichange: nhanVienModalHinhDaiDienNhanVienChange
                                            })
                                        }}
                                    >Cập nhật</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCloseUpdate()}
                                    >Hủy bỏ</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => handleCloseUpdate()}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ThemThuCungWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // // =============== Xóa thú cưng ===============
    if (type === "xoanhanvien") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>Bạn muốn xóa nhân viên có mã <span style={{ color: `var(--color-primary)` }}>{nhanvien.manhanvien}</span> này?</h1>
                                <p>Thông tin nhân viên không thể khôi phục. Bạn có chắc chắn?</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleXoaNhanVien({ manhanvien: nhanvien.manhanvien }) }}
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