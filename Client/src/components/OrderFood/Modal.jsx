import { Add, ArrowRightAltOutlined, CheckCircleRounded, Close, CloseOutlined, Remove } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { logoutCart, updateFood } from "../../redux/foodCartRedux";
import { format_money } from "../../utils/utils";
import Toast from "../Toast";
import MiniImage from "./MiniImage";
import MiniImagePayment from "./MiniImagePayment";

// SERVICES
import * as RoomBookingFoodOrderService from "../../service/RoomBookingFoodOrderService";

const Background = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99000;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    animation: fadeIn linear 0.1s;
`

const ModalWrapper = styled.div`
    width: 1230px;
    height: 690px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: #F8F9FA;
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    z-index: 99999;
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
    width: 100%;
`

const CloseModalButton = styled.span`
    cursor: pointer;
    color: #D0D0D0;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
    &:hover {
        color: black;
        transform: scale(1.3);
        transition: all 200ms linear; 
    }
`

// Cart Components
const Wrapper = styled.div`
  padding: 20px;
  width: 100%;
`

const Title = styled.h1`
    font-size: 2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`

// TOP
const Top = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${props => props.type === "filled" && "none"};
  background-color: ${props =>
        props.type === "filled" ? "black" : "transparent"};
  color: ${props => props.type === "filled" && "white"};
  letter-spacing: 2px;
  transition: all 0.3s ease;
    &:hover {
        background-color: var(--color-primary);
    }
`

const TopTexts = styled.div`
`

const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`

// BOTTOM
const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
`
// Thông tin
const Info = styled.div`
    flex: 3;
    max-height: 380px;
    overflow-y: scroll;
`

// Thông tin - Thông tin sản phẩm
const Product = styled.div`
    width: 100%;
    display: flex;
    border: 1px solid white;
    justify-content: space-between;
    position: relative;
    &:hover {
      border: 1px solid #333;
    }
`

const ProductDetail = styled.div`
    flex: 2;
    display: flex;
`

const Details = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`

const ProductName = styled.span``

const ProductId = styled.span``
const PriceDetail = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

`
// Thông tin - Thông tin giá
const ProductAmountContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`

const ProductAmount = styled.div`
    font-size: 24px;
    margin: 5px;
`

const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
`

const Hr = styled.hr`
    background-color: #adb5bd;
    border: none;
    height: 1px;
`

// Tóm tắt
const Summary = styled.div`
    flex: 1;
    border: 0.5px solid lightgray;
    border-radius: 10px;
    padding: 20px;
    height: 50vh;
`

const SummaryTitle = styled.h1`
    font-weight: 500;
    font-size: 2rem;
`

const SummaryItem = styled.div`
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    font-weight: ${props => props.type === "total" && "500"};
    font-size: ${props => props.type === "total" && "24px"};
`

const SummaryItemText = styled.span``
const SummaryItemPrice = styled.span``
const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: black;
    color: white;
    font-weight: 600;
    letter-spacing: 2px;
    transition: all 0.3s ease;
    &:hover {
        background-color: var(--color-primary);
    }
`

const RemoveProduct = styled.div`
    width: 20px;
    height: 20px;
    position: absolute;
    top: 10px;
    right: 12px;
    &:hover .remove-product{
      color: #878788;
      cursor: pointer;
    }
`

// Payment
const PaymentWrapper = styled.div`
width: 100%;
margin: 20px auto;
overflow: hidden;
background-color: #f8f9fa;
box-shadow: 0 2px 3px #e0e0e0;
display: flex;
`

const Box1 = styled.div`
max-width: 600px;
padding: 10px 40px;
user-select: none;
`

const Box2 = styled.div`
width: 100%;
padding: 10px 40px;
`

const Title1 = styled.div`
display: flex;
justify-content: space-between;
`

const CartItem = styled.div`
display: flex;
width: 100%;
font-size: 1.1rem;
background: #ddd;
margin-top: 10px;
padding: 10px 12px;
border-radius: 5px;
cursor: pointer;
border: 1px solid transparent;
`

const Circle = styled.span`
height: 12px;
width: 12px;
background: #ccc;
border-radius: 50%;
margin-right: 15px;
border: 4px solid transparent;
display: inline-block;
`

const Course = styled.div`
width: 100%;
`

const Content = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`

const InfomationTitle = styled.div`
    font-size: 1.2rem;
`

const InfomationForm = styled.div`

`

const ModalChiTietItem = styled.div`
margin: 2px 0px;
display: flex;
flex-direction: column;
`

const FormSpan = styled.span`
font-size: 1.1rem;
font-weight: 700;
color: var(--color-dark-light);
margin-bottom: 3px;
`
const FormInput = styled.input`
background-color: var(--color-white);
color: var(--color-dark);
width: auto;
padding: 8px 20px;
margin: 5px 0;
display: inline-block;
outline: 0;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
&:focus {
    border: 1px solid var(--color-success);
    box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
}
`

const FormTextArea = styled.textarea`
background-color: var(--color-white);
color: var(--color-dark);
width: auto;
padding: 8px 20px;
margin: 5px 0;
display: inline-block;
outline: 0;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
&:focus {
    border: 1px solid var(--color-success);
    box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
}
`
const Total = styled.div`
display: flex;
flex-direction: column;
`

const TotalItem = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`

const ButtonContainer = styled.div`
    justify-content: center;
    position: relative;
    float: right;
    margin: 10px 22px 22px 0;
    display: flex;
    &::after {
        content: "";
        border: 2px solid black;
        position: absolute;
        top: 5px;
        right: -5px;
        background-color: transperent;
        width: 150px;
        height: 100%;
        z-index: 5;
    }
`

const PaymentButton = styled.button`
    padding: 10px;
    width: 150px;
    border: 2px solid black;
    background-color: black;
    color: white;
    cursor: pointer;
    font-weight: 500;
    z-index: 10;
    &:hover {
        background-color: var(--color-primary);
    }
    &:active {
        background-color: #333;
        transform: translate(5px, 5px);
        transition: transform 0.25s;
    }
`

const H2 = styled.h2`
font-size: 1.8rem;
margin-top: 20px;
`
const Small = styled.small`
margin-top: 15px;
font-size: 1.3rem;
`
const SuccessButtonContainer = styled.div`
    justify-content: center;
    position: relative;
    margin: 22px 0;
    display: flex;
    &::after {
        content: "";
        border: 2px solid black;
        position: absolute;
        top: 5px;
        left: 5px;
        background-color: transperent;
        width: 300px;
        height: 100%;
        z-index: 5;
    }
`

const SuccessButton = styled.button`
    padding: 10px;
    width: 300px;
    border: 2px solid black;
    background-color: black;
    color: white;
    cursor: pointer;
    font-weight: 500;
    z-index: 10;
    &:hover {
        background-color: var(--color-primary);
    }
    &:active {
        background-color: #333;
        transform: translate(5px, 5px);
        transition: transform 0.25s;
    }
`

// Empty item
const EmptyItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const EmptyItemSvg = styled.div``
const EmptyContent = styled.div`
    letter-spacing: 2px;
    font-size: 1.2rem;
    color: var(--color-primary);
    font-weight: bold;
`

const CartItemDiv = styled.div`
    height: 41vh;
    overflow-y: scroll;
`
const Modal = ({ showModal, setShowModal, type }) => {
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer.currentCustomer);
    const foodCart = useSelector(state => state.foodCart);
    // STATE
    const [isPayment, setIsPayment] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [customerId, setCustomerId] = useState(customer.customer_id);
    const [firstName, setFirstName] = useState(customer.customer_first_name);
    const [lastName, setLastName] = useState(customer.customer_last_name);
    const [email, setEmail] = useState(customer.customer_email);
    const [phoneNumber, setPhoneNumber] = useState(customer.customer_phone_number);
    const [note, setNote] = useState("");
    const [roomId, setRoomId] = useState();
    const [key, setKey] = useState();

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
    // Toast
    const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
    const toastRef = useRef(null);

    const showToastFromOut = (dataShow) => {
        setDataToast(dataShow);
        toastRef.current.show();
    }

    // Fake loading when fetch data
    const [isLoading, setIsLoading] = useState(false);
    const handleLoading = () => {
        // Scroll lên kết quả mới
        window.scrollTo({
            top: 300,
            behavior: "smooth"
        });
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    };

    const handleOrderFood = () => {
        if (foodCart.foods.length > 0) {
            // Success
            setIsPayment(true);
            handleLoading();
            return;
        }
        // Toast
        const dataToast = { message: "Giỏ hàng hiện đang rỗng!", type: "danger" };
        showToastFromOut(dataToast);
    };

    // Handle booking food order
    const handleBookingFoodOrder = () => {
        const createRoomBookingFoodOrder = async () => {
            try {
                console.log("REQ: ", customer.customer_id, roomId, key, note, foodCart.foodCartTotal, foodCart.foods);
                const createRoomBookingFoodOrderRes = await RoomBookingFoodOrderService.createRoomBookingFoodOrder({
                    customerId: customer.customer_id,
                    roomId: parseInt(roomId),
                    key: key,

                    roomBookingFoodOrderNote: note,
                    roomBookingFoodOrderTotal: foodCart.foodCartTotal,

                    foodList: foodCart.foods
                });
                if (createRoomBookingFoodOrderRes) {
                    // Success
                    setIsSuccess(true);
                    handleLoading();
                    dispatch(logoutCart());
                    // Toast
                    const dataToast = { message: createRoomBookingFoodOrderRes.data.message, type: "success" };
                    showToastFromOut(dataToast);
                    return;
                } else {
                    // Toast
                    const dataToast = { message: createRoomBookingFoodOrderRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
            }
        }
        createRoomBookingFoodOrder();
    };
    // ================================================================
    // =============== Show video ===============
    if (type === "showCartItems") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal}>
                            {isLoading ? (
                                <div className="row">
                                    <div
                                        class="spinner-border"
                                        style={{ color: '#41F1B6', position: 'absolute', left: '50%', top: "45%", scale: "1.5" }}
                                        role="status"
                                    >
                                        <span class="visually-hidden"></span>
                                    </div>
                                </div>
                            ) :
                                isSuccess ? (
                                    <ModalContent>
                                        <CheckCircleRounded style={{ fontSize: "6rem", color: "var(--color-success)", margin: "auto" }} />
                                        <span style={{ color: "var(--color-success)", fontSize: "1.5rem", fontWeight: "700", letterSpacing: "2px" }}>ĐẶT MÓN THÀNH CÔNG!</span>
                                        <H2>Cảm ơn bạn đã tin tưởng và lựa chọn <span style={{ color: "var(--color-primary)" }}>Hoàng Long Hotel &amp; Restaurant</span></H2>
                                        <Small className="text-muted">Món ăn sẽ nhanh chóng mang đến cho quý khách!</Small>
                                        <Link to="/restaurant" style={{ textDecoration: "none" }}>
                                            <SuccessButtonContainer>
                                                <SuccessButton><ArrowRightAltOutlined />   Quay về trang chủ sau 4 giây ...</SuccessButton>
                                            </SuccessButtonContainer>
                                        </Link>
                                    </ModalContent>
                                ) : (
                                    // Payment
                                    isPayment ?
                                        (
                                            <ModalContent>
                                                <PaymentWrapper>
                                                    <Box1>
                                                        <Title1>
                                                            <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Những món ăn bạn muốn đặt</p>
                                                        </Title1>
                                                        <Carousel style={{ maxHeight: "300px", overflow: "hidden" }}>
                                                            {
                                                                foodCart.foods.length > 0 ? (
                                                                    foodCart.foods.map((food, key) => {
                                                                        return (
                                                                            <Carousel.Item>
                                                                                <MiniImagePayment image={food.food_image} />
                                                                            </Carousel.Item>
                                                                        )
                                                                    })
                                                                ) : null
                                                            }
                                                        </Carousel>
                                                        <p style={{ fontWeight: "500", marginTop: "10px" }}>Chi tiết giỏ hàng</p>
                                                        <CartItemDiv>
                                                            {
                                                                foodCart.foods.length > 0 ? (
                                                                    foodCart.foods.map((food, key) => {
                                                                        return (
                                                                            <CartItem>
                                                                                <Circle />
                                                                                <Course>
                                                                                    <Content>
                                                                                        <span style={{ width: "320px", fontWeight: "bold" }}> {food.food_type_name} </span>
                                                                                        <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{format_money(food.food_price * food.foodQuantity)} VNĐ</span>
                                                                                    </Content>
                                                                                    <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{food.foodQuantity}</span> x {food.food_name}</span>
                                                                                </Course>
                                                                            </CartItem>
                                                                        )
                                                                    })
                                                                ) : null
                                                            }
                                                        </CartItemDiv>
                                                    </Box1>
                                                    <Box2>
                                                        <div className="col-lg-12">
                                                            <div className="row">
                                                                <InfomationTitle>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi tiết Đặt món</p>
                                                                    <p style={{ fontSize: "1rem" }}>Hoàn tất Đặt món bằng việc cung cấp những thông tin sau</p>
                                                                </InfomationTitle>
                                                            </div>
                                                            <div className="row">
                                                                <InfomationForm className="col-lg-12">
                                                                    <div className="row">
                                                                        <ModalChiTietItem className="col-lg-6">
                                                                            <FormSpan>Họ tên:</FormSpan>
                                                                            <FormInput type="text" value={firstName + " " + lastName} disabled />
                                                                        </ModalChiTietItem>
                                                                        <ModalChiTietItem className="col-lg-6">
                                                                            <FormSpan>Số điện thoại:</FormSpan>
                                                                            <FormInput type="text" value={phoneNumber} disabled />
                                                                        </ModalChiTietItem>
                                                                    </div>
                                                                    <div className="row">

                                                                        <ModalChiTietItem className="col-lg-12">
                                                                            <FormSpan>Địa chỉ email:</FormSpan>
                                                                            <FormInput type="email" value={email} disabled />
                                                                        </ModalChiTietItem>
                                                                    </div>
                                                                    <div className="row">
                                                                        <ModalChiTietItem className="col-lg-6">
                                                                            <FormSpan>Mã phòng:</FormSpan>
                                                                            <FormInput type="text" placeholder="Mã phòng của bạn là"
                                                                                value={roomId} onChange={(e) => setRoomId(e.target.value)}
                                                                            />
                                                                        </ModalChiTietItem>
                                                                        <ModalChiTietItem className="col-lg-6">
                                                                            <FormSpan>Mã KEY:</FormSpan>
                                                                            <FormInput type="text" placeholder="Mã khóa KEY phòng của bạn là"
                                                                                value={key} onChange={(e) => setKey(e.target.value)}
                                                                            />
                                                                        </ModalChiTietItem>
                                                                    </div>
                                                                    <div className="row">
                                                                        <ModalChiTietItem className="col-lg-12">
                                                                            <FormSpan>Ghi chú:</FormSpan>
                                                                            <FormTextArea rows="3"
                                                                                placeholder="Ghi chú về những món ăn này"
                                                                                value={note} onChange={(e) => setNote(e.target.value)}
                                                                            />
                                                                        </ModalChiTietItem>
                                                                    </div>
                                                                </InfomationForm>
                                                            </div>
                                                            <Total>
                                                                <TotalItem>
                                                                    <p>Tổng tiền món ăn</p>
                                                                    <p>{format_money(foodCart.foodCartTotal)} VNĐ</p>
                                                                </TotalItem>
                                                                <TotalItem>
                                                                    <p>Free phí dịch vụ</p>
                                                                    <p>0.00 VNĐ</p>
                                                                </TotalItem>
                                                                <TotalItem>
                                                                    <p style={{ color: "var(--color-primary)", fontWeight: "bold" }}>Tổng cộng</p>
                                                                    <p style={{ color: "var(--color-primary)", fontWeight: "bold" }}>{format_money(foodCart.foodCartTotal)} VNĐ</p>
                                                                </TotalItem>
                                                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                                    <ButtonContainer>
                                                                        <PaymentButton
                                                                            onClick={() => handleBookingFoodOrder()}
                                                                        >Đặt mua</PaymentButton>
                                                                    </ButtonContainer>

                                                                    <ButtonContainer>
                                                                        <PaymentButton
                                                                            onClick={() => setIsPayment(false)}
                                                                        >Trở lại</PaymentButton>
                                                                    </ButtonContainer>
                                                                </div>
                                                            </Total>

                                                        </div>
                                                    </Box2>
                                                </PaymentWrapper>
                                            </ModalContent>
                                        ) : (
                                            <ModalContent>
                                                {/* Content of modal */}
                                                <Wrapper className="row">
                                                    <div className="col-lg-12">
                                                        <Title className="row">Món ăn bạn đã chọn</Title>
                                                        <Top className="row">
                                                            <TopButton className="col-lg-3">CHỌN THÊM MÓN ĂN</TopButton>

                                                            <TopTexts className="col-lg-4">
                                                                <TopText>Số món ăn (12)</TopText>
                                                                <TopText>Your Wishlist (0)</TopText>
                                                            </TopTexts>

                                                            <TopButton className="col-lg-3" type="filled"
                                                                onClick={() => handleOrderFood()}
                                                            >ĐẶT MÓN</TopButton>
                                                        </Top>
                                                        <Bottom className="row">
                                                            <Info className="col-lg-8">
                                                                {
                                                                    foodCart.foods.length > 0 ? (
                                                                        foodCart.foods.map(food => {
                                                                            const handleRemove = (foodQuantityUpdate) => {
                                                                                dispatch(updateFood({ ...food, foodQuantityUpdate }));
                                                                                if (foodQuantityUpdate === 0) {
                                                                                    // Toast
                                                                                    const dataToast = { message: "Đã xóa món ăn khỏi giỏ hàng!", type: "success" };
                                                                                    showToastFromOut(dataToast);
                                                                                }
                                                                            }
                                                                            return (
                                                                                <>
                                                                                    <Product>
                                                                                        <ProductDetail>
                                                                                            <MiniImage image={food.food_image}></MiniImage>
                                                                                            <Details>
                                                                                                <ProductName><b style={{ marginRight: "10px" }}>Món ăn:</b>{food.food_name}</ProductName>
                                                                                                <ProductId><b style={{ marginRight: "5px" }}>Loại món ăn:</b> {food.food_type_name}</ProductId>
                                                                                                <ProductId><b style={{ marginRight: "5px" }}>Thành phần:</b> {food.food_ingredient}</ProductId>
                                                                                                {/* <ProductId><b style={{ marginRight: "5px" }}>ID:</b> {food.food_ingredient}</ProductId> */}
                                                                                            </Details>
                                                                                        </ProductDetail>
                                                                                        <PriceDetail>
                                                                                            <ProductAmountContainer>
                                                                                                {/* <div onClick={() => product.soluongmua < product.data[0].soluong && handleRemove(1)}> */}
                                                                                                <div onClick={() => handleRemove(1)}>
                                                                                                    <Add />
                                                                                                </div>
                                                                                                <ProductAmount>{food.foodQuantity}</ProductAmount>
                                                                                                <div onClick={() => handleRemove(-1)}>
                                                                                                    <Remove />
                                                                                                </div>
                                                                                            </ProductAmountContainer>
                                                                                            <ProductPrice>{format_money(food.foodQuantity * food.food_price)} <b><u>đ</u></b></ProductPrice>
                                                                                        </PriceDetail>
                                                                                        <RemoveProduct onClick={() => handleRemove(0)}><Close className="remove-product" /></RemoveProduct>
                                                                                    </Product>
                                                                                    <Hr />
                                                                                </>
                                                                            )
                                                                        })
                                                                    ) : (
                                                                        <EmptyItem style={{ marginTop: "25px" }}>
                                                                            <EmptyItemSvg>
                                                                                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="EmptyStatestyles__StyledSvg-sc-qsuc29-0 cHfQrS">
                                                                                    <path d="M186 63V140H43V177H200V63H186Z" fill="#D6DADC"></path>
                                                                                    <path d="M170.5 45H13.5V159H170.5V45Z" fill="white"></path>
                                                                                    <path d="M29.5 26V45H170.5V140H186.5V26H29.5Z" fill="#1952B3"></path>
                                                                                    <path d="M175 155V42H167H121.5V44H15H11V84H15V64H161V60H15V48H121.5V50H167V155H31V163H175V155Z" fill="#232729"></path>
                                                                                    <path d="M28 52H24V56H28V52Z" fill="#232729"></path>
                                                                                    <path d="M35 52H31V56H35V52Z" fill="#232729"></path>
                                                                                    <path d="M42 52H38V56H42V52Z" fill="#232729"></path>
                                                                                    <path d="M120 76H30V106H120V76Z" fill="#F3F4F6"></path>
                                                                                    <path d="M153.5 76H126.5V142H153.5V76Z" fill="#F3F4F6"></path>
                                                                                    <path d="M120 112H30V142H120V112Z" fill="#F3F4F6"></path>
                                                                                    <path d="M44 120.77H26.23V103H17.77V120.77H0V129.23H17.77V147H26.23V129.23H44V120.77Z" fill="#FF5100"></path>
                                                                                    <path d="M60.0711 146.314L62.1924 144.192L55.1213 137.121L53 139.243L60.0711 146.314Z" fill="#232729"></path>
                                                                                    <path d="M53.0711 105.071L55.1924 107.192L62.2634 100.121L60.1421 98L53.0711 105.071Z" fill="#232729"></path>
                                                                                    <path d="M70.1924 124.192V121.192H59.1924V124.192H70.1924Z" fill="#232729"></path>
                                                                                </svg>
                                                                            </EmptyItemSvg>
                                                                            <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Chưa có món ăn nào được chọn!</EmptyContent>
                                                                        </EmptyItem>
                                                                    )
                                                                }
                                                            </Info>

                                                            <Summary className="col-lg-4">
                                                                <SummaryTitle >CHI PHÍ ĐẶT MÓN</SummaryTitle>
                                                                <SummaryItem>
                                                                    <SummaryItemText>Thành tiền</SummaryItemText>
                                                                    <SummaryItemPrice>{format_money(foodCart.foodCartTotal)} <b><u>đ</u></b></SummaryItemPrice>
                                                                </SummaryItem>
                                                                <SummaryItem>
                                                                    <SummaryItemText>Free phí dịch vụ</SummaryItemText>
                                                                    <SummaryItemPrice>0.00 <b><u>đ</u></b></SummaryItemPrice>
                                                                </SummaryItem>
                                                                <SummaryItem type="total">
                                                                    <SummaryItemText>Tổng cộng</SummaryItemText>
                                                                    <SummaryItemPrice>{format_money(foodCart.foodCartTotal)} <b><u>đ</u></b></SummaryItemPrice>
                                                                </SummaryItem>

                                                                <Button
                                                                    onClick={() => handleOrderFood()}
                                                                >ĐẶT MÓN</Button>

                                                            </Summary>
                                                        </Bottom>
                                                    </div>
                                                </Wrapper>
                                            </ModalContent>
                                        )
                                )
                            }

                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => setShowModal(prev => !prev)}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ModalWrapper>
                    </Background>
                ) : null}

                {/* TOAST */}
                <Toast
                    ref={toastRef}
                    dataToast={dataToast}
                />
            </>
        );
    } else {
        return (
            <></>
        );
    }
};

export default Modal;