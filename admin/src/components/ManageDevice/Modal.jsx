import { CloseOutlined } from "@mui/icons-material";
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
import * as DeviceService from "../../service/DeviceService";
import * as DeviceTypeService from "../../service/DeviceTypeService";

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
    height: 200px;
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
const Modal = ({ showModal, setShowModal, type, device, setReRenderData, handleClose, showToastFromOut }) => {
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

    // =============== X??? l?? c???p nh???t danh m???c ===============
    useEffect(() => {
        setDeviceImageModalNew(null);
        setDeviceNameModalNew();
    }, [showModal]);

    const handleUpdateDevice = async (newDeviceName, newDeviceDate, newDeviceDescription, newDeviceImage, newDeviceState, deviceTypeId, deviceId) => {
        try {
            const updateDeviceRes = await DeviceService.updateDevice({
                deviceId: deviceId,
                deviceName: newDeviceName,
                deviceDate: newDeviceDate,
                deviceDescription: newDeviceDescription,
                deviceImage: newDeviceImage,
                deviceState: newDeviceState,
                deviceTypeId: deviceTypeId
            });
            if (!updateDeviceRes) {
                // Toast
                const dataToast = { message: updateDeviceRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: updateDeviceRes.data.message, type: "success" };
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

    useEffect(() => {
        const getDeviceType = async () => {
            try {
                const deviceTypeRes = await DeviceTypeService.getDeviceTypes();
                setDeviceTypeList(deviceTypeRes.data.data);
            } catch (err) {
                console.log("L???i l???y device type: ", err);
            }
        };
        getDeviceType();
    }, []);

    // STATE:
    const [deviceModal, setDeviceModal] = useState();
    const [deviceIdModal, setDeviceIdModal] = useState();
    const [deviceNameModal, setDeviceNameModal] = useState();
    const [deviceImageModal, setDeviceImageModal] = useState();
    const [deviceDescriptionModal, setDeviceDescriptionModal] = useState();
    const [deviceDateModal, setDeviceDateModal] = useState();
    const [deviceStateModal, setDeviceStateModal] = useState();
    const [deviceTypeIdModal, setDeviceTypeIdModal] = useState();

    const [deviceModalOld, setDeviceModalOld] = useState();
    const [deviceIdModalOld, setDeviceIdModalOld] = useState();
    const [deviceNameModalOld, setDeviceNameModalOld] = useState();
    const [deviceImageModalOld, setDeviceImageModalOld] = useState();
    const [deviceDescriptionModalOld, setDeviceDescriptionModalOld] = useState();
    const [deviceDateModalOld, setDeviceDateModalOld] = useState();
    const [deviceStateModalOld, setDeviceStateModalOld] = useState();
    const [deviceTypeIdModalOld, setDeviceTypeIdModalOld] = useState();

    const [deviceTypeList, setDeviceTypeList] = useState([]);
    useEffect(() => {
        const getDevice = async () => {
            try {
                const deviceRes = await DeviceService.findDeviceById({
                    deviceId: device.device_id
                });
                console.log("RES: ", deviceRes);
                setDeviceModal(deviceRes.data.data);
                setDeviceIdModal(deviceRes.data.data.device_id);
                setDeviceNameModal(deviceRes.data.data.device_name);
                setDeviceDescriptionModal(deviceRes.data.data.device_description);
                setDeviceDateModal(deviceRes.data.data.device_date);
                setDeviceStateModal(deviceRes.data.data.device_state);
                setDeviceImageModal(deviceRes.data.data.device_image);
                setDeviceTypeIdModal(deviceRes.data.data.device_type_id);

                setDeviceModalOld(deviceRes.data.data);
                setDeviceIdModalOld(deviceRes.data.data.device_id);
                setDeviceNameModalOld(deviceRes.data.data.device_name);
                setDeviceDescriptionModalOld(deviceRes.data.data.device_description);
                setDeviceDateModalOld(deviceRes.data.data.device_date);
                setDeviceStateModalOld(deviceRes.data.data.device_state);
                setDeviceImageModalOld(deviceRes.data.data.device_image);
                setDeviceTypeIdModalOld(deviceRes.data.data.device_type_id);
            } catch (err) {
                console.log("L???i l???y device: ", err);
            }
        }
        if (device) {
            getDevice();
        }
    }, [device]);
    console.log("Danh m???c modal: ", deviceModal);

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
                        setDeviceImageModal(downloadURL);
                    } catch (err) {
                        console.log("L???i c???p nh???t h??nh ???nh:", err);
                    }
                });
            }
        );
    }

    const handleCloseUpdate = () => {
        // Set l???i gi?? tr??? c?? sau khi ????ng Modal
        setDeviceNameModal(deviceNameModalOld);
        setDeviceImageModal(deviceImageModalOld);

        setShowModal(prev => !prev);
    }

    // =============== X??? l?? th??m danh m???c ===============
    const [deviceNameModalNew, setDeviceNameModalNew] = useState();
    const [deviceImageModalNew, setDeviceImageModalNew] = useState(null);
    const [deviceDescriptionModalNew, setDeviceDescriptionModalNew] = useState();
    const [deviceTypeIdModalNew, setDeviceTypeIdModalNew] = useState();

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
                        setDeviceImageModalNew(downloadURL);
                    } catch (err) {
                        console.log("L???i c???p nh???t h??nh ???nh:", err);
                    }
                });
            }
        );
    }

    // Create new divice
    const handleCreateDevice = async (newName, newDescription, newImage, deviceTypeId) => {
        try {
            const createDeviceRes = await DeviceService.createDevice({
                deviceName: newName,
                deviceDescription: newDescription,
                deviceImage: newImage,
                deviceTypeId: deviceTypeId
            });
            if (!createDeviceRes) {
                // Toast
                const dataToast = { message: createDeviceRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            setDeviceImageModalNew(null);
            // Toast
            const dataToast = { message: createDeviceRes.data.message, type: "success" };
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

    // =============== X??? l?? x??a danh m???c ===============
    const handleDeleteDevice = async (deviceId) => {
        try {
            const deleteDeviceRes = await DeviceService.deleteDevice(deviceId);
            if (!deleteDeviceRes) {
                // Toast
                const dataToast = { message: deleteDeviceRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: deleteDeviceRes.data.message, type: "success" };
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
    if (type === "detailDevice") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi ti???t Thi???t b???</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <ChiTietHinhAnh src={deviceModal ? deviceModal.device_image : null} />
                                    </div>
                                    <div className="col-lg-9">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>M?? thi???t b???:</FormSpan>
                                                    <FormInput type="text" value={deviceModal ? deviceModal.device_id : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>T??n thi???t b???:</FormSpan>
                                                    <FormInput type="text" value={deviceModal ? deviceModal.device_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ph??n lo???i:</FormSpan>
                                                    <FormInput type="text" value={deviceModal ? deviceModal.device_type_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ng??y th??m:</FormSpan>
                                                    <FormInput type="text" value={deviceModal ? deviceModal.device_date : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Nh??n vi??n ???? th??m:</FormSpan>
                                                    <FormInput type="text" value={deviceModal ? deviceModal.device_detail_tinh_trang : null} readOnly />
                                                </ModalFormItem>
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>M?? t??? chi ti???t:</FormSpan>
                                                    <FormTextArea style={{ height: "100px" }} rows="2" cols="50" value={deviceModal ? deviceModal.device_description : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Tr???ng th??i:</FormSpan>
                                                    <FormInput type="text" value={deviceModal ? deviceModal.device_state === 0 ? "L??u kho" : deviceModal.device_state === 1 ? "??ang s??? d???ng" : "Ch??a c??" : null} readOnly />
                                                </ModalFormItem>
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>V??? tr??:</FormSpan>
                                                    <FormInput type="text" value={deviceModal && deviceModal.room_name && deviceModal.floor_name ? deviceModal.room_name + ", " + deviceModal.floor_name : "Ch??a c??"} readOnly />
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
    //  =============== Th??m thi???t b??? ===============
    if (type === "createDevice") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Th??m Thi???t b??? m???i</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Lo???i thi???t b???:</FormSpan>
                                            <FormSelect onChange={(e) => { setDeviceTypeIdModalNew(parseInt(e.target.value)) }}>
                                                {
                                                    deviceTypeList.map((deviceType, key) => {
                                                        return (
                                                            <FormOption value={deviceType.device_type_id}>{deviceType.device_type_name}</FormOption>
                                                        )
                                                    })
                                                }
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-6">
                                        <ModalFormItem>
                                            <FormSpan>T??n thi???t b???:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setDeviceNameModalNew(e.target.value)} placeholder="Nh???p v??o T??n thi???t b???" />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem>
                                    <FormSpan>M?? t??? thi???t b???:</FormSpan>
                                    <FormTextArea rows="2" cols="50" onChange={(e) => setDeviceDescriptionModalNew(e.target.value)} placeholder="M?? t??? v??? thi???t b??? n??y" />
                                </ModalFormItem>

                                <ModalFormItem>
                                    <FormSpan>H??nh ???nh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleShowImg(e.target.files[0])} />
                                    <FormImg src={deviceImageModalNew !== null ? deviceImageModalNew : "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} key={deviceImageModalNew}></FormImg>
                                </ModalFormItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateDevice(deviceNameModalNew, deviceDescriptionModalNew, deviceImageModalNew, deviceTypeIdModalNew)}
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
    // =============== Ch???nh s???a thi???t b??? ===============
    if (type === "updateDevice") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>C???p nh???t Thi???t b???</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <ModalFormItem style={{ flex: "1", margin: "0 30px" }}>
                                            <FormSpan>Lo???i thi???t b???:</FormSpan>
                                            <FormSelect onChange={(e) => { setDeviceTypeIdModal(parseInt(e.target.value)) }}>
                                                {deviceTypeList.map((deviceType, key) => {
                                                    if (deviceType.device_type_id === deviceTypeIdModal) {
                                                        return (
                                                            <FormOption value={deviceType.device_type_id} selected> {deviceType.device_type_name} </FormOption>
                                                        )
                                                    } else {
                                                        return (
                                                            <FormOption value={deviceType.device_type_id}> {deviceType.device_type_name} </FormOption>
                                                        )
                                                    }
                                                })}
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-6">
                                        <ModalFormItem style={{ margin: "0 30px" }}>
                                            <FormSpan>T??n Thi???t b???:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setDeviceNameModal(e.target.value)} value={deviceNameModal} />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem style={{ margin: "0 30px" }}>
                                    <FormSpan>M?? t??? thi???t b???:</FormSpan>
                                    <FormTextArea rows="2" cols="50" onChange={(e) => setDeviceDescriptionModal(e.target.value)} value={deviceDescriptionModal} />
                                </ModalFormItem>

                                <div className="row">
                                    <div className="col-lg-6">
                                        <ModalFormItem style={{ flex: "1", margin: "0 30px" }}>
                                            <FormSpan>Tr???ng th??i thi???t b???:</FormSpan>
                                            <FormSelect onChange={(e) => { setDeviceStateModal(parseInt(e.target.value)) }}>
                                                <FormOption value={0} selected={deviceModal && deviceStateModal === 0 ? true : false}> L??u kho </FormOption>
                                                <FormOption value={1} selected={deviceModal && deviceStateModal === 1 ? true : false}> ??ang s??? d???ng </FormOption>
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-6">
                                        <ModalFormItem style={{ marginTop: "10px" }}>
                                            <FormSpan>Ng??y th??m Thi???t b???:</FormSpan>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <Stack spacing={1}>
                                                    <DesktopDatePicker
                                                        label="Ng??y th??m Thi???t b???:"
                                                        inputFormat="dd/MM/yyyy"
                                                        disableFuture
                                                        value={deviceDateModal}
                                                        onChange={(newValue) => { setDeviceDateModal(moment(newValue).format("YYYY-MM-DD HH:mm:ss")); }}
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

                                <ModalFormItem style={{ margin: "0 30px" }}>
                                    <FormSpan>H??nh ???nh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleChangeImg(e.target.files[0])} />
                                    <FormImg src={deviceImageModal !== deviceImageModalOld ? deviceImageModal : deviceImageModalOld} key={deviceImageModal}></FormImg>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    {/* newDeviceName, newDeviceDate, newDeviceDescription, newDeviceImage, newDeviceState, deviceTypeId, deviceId */}
                                    <ButtonClick
                                        onClick={() => handleUpdateDevice(deviceNameModal, deviceDateModal, deviceDescriptionModal, deviceImageModal, deviceStateModal, deviceTypeIdModal, deviceIdModal)}
                                    >C???p nh???t</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCloseUpdate()}
                                    >H???y b???</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => handleCloseUpdate()}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // =============== X??a danh m???c ===============
    if (type === "deleteDevice") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <H1Delete>B???n mu???n x??a Thi???t b??? <span style={{ color: `var(--color-primary)` }}>{deviceNameModal}</span> n??y?</H1Delete>
                                <p>Click ?????ng ?? n???u b???n mu???n th???c hi???n h??nh ?????ng n??y!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteDevice(deviceIdModal) }}
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