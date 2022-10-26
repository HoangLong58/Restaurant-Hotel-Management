import {format_money} from "../../utils/utils";
import styled from "styled-components";
import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import "../../css/main.css";
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";

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

const Modal = ({ showModal, setShowModal, type, thucung, setReRenderData, handleClose, showToastFromOut }) => {
    const modalRef = useRef();
    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            setShowModal(false);
            // setThuCungModalHinhAnh([]); //Modal chi tiết thú cưng khi tắt sẽ xóa mảng hình
            setHinhAnhMoi([]);  //Modal thêm thú cưng khi tắt sẽ xóa mảng hình
        }
    }

    const keyPress = useCallback(
        (e) => {
            if (e.key === 'Escape' && showModal) {
                setShowModal(false);
                // setThuCungModalHinhAnh([]); //Modal chi tiết thú cưng khi tắt sẽ xóa mảng hình
                setHinhAnhMoi([]);  //Modal thêm thú cưng khi tắt sẽ xóa mảng hình
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

    // =============== Xử lý cập nhật thú cưng ===============
    const handleCapNhatThuCung = async (
        {
            mathucung,
            madanhmucmoi,
            tenthucungmoi,
            gioitinhthucungmoi,
            tuoithucungmoi,
            datiemchungmoi,
            baohanhsuckhoemoi,
            tieudemoi,
            motamoi,
            ghichumoi,
            soluongmoi,
            giabanmoi,
            giamgiamoi,
            thucungmodalhinganhchange,
            thucungmodalhinhanh
        }
    ) => {
        console.log("Dau vao:", { mathucung, madanhmucmoi, tenthucungmoi, gioitinhthucungmoi, tuoithucungmoi, datiemchungmoi, baohanhsuckhoemoi, tieudemoi, motamoi, ghichumoi, soluongmoi, giabanmoi, giamgiamoi, thucungmodalhinganhchange, thucungmodalhinhanh });

        if (madanhmucmoi !== ""
            && tenthucungmoi !== ""
            && gioitinhthucungmoi !== ""
            && tuoithucungmoi !== ""
            // && datiemchungmoi !== ""
            // && baohanhsuckhoemoi !== ""
            && tieudemoi !== ""
            && motamoi !== ""
            && ghichumoi !== ""
            && soluongmoi !== ""
            && giabanmoi !== ""
            && giamgiamoi !== ""
            // && hinhanhmoi !== ""
        ) {
            try {
                // setThuCungModalHinhAnhChange([]);
                if(thucungmodalhinganhchange.length > 0) {
                    const updatethucungres = await axios.post("http://localhost:3001/api/products/updateThuCung", { mathucung, madanhmucmoi, tenthucungmoi, gioitinhthucungmoi, tuoithucungmoi, datiemchungmoi, baohanhsuckhoemoi, tieudemoi, motamoi, ghichumoi, soluongmoi, giabanmoi, giamgiamoi, hinhanhmoi: thucungmodalhinganhchange });
                    console.log("KQ trả về update: ", updatethucungres);
                    setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - ThuCungMain & ThuCungRight.jsx
                    setShowModal(prev => !prev);
                    handleClose();
                    const dataShow = { message: "Thay đổi thú cưng có mã " + mathucung + " thành công!", type: "success" };
                    showToastFromOut(dataShow);
                    setThuCungModalHinhAnhChange([]);
                } else {
                    const updatethucungres = await axios.post("http://localhost:3001/api/products/updateThuCung", { mathucung, madanhmucmoi, tenthucungmoi, gioitinhthucungmoi, tuoithucungmoi, datiemchungmoi, baohanhsuckhoemoi, tieudemoi, motamoi, ghichumoi, soluongmoi, giabanmoi, giamgiamoi, hinhanhmoi: thucungmodalhinhanh });
                    console.log("KQ trả về update: ", updatethucungres);
                    setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - ThuCungMain & ThuCungRight.jsx
                    setShowModal(prev => !prev);
                    handleClose();
                    const dataShow = { message: "Thay đổi thú cưng có mã " + mathucung + " thành công!", type: "success" };
                    showToastFromOut(dataShow);
                    // setThuCungModalHinhAnh([]);
                    setIsUpdate(prev => !prev);
                }
            } catch (err) {
                setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - ThuCungMain & ThuCungRight.jsx
                setShowModal(prev => !prev);
                handleClose();
                const dataShow = { message: "Thất bại! Không thể cập nhật thú cưng có mã " + mathucung, type: "danger" };
                showToastFromOut(dataShow);
            }
        }
    }
    //  test
    const [thuCungModal, setThuCungModal] = useState();
    const [thuCungModalMaDanhMuc, setThuCungModalMaDanhMuc] = useState();
    const [thuCungModalTenThuCung, setThuCungModalTenThuCung] = useState();
    const [thuCungModalGioiTinhThuCung, setThuCungModalGioiTinhThuCung] = useState();
    const [thuCungModalTuoiThuCung, setThuCungModalTuoiThuCung] = useState();
    const [thuCungModalDaTiemChung, setThuCungModalDaTiemChung] = useState();
    const [thuCungModalBaoHanhSucKhoe, setThuCungModalBaoHanhSucKhoe] = useState();
    const [thuCungModalTieuDe, setThuCungModalTieuDe] = useState();
    const [thuCungModalMoTa, setThuCungModalMoTa] = useState();
    const [thuCungModalGhiChu, setThuCungModalGhiChu] = useState();
    const [thuCungModalSoLuong, setThuCungModalSoLuong] = useState();
    const [thuCungModalGiaBan, setThuCungModalGiaBan] = useState();
    const [thuCungModalGiamGia, setThuCungModalGiamGia] = useState();
    const [thuCungModalHinhAnh, setThuCungModalHinhAnh] = useState([]);
    const [thuCungModalHinhAnhChange, setThuCungModalHinhAnhChange] = useState([]);

    const [thuCungModalMaDanhMucOld, setThuCungModalMaDanhMucOld] = useState();
    const [thuCungModalTenThuCungOld, setThuCungModalTenThuCungOld] = useState();
    const [thuCungModalGioiTinhThuCungOld, setThuCungModalGioiTinhThuCungOld] = useState();
    const [thuCungModalTuoiThuCungOld, setThuCungModalTuoiThuCungOld] = useState();
    const [thuCungModalDaTiemChungOld, setThuCungModalDaTiemChungOld] = useState();
    const [thuCungModalBaoHanhSucKhoeOld, setThuCungModalBaoHanhSucKhoeOld] = useState();
    const [thuCungModalTieuDeOld, setThuCungModalTieuDeOld] = useState();
    const [thuCungModalMoTaOld, setThuCungModalMoTaOld] = useState();
    const [thuCungModalGhiChuOld, setThuCungModalGhiChuOld] = useState();
    const [thuCungModalSoLuongOld, setThuCungModalSoLuongOld] = useState();
    const [thuCungModalGiaBanOld, setThuCungModalGiaBanOld] = useState();
    const [thuCungModalGiamGiaOld, setThuCungModalGiamGiaOld] = useState();
    const [thuCungModalHinhAnhOld, setThuCungModalHinhAnhOld] = useState([]);
    useEffect(() => {
        // setThuCungModalHinhAnh([]);
        // setThuCungModalHinhAnhChange([]);
        setHinhAnhMoi([]);
        const getThuCung = async () => {
            try {
                const thucungres = await axios.post("http://localhost:3001/api/products/findThuCungById", { mathucung: thucung.mathucung });
                setThuCungModal(thucungres.data);
                setThuCungModalMaDanhMuc(thucungres.data[0].madanhmuc);
                setThuCungModalTenThuCung(thucungres.data[0].tenthucung);
                setThuCungModalGioiTinhThuCung(thucungres.data[0].gioitinhthucung);
                setThuCungModalTuoiThuCung(thucungres.data[0].tuoithucung);
                setThuCungModalDaTiemChung(thucungres.data[0].datiemchung);
                setThuCungModalBaoHanhSucKhoe(thucungres.data[0].baohanhsuckhoe);
                setThuCungModalTieuDe(thucungres.data[0].tieude);
                setThuCungModalMoTa(thucungres.data[0].mota);
                setThuCungModalGhiChu(thucungres.data[0].ghichu);
                setThuCungModalSoLuong(thucungres.data[0].soluong);
                setThuCungModalGiaBan(thucungres.data[0].giaban);
                setThuCungModalGiamGia(thucungres.data[0].giamgia);

                setThuCungModalMaDanhMucOld(thucungres.data[0].madanhmuc);
                setThuCungModalTenThuCungOld(thucungres.data[0].tenthucung);
                setThuCungModalGioiTinhThuCungOld(thucungres.data[0].gioitinhthucung);
                setThuCungModalTuoiThuCungOld(thucungres.data[0].tuoithucung);
                setThuCungModalDaTiemChungOld(thucungres.data[0].datiemchung);
                setThuCungModalBaoHanhSucKhoeOld(thucungres.data[0].baohanhsuckhoe);
                setThuCungModalTieuDeOld(thucungres.data[0].tieude);
                setThuCungModalMoTaOld(thucungres.data[0].mota);
                setThuCungModalGhiChuOld(thucungres.data[0].ghichu);
                setThuCungModalSoLuongOld(thucungres.data[0].soluong);
                setThuCungModalGiaBanOld(thucungres.data[0].giaban);
                setThuCungModalGiamGiaOld(thucungres.data[0].giamgia);
            } catch (err) {
                console.log("Lỗi lấy danh mục: ", err);
            }
        }
        const getHinhAnh = async () => {
            try {
                setThuCungModalHinhAnh([]);
                const hinhanhres = await axios.post("http://localhost:3001/api/products/findImage", { mathucung: thucung.mathucung });
                hinhanhres.data.map((thucung, index) => {
                    setThuCungModalHinhAnh(prev => {
                        const isHave = thuCungModalHinhAnh.includes(thucung.hinhanh);
                        if (isHave) {
                            return [...prev];
                        } else {
                            return [...prev, thucung.hinhanh];
                        }
                    });
                    // setThuCungModalHinhAnhChange(prev => {
                    //     const isHave = thuCungModalHinhAnhChange.includes(thucung.hinhanh);
                    //     if (isHave) {
                    //         return [...prev];
                    //     } else {
                    //         return [...prev, thucung.hinhanh];
                    //     }
                    // });
                    setThuCungModalHinhAnhOld(prev => {
                        const isHave = thuCungModalHinhAnhOld.includes(thucung.hinhanh);
                        if (isHave) {
                            return [...prev];
                        } else {
                            return [...prev, thucung.hinhanh];
                        }
                    });
                })
            } catch (err) {
                console.log("Lỗi lấy hình ảnh thú cưng: ", err);
            }
        }
        getThuCung();
        getHinhAnh();
    }, [thucung]);
    console.log("Thú cưng modal: ", thuCungModal);

    const [isUpdate, setIsUpdate] = useState(true);
    useEffect(() => {
        const getImageUpdate = async () => {
            try {
                const hinhanhres = await axios.post("http://localhost:3001/api/products/findImage", { mathucung: thucung.mathucung });
                setThuCungModalHinhAnh(hinhanhres.data);
            } catch (err) {
                console.log("Lỗi lấy hình ảnh thú cưng: ", err);
            }
        }
        getImageUpdate();
    },[isUpdate])
    // Thay đổi hình ảnh
    const handleChangeImg = (hinhmoiarray) => {
        setThuCungModalHinhAnhChange([]);
        for (let i = 0; i < hinhmoiarray.length; i++) {
            // console.log("hinh moi: ", hinhmoiarray[i]);
            const hinhanhunique = new Date().getTime() + hinhmoiarray[i].name;
            const storage = getStorage(app);
            const storageRef = ref(storage, hinhanhunique);
            const uploadTask = uploadBytesResumable(storageRef, hinhmoiarray[i]);

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
                            setThuCungModalHinhAnhChange(prev => [...prev, downloadURL]);
                        } catch (err) {
                            console.log("Lỗi cập nhật hình ảnh:", err);
                        }
                    });
                }
            );
        }
    }

    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal
        // setThuCungModalHinhAnh(thuCungModalHinhAnhOld);
        setThuCungModalMaDanhMuc(thuCungModalMaDanhMucOld);
        setThuCungModalTenThuCung(thuCungModalTenThuCungOld);
        setThuCungModalGioiTinhThuCung(thuCungModalGioiTinhThuCungOld);
        setThuCungModalTuoiThuCung(thuCungModalTuoiThuCungOld);
        setThuCungModalDaTiemChung(thuCungModalDaTiemChungOld);
        setThuCungModalBaoHanhSucKhoe(thuCungModalBaoHanhSucKhoeOld);
        setThuCungModalTieuDe(thuCungModalTieuDeOld);
        setThuCungModalMoTa(thuCungModalMoTaOld);
        setThuCungModalGhiChu(thuCungModalMaDanhMucOld);
        setThuCungModalSoLuong(thuCungModalSoLuongOld);
        setThuCungModalGiaBan(thuCungModalGiaBanOld);
        setThuCungModalGiamGia(thuCungModalMaDanhMucOld);

        setShowModal(prev => !prev);
        // setHinhAnhMoi([]);  //Đóng modal sẽ xóa mảng hình cũ ở Modal Thêm thú cưng
        // setThuCungModalHinhAnhChange([]);
    }
    

    // Checkbox - Update thú cưng - Đã tiêm chủng - Được check
    const handleCheckboxDaTiemUpdate = (e) => {
        if (e.target.checked) { //Khi checked
            setThuCungModalDaTiemChung(e.target.value);
        } else {
            setThuCungModalDaTiemChung("");
        }
    }

    // Checkbox - Update thú cưng - Bảo hành sức khỏe - Được check
    const handleCheckboxBaoHanhUpdate = (e) => {
        if (e.target.checked) { //Khi checked
            setThuCungModalBaoHanhSucKhoe(e.target.value);
        } else {
            setThuCungModalBaoHanhSucKhoe("");
        }
    }

    console.log("Đã tiêm chủng: ", thuCungModalDaTiemChung);
    console.log("Được bảo hành sức khỏe: ", thuCungModalBaoHanhSucKhoe);
    console.log("thucungmodalhinhanh: ", thuCungModalHinhAnh);
    console.log("thucungmodalhinhanhchange: ", thuCungModalHinhAnhChange);

    // =============== Xử lý thêm thú cưng ===============
    const [maDanhMucMoi, setMaDanhMucMoi] = useState("1");  //Danh mục mặc định là Chó
    const [tenThuCungMoi, setTenThuCungMoi] = useState("");
    const [gioiTinhThuCungMoi, setGioiTinhThuCungMoi] = useState("Đực");    //Giới tính mặc định là "Đực"
    const [tuoiThuCungMoi, setTuoiThuCungMoi] = useState("");
    const [daTiemChungMoi, setDaTiemChungMoi] = useState("");
    const [baoHanhSucKhoeMoi, setBaoHanhSucKhoeMoi] = useState("");
    const [tieuDeMoi, setTieuDeMoi] = useState("");
    const [moTaMoi, setMoTaMoi] = useState("");
    const [ghiChuMoi, setGhiChuMoi] = useState("");
    const [soLuongMoi, setSoLuongMoi] = useState("");
    const [giaBanMoi, setGiaBanMoi] = useState("");
    const [giamGiaMoi, setGiamGiaMoi] = useState("");
    const [hinhAnhMoi, setHinhAnhMoi] = useState([]);   //Mảng chứa hình ảnh

    // Thay đổi hình ảnh
    const handleShowImg = (hinhmoiarray) => {
        // Chạy vòng lặp thêm từng hình trong mảng lên firebase rồi lưu vô mảng [hinhAnhMoi] ở modal Thêm thú cưng
        setHinhAnhMoi([]);
        for (let i = 0; i < hinhmoiarray.length; i++) {
            // console.log("hinh moi: ", hinhmoiarray[i]);
            const hinhanhunique = new Date().getTime() + hinhmoiarray[i].name;
            const storage = getStorage(app);
            const storageRef = ref(storage, hinhanhunique);
            const uploadTask = uploadBytesResumable(storageRef, hinhmoiarray[i]);

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
                            setHinhAnhMoi(prev => [...prev, downloadURL]);
                            console.log("Up thành công 1 hình: ", downloadURL);
                        } catch (err) {
                            console.log("Lỗi show hình ảnh:", err);
                        }
                    });
                }
            );
        }
        console.log("mang hinh: ", hinhmoiarray);
    }

    const handleThemThuCung = async (
        { madanhmucmoi,
            tenthucungmoi,
            gioitinhthucungmoi,
            tuoithucungmoi,
            datiemchungmoi,
            baohanhsuckhoemoi,
            tieudemoi,
            motamoi,
            ghichumoi,
            soluongmoi,
            giabanmoi,
            giamgiamoi,
            hinhanhmoi  //Mảng hình nhe
        }) => {
        console.log("Thu Cung duoc them moi: ",{
            madanhmucmoi,
            tenthucungmoi,
            gioitinhthucungmoi,
            tuoithucungmoi,
            datiemchungmoi,
            baohanhsuckhoemoi,
            tieudemoi,
            motamoi,
            ghichumoi,
            soluongmoi,
            giabanmoi,
            giamgiamoi,
            hinhanhmoi  //Mảng hình nhe
        });
        if (madanhmucmoi !== ""
            && tenthucungmoi !== ""
            && gioitinhthucungmoi !== ""
            && tuoithucungmoi !== ""
            // && datiemchungmoi !== ""
            // && baohanhsuckhoemoi !== ""
            && tieudemoi !== ""
            && motamoi !== ""
            && ghichumoi !== ""
            && soluongmoi >= 1
            && giabanmoi >= 0
            && giamgiamoi >= 0
            && hinhanhmoi.length > 0
        ) {
            try {
                const insertthucungres = axios.post("http://localhost:3001/api/products/insertThuCung",
                    {
                        madanhmuc: madanhmucmoi,
                        tenthucung: tenthucungmoi,
                        gioitinhthucung: gioitinhthucungmoi,
                        tuoithucung: tuoithucungmoi,
                        datiemchung: datiemchungmoi,
                        baohanhsuckhoe: baohanhsuckhoemoi,
                        tieude: tieudemoi,
                        mota: motamoi,
                        ghichu: ghichumoi,
                        soluong: soluongmoi,
                        giaban: giabanmoi,
                        giamgia: giamgiamoi,
                        hinhanh: hinhanhmoi
                    }
                );
                console.log("KQ trả về update: ", insertthucungres);
                setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
                setShowModal(prev => !prev);
                const dataShow = { message: "Thêm thú cưng " + tenthucungmoi + " thành công!", type: "success" };
                showToastFromOut(dataShow);
                setHinhAnhMoi([]);  //Làm rỗng mảng hình
            } catch (err) {
                console.log("Lỗi insert: ", err);
                setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
                setShowModal(prev => !prev);
                const dataShow = { message: "Đã có lỗi khi thêm thú cưng " + tenthucungmoi, type: "danger" };
                showToastFromOut(dataShow); //Hiện toast thông báo
            }
        } else {
            const dataShow = { message: "Bạn chưa nhập thông tin cho thú cưng", type: "danger" };
            showToastFromOut(dataShow); //Hiện toast thông báo
        }
    }

    // State chứa mảng danh mục - Lấy về danh mục để hiện select-option
    const [danhMuc, setDanhMuc] = useState([]);
    useEffect(() => {
        const getDanhMuc = async () => {
            try {
                const danhmucres = await axios.post("http://localhost:3001/api/products/getDanhMuc", {});
                setDanhMuc(danhmucres.data);
                console.log("Mảng danh mục: ", danhMuc);
            } catch (err) {
                console.log("Lỗi lấy danh mục: ", err);
            }
        }
        getDanhMuc();
    }, [thucung])
    // Checkbox - Thêm thú cưng - Đã tiêm chủng
    const [daTiem, setDaTiem] = useState(false);
    const handleCheckboxDaTiem = (value) => {
        setDaTiem(!daTiem);
        if (!daTiem) { //Khi checked
            setDaTiemChungMoi(value);
        } else {
            setDaTiemChungMoi("");
        }
    }
    // Checkbox - Thêm thú cưng - Bảo hành sức khỏe
    const [baoHanh, setBaoHanh] = useState(false);
    const handleCheckboxBaoHanh = (value) => {
        setBaoHanh(!baoHanh);
        if (!baoHanh) { //Khi checked
            setBaoHanhSucKhoeMoi(value);
        } else {
            setBaoHanhSucKhoeMoi("");
        }
    }

    // =============== Xử lý xóa thú cưng ===============
    const handleXoaThuCung = async ({ mathucung }) => {
        if (mathucung !== "") {
            try {
                const deletethucungres = await axios.post("http://localhost:3001/api/products/deleteThuCung", { mathucung });
                console.log("KQ trả về delete: ", deletethucungres);
                setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
                setShowModal(prev => !prev);
                handleClose();  //Đóng thanh tìm kiếm
                const dataShow = { message: "Đã xóa thú cưng mã " + mathucung + " thành công!", type: "success" };
                showToastFromOut(dataShow);
            } catch (err) {
                console.log("Lỗi Delete thú cưng err: ", err);
            }
        }
    }

    // =============== Xử lý Xem chi tiết thú cưng ===============
    const handleCloseChiTiet = () => {
        setShowModal(prev => !prev);
        setHinhAnhMoi([]);  //Đóng modal sẽ xóa mảng hình cũ ở Modal Thêm thú cưng
    }
    console.log("Giới tính: ", maDanhMucMoi);
    // ================================================================
    //  =============== Xem chi tiết thú cưng ===============
    if (type === "chitietthucung") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết thú cưng</H1>
                            <ModalForm>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Mã thú cưng:</FormSpan>
                                        <FormInput type="text" value={thucung.mathucung} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tên thú cưng:</FormSpan>
                                        <FormInput type="text" value={thucung.tenthucung} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Danh mục:</FormSpan>
                                        <FormInput type="text" value={thucung.tendanhmuc} readOnly />
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giới tính:</FormSpan>
                                        <FormInput type="text" value={thucung.gioitinhthucung} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tuổi:</FormSpan>
                                        <FormInput type="text" value={thucung.tuoithucung} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tiêm chủng:</FormSpan>
                                        <FormInput type="text" value={thucung.datiemchung} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Bảo hành:</FormSpan>
                                        <FormInput type="text" value={thucung.baohanhsuckhoe} readOnly />
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tiêu đề:</FormSpan>
                                        <FormInput type="text" value={thucung.tieude} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Ghi chú:</FormSpan>
                                        <FormInput type="text" value={thucung.ghichu} readOnly />
                                    </ModalChiTietItem>
                                </div>
                                <ModalChiTietItem>
                                    <FormSpan>Mô tả:</FormSpan>
                                    <FormInput type="text" value={thucung.mota} readOnly />
                                </ModalChiTietItem>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Số lượng:</FormSpan>
                                        <FormInput type="text" value={thucung.soluong} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giá bán:</FormSpan>
                                        <FormInput type="text" value={thucung.giaban ? format_money((thucung.giaban).toString()) : null} readOnly />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giảm giá:</FormSpan>
                                        <FormInput type="text" value={thucung.giamgia ? format_money((thucung.giamgia).toString()) : null} readOnly />
                                    </ModalChiTietItem>
                                </div>
                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <ImageWrapper>
                                        {
                                            thuCungModalHinhAnh.map((hinhanh, index) => {
                                                return (
                                                    <ChiTietHinhAnh src={hinhanh} />
                                                );
                                            })
                                        }
                                    </ImageWrapper>
                                </ModalChiTietItem>
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
    console.log("daTiemChungMoi: ", daTiemChungMoi);
    console.log("baoHanhSucKhoeMoi: ", baoHanhSucKhoeMoi);
    if (type === "themthucung") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ThemThuCungWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm thú cưng mới</H1>
                            <ModalForm>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tên thú cưng:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setTenThuCungMoi(e.target.value)} placeholder="Tên của thú cưng" />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Danh mục:</FormSpan>
                                        <FormSelect onChange={(e) => { setMaDanhMucMoi(e.target.value) }}>
                                            {danhMuc.map((danhmuc, key) => {
                                                return (
                                                    <FormOption value={danhmuc.madanhmuc}> {danhmuc.tendanhmuc} </FormOption>
                                                )
                                            })}
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giới tính:</FormSpan>
                                        <FormSelect onChange={(e) => { setGioiTinhThuCungMoi(e.target.value) }}>
                                            <FormOption value="Đực"> Đực </FormOption>
                                            <FormOption value="Cái"> Cái </FormOption>
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tuổi thú cưng:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setTuoiThuCungMoi(e.target.value)} placeholder="Tuổi của thú cưng" />
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormLabel>
                                            <FormCheckbox type="checkbox" onChange={(e) => handleCheckboxDaTiem(e.target.value)} value="Đã tiêm chủng" />
                                            <FormSpan>Đã tiêm chủng</FormSpan>
                                        </FormLabel>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormLabel>
                                            <FormCheckbox type="checkbox" onChange={(e) => handleCheckboxBaoHanh(e.target.value)} value="Được bảo hành sức khỏe" />
                                            <FormSpan>Bảo hành sức khỏe</FormSpan>
                                        </FormLabel>
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tiêu đề:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setTieuDeMoi(e.target.value)} placeholder="Nhập vào tiêu đề hiển thị thú cưng" />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Ghi chú:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setGhiChuMoi(e.target.value)} placeholder="Ghi chú cho thú cưng này" />
                                    </ModalChiTietItem>
                                </div>
                                <ModalChiTietItem>
                                    <FormSpan>Mô tả:</FormSpan>
                                    <FormTextArea rows="4" cols="50" onChange={(e) => setMoTaMoi(e.target.value)} placeholder="Mô tả về thú cưng này" />
                                </ModalChiTietItem>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Số lượng:</FormSpan>
                                        <FormInput type="number" min="1" onChange={(e) => setSoLuongMoi(e.target.value)} placeholder="Số lượng của thú cưng" />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giá bán:</FormSpan>
                                        <FormInput type="number" min="0" onChange={(e) => setGiaBanMoi(e.target.value)} placeholder="Giá thú cưng" />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giảm giá:</FormSpan>
                                        <FormInput type="number" min="0" onChange={(e) => setGiamGiaMoi(e.target.value)} placeholder="Giá sau khi giảm" />
                                    </ModalChiTietItem>
                                </div>
                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" multiple onChange={(e) => handleShowImg(e.target.files)} />
                                    <ImageWrapper>
                                        {
                                            hinhAnhMoi.length > 0   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                hinhAnhMoi.map((hinhanh, index) => {
                                                    return (
                                                        <ChiTietHinhAnh src={hinhanh} />
                                                    );
                                                })
                                                :   //Khi mảng hình trống thì hiện No Available Image
                                                <ChiTietHinhAnh src={"https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} />
                                        }
                                    </ImageWrapper>
                                </ModalChiTietItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleThemThuCung({
                                            madanhmucmoi: maDanhMucMoi,
                                            tenthucungmoi: tenThuCungMoi,
                                            gioitinhthucungmoi: gioiTinhThuCungMoi,
                                            tuoithucungmoi: tuoiThuCungMoi,
                                            datiemchungmoi: daTiemChungMoi,
                                            baohanhsuckhoemoi: baoHanhSucKhoeMoi,
                                            tieudemoi: tieuDeMoi,
                                            motamoi: moTaMoi,
                                            ghichumoi: ghiChuMoi,
                                            soluongmoi: soLuongMoi,
                                            giabanmoi: giaBanMoi,
                                            giamgiamoi: giamGiaMoi,
                                            hinhanhmoi: hinhAnhMoi
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
    // =============== Chỉnh sửa thú cưng ===============
    if (type === "chinhsuathucung") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ThemThuCungWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật thông tin thú cưng</H1>
                            <ModalForm>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tên thú cưng:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setThuCungModalTenThuCung(e.target.value)} value={thuCungModalTenThuCung} />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Danh mục:</FormSpan>
                                        <FormSelect onChange={(e) => { setThuCungModalMaDanhMuc(e.target.value) }}>
                                            {danhMuc.map((danhmuc, key) => {
                                                if (danhmuc.madanhmuc === thuCungModalMaDanhMuc) {
                                                    return (
                                                        <FormOption value={danhmuc.madanhmuc} selected> {danhmuc.tendanhmuc} </FormOption>
                                                    )
                                                } else {
                                                    return (
                                                        <FormOption value={danhmuc.madanhmuc}> {danhmuc.tendanhmuc} </FormOption>
                                                    )
                                                }
                                            })}
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giới tính:</FormSpan>
                                        <FormSelect onChange={(e) => { setThuCungModalGioiTinhThuCung(e.target.value) }}>
                                            {
                                                thuCungModalGioiTinhThuCung === "Đực"
                                                    ?
                                                    <FormOption value="Đực" selected> Đực </FormOption>
                                                    :
                                                    <FormOption value="Đực"> Đực </FormOption>
                                            }
                                            {
                                                thuCungModalGioiTinhThuCung === "Cái"
                                                    ?
                                                    <FormOption value="Cái" selected> Cái </FormOption>
                                                    :
                                                    <FormOption value="Cái"> Cái </FormOption>
                                            }
                                        </FormSelect>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tuổi thú cưng:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setThuCungModalTuoiThuCung(e.target.value)} value={thuCungModalTuoiThuCung} />
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormLabel>
                                            {
                                                thuCungModalDaTiemChung === "Đã tiêm chủng"
                                                    ?
                                                    <FormCheckbox type="checkbox" checked={true} onChange={(e) => handleCheckboxDaTiemUpdate(e)} value="Đã tiêm chủng" />
                                                    :
                                                    <FormCheckbox type="checkbox" checked={false} onChange={(e) => handleCheckboxDaTiemUpdate(e)} value="Đã tiêm chủng" />
                                            }
                                            <FormSpan>Đã tiêm chủng</FormSpan>
                                        </FormLabel>
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormLabel>
                                            {
                                                thuCungModalBaoHanhSucKhoe === "Được bảo hành sức khỏe"
                                                    ?
                                                    <FormCheckbox type="checkbox" checked={true} onChange={(e) => handleCheckboxBaoHanhUpdate(e)} value="Được bảo hành sức khỏe" />
                                                    :
                                                    <FormCheckbox type="checkbox" checked={false} onChange={(e) => handleCheckboxBaoHanhUpdate(e)} value="Được bảo hành sức khỏe" />
                                            }
                                            <FormSpan>Bảo hành sức khỏe</FormSpan>
                                        </FormLabel>
                                    </ModalChiTietItem>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Tiêu đề:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setThuCungModalTieuDe(e.target.value)} value={thuCungModalTieuDe} />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Ghi chú:</FormSpan>
                                        <FormInput type="text" onChange={(e) => setThuCungModalGhiChu(e.target.value)} value={thuCungModalGhiChu} />
                                    </ModalChiTietItem>
                                </div>
                                <ModalChiTietItem>
                                    <FormSpan>Mô tả:</FormSpan>
                                    <FormTextArea rows="4" cols="50" onChange={(e) => setThuCungModalMoTa(e.target.value)} value={thuCungModalMoTa} />
                                </ModalChiTietItem>
                                <div style={{ display: "flex" }}>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Số lượng:</FormSpan>
                                        <FormInput type="number" min="1" onChange={(e) => setThuCungModalSoLuong(e.target.value)} value={thuCungModalSoLuong} />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giá bán:</FormSpan>
                                        <FormInput type="number" min="0" onChange={(e) => setThuCungModalGiaBan(e.target.value)} value={thuCungModalGiaBan} />
                                    </ModalChiTietItem>
                                    <ModalChiTietItem style={{ flex: "1" }}>
                                        <FormSpan>Giảm giá:</FormSpan>
                                        <FormInput type="number" min="0" onChange={(e) => setThuCungModalGiamGia(e.target.value)} value={thuCungModalGiamGia} />
                                    </ModalChiTietItem>
                                </div>
                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" multiple onChange={(e) => handleChangeImg(e.target.files)} placeholder="Nhập vào tên danh mục thú cưng" />
                                    <ImageWrapper>
                                        {
                                            thuCungModalHinhAnhChange.length > 0   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                thuCungModalHinhAnhChange.map((hinhanhupdate, index) => {
                                                    return (
                                                        <ChiTietHinhAnh src={hinhanhupdate} />
                                                    );
                                                })
                                                :
                                                thuCungModalHinhAnh.length > 0
                                                    ?
                                                    thuCungModalHinhAnh.map((hinhanh, index) => {
                                                        return (
                                                            <ChiTietHinhAnh src={hinhanh} />
                                                        );
                                                    })
                                                    : null

                                        }
                                    </ImageWrapper>
                                </ModalChiTietItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCapNhatThuCung({
                                            mathucung: thucung.mathucung,
                                            madanhmucmoi: thuCungModalMaDanhMuc,
                                            tenthucungmoi: thuCungModalTenThuCung,
                                            gioitinhthucungmoi: thuCungModalGioiTinhThuCung,
                                            tuoithucungmoi: thuCungModalTuoiThuCung,
                                            datiemchungmoi: thuCungModalDaTiemChung,
                                            baohanhsuckhoemoi: thuCungModalBaoHanhSucKhoe,
                                            tieudemoi: thuCungModalTieuDe,
                                            motamoi: thuCungModalMoTa,
                                            ghichumoi: thuCungModalGhiChu,
                                            soluongmoi: thuCungModalSoLuong,
                                            giabanmoi: thuCungModalGiaBan,
                                            giamgiamoi: thuCungModalGiamGia,
                                            thucungmodalhinganhchange: thuCungModalHinhAnhChange,
                                            thucungmodalhinhanh: thuCungModalHinhAnh,
                                        })}
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
    if (type === "xoathucung") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>Bạn muốn xóa thú cưng có mã <span style={{ color: `var(--color-primary)` }}>{thucung.mathucung}</span> này?</h1>
                                <p>Thông tin thú cưng không thể khôi phục. Bạn có chắc chắn?</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleXoaThuCung({ mathucung: thucung.mathucung }) }}
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