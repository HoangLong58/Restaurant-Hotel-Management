import { Add, ArrowRightAltOutlined, CheckCircleRounded, Close, CloseOutlined, Remove } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Carousel } from 'react-bootstrap';
import { Link } from "react-router-dom";
import styled from "styled-components";
import Toast from "../Toast";
import MiniImage from "./MiniImage";
import MiniImagePayment from "./MiniImagePayment";

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

const Modal = ({ showModal, setShowModal, type }) => {
    // STATE
    const [isPayment, setIsPayment] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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

    // Handle
    const handleRemoveCartItem = () => {
        console.log("cccc");
        // Toast
        const dataToast = { message: "Add new category success", type: "success" };
        showToastFromOut(dataToast);
    }

    // ================================================================
    // =============== Show video ===============
    if (type === "showCartItems") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal}>
                            {
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
                                                            <Carousel.Item>
                                                                <MiniImagePayment ></MiniImagePayment>
                                                            </Carousel.Item>
                                                        </Carousel>
                                                        <p style={{ fontWeight: "500", marginTop: "10px" }}>Chi tiết giỏ hàng</p>

                                                        <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold" }}> Gè rén </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                                </Content>
                                                                <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                            </Course>
                                                        </CartItem>

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
                                                                            <FormInput type="text" placeholder="Họ tên của bạn là" />
                                                                        </ModalChiTietItem>
                                                                        <ModalChiTietItem className="col-lg-6">
                                                                            <FormSpan>Số điện thoại:</FormSpan>
                                                                            <FormInput type="text" placeholder="Số điện thoại của bạn là" />
                                                                        </ModalChiTietItem>
                                                                    </div>
                                                                    <div className="row">

                                                                        <ModalChiTietItem className="col-lg-12">
                                                                            <FormSpan>Địa chỉ email:</FormSpan>
                                                                            <FormInput type="email" placeholder="Email của bạn là" />
                                                                        </ModalChiTietItem>
                                                                    </div>
                                                                    <div className="row">
                                                                        <ModalChiTietItem className="col-lg-6">
                                                                            <FormSpan>Phòng số:</FormSpan>
                                                                            <FormInput type="text" placeholder="Số phòng của bạn là" />
                                                                        </ModalChiTietItem>
                                                                        <ModalChiTietItem className="col-lg-6">
                                                                            <FormSpan>Mã KEY:</FormSpan>
                                                                            <FormInput type="text" placeholder="Số phòng của bạn là" />
                                                                        </ModalChiTietItem>
                                                                    </div>
                                                                    <div className="row">
                                                                        <ModalChiTietItem className="col-lg-12">
                                                                            <FormSpan>Ghi chú:</FormSpan>
                                                                            <FormTextArea rows="3" placeholder="Ghi chú về những món ăn này" />
                                                                        </ModalChiTietItem>
                                                                    </div>
                                                                </InfomationForm>
                                                            </div>
                                                            <Total>
                                                                <TotalItem>
                                                                    <p>Tổng tiền món ăn</p>
                                                                    <p>200.000 VNĐ</p>
                                                                </TotalItem>
                                                                <TotalItem>
                                                                    <p>Phí dịch vụ 10%</p>
                                                                    <p>20.000 VNĐ</p>
                                                                </TotalItem>
                                                                <TotalItem>
                                                                    <p style={{ color: "var(--color-primary)", fontWeight: "bold" }}>Tổng cộng</p>
                                                                    <p style={{ color: "var(--color-primary)", fontWeight: "bold" }}>200.000 VNĐ</p>
                                                                </TotalItem>
                                                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                                    <ButtonContainer>
                                                                        <PaymentButton
                                                                            onClick={() => setIsSuccess(true)}
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
                                                                onClick={() => setIsPayment(true)}
                                                            >ĐẶT MÓN</TopButton>
                                                        </Top>
                                                        <Bottom className="row">
                                                            <Info className="col-lg-8">
                                                                {/* {cart.products.map(product => {
                                                    const handleRemove = (soluongcapnhat) => {
                                                        dispatch(capNhatSanPham({ ...product, soluongcapnhat }));
                                                    }
                                                    return (
                                                        <>
                                                            <Product>
                                                                <ProductDetail>
                                                                    <MiniImage item={product.data[0].mathucung}></MiniImage>
                                                                    <Details>
                                                                        <ProductName><b style={{ marginRight: "10px" }}>Tiêu đề:</b>{product.data[0].tieude}</ProductName>
                                                                        <ProductId><b style={{ marginRight: "5px" }}>Phân loại:</b> {product.data[0].tendanhmuc}</ProductId>
                                                                        <ProductId><b style={{ marginRight: "5px" }}>Tên thú cưng:</b> {product.data[0].tenthucung}</ProductId>
                                                                        <ProductId><b style={{ marginRight: "5px" }}>ID:</b> {product.data[0].mathucung}</ProductId>
                                                                    </Details>
                                                                </ProductDetail>
                                                                <PriceDetail>
                                                                    <ProductAmountContainer>
                                                                        <div onClick={() => product.soluongmua < product.data[0].soluong && handleRemove(1)}>
                                                                            <Add />
                                                                        </div>
                                                                        <ProductAmount>{product.soluongmua}</ProductAmount>
                                                                        <div onClick={() => handleRemove(-1)}>
                                                                            <Remove />
                                                                        </div>
                                                                    </ProductAmountContainer>
                                                                    <ProductPrice>{format_money((product.soluongmua * product.data[0].giamgia).toString())} <b><u>đ</u></b></ProductPrice>
                                                                </PriceDetail>
                                                                <RemoveProduct onClick={() => handleRemove(0)}><Close className="remove-product" /></RemoveProduct>
                                                            </Product>
                                                            <Hr />
                                                        </>
                                                    )
                                                })
                                                } */}
                                                                <Product>
                                                                    <ProductDetail>
                                                                        <MiniImage />
                                                                        <Details>
                                                                            <ProductName><b style={{ marginRight: "10px" }}>Tiêu đề:</b>Gè Rán</ProductName>
                                                                            <ProductId><b style={{ marginRight: "5px" }}>Phân loại:</b> Gà gà</ProductId>
                                                                            <ProductId><b style={{ marginRight: "5px" }}>Tên thú cưng:</b> Gà</ProductId>
                                                                            <ProductId><b style={{ marginRight: "5px" }}>ID:</b> 1234</ProductId>
                                                                        </Details>
                                                                    </ProductDetail>
                                                                    <PriceDetail>
                                                                        <ProductAmountContainer>
                                                                            <div>
                                                                                <Add />
                                                                            </div>
                                                                            <ProductAmount>12</ProductAmount>
                                                                            <div>
                                                                                <Remove />
                                                                            </div>
                                                                        </ProductAmountContainer>
                                                                        <ProductPrice>200.000 <b><u>đ</u></b></ProductPrice>
                                                                    </PriceDetail>
                                                                    <RemoveProduct
                                                                        onClick={() => handleRemoveCartItem()}
                                                                    ><Close className="remove-product" /></RemoveProduct>
                                                                </Product>
                                                                <Hr />
                                                                <Product>
                                                                    <ProductDetail>
                                                                        <MiniImage />
                                                                        <Details>
                                                                            <ProductName><b style={{ marginRight: "10px" }}>Tiêu đề:</b>Gè Rán</ProductName>
                                                                            <ProductId><b style={{ marginRight: "5px" }}>Phân loại:</b> Gà gà</ProductId>
                                                                            <ProductId><b style={{ marginRight: "5px" }}>Tên thú cưng:</b> Gà</ProductId>
                                                                            <ProductId><b style={{ marginRight: "5px" }}>ID:</b> 1234</ProductId>
                                                                        </Details>
                                                                    </ProductDetail>
                                                                    <PriceDetail>
                                                                        <ProductAmountContainer>
                                                                            <div>
                                                                                <Add />
                                                                            </div>
                                                                            <ProductAmount>12</ProductAmount>
                                                                            <div>
                                                                                <Remove />
                                                                            </div>
                                                                        </ProductAmountContainer>
                                                                        <ProductPrice>200.000 <b><u>đ</u></b></ProductPrice>
                                                                    </PriceDetail>
                                                                    <RemoveProduct><Close className="remove-product" /></RemoveProduct>
                                                                </Product>
                                                                <Hr />
                                                                <Product>
                                                                    <ProductDetail>
                                                                        <MiniImage />
                                                                        <Details>
                                                                            <ProductName><b style={{ marginRight: "10px" }}>Tiêu đề:</b>Gè Rán</ProductName>
                                                                            <ProductId><b style={{ marginRight: "5px" }}>Phân loại:</b> Gà gà</ProductId>
                                                                            <ProductId><b style={{ marginRight: "5px" }}>Tên thú cưng:</b> Gà</ProductId>
                                                                            <ProductId><b style={{ marginRight: "5px" }}>ID:</b> 1234</ProductId>
                                                                        </Details>
                                                                    </ProductDetail>
                                                                    <PriceDetail>
                                                                        <ProductAmountContainer>
                                                                            <div>
                                                                                <Add />
                                                                            </div>
                                                                            <ProductAmount>12</ProductAmount>
                                                                            <div>
                                                                                <Remove />
                                                                            </div>
                                                                        </ProductAmountContainer>
                                                                        <ProductPrice>200.000 <b><u>đ</u></b></ProductPrice>
                                                                    </PriceDetail>
                                                                    <RemoveProduct><Close className="remove-product" /></RemoveProduct>
                                                                </Product>
                                                                <Hr />
                                                            </Info>

                                                            <Summary className="col-lg-4">
                                                                <SummaryTitle >CHI PHÍ ĐẶT MÓN</SummaryTitle>
                                                                <SummaryItem>
                                                                    <SummaryItemText>Thành tiền</SummaryItemText>
                                                                    <SummaryItemPrice>200.000 <b><u>đ</u></b></SummaryItemPrice>
                                                                </SummaryItem>
                                                                <SummaryItem>
                                                                    <SummaryItemText>Phí dịch vụ 10%</SummaryItemText>
                                                                    <SummaryItemPrice>20.000 <b><u>đ</u></b></SummaryItemPrice>
                                                                </SummaryItem>
                                                                <SummaryItem type="total">
                                                                    <SummaryItemText>Tổng cộng</SummaryItemText>
                                                                    <SummaryItemPrice>220.000 <b><u>đ</u></b></SummaryItemPrice>
                                                                </SummaryItem>

                                                                <Button
                                                                    onClick={() => setIsPayment(true)}
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