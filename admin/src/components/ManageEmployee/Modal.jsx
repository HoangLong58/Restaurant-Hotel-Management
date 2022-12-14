import { CloseOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import app from "../../firebase";

// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';

// SERVICES
import * as EmployeeService from "../../service/EmployeeService";
import * as PositionService from "../../service/PositionService";
import { getYearWork } from "../../utils/utils";

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
    width: 900px;
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
    object-fit: contain;
    height: 100px;
`

const ModalChiTietItem = styled.div`
margin: 2px 30px;
display: flex;
flex-direction: column;
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
    resize: none;
    &:focus {
        border: 1px solid var(--color-success);
        box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
    }
`
// Chi ti???t
const ChiTietHinhAnh = styled.img`
    width: 100%;
    height: 100%;
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

const H1Delete = styled.h1` 
    width: "90%";
    text-align: center;
`

// EYE
const Eye = styled.div`
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 18px;
    display: flex;
    z-index: 10;
`

const Label = styled.label`
    position: relative;
`

const AlertWrapper = styled.div`
    width: 50%;
    height: auto;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: var(--color-white);
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    position: relative;
    z-index: 10;
    border-radius: 10px;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
`

const ChangePassBtn = styled.button`
    padding: 0px 35px;
    width: auto;
    height: 45px;
    margin: 30px 0px 0px 0px;
    border: none;
    outline: none;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 700;
    box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: var(--color-dark);
    background-color: var(--color-light);
    transition: all 0.3s ease;
    &:hover {
        color: var(--color-white);
        background-color: var(--color-primary);
    }
    &:active {
        transform: scale(1.05);
    }   
`

const Modal = ({ showModal, setShowModal, type, employee, setReRenderData, handleClose, showToastFromOut }) => {
    // Modal
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

    // X??? l?? Th??m nh??n vi??n
    const [positionList, setPositionList] = useState([]);
    const [positionIdModalNew, setPositionIdModalNew] = useState();
    const [employeeFirstNameModalNew, setEmployeeFirstNameModalNew] = useState();
    const [employeeLastNameModalNew, setEmployeeLastNameModalNew] = useState();
    const [employeeGenderModalNew, setEmployeeGenderModalNew] = useState();
    const [employeeBirthdayModalNew, setEmployeeBirthdayModalNew] = useState();
    const [employeeStartJobModalNew, setEmployeeStartJobModalNew] = useState();
    const [employeePhoneNumberModalNew, setEmployeePhoneNumberModalNew] = useState();
    const [employeeEmailModalNew, setEmployeeEmailModalNew] = useState();
    const [employeePasswordModalNew, setEmployeePasswordModalNew] = useState();
    const [employeeRePasswordModalNew, setEmployeeRePasswordModalNew] = useState();
    const [employeeImageModalNew, setEmployeeImageModalNew] = useState(null);

    useEffect(() => {
        setEmployeeFirstNameModalNew();
        setEmployeeLastNameModalNew();
        setEmployeeBirthdayModalNew();
        setEmployeeStartJobModalNew();
        setEmployeeGenderModalNew();
        setEmployeePhoneNumberModalNew();
        setEmployeeEmailModalNew();
        setEmployeePasswordModalNew();
        setEmployeeRePasswordModalNew();
        setEmployeeImageModalNew(null);
        setPositionIdModalNew();
    }, [showModal]);

    useEffect(() => {
        const getPosition = async () => {
            try {
                const positionRes = await PositionService.getPositions();
                setPositionList(positionRes.data.data);
            } catch (err) {
                console.log("L???i l???y position: ", err.response);
            }
        };
        getPosition();
    }, []);

    const handleChangeEmail = (e) => {
        // ???????c nh???p @ v?? . nh??ng k?? t??? ??b kh??c th?? kh??ng
        const resultEmail = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setEmployeeEmailModalNew(resultEmail);
    }

    const handleChangePhoneNumber = (e) => {
        const resultPhoneNumber = e.target.value.replace(/[^0-9 ]/gi, '');
        setEmployeePhoneNumberModalNew(resultPhoneNumber);
    }

    const handleChangePassword = (e) => {
        setEmployeePasswordModalNew(e.target.value);
    }
    const handleChangeRePassword = (e) => {
        setEmployeeRePasswordModalNew(e.target.value);
    }
    // --Show/ hide password register
    const [passwordType, setPasswordType] = useState("password");
    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }
    // --Show/ hide re-password register
    const [rePasswordType, setRePasswordType] = useState("password");
    const toggleRePassword = () => {
        if (rePasswordType === "password") {
            setRePasswordType("text")
            return;
        }
        setRePasswordType("password")
    }

    // Thay ?????i h??nh ???nh
    const handleShowImg = (hinhmoi) => {
        const hinhanhunique = new Date().getTime() + hinhmoi.name;
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
                        setEmployeeImageModalNew(downloadURL);
                    } catch (err) {
                        console.log("L???i c???p nh???t h??nh ???nh:", err);
                    }
                });
            }
        );
    }

    const handleCreateEmployee = async (
        employeeFirstName,
        employeeLastName,
        employeeBirthday,
        employeeStartJob,
        employeeGender,
        employeePhoneNumber,
        employeeEmail,
        employeePassword,
        employeeRePassword,
        employeeImage,
        positionId
    ) => {
        console.log(":ssssssss: ", employeeFirstName,
            employeeLastName,
            employeeBirthday,
            employeeStartJob,
            employeeGender,
            employeePhoneNumber,
            employeeEmail,
            employeePassword,
            employeeRePassword,
            employeeImage,
            positionId);
        if (employeePassword !== employeeRePassword) {
            // Toast
            const dataToast = { message: "M???t kh???u kh??ng tr??ng nhau!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        try {
            const createEmployeeRes = await EmployeeService.createEmployee({
                employeeFirstName: employeeFirstName,
                employeeLastName: employeeLastName,
                employeeBirthday: employeeBirthday,
                employeeStartJob: employeeStartJob,
                employeeGender: employeeGender,
                employeePhoneNumber: employeePhoneNumber,
                employeeEmail: employeeEmail,
                employeePassword: employeePassword,
                employeeImage: employeeImage,
                positionId: positionId
            });
            if (!createEmployeeRes) {
                // Toast
                const dataToast = { message: createEmployeeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            setEmployeeImageModalNew(null);
            // Toast
            const dataToast = { message: createEmployeeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }
    // MODAL DATA
    const [employeeModal, setEmployeeModal] = useState();
    const [employeeIdModal, setEmployeeIdModal] = useState();
    const [positionIdModal, setPositionIdModal] = useState();
    const [employeeFirstNameModal, setEmployeeFirstNameModal] = useState();
    const [employeeLastNameModal, setEmployeeLastNameModal] = useState();
    const [employeePasswordModal, setEmployeePasswordModal] = useState(null);
    const [employeeRePasswordModal, setEmployeeRePasswordModal] = useState(null);
    const [employeeGenderModal, setEmployeeGenderModal] = useState();
    const [employeeBirthdayModal, setEmployeeBirthdayModal] = useState();
    const [employeeStartJobModal, setEmployeeStartJobModal] = useState();
    const [employeeEmailModal, setEmployeeEmailModal] = useState();
    const [employeePhoneNumberModal, setEmployeePhoneNumberModal] = useState();
    const [employeeImageModal, setEmployeeImageModal] = useState();
    const [isChangePasswordUpdate, setIsChangePasswordUpdate] = useState(false);
    useEffect(() => {
        const getEmployeeModal = async () => {
            try {
                const employeeRes = await EmployeeService.findEmployeeById({
                    employeeId: employee.employee_id
                });
                setEmployeeModal(employeeRes.data.data);
                setEmployeeIdModal(employeeRes.data.data.employee_id);
                setPositionIdModal(employeeRes.data.data.position_id);
                setEmployeeFirstNameModal(employeeRes.data.data.employee_first_name);
                setEmployeeLastNameModal(employeeRes.data.data.employee_last_name);
                setEmployeeGenderModal(employeeRes.data.data.employee_gender);
                setEmployeeBirthdayModal(employeeRes.data.data.employee_birthday);
                setEmployeeStartJobModal(employeeRes.data.data.employee_start_job);
                setEmployeeEmailModal(employeeRes.data.data.employee_email);
                setEmployeePhoneNumberModal(employeeRes.data.data.employee_phone_number);
                setEmployeeImageModal(employeeRes.data.data.employee_image);
            } catch (err) {
                console.log("L???i l???y employee: ", err.response);
            }
        }
        if (employee) {
            getEmployeeModal();
            setIsChangePasswordUpdate(false);
        }
    }, [employee, showModal]);
    console.log("employeeModal: ", employeeModal);

    // =============== X??? l?? Disable Employee ===============
    const handleDisableEmployee = async (employeeId) => {
        try {
            const disableEmployeeRes = await EmployeeService.updateEmployeeStateToDisable({
                employeeId: employeeId
            });
            if (!disableEmployeeRes) {
                // Toast
                const dataToast = { message: disableEmployeeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: disableEmployeeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // =============== X??? l?? Able Employee ===============
    const handleAbleEmployee = async (employeeId) => {
        try {
            const ableEmployeeRes = await EmployeeService.updateEmployeeStateToAble({
                employeeId: employeeId
            });
            if (!ableEmployeeRes) {
                // Toast
                const dataToast = { message: ableEmployeeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: ableEmployeeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // UPDATE:
    const handleChangeEmailUpdate = (e) => {
        // ???????c nh???p @ v?? . nh??ng k?? t??? ??b kh??c th?? kh??ng
        const resultEmail = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setEmployeeEmailModal(resultEmail);
    }

    const handleChangePhoneNumberUpdate = (e) => {
        const resultPhoneNumber = e.target.value.replace(/[^0-9 ]/gi, '');
        setEmployeePhoneNumberModal(resultPhoneNumber);
    }

    const handleChangePasswordUpdate = (e) => {
        setEmployeePasswordModal(e.target.value);
    }
    const handleChangeRePasswordUpdate = (e) => {
        setEmployeeRePasswordModal(e.target.value);
    }

    // Thay ?????i h??nh ???nh
    const handleChangeImg = (hinhmoi) => {
        const hinhanhunique = new Date().getTime() + hinhmoi.name;
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
                        setEmployeeImageModal(downloadURL);
                    } catch (err) {
                        console.log("L???i c???p nh???t h??nh ???nh:", err);
                    }
                });
            }
        );
    }

    // C???p nh???t nh??n vi??n
    const handleUpdateEmployee = async (
        employeeFirstNameModal,
        employeeLastNameModal,
        employeeBirthdayModal,
        employeeStartJobModal,
        employeeGenderModal,
        employeePhoneNumberModal,
        employeeEmailModal,
        employeePasswordModal,
        employeeRePasswordModal,
        employeeImageModal,
        positionIdModal,
        employeeIdModal
    ) => {
        if (employeePasswordModal !== null && employeeRePasswordModal !== null && employeePasswordModal !== employeeRePasswordModal) {
            // Toast
            const dataToast = { message: "M???t kh???u kh??ng tr??ng nhau!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        try {
            const updateEmployeeRes = await EmployeeService.updateEmployee({
                employeeFirstName: employeeFirstNameModal,
                employeeLastName: employeeLastNameModal,
                employeeBirthday: employeeBirthdayModal,
                employeeStartJob: employeeStartJobModal,
                employeeGender: employeeGenderModal,
                employeePhoneNumber: employeePhoneNumberModal,
                employeeEmail: employeeEmailModal,
                employeePassword: employeePasswordModal,
                employeeImage: employeeImageModal,
                positionId: positionIdModal,
                employeeId: employeeIdModal
            });
            if (!updateEmployeeRes) {
                // Toast
                const dataToast = { message: updateEmployeeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: updateEmployeeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // X??a nh??n vi??n
    const handleDeleteEmployee = async (employeeId) => {
        try {
            const deleteEmployeeRes = await EmployeeService.deleteEmployee(employeeId);
            if (!deleteEmployeeRes) {
                // Toast
                const dataToast = { message: deleteEmployeeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: deleteEmployeeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // ================================================================
    // Chi ti???t nh??n vi??n
    if (type === "detailEmployee") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi ti???t Nh??n vi??n</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <ChiTietHinhAnh src={employeeModal ? employeeModal.employee_image : null} />
                                    </div>
                                    <div className="col-lg-9">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>M?? Nh??n vi??n:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? employeeModal.employee_id : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>H??? t??n:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? employeeModal.employee_first_name + " " + employeeModal.employee_last_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Gi???i t??nh:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? employeeModal.employee_gender : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ng??y sinh:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? employeeModal.employee_birthday : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ch???c v???:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? employeeModal.position_name : null} readOnly />
                                                </ModalFormItem>
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Tr???ng th??i:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? employeeModal.employee_state : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Email nh??n vi??n:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? employeeModal.employee_email : null} readOnly />
                                                </ModalFormItem>
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>S??? ??i???n tho???i:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? employeeModal.employee_phone_number : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ng??y l??m vi???c ch??nh th???c:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? employeeModal.employee_start_job : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Th??m ni??n lao ?????ng:</FormSpan>
                                                    <FormInput type="text" value={employeeModal ? getYearWork(new Date(employeeModal.employee_start_job), new Date()) : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >????ng</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => setShowModal(prev => !prev)}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ChiTietWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    //  =============== Th??m Nh??n vi??n ===============
    if (type === "createEmployee") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Th??m Nh??n vi??n m???i</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px 10px 10px" }}>
                                            <FormSpan>Ng??y l??m vi???c ch??nh th???c:</FormSpan>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <Stack spacing={1}>
                                                    <DesktopDatePicker
                                                        label="T??n Thi???t b???:"
                                                        inputFormat="dd/MM/yyyy"
                                                        disableFuture
                                                        value={employeeStartJobModalNew}
                                                        onChange={(newValue) => { setEmployeeStartJobModalNew(moment(newValue).format("YYYY-MM-DD HH:mm:ss")); }}
                                                        renderInput={(params) => <TextField {...params} sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                height: '10px', // Set your height here.
                                                                padding: "15px 25px"
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: 'var(--color-dark)',
                                                                fontWeight: "bold"
                                                            },
                                                            '& .MuiOutlinedInput-root': {
                                                                color: 'var(--color-dark)',
                                                                letterSpacing: '2px'
                                                            },
                                                            '& .MuiFormLabel-root': {
                                                                display: 'none'
                                                            }
                                                        }}
                                                        />}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1", margin: "0px 10px" }}>
                                            <FormSpan>Ch???c v??? c???a Nh??n vi??n:</FormSpan>
                                            <FormSelect onChange={(e) => { setPositionIdModalNew(parseInt(e.target.value)) }}>
                                                {
                                                    positionList.map((position, key) => {
                                                        return (
                                                            <FormOption value={position.position_id}>{position.position_name}</FormOption>
                                                        )
                                                    })
                                                }
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px" }}>
                                            <FormSpan>H??? c???a Nh??n vi??n:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setEmployeeFirstNameModalNew(e.target.value)} placeholder="Nh???p v??o H??? c???a Nh??n vi??n" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px" }}>
                                            <FormSpan>T??n c???a Nh??n vi??n:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setEmployeeLastNameModalNew(e.target.value)} placeholder="Nh???p v??o T??n c???a Nh??n vi??n" />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1", margin: "0px 10px" }}>
                                            <FormSpan>Gi???i t??nh:</FormSpan>
                                            <FormSelect onChange={(e) => { setEmployeeGenderModalNew(e.target.value) }}>
                                                <FormOption value={"Nam"}>Nam</FormOption>
                                                <FormOption value={"N???"}>N???</FormOption>
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ marginTop: "10px" }}>
                                            <FormSpan>Ng??y sinh:</FormSpan>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <Stack spacing={1}>
                                                    <DesktopDatePicker
                                                        label="T??n Thi???t b???:"
                                                        inputFormat="dd/MM/yyyy"
                                                        disableFuture
                                                        value={employeeBirthdayModalNew}
                                                        onChange={(newValue) => { setEmployeeBirthdayModalNew(moment(newValue).format("YYYY-MM-DD HH:mm:ss")); }}
                                                        renderInput={(params) => <TextField {...params} sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                height: '10px', // Set your height here.
                                                                padding: "15px 25px"
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: 'var(--color-dark)',
                                                                fontWeight: "bold"
                                                            },
                                                            '& .MuiOutlinedInput-root': {
                                                                color: 'var(--color-dark)',
                                                                letterSpacing: '2px'
                                                            },
                                                            '& .MuiFormLabel-root': {
                                                                display: 'none'
                                                            }
                                                        }}
                                                        />}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px" }}>
                                            <FormSpan>S??? ??i???n tho???i:</FormSpan>
                                            <FormInput style={{ marginBottom: "25px" }} type="text" placeholder="S??? ??i???n tho???i c???a Nh??n vi??n"
                                                maxLength={11}
                                                value={employeePhoneNumberModalNew}
                                                onChange={(e) => handleChangePhoneNumber(e)}
                                            />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px" }}>
                                            <FormSpan>Email:</FormSpan>
                                            <FormInput style={{ marginBottom: "25px" }} type="email" placeholder="Email c???a Nh??n vi??n"
                                                value={employeeEmailModalNew}
                                                onChange={(e) => handleChangeEmail(e)}
                                            />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 30px" }}>
                                            <FormSpan>M???t kh???u:</FormSpan>
                                            <Label>
                                                <FormInput type={passwordType} placeholder="M???t kh???u c???a b???n"
                                                    onChange={(e) => handleChangePassword(e)}
                                                />
                                                {
                                                    passwordType === "password" ?
                                                        <Eye onClick={() => togglePassword()}>
                                                            <VisibilityOutlined />
                                                        </Eye>
                                                        :
                                                        <Eye onClick={() => togglePassword()}>
                                                            <VisibilityOffOutlined />
                                                        </Eye>
                                                }
                                            </Label>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 30px" }}>
                                            <FormSpan>X??c nh???n m???t kh???u:</FormSpan>
                                            <Label>
                                                <FormInput type={rePasswordType} placeholder="Nh???p l???i m???t kh???u"
                                                    onChange={(e) => handleChangeRePassword(e)}
                                                />
                                                {
                                                    rePasswordType === "password" ?
                                                        <Eye onClick={() => toggleRePassword()}>
                                                            <VisibilityOutlined />
                                                        </Eye>
                                                        :
                                                        <Eye onClick={() => toggleRePassword()}>
                                                            <VisibilityOffOutlined />
                                                        </Eye>
                                                }
                                            </Label>
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem style={{ margin: "0px 10px" }}>
                                    <FormSpan>H??nh ???nh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleShowImg(e.target.files[0])} />
                                    <FormImg src={employeeImageModalNew !== null ? employeeImageModalNew : "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} key={employeeImageModalNew}></FormImg>
                                </ModalFormItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateEmployee(
                                            employeeFirstNameModalNew,
                                            employeeLastNameModalNew,
                                            employeeBirthdayModalNew,
                                            employeeStartJobModalNew,
                                            employeeGenderModalNew,
                                            employeePhoneNumberModalNew,
                                            employeeEmailModalNew,
                                            employeePasswordModalNew,
                                            employeeRePasswordModalNew,
                                            employeeImageModalNew,
                                            positionIdModalNew
                                        )}
                                    >Th??m v??o</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >H???y b???</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
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
    // =============== Disable Employee ===============
    if (type === "disableEmployee") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>B???n mu???n V?? hi???u h??a Nh??n vi??n <span style={{ color: `var(--color-primary)` }}>{employeeModal ? employeeModal.employee_first_name + " " + employeeModal.employee_last_name : null}</span> n??y?</h1>
                                    <p style={{ marginTop: "10px" }}>T??i kho???n Email v?? S??? ??i???n tho???i c???a nh??n vi??n s??? kh??ng th??? ????ng nh???p n???a!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleDisableEmployee(employeeIdModal)}
                                    >?????ng ??</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >H???y b???</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => setShowModal(prev => !prev)}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </AlertWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // =============== able Employee ===============
    if (type === "ableEmployee") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>B???n mu???n M??? kh??a Nh??n vi??n <span style={{ color: `var(--color-primary)` }}>{employeeModal ? employeeModal.employee_first_name + " " + employeeModal.employee_last_name : null}</span> n??y?</h1>
                                    <p style={{ marginTop: "10px" }}>T??i kho???n Email v?? S??? ??i???n tho???i c???a ng?????i d??ng s??? c?? th??? ????ng nh???p l???i nh?? tr?????c!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleAbleEmployee(employeeIdModal)}
                                    >?????ng ??</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >H???y b???</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => setShowModal(prev => !prev)}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </AlertWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // =============== Ch???nh s???a Nh??n vi??n ===============
    if (type === "updateEmployee") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>C???p nh???t th??ng tin Nh??n vi??n</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px 10px 10px" }}>
                                            <FormSpan>Ng??y l??m vi???c ch??nh th???c:</FormSpan>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <Stack spacing={1}>
                                                    <DesktopDatePicker
                                                        label="Ng??y sinh:"
                                                        inputFormat="dd/MM/yyyy"
                                                        disableFuture
                                                        value={employeeStartJobModal}
                                                        onChange={(newValue) => { setEmployeeStartJobModal(moment(newValue).format("YYYY-MM-DD HH:mm:ss")); }}
                                                        renderInput={(params) => <TextField {...params} sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                height: '10px', // Set your height here.
                                                                padding: "15px 25px"
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: 'var(--color-dark)',
                                                                fontWeight: "bold"
                                                            },
                                                            '& .MuiOutlinedInput-root': {
                                                                color: 'var(--color-dark)',
                                                                letterSpacing: '2px'
                                                            },
                                                            '& .MuiFormLabel-root': {
                                                                display: 'none'
                                                            }
                                                        }}
                                                        />}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1", margin: "0px 10px" }}>
                                            <FormSpan>Ch???c v??? c???a Nh??n vi??n:</FormSpan>
                                            <FormSelect onChange={(e) => { setPositionIdModal(parseInt(e.target.value)) }}>
                                                {positionList.map((position, key) => {
                                                    if (position.position_id === positionIdModal) {
                                                        return (
                                                            <FormOption value={position.position_id} selected> {position.position_name} </FormOption>
                                                        )
                                                    } else {
                                                        return (
                                                            <FormOption value={position.position_id}> {position.position_name} </FormOption>
                                                        )
                                                    }
                                                })}
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px" }}>
                                            <FormSpan>H??? c???a Nh??n vi??n:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setEmployeeFirstNameModal(e.target.value)} value={employeeFirstNameModal} />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px" }}>
                                            <FormSpan>T??n c???a Nh??n vi??n:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setEmployeeLastNameModal(e.target.value)} value={employeeLastNameModal} />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1", margin: "0px 10px" }}>
                                            <FormSpan>Gi???i t??nh:</FormSpan>
                                            <FormSelect onChange={(e) => { setEmployeeGenderModal(e.target.value) }}>
                                                {
                                                    employeeGenderModal === "Nam" ? (
                                                        <>
                                                            <FormOption value={"Nam"} selected>Nam</FormOption>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FormOption value={"Nam"}>Nam</FormOption>
                                                        </>
                                                    )
                                                }
                                                {
                                                    employeeGenderModal === "N???" ? (
                                                        <>
                                                            <FormOption value={"N???"} selected>N???</FormOption>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FormOption value={"N???"}>N???</FormOption>
                                                        </>
                                                    )
                                                }
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ marginTop: "10px" }}>
                                            <FormSpan>Ng??y sinh:</FormSpan>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <Stack spacing={1}>
                                                    <DesktopDatePicker
                                                        label="Ng??y sinh:"
                                                        inputFormat="dd/MM/yyyy"
                                                        disableFuture
                                                        value={employeeBirthdayModal}
                                                        onChange={(newValue) => { setEmployeeBirthdayModal(moment(newValue).format("YYYY-MM-DD HH:mm:ss")); }}
                                                        renderInput={(params) => <TextField {...params} sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: 'var(--color-dark)',
                                                                },
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                height: '10px', // Set your height here.
                                                                padding: "15px 25px"
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: 'var(--color-dark)',
                                                                fontWeight: "bold"
                                                            },
                                                            '& .MuiOutlinedInput-root': {
                                                                color: 'var(--color-dark)',
                                                                letterSpacing: '2px'
                                                            },
                                                            '& .MuiFormLabel-root': {
                                                                display: 'none'
                                                            }
                                                        }}
                                                        />}
                                                        InputLabelProps={{ shrink: true }}
                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px" }}>
                                            <FormSpan>S??? ??i???n tho???i:</FormSpan>
                                            <FormInput style={{ marginBottom: "25px" }} type="text" placeholder="S??? ??i???n tho???i c???a Nh??n vi??n"
                                                maxLength={11}
                                                value={employeePhoneNumberModal}
                                                onChange={(e) => handleChangePhoneNumberUpdate(e)}
                                            />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0px 10px" }}>
                                            <FormSpan>Email:</FormSpan>
                                            <FormInput style={{ marginBottom: "25px" }} type="email" placeholder="Email c???a Nh??n vi??n"
                                                value={employeeEmailModal}
                                                onChange={(e) => handleChangeEmailUpdate(e)}
                                            />
                                        </ModalFormItem>
                                    </div>
                                    {
                                        isChangePasswordUpdate ? (
                                            <>
                                                <div className="col-lg-4">
                                                    <ModalFormItem style={{ margin: "0px 10px" }}>
                                                        <FormSpan>M???t kh???u:</FormSpan>
                                                        <Label>
                                                            <FormInput type={passwordType} placeholder="M???t kh???u c???a b???n"
                                                                onChange={(e) => handleChangePasswordUpdate(e)}
                                                            />
                                                            {
                                                                passwordType === "password" ?
                                                                    <Eye onClick={() => togglePassword()}>
                                                                        <VisibilityOutlined />
                                                                    </Eye>
                                                                    :
                                                                    <Eye onClick={() => togglePassword()}>
                                                                        <VisibilityOffOutlined />
                                                                    </Eye>
                                                            }
                                                        </Label>
                                                    </ModalFormItem>
                                                </div>
                                                <div className="col-lg-4">
                                                    <ModalFormItem style={{ margin: "0px 10px" }}>
                                                        <FormSpan>X??c nh???n m???t kh???u:</FormSpan>
                                                        <Label>
                                                            <FormInput type={rePasswordType} placeholder="Nh???p l???i m???t kh???u"
                                                                onChange={(e) => handleChangeRePasswordUpdate(e)}
                                                            />
                                                            {
                                                                rePasswordType === "password" ?
                                                                    <Eye onClick={() => toggleRePassword()}>
                                                                        <VisibilityOutlined />
                                                                    </Eye>
                                                                    :
                                                                    <Eye onClick={() => toggleRePassword()}>
                                                                        <VisibilityOffOutlined />
                                                                    </Eye>
                                                            }
                                                        </Label>
                                                    </ModalFormItem>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0px 10px" }}>
                                                    <ChangePassBtn onClick={() => setIsChangePasswordUpdate(prev => !prev)}>?????I M???T KH???U</ChangePassBtn>
                                                </ModalFormItem>
                                            </div>
                                        )
                                    }
                                </div>

                                <ModalFormItem style={{ margin: "0px 10px" }}>
                                    <FormSpan>H??nh ???nh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleChangeImg(e.target.files[0])} />
                                    <FormImg src={employeeImageModal !== null ? employeeImageModal : "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} key={employeeImageModal}></FormImg>
                                </ModalFormItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdateEmployee(
                                            employeeFirstNameModal,
                                            employeeLastNameModal,
                                            employeeBirthdayModal,
                                            employeeStartJobModal,
                                            employeeGenderModal,
                                            employeePhoneNumberModal,
                                            employeeEmailModal,
                                            employeePasswordModal,
                                            employeeRePasswordModal,
                                            employeeImageModal,
                                            positionIdModal,
                                            employeeIdModal
                                        )}
                                    >C???p nh???t</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >H???y b???</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
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
    // =============== X??a Nh??n vi??n ===============
    if (type === "deleteEmployee") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <H1Delete>B???n mu???n x??a Nh??n vi??n <span style={{ color: `var(--color-primary)` }}>{employeeModal ? employeeModal.employee_first_name + " " + employeeModal.employee_last_name : null}</span> n??y?</H1Delete>
                                <p>Click ?????ng ?? n???u b???n mu???n th???c hi???n h??nh ?????ng n??y!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteEmployee(employeeIdModal) }}
                                        >?????ng ??</ButtonClick>
                                    </ButtonContainer>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => setShowModal(prev => !prev)}
                                        >H???y b???</ButtonClick>
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