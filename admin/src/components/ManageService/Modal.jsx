import { CloseOutlined } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import app from "../../firebase";

// SERVICES
import * as ServiceService from "../../service/ServiceService";

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
    object-fit: cover;
    height: 200px;
`

const Modal = ({ showModal, setShowModal, type, service, setReRenderData, handleClose, showToastFromOut }) => {
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

    // =============== Xử lý cập nhật danh mục ===============
    useEffect(() => {
        setServiceImageModalNew(null);
        setServiceNameModalNew();
        setServiceTimeModalNew();
    }, [showModal]);

    const handleUpdateService = async (newServiceName, newServiceImage, newServiceTime, serviceId) => {
        try {
            const updateServiceRes = await ServiceService.updateService({
                serviceId: serviceId,
                serviceName: newServiceName,
                serviceImage: newServiceImage,
                serviceTime: newServiceTime
            });
            if (!updateServiceRes) {
                // Toast
                const dataToast = { message: updateServiceRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: updateServiceRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }
    //  test
    const [serviceModal, setServiceModal] = useState();
    const [serviceIdModal, setServiceIdModal] = useState();
    const [serviceNameModal, setServiceNameModal] = useState();
    const [serviceImageModal, setServiceImageModal] = useState();
    const [serviceTimeModal, setServiceTimeModal] = useState();

    const [serviceModalOld, setServiceModalOld] = useState();
    const [serviceIdModalOld, setServiceIdModalOld] = useState();
    const [serviceNameModalOld, setServiceNameModalOld] = useState();
    const [serviceImageModalOld, setServiceImageModalOld] = useState();
    const [serviceTimeModalOld, setServiceTimeModalOld] = useState();
    useEffect(() => {
        const getService = async () => {
            try {
                const serviceRes = await ServiceService.findServiceById({
                    serviceId: service.service_id
                });
                console.log("RES: ", serviceRes);
                setServiceModal(serviceRes.data.data);
                setServiceIdModal(serviceRes.data.data.service_id);
                setServiceNameModal(serviceRes.data.data.service_name);
                setServiceImageModal(serviceRes.data.data.service_image);
                setServiceTimeModal(serviceRes.data.data.service_time);

                setServiceModalOld(serviceRes.data.data);
                setServiceIdModalOld(serviceRes.data.data.service_id);
                setServiceNameModalOld(serviceRes.data.data.service_name);
                setServiceImageModalOld(serviceRes.data.data.service_image);
                setServiceTimeModalOld(serviceRes.data.data.service_time);
            } catch (err) {
                console.log("Lỗi lấy danh mục: ", err.response);
            }
        }
        if (service) {
            getService();
        }
    }, [service]);
    console.log("Service modal: ", serviceModal);

    // Thay đổi hình ảnh
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
                        setServiceImageModal(downloadURL);
                    } catch (err) {
                        console.log("Lỗi cập nhật hình ảnh:", err);
                    }
                });
            }
        );
    }

    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal
        setServiceNameModal(serviceNameModalOld);
        setServiceImageModal(serviceImageModalOld);
        setServiceTimeModal(serviceTimeModalOld);

        setShowModal(prev => !prev);
    }

    // =============== Xử lý thêm Dịch vụ ===============
    const [serviceNameModalNew, setServiceNameModalNew] = useState();
    const [serviceImageModalNew, setServiceImageModalNew] = useState(null);
    const [serviceTimeModalNew, setServiceTimeModalNew] = useState();

    // Thay đổi hình ảnh
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
                        setServiceImageModalNew(downloadURL);
                    } catch (err) {
                        console.log("Lỗi cập nhật hình ảnh:", err);
                    }
                });
            }
        );
    }

    // Create new service
    const handleCreateService = async (newName, newImage, newTime) => {
        try {
            const createServiceRes = await ServiceService.createService({
                serviceName: newName,
                serviceImage: newImage,
                serviceTime: newTime
            });
            if (!createServiceRes) {
                // Toast
                const dataToast = { message: createServiceRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            setServiceImageModalNew(null);
            // Toast
            const dataToast = { message: createServiceRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;

        } catch (err) {
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // =============== Xử lý xóa Dịch vụ ===============
    const handleDeleteService = async (serviceId) => {
        try {
            const deleteServiceRes = await ServiceService.deleteService(serviceId);
            if (!deleteServiceRes) {
                // Toast
                const dataToast = { message: deleteServiceRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deleteServiceRes.data.message, type: "success" };
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
    //  =============== Chi tiết Dịch vụ ===============
    if (type === "detailService") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Dịch vụ</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Mã số Dịch vụ:</FormSpan>
                                    <FormInput type="text" value={serviceModal ? serviceModal.service_id : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Tên Dịch vụ:</FormSpan>
                                    <FormInput type="text" value={serviceModal ? serviceModal.service_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Thời gian:</FormSpan>
                                    <FormInput type="text" value={serviceModal ? serviceModal.service_time : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormImg src={serviceModal ? serviceModal.service_image : null}></FormImg>
                                </ModalFormItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >Đóng</ButtonClick>
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
    //  =============== Thêm Dịch vụ ===============
    if (type === "createService") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Dịch vụ mới</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Dịch vụ:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setServiceNameModalNew(e.target.value)} placeholder="Nhập vào tên của Dịch vụ" />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Thời gian:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setServiceTimeModalNew(e.target.value)} placeholder="Nhập vào Thời gian của Dịch vụ" />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleShowImg(e.target.files[0])} />
                                    <FormImg src={serviceImageModalNew !== null ? serviceImageModalNew : "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} key={serviceImageModalNew}></FormImg>
                                </ModalFormItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateService(serviceNameModalNew, serviceImageModalNew, serviceTimeModalNew)}
                                    >Thêm vào</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >Hủy bỏ</ButtonClick>
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
    // =============== Chỉnh sửa Dịch vụ ===============
    if (type === "updateService") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Dịch vụ</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Dịch vụ:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setServiceNameModal(e.target.value)} value={serviceNameModal} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Thời gian:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setServiceTimeModal(e.target.value)} value={serviceTimeModal} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleChangeImg(e.target.files[0])} />
                                    <FormImg src={serviceImageModal !== serviceImageModalOld ? serviceImageModal : serviceImageModalOld} key={serviceImageModal}></FormImg>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdateService(serviceNameModal, serviceImageModal, serviceTimeModal, serviceIdModal)}
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
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // =============== Xóa Dịch vụ ===============
    if (type === "deleteService") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>Bạn muốn xóa Dịch vụ <span style={{ color: `var(--color-primary)` }}>{serviceNameModal}</span> này?</h1>
                                <p>Click Đồng ý nếu bạn muốn thực hiện hành động này!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteService(serviceIdModal) }}
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