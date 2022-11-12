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
import * as FoodService from "../../service/FoodService";
import * as FoodTypeService from "../../service/FoodTypeService";

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
// Chi tiết
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
const Modal = ({ showModal, setShowModal, type, food, setReRenderData, handleClose, showToastFromOut }) => {
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
        setFoodImageModalNew(null);
        setFoodNameModalNew();
    }, [showModal]);

    const handleUpdateFood = async (newFoodName, newFoodPrice, newFoodImage, newFoodIngredient, foodTypeId, foodId) => {
        try {
            const updateFoodRes = await FoodService.updateFood({
                foodName: newFoodName,
                foodPrice: newFoodPrice,
                foodImage: newFoodImage,
                foodIngredient: newFoodIngredient,
                foodTypeId: foodTypeId,
                foodId: foodId
            });
            if (!updateFoodRes) {
                // Toast
                const dataToast = { message: updateFoodRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: updateFoodRes.data.message, type: "success" };
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

    useEffect(() => {
        const getFoodType = async () => {
            try {
                const foodTypeRes = await FoodTypeService.getAllFoodTypes();
                setFoodTypeList(foodTypeRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy food type: ", err.response);
            }
        };
        getFoodType();
    }, []);

    // STATE:
    const [foodModal, setFoodModal] = useState();
    const [foodIdModal, setFoodIdModal] = useState();
    const [foodNameModal, setFoodNameModal] = useState();
    const [foodImageModal, setFoodImageModal] = useState();
    const [foodIngredientModal, setFoodIngredientModal] = useState();
    const [foodPriceModal, setFoodPriceModal] = useState();
    const [foodTypeIdModal, setFoodTypeIdModal] = useState();

    const [foodModalOld, setFoodModalOld] = useState();
    const [foodIdModalOld, setFoodIdModalOld] = useState();
    const [foodNameModalOld, setFoodNameModalOld] = useState();
    const [foodImageModalOld, setFoodImageModalOld] = useState();
    const [foodIngredientModalOld, setFoodIngredientModalOld] = useState();
    const [foodPriceModalOld, setFoodPriceModalOld] = useState();
    const [foodTypeIdModalOld, setFoodTypeIdModalOld] = useState();

    const [foodTypeList, setFoodTypeList] = useState([]);
    useEffect(() => {
        const getFood = async () => {
            try {
                const foodRes = await FoodService.findFoodById({
                    foodId: food.food_id
                });
                console.log("RES: ", foodRes);
                setFoodModal(foodRes.data.data);
                setFoodIdModal(foodRes.data.data.food_id);
                setFoodNameModal(foodRes.data.data.food_name);
                setFoodIngredientModal(foodRes.data.data.food_ingredient);
                setFoodPriceModal(foodRes.data.data.food_price);
                setFoodImageModal(foodRes.data.data.food_image);
                setFoodTypeIdModal(foodRes.data.data.food_type_id);

                setFoodModalOld(foodRes.data.data);
                setFoodIdModalOld(foodRes.data.data.food_id);
                setFoodNameModalOld(foodRes.data.data.food_name);
                setFoodIngredientModalOld(foodRes.data.data.food_ingredient);
                setFoodPriceModalOld(foodRes.data.data.food_price);
                setFoodImageModalOld(foodRes.data.data.food_image);
                setFoodTypeIdModalOld(foodRes.data.data.food_type_id);
            } catch (err) {
                console.log("Lỗi lấy food: ", err.response);
            }
        }
        if (food) {
            getFood();
        }
    }, [food, showModal]);
    console.log("Danh mục modal: ", foodModal);

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
                        setFoodImageModal(downloadURL);
                    } catch (err) {
                        console.log("Lỗi cập nhật hình ảnh:", err);
                    }
                });
            }
        );
    }

    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal
        setFoodNameModal(foodNameModalOld);
        setFoodImageModal(foodImageModalOld);

        setShowModal(prev => !prev);
    }

    // =============== Xử lý thêm danh mục ===============
    const [foodNameModalNew, setFoodNameModalNew] = useState();
    const [foodImageModalNew, setFoodImageModalNew] = useState(null);
    const [foodPriceModalNew, setFoodPriceModalNew] = useState(null);
    const [foodIngredientModalNew, setFoodIngredientModalNew] = useState();
    const [foodTypeIdModalNew, setFoodTypeIdModalNew] = useState();

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
                        setFoodImageModalNew(downloadURL);
                    } catch (err) {
                        console.log("Lỗi cập nhật hình ảnh:", err);
                    }
                });
            }
        );
    }

    // Create new food
    const handleCreateFood = async (newName, newPrice, newImage, newIngredient, foodTypeId) => {
        try {
            const createFoodRes = await FoodService.createFood({
                foodName: newName,
                foodPrice: newPrice,
                foodImage: newImage,
                foodIngredient: newIngredient,
                foodTypeId: foodTypeId
            });
            if (!createFoodRes) {
                // Toast
                const dataToast = { message: createFoodRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            setFoodImageModalNew(null);
            // Toast
            const dataToast = { message: createFoodRes.data.message, type: "success" };
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

    // =============== Xử lý xóa danh mục ===============
    const handleDeleteFood = async (foodId) => {
        try {
            const deleteFoodRes = await FoodService.deleteFood(foodId);
            if (!deleteFoodRes) {
                // Toast
                const dataToast = { message: deleteFoodRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deleteFoodRes.data.message, type: "success" };
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
    if (type === "detailFood") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Món ăn</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <ChiTietHinhAnh src={foodModal ? foodModal.food_image : null} />
                                    </div>
                                    <div className="col-lg-9">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Mã Món ăn:</FormSpan>
                                                    <FormInput type="text" value={foodModal ? foodModal.food_id : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Tên Món ăn:</FormSpan>
                                                    <FormInput type="text" value={foodModal ? foodModal.food_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Phân loại:</FormSpan>
                                                    <FormInput type="text" value={foodModal ? foodModal.food_type_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Trạng thái:</FormSpan>
                                                    <FormInput type="text" value={foodModal ? foodModal.food_type_state === 0 ? "Đang hoạt động" : foodModal.food_type_state === 1 ? "Ngưng hoạt động" : null : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Thành phần:</FormSpan>
                                                    <FormInput type="text" value={foodModal ? foodModal.food_ingredient : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Giá tiền:</FormSpan>
                                                    <FormInput type="text" value={foodModal ? foodModal.food_price : null} readOnly />
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
                                    >Đóng</ButtonClick>
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
    //  =============== Thêm Món ăn ===============
    if (type === "createFood") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Món ăn mới</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Loại Món ăn:</FormSpan>
                                            <FormSelect onChange={(e) => { setFoodTypeIdModalNew(parseInt(e.target.value)) }}>
                                                {
                                                    foodTypeList.map((foodType, key) => {
                                                        return (
                                                            <FormOption value={foodType.food_type_id}>{foodType.food_type_name}</FormOption>
                                                        )
                                                    })
                                                }
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-6">
                                        <ModalFormItem>
                                            <FormSpan>Tên Món ăn:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setFoodNameModalNew(e.target.value)} placeholder="Nhập vào Tên Món ăn" />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <ModalFormItem>
                                            <FormSpan>Thành phần Món ăn:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setFoodIngredientModalNew(e.target.value)} placeholder="Thành phần của Món ăn này" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-6">
                                        <ModalFormItem>
                                            <FormSpan>Giá tiền Món ăn:</FormSpan>
                                            <FormInput type="number" min={0} onChange={(e) => setFoodPriceModalNew(parseInt(e.target.value))} placeholder="Giá tiền của Món ăn này" />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleShowImg(e.target.files[0])} />
                                    <FormImg src={foodImageModalNew !== null ? foodImageModalNew : "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} key={foodImageModalNew}></FormImg>
                                </ModalFormItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateFood(foodNameModalNew, foodPriceModalNew, foodImageModalNew, foodIngredientModalNew, foodTypeIdModalNew)}
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
    // =============== Chỉnh sửa Món ăn ===============
    if (type === "updateFood") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Món ăn</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <ModalFormItem style={{ flex: "1", margin: "0 30px" }}>
                                            <FormSpan>Loại Món ăn:</FormSpan>
                                            <FormSelect onChange={(e) => { setFoodTypeIdModal(parseInt(e.target.value)) }}>
                                                {foodTypeList.map((foodType, key) => {
                                                    if (foodType.food_type_id === foodTypeIdModal) {
                                                        return (
                                                            <FormOption value={foodType.food_type_id} selected> {foodType.food_type_name} </FormOption>
                                                        )
                                                    } else {
                                                        return (
                                                            <FormOption value={foodType.food_type_id}> {foodType.food_type_name} </FormOption>
                                                        )
                                                    }
                                                })}
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-6">
                                        <ModalFormItem style={{ margin: "0 30px" }}>
                                            <FormSpan>Tên Món ăn:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setFoodNameModal(e.target.value)} value={foodNameModal} />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem style={{ margin: "0 30px" }}>
                                    <FormSpan>Thành phần Món ăn:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setFoodIngredientModal(e.target.value)} value={foodIngredientModal} />
                                </ModalFormItem>

                                <ModalFormItem style={{ margin: "0 30px" }}>
                                    <FormSpan>Giá tiền Món ăn:</FormSpan>
                                    <FormInput type="number" min={0} onChange={(e) => setFoodPriceModal(parseInt(e.target.value))} value={foodPriceModal} />
                                </ModalFormItem>

                                <ModalFormItem style={{ margin: "0 30px" }}>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleChangeImg(e.target.files[0])} />
                                    <FormImg src={foodImageModal !== foodImageModalOld ? foodImageModal : foodImageModalOld} key={foodImageModal}></FormImg>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdateFood(foodNameModal, foodPriceModal, foodImageModal, foodIngredientModal, foodTypeIdModal, foodIdModal)}
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

    // =============== Xóa danh mục ===============
    if (type === "deleteFood") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <H1Delete>Bạn muốn xóa Món ăn <span style={{ color: `var(--color-primary)` }}>{foodNameModal}</span> này?</H1Delete>
                                <p>Click Đồng ý nếu bạn muốn thực hiện hành động này!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteFood(foodIdModal) }}
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