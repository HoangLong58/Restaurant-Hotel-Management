import { ArrowRightAltOutlined, CheckCircleRounded, CloseOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Toast from "../Toast";
import ChangePasswordProgress from "./ChangePasswordProgress";

// SERVICES
import * as CustomerService from "../../service/CustomerService";

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
    width: 100%;
    margin-bottom: 25px;
    font-size: 1.2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 2px;
`

// TOP
const Top = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
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
    width: 220px;
    height: 40px;
    margin: 5px 0px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    outline: none;
    color: #191919;
    border-radius: 10px;
    padding: 0px 10px;
    box-sizing: border-box;
    &::placeholder {
        letter-spacing: 2px;

        font-size: 15px;
    }
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

const FormChucNang = styled.div`
    display: flex;
    flex-direction: column;
    /* position: absolute;
    left: 50%;
    bottom: 50%; */
    /* transform: translateX(-50%); */
    text-align: center;
`

const SignInBtn = styled.button`
    padding: 0px 35px;
    width: auto;
    height: 42px;
    margin: 5px 0px 10px 0px;
    border: none;
    outline: none;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 700;
    box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: #171717;
    background-color: #ffffff;
    transition: all 0.3s ease;
    &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
    }
    &:active {
        transform: scale(1.05);
    }
`

const SignUpBtn = styled.button`
    padding: 0px 35px;
    width: auto;
    height: 42px;
    margin: 5px 0px;
    border: none;
    outline: none;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 700;
    box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: #171717;
    background-color: #ffffff;
    transition: all 0.3s ease;
    &:hover {
        color: var(--color-white);
        background-color: var(--color-primary);
    }
    &:active {
        transform: scale(1.05);
    }   
`
// Right
const Right = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 95%;
    height: 95%;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: white;
`
// EYE
const Eye = styled.div`
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 13px;
    display: flex;
    z-index: 10;
`

const Label = styled.label`
    position: relative;
`
const Modal = ({ showModal, setShowModal, type }) => {
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer.currentCustomer);
    const foodCart = useSelector(state => state.foodCart);
    // STATE
    const [isSuccess, setIsSuccess] = useState(false);
    const [isEmailWay, setIsEmailWay] = useState(false);
    const [isFillKey, setIsFillKey] = useState(false);
    const [password, setPassword] = useState();
    const [rePassword, setRePassword] = useState();
    const [email, setEmail] = useState();
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
    // Choose email
    const handleChooseEmailWay = () => {
        handleLoading();
        setIsEmailWay(true);
    };
    const handleChangeEmail = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultEmail = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setEmail(resultEmail);
    }
    const handleSendEmail = (e) => {
        const updateCustomerOtpEmail = async () => {
            try {
                const updateCustomerOtpRes = await CustomerService.updateCustomerOtpByEmail({
                    customerEmail: email
                });
                if (!updateCustomerOtpRes) {
                    // Toast
                    const dataToast = { message: updateCustomerOtpRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                handleLoading();
                setIsFillKey(true);
                // Toast
                const dataToast = { message: updateCustomerOtpRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            }
            catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
        updateCustomerOtpEmail();
    }

    // =======================================================================================================
    // Choose phone
    const [isPhoneWay, setIsPhoneWay] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState();
    const handleChoosePhoneWay = () => {
        handleLoading();
        setIsPhoneWay(true);
    };
    const handleChangePhoneNumber = (e) => {
        const resultPhoneNumber = e.target.value.replace(/[^0-9 ]/gi, '');
        setPhoneNumber(resultPhoneNumber);
    }
    const handleSendPhoneNumber = (e) => {
        const updateCustomerOtpPhoneNumber = async () => {
            try {
                const updateCustomerOtpPhoneNumberRes = await CustomerService.updateCustomerOtpByPhoneNumber({
                    customerPhoneNumber: phoneNumber
                });
                if (!updateCustomerOtpPhoneNumberRes) {
                    // Toast
                    const dataToast = { message: updateCustomerOtpPhoneNumberRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                handleLoading();
                setIsFillKey(true);
                // Toast
                const dataToast = { message: updateCustomerOtpPhoneNumberRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
        updateCustomerOtpPhoneNumber();
    }

    // =======================================================================================================
    // Fill Key
    const handleChangeKey = (e) => {
        const resultKey = e.target.value.replace(/[^0-9 ]/gi, '');
        setKey(parseInt(resultKey));
    }
    const handleAuthenKey = (e) => {
        if (password !== rePassword) {
            // Toast
            const dataToast = { message: "Mật khẩu không trùng nhau!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        const updateCustomerPasswordWithOtp = async () => {
            try {
                const updateCustomerPasswordRes = await CustomerService.updateCustomerPasswordByEmail({
                    customerEmail: email,
                    customerOtp: key,
                    customerPassword: password
                });
                if (!updateCustomerPasswordRes) {
                    // Toast
                    const dataToast = { message: updateCustomerPasswordRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                handleLoading();
                setIsSuccess(true);
                // Toast
                const dataToast = { message: updateCustomerPasswordRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
        const updateCustomerPasswordWithOtpPhoneNumber = async () => {
            try {
                const updateCustomerPasswordWithOtpPhoneNumberRes = await CustomerService.updateCustomerPasswordByPhoneNumber({
                    customerPhoneNumber: phoneNumber,
                    customerOtp: key,
                    customerPassword: password
                });
                if (!updateCustomerPasswordWithOtpPhoneNumberRes) {
                    // Toast
                    const dataToast = { message: updateCustomerPasswordWithOtpPhoneNumberRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                handleLoading();
                setIsSuccess(true);
                // Toast
                const dataToast = { message: updateCustomerPasswordWithOtpPhoneNumberRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
        if (isEmailWay) {
            updateCustomerPasswordWithOtp();
        } else {
            updateCustomerPasswordWithOtpPhoneNumber();
        }
    }
    // ============== Fill Key and new password
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
        // setIsPasswordCorrect(false);
    }
    const handleChangeRePassword = (e) => {
        setRePassword(e.target.value);
        // setIsPasswordCorrect(false);
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

    // =======================================================================================================
    // =============== Show video ===============
    if (type === "forgetPassword") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal}>
                            <ModalContent className="col-lg-12">
                                <div className="row" style={{ width: "100%" }}>
                                    <div className="col-lg-5">
                                        <div className="row">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" style={{ width: "100%" }}>
                                                <defs>
                                                    <clipPath id="freepik--clip-path--inject-4">
                                                        <path d="M136.74,252.74c-2.91-5.61-4.13-9.63-4.13-10.56,0-1.84,4-2.94,4-2.94,6.24-3.3,35.59,1.47,48.8,3.67a150.84,150.84,0,0,0,22.38,2.2s1.83-1.46,4-3.3,12.47-13.94,16.51-15,7.7,1.47,7.7,1.47,6.61,4,5.5,4.77-17.24,14.67-21.28,17.24-12.47,1.47-19.81,2.94c-6.32,1.26-31.92,2.82-37.79,3.3a21.33,21.33,0,0,1-13.21-1.1" style={{ fill: "#fff", stroke: "#263238", strokeLinecap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-2--inject-4">
                                                        <path d="M281.65,285.36a7.81,7.81,0,0,1,6.92-4.17h66.7s4.82,0,3.38,9.16-21.22,65.09-26,82-5.79,52.55-5.79,52.55h-80S253.2,339.67,281.65,285.36Z" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-3--inject-4">
                                                        <path d="M132.61,242.18a1.62,1.62,0,0,0,0,.21A1.62,1.62,0,0,1,132.61,242.18Zm4.13,10.56a48.12,48.12,0,0,1-4-9.72A47.51,47.51,0,0,0,136.74,252.74Zm-4.11-10.29c0,.06,0,.13,0,.22C132.65,242.58,132.64,242.51,132.63,242.45Zm.05.28a1.88,1.88,0,0,0,.06.29A1.88,1.88,0,0,1,132.68,242.73Zm4.06,10a91.6,91.6,0,0,0,13.84,19.52c13.21,14.31,51.37,51.74,55,54.31s2.57,9.9,0,17.24-12.11,18-11.74,29.72,4,29.72,3.67,33.39S188,423.06,188,423.06h94.66s-11.8-15-11.8-20.13,16.2-70.86,16.93-75.63-2.2-8.07-8.07-8.44-28.25-5.14-29.35-8.81,5.87-17.61,5.87-17.61l-22,1.1s-1.1,9.54-2.57,11.38-3.67-1.84-8.81-4.4-15-4.77-18.71-7.71-38.89-36-38.89-36" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-4--inject-4">
                                                        <path d="M250.38,310.05c-1.1-3.66,5.87-17.61,5.87-17.61l-22,1.1s-1.1,9.54-2.57,11.38-3.67-1.84-8.81-4.4c-.39-.2-.82-.39-1.26-.58l-1.33,20.91s1.93,20.25,25.07,16.4c9.37-1.56,19.37-9.92,28-19.32C264.47,316.3,251.22,312.86,250.38,310.05Z" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-5--inject-4">
                                                        <path d="M231.67,304.92c-1.47,1.83-3.67-1.84-8.81-4.4-3.24-1.63-8.4-3.11-12.67-4.71-1.21-2.87-2.81-6.61-3.84-8.87-1.83-4-4.77-1.47-4.77-1.47a21.4,21.4,0,0,1-3.67-5.87c-1.83-4-4.77-3.67-8.8-4.4s-12.48-8.44-12.48-8.44-3.95-3-5.58-4.49c-1.9,3.74-6.45,10.32-16.29,14.43,15.69,16.39,47.52,47.53,50.86,49.87,3.67,2.56,2.57,9.9,0,17.24s-12.11,18-11.74,29.72,4,29.72,3.67,33.39c-.33,3.27-7.65,13.52-9.24,15.72l3.73.42h19.42c-.11-9.84-.1-50,6.63-66C225.8,338.67,231.67,304.92,231.67,304.92Z" style={{ fill: "#92E3A9", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-6--inject-4">
                                                        <path d="M231.93,303.64s-4.56-1.4-7.37,1.06-7,15.08-9.47,28.77a38.26,38.26,0,0,0,3,23.55s5.77-15.13,7.52-22.5S231.93,303.64,231.93,303.64Z" style={{ fill: "#92E3A9", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-7--inject-4">
                                                        <path d="M239.89,423.06h42.78s-11.8-15-11.8-20.13,16.2-70.86,16.93-75.63-2.2-8.07-8.07-8.44-28.25-5.14-29.35-8.81c0,0-8.44,29.72-11.37,49.9C236.49,377.26,239.1,413.18,239.89,423.06Z" style={{ fill: "#92E3A9", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-8--inject-4">
                                                        <path d="M250.38,310.05s-11.32,36-11.37,49.9c0,0,16.08-19.47,18.18-33.15S250.38,310.05,250.38,310.05Z" style={{ fill: "#92E3A9", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-9--inject-4">
                                                        <path d="M371.23,416.29s8.29.34,13.72,1.12a99.2,99.2,0,0,0,10.92.87s-3-6.06-6.2-7.77-9-4.77-13.86-4.09S364,412,364.58,413.56,367.75,415.82,371.23,416.29Z" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-10--inject-4">
                                                        <path d="M385,413.81s6.57-3.41,8.21-3.36,12.54,7.42,12,8.6a3.14,3.14,0,0,1-3.44,1.28c-1.21-.57-8.55-3.69-8.55-3.69l-4.8,1.13Z" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-11--inject-4">
                                                        <path d="M380.31,408.2s8.76-.28,10.5.6,9.6,14.36,8.42,15.34-4.44.69-4.34-.4-7.24-8.31-7.24-8.31l-5.71-1.25Z" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-12--inject-4">
                                                        <path d="M375.12,406.39s8.87-.29,10.63.61,9.72,14.53,8.52,15.53-4.48.69-4.38-.41-7.33-8.41-7.33-8.41l-5.78-1.27Z" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-13--inject-4">
                                                        <path d="M274.27,355.57c6.42,9.89,19.31,34.95,23.07,37.77,5.87,4.4,45.11,15.08,48.89,18s3.52,5.85,7.1,6.92,17,4.14,22.12,4.62,2.83-2.69,2.83-2.69l-8.73-6,7.61-1.88s7.63,9.18,9.06,9.68,3.95,0,3.79-1.13c-.28-1.81-8.42-16.62-11.31-17.25s-20.43,1.8-20.43,1.8-36.79-24.81-37.45-25.69c0,0-2.2-6.24-4-8.81s-2.94-1.83-2.94-1.83.74-3.31-.36-4.41l-5.87-5.87-.21.28c-1-2-2-4.28-3.1-6.88-3.07-7.23-13.94-27.52-15.77-30.45-1.37-2.19-12.85-3.76-18.67-4.42" style={{ fill: "#92E3A9", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-14--inject-4">
                                                        <path d="M346.23,411.35c3.79,2.93,3.52,5.85,7.1,6.92s17,4.14,22.12,4.62,2.83-2.69,2.83-2.69l-8.73-6,7.61-1.88s7.63,9.18,9.06,9.68,4.15.68,3.79-1.13c-.7-3.5-8.42-16.62-11.31-17.25s-20.43,1.8-20.43,1.8-33.51-23-37.18-25.49c-14.23,1.37-21,8.82-23.85,13.29l.1.08C303.21,397.74,342.45,408.42,346.23,411.35Z" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-15--inject-4">
                                                        <path d="M257.85,236.73,227.73,249.3a44.41,44.41,0,0,1-3.87,15.31c-3.56,7.53-1.48,21.78,1.94,29.47s18.49,4.68,24,3.72a59.4,59.4,0,0,0,10.93-3.19,10.16,10.16,0,0,0,9.76-1.36S254.37,248,257.85,236.73Z" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-16--inject-4">
                                                        <path d="M158,417.38a17.69,17.69,0,0,1-6.3-1.5,2.18,2.18,0,1,1,1.72-4c2,.85,4.59,1.38,5.28,1.08,1.27-1.42,3.22-10,.7-14.14-.57-.92-1.1-1.09-1.45-1.13-1.43-.2-3.55,1.27-4.3,2a2.18,2.18,0,1,1-3-3.18c.39-.38,4-3.63,7.85-3.11a6.28,6.28,0,0,1,4.58,3.16c3.71,6.05,1.17,17.56-1.68,19.84A5.38,5.38,0,0,1,158,417.38Z" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    </clipPath>
                                                    <clipPath id="freepik--clip-path-17--inject-4">
                                                        <rect x="130.13" y="391.58" width="24.05" height="31.92" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    </clipPath>
                                                </defs>
                                                <g id="freepik--background-simple--inject-4">
                                                    <path d="M440.71,263.76c2-26.57-4.18-54.31-12.46-79C416,148,392.08,110.33,351.88,101.63c-23.18-5-46.77.36-66.65,12.92-19.11,12.08-34,27.69-57.51,30.71-23.77,3.06-48.16,1.83-72.05,1.83-61.43,0-111.28,64.53-98.82,131.75s71.22,113.83,121.07,113.83c44.8,0,81.66-26.87,124.21-34.09,21.1-3.58,42.29.66,63.17-4.7,24.27-6.24,47.09-21.11,60.54-42.64C435,296.56,439.46,280.39,440.71,263.76Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M440.71,263.76c2-26.57-4.18-54.31-12.46-79C416,148,392.08,110.33,351.88,101.63c-23.18-5-46.77.36-66.65,12.92-19.11,12.08-34,27.69-57.51,30.71-23.77,3.06-48.16,1.83-72.05,1.83-61.43,0-111.28,64.53-98.82,131.75s71.22,113.83,121.07,113.83c44.8,0,81.66-26.87,124.21-34.09,21.1-3.58,42.29.66,63.17-4.7,24.27-6.24,47.09-21.11,60.54-42.64C435,296.56,439.46,280.39,440.71,263.76Z" style={{ fill: "#fff", opacity: "0.7000000000000001" }}></path>
                                                </g>
                                                <g id="freepik--Plants--inject-4">
                                                    <path d="M433.52,254.43s0-5-7-11.93-11.44-10.95-11.44-10.95-3.48,11.44,3,18.41a122.46,122.46,0,0,0,15.42,13.42Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M423.42,285.49s0-5-7-11.93S405,262.61,405,262.61s-3.49,11.44,3,18.41a122.46,122.46,0,0,0,15.42,13.42Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M433.08,262.9s.53-4.94,8.19-11.13,12.53-9.67,12.53-9.67,2.25,11.74-4.91,18a122.53,122.53,0,0,1-16.75,11.72Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M420.88,299.58s1-4.86,9.31-10.21,13.47-8.3,13.47-8.3,1,11.92-6.77,17.37a122.67,122.67,0,0,1-17.89,9.9Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M423.17,339.58s0-5,7-11.94,11.43-10.94,11.43-10.94,3.49,11.44-3,18.4a122,122,0,0,1-15.42,13.43Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M423.06,349.34s.7-4.92-5.2-12.8-9.77-12.46-9.77-12.46-5.07,10.83.34,18.64a122.34,122.34,0,0,0,13.35,15.48Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M416.19,378.27s0-5,7-11.93,11.44-10.95,11.44-10.95,3.48,11.44-3,18.41a123,123,0,0,1-15.42,13.43Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M420.84,404.5s-1.26-4.81,3.71-13.31,8.3-13.48,8.3-13.48,6.26,10.18,1.77,18.56a122.38,122.38,0,0,1-11.51,16.89Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M434.15,253.16a141.66,141.66,0,0,1-1.9,15.44c-2.76,14.22-9.64,23.4-12.39,36.24s5.15,29.39,3,45.89-8.53,25.67-6.7,36.68,11.47,40.83,11.47,40.83" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <line x1="433.02" y1="266.21" x2="440.52" y2="260.45" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <line x1="433.37" y1="259.58" x2="430.22" y2="253.99" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <path d="M420.28,304.25s6.28-4.71,12.74-9.42" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M423.42,294.44s-5.24-10.26-11.17-17.06" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M423.42,346.66a77.53,77.53,0,0,1,13.44-18" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M422.2,353.64a87.44,87.44,0,0,0-6.81-12.92c-3.66-5.41-4.19-6.11-4.19-6.11" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M416.19,387.41A83.77,83.77,0,0,1,421.85,376a73.25,73.25,0,0,1,7.33-9.6" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M423.11,413.16a21.25,21.25,0,0,1,1.88-11c2.62-5.06,5.58-11.69,6.8-14.31" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M376.7,320.88s-.54-3.12,3.07-8.25,6-8.1,6-8.1,3.42,6.8.12,11.86a78.12,78.12,0,0,1-8.21,10.1Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M386.41,339.26s-.54-3.12,3.07-8.25,6-8.1,6-8.1,3.42,6.8.12,11.87a78.46,78.46,0,0,1-8.21,10.09Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M377.89,326.14s-.86-3-6.34-6.09-8.9-4.71-8.9-4.71-.14,7.61,5,10.75a78.33,78.33,0,0,0,11.77,5.53Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M389.53,347.82s-1.18-2.94-6.94-5.4-9.36-3.74-9.36-3.74.66,7.58,6.14,10.16a78.08,78.08,0,0,0,12.29,4.26Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M392.43,373.15s-.53-3.12-5.66-6.73-8.36-5.62-8.36-5.62-.94,7.55,3.87,11.21a77.35,77.35,0,0,0,11.13,6.75Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M393.57,379.26s-1-3,1.87-8.6,4.77-8.87,4.77-8.87,4.35,6.24,1.81,11.73a77.48,77.48,0,0,1-6.69,11.15Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M402.31,404.41s.36-3.14,5.27-7,8-6.09,8-6.09,1.37,7.49-3.22,11.42a78,78,0,0,1-10.72,7.37Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M401,396.65s-.54-3.12-5.66-6.73S387,384.3,387,384.3s-.94,7.55,3.87,11.22A78.4,78.4,0,0,0,402,402.27Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M401,413.61s.26-3.16-3.78-7.95-6.66-7.55-6.66-7.55-2.83,7.06.9,11.83a77.58,77.58,0,0,0,9,9.34Z" style={{ fill: "#92E3A9" }}></path>
                                                    <path d="M376.17,320.14a90.29,90.29,0,0,0,2.87,9.48c3.27,8.62,8.58,13.63,11.7,21.38s0,19,3.08,29.11S402,395.28,402,402.38s-2.76,26.85-2.76,26.85" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <line x1="378.3" y1="328.2" x2="372.97" y2="325.41" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <line x1="377.36" y1="324.08" x2="378.72" y2="320.24" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <path d="M390.41,350.68s-4.45-2.27-9-4.53" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M387.38,344.87A64.08,64.08,0,0,1,392.53,333" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M393.05,377.61a49.47,49.47,0,0,0-10.38-9.81" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M394.57,381.85a56.26,56.26,0,0,1,2.87-8.83c1.71-3.79,2-4.29,2-4.29" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M401.76,407.77a46.81,46.81,0,0,1,5.74-5.95,30.16,30.16,0,0,0,3.72-3.24" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M402,402.38a53.67,53.67,0,0,0-4.79-6.56,46.69,46.69,0,0,0-5.64-5.22" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M400.46,419.28a13.53,13.53,0,0,0-2.37-6.7c-2.19-2.89-4.77-6.73-5.82-8.24" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                </g>
                                                <g id="freepik--Bookshelf--inject-4">
                                                    <polygon points="92.67 277.32 88.29 264.81 92.67 270.12 89.23 251.35 94.55 264.81 96.43 238.52 99.56 263.55 103 258.55 103 264.81 107.07 256.36 104.88 271.06 108.63 268.56 102.69 276.69 92.67 277.32" style={{ fill: "#92E3A9" }}></polygon>
                                                    <polygon points="106.44 274.19 90.17 274.19 93.1 307.04 103.51 307.04 106.44 274.19" style={{ fill: "#263238", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></polygon>
                                                    <rect x="81.53" y="306.67" width="55.43" height="117.4" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="306.67" width="30.75" height="117.4" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="306.67" width="27.29" height="117.4" style={{ fill: "#263238", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="396.77" width="24.22" height="24.04" style={{ fill: "#92E3A9", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="398.07" width="24.22" height="3.08" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="415.77" width="24.22" height="3.08" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <line x1="113.83" y1="397.27" x2="113.83" y2="427.67" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <line x1="122.28" y1="397.27" x2="122.28" y2="427.67" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <line x1="129.7" y1="397.27" x2="129.7" y2="427.67" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <rect x="109.24" y="311.03" width="24.22" height="35.35" style={{ fill: "#92E3A9", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="312.51" width="24.22" height="3.5" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="335.17" width="24.22" height="3.5" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <line x1="113.83" y1="311.59" x2="113.83" y2="346.14" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <line x1="122.28" y1="311.59" x2="122.28" y2="346.14" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <line x1="129.7" y1="311.59" x2="129.7" y2="346.14" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <rect x="109.24" y="353.63" width="24.22" height="35.35" style={{ fill: "#92E3A9", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="355.11" width="24.22" height="3.5" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="377.77" width="24.22" height="3.5" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <line x1="113.83" y1="354.2" x2="113.83" y2="388.74" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <line x1="122.28" y1="354.2" x2="122.28" y2="388.74" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <line x1="129.7" y1="354.2" x2="129.7" y2="388.74" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <rect x="109.24" y="345.89" width="27.71" height="4.02" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <rect x="109.24" y="388.76" width="27.71" height="4.02" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <line x1="136.95" y1="306.67" x2="136.95" y2="424.06" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                    <polygon points="105.33 306.67 105.33 424.06 109.24 424.06 109.24 311.03 136.47 311.03 136.47 306.62 105.33 306.67" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></polygon>
                                                    <line x1="109.24" y1="311.03" x2="109.24" y2="306.67" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></line>
                                                </g>
                                                <g id="freepik--Character--inject-4">
                                                    <path d="M136.74,252.74c-2.91-5.61-4.13-9.63-4.13-10.56,0-1.84,4-2.94,4-2.94,6.24-3.3,35.59,1.47,48.8,3.67a150.84,150.84,0,0,0,22.38,2.2s1.83-1.46,4-3.3,12.47-13.94,16.51-15,7.7,1.47,7.7,1.47,6.61,4,5.5,4.77-17.24,14.67-21.28,17.24-12.47,1.47-19.81,2.94c-6.32,1.26-31.92,2.82-37.79,3.3a21.33,21.33,0,0,1-13.21-1.1" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path--inject-4)" }}>
                                                        <path d="M236.07,228.24s-3.67-2.57-7.7-1.47-14.31,13.21-16.51,15-4,3.3-4,3.3a150.84,150.84,0,0,1-22.38-2.2c-13.21-2.2-42.56-7-48.8-3.67,0,0-4,1.1-4,2.94a12.62,12.62,0,0,0,.79,3l.55.2s7.33-.77,23.15-.39,52.41,2.55,54.76,3.4c1,.38,8.09-1.22,15.95-4,6-4.89,13.05-11,13.76-11.43C242.68,232.27,236.07,228.24,236.07,228.24Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M236.07,228.24s-3.67-2.57-7.7-1.47-14.31,13.21-16.51,15-4,3.3-4,3.3a150.84,150.84,0,0,1-22.38-2.2c-13.21-2.2-42.56-7-48.8-3.67,0,0-4,1.1-4,2.94a12.62,12.62,0,0,0,.79,3l.55.2s7.33-.77,23.15-.39,52.41,2.55,54.76,3.4c1,.38,8.09-1.22,15.95-4,6-4.89,13.05-11,13.76-11.43C242.68,232.27,236.07,228.24,236.07,228.24Z" style={{ fill: "#fff", opacity: "0.5" }}></path>
                                                    </g>
                                                    <path d="M136.74,252.74c-2.91-5.61-4.13-9.63-4.13-10.56,0-1.84,4-2.94,4-2.94,6.24-3.3,35.59,1.47,48.8,3.67a150.84,150.84,0,0,0,22.38,2.2s1.83-1.46,4-3.3,12.47-13.94,16.51-15,7.7,1.47,7.7,1.47,6.61,4,5.5,4.77-17.24,14.67-21.28,17.24-12.47,1.47-19.81,2.94c-6.32,1.26-31.92,2.82-37.79,3.3a21.33,21.33,0,0,1-13.21-1.1" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M281.65,285.36a7.81,7.81,0,0,1,6.92-4.17h66.7s4.82,0,3.38,9.16-21.22,65.09-26,82-5.79,52.55-5.79,52.55h-80S253.2,339.67,281.65,285.36Z" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-2--inject-4)" }}>
                                                        <path d="M311.69,281.19H288.57a7.81,7.81,0,0,0-6.92,4.17c-28.45,54.31-34.86,139.51-34.86,139.51h35.88l8.85-33.61,36.9,7.61c.26-2.82.56-5.69.91-8.52l-.81-9s-7.56-7.95-9.94-9.94-.8-5.58-1.2-21.09-14.32-26.66-19.5-36.21,2.79-15.52,9.95-25.07C310.38,285.59,311.42,283.05,311.69,281.19Z" style={{ opacity: "0.16" }}></path>
                                                    </g>
                                                    <path d="M281.65,285.36a7.81,7.81,0,0,1,6.92-4.17h66.7s4.82,0,3.38,9.16-21.22,65.09-26,82-5.79,52.55-5.79,52.55h-80S253.2,339.67,281.65,285.36Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M343.7,297.1c-6.74,15.73-21,78-23.32,127.77h6.44s1-35.68,5.79-52.55,24.59-72.81,26-82-3.38-9.16-3.38-9.16S349.11,284.49,343.7,297.1Z" style={{ fill: "#263238", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M226.53,265.66s-10.64-6.24-14.67-17.24,31.55-28.62,47-29.72,19.81,2.93,29,18.71,15.41,37.42,10.64,48.06-12.84,13.21-7,22,22.38,33.75,21.28,45.49-12.47,22-29,23.12-38.53-8.81-56.87-25-13.58-40-7-47.7,16.51-10.64,17.24-18.34S226.53,265.66,226.53,265.66Z" style={{ fill: "#263238", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M271.88,248.25c5.65,10.52,12.72,24.61,14.93,33.12,3.86,14.9-16,24.28-10.49,31.45" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M264.18,234.47s2.2,3.75,5.24,9.27" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M293.82,260.94a27.08,27.08,0,0,1,1.26,6.08" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M268,229s17.38,12.84,24.32,28.21" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M243.88,238.63c-12.41,3.48-30.26,9.13-28.81,12.39" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M255.35,235.57s-2.65.66-6.6,1.72" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M240,229.09a64,64,0,0,1,22-2.9" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M234.94,231.16a27.72,27.72,0,0,1,3.48-1.52" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M132.61,242.18a1.62,1.62,0,0,0,0,.21A1.62,1.62,0,0,1,132.61,242.18Zm4.13,10.56a48.12,48.12,0,0,1-4-9.72A47.51,47.51,0,0,0,136.74,252.74Zm-4.11-10.29c0,.06,0,.13,0,.22C132.65,242.58,132.64,242.51,132.63,242.45Zm.05.28a1.88,1.88,0,0,0,.06.29A1.88,1.88,0,0,1,132.68,242.73Zm4.06,10a91.6,91.6,0,0,0,13.84,19.52c13.21,14.31,51.37,51.74,55,54.31s2.57,9.9,0,17.24-12.11,18-11.74,29.72,4,29.72,3.67,33.39S188,423.06,188,423.06h94.66s-11.8-15-11.8-20.13,16.2-70.86,16.93-75.63-2.2-8.07-8.07-8.44-28.25-5.14-29.35-8.81,5.87-17.61,5.87-17.61l-22,1.1s-1.1,9.54-2.57,11.38-3.67-1.84-8.81-4.4-15-4.77-18.71-7.71-38.89-36-38.89-36" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-3--inject-4)" }}>
                                                        <path d="M209.77,295.64c1.83,3.2,3.66,6.09,3.66,6.09s6.17,3.47,7.71,3.47,10.8,5,10.8,5,7.72-1.93,5-8.49a20.72,20.72,0,0,0-3.22-4.62c-.46,2.91-1.2,6.72-2.07,7.81-1.47,1.83-3.67-1.84-8.81-4.4C219.51,298.84,214.12,297.32,209.77,295.64Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M190.93,280.79c-11.33-10.49-25.67-23.94-25.67-23.94l-8.34-1.2-1,.56s23.54,20.83,28.55,23.15A15.65,15.65,0,0,0,190.93,280.79Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M202.8,291.65l-.9-.8c.46.76.72,1.24.72,1.24Z" style={{ fill: "#92E3A9" }}></path>
                                                        <g style={{ opacity: "0.5" }}>
                                                            <path d="M209.77,295.64c1.83,3.2,3.66,6.09,3.66,6.09s6.17,3.47,7.71,3.47,10.8,5,10.8,5,7.72-1.93,5-8.49a20.72,20.72,0,0,0-3.22-4.62c-.46,2.91-1.2,6.72-2.07,7.81-1.47,1.83-3.67-1.84-8.81-4.4C219.51,298.84,214.12,297.32,209.77,295.64Z" style={{ fill: "#fff" }}></path>
                                                            <path d="M190.93,280.79c-11.33-10.49-25.67-23.94-25.67-23.94l-8.34-1.2-1,.56s23.54,20.83,28.55,23.15A15.65,15.65,0,0,0,190.93,280.79Z" style={{ fill: "#fff" }}></path>
                                                            <path d="M202.8,291.65l-.9-.8c.46.76.72,1.24.72,1.24Z" style={{ fill: "#fff" }}></path>
                                                        </g>
                                                    </g>
                                                    <path d="M132.61,242.18a1.62,1.62,0,0,0,0,.21A1.62,1.62,0,0,1,132.61,242.18Zm4.13,10.56a48.12,48.12,0,0,1-4-9.72A47.51,47.51,0,0,0,136.74,252.74Zm-4.11-10.29c0,.06,0,.13,0,.22C132.65,242.58,132.64,242.51,132.63,242.45Zm.05.28a1.88,1.88,0,0,0,.06.29A1.88,1.88,0,0,1,132.68,242.73Zm4.06,10a91.6,91.6,0,0,0,13.84,19.52c13.21,14.31,51.37,51.74,55,54.31s2.57,9.9,0,17.24-12.11,18-11.74,29.72,4,29.72,3.67,33.39S188,423.06,188,423.06h94.66s-11.8-15-11.8-20.13,16.2-70.86,16.93-75.63-2.2-8.07-8.07-8.44-28.25-5.14-29.35-8.81,5.87-17.61,5.87-17.61l-22,1.1s-1.1,9.54-2.57,11.38-3.67-1.84-8.81-4.4-15-4.77-18.71-7.71-38.89-36-38.89-36" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M165.26,256.85s-11.72.22-18.26-5.17" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M250.38,310.05c-1.1-3.66,5.87-17.61,5.87-17.61l-22,1.1s-1.1,9.54-2.57,11.38-3.67-1.84-8.81-4.4c-.39-.2-.82-.39-1.26-.58l-1.33,20.91s1.93,20.25,25.07,16.4c9.37-1.56,19.37-9.92,28-19.32C264.47,316.3,251.22,312.86,250.38,310.05Z" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-4--inject-4)" }}>
                                                        <path d="M249.76,295.21s-1.33,7.46-2.4,15.71-1.86,14.39-1.86,14.39l4.88-15.26,5.5-16.17S250.56,293.88,249.76,295.21Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M249.76,295.21s-1.33,7.46-2.4,15.71-1.86,14.39-1.86,14.39l4.88-15.26,5.5-16.17S250.56,293.88,249.76,295.21Z" style={{ fill: "#fff", opacity: "0.5" }}></path>
                                                    </g>
                                                    <path d="M250.38,310.05c-1.1-3.66,5.87-17.61,5.87-17.61l-22,1.1s-1.1,9.54-2.57,11.38-3.67-1.84-8.81-4.4c-.39-.2-.82-.39-1.26-.58l-1.33,20.91s1.93,20.25,25.07,16.4c9.37-1.56,19.37-9.92,28-19.32C264.47,316.3,251.22,312.86,250.38,310.05Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M231.67,304.92c-1.47,1.83-3.67-1.84-8.81-4.4-3.24-1.63-8.4-3.11-12.67-4.71-1.21-2.87-2.81-6.61-3.84-8.87-1.83-4-4.77-1.47-4.77-1.47a21.4,21.4,0,0,1-3.67-5.87c-1.83-4-4.77-3.67-8.8-4.4s-12.48-8.44-12.48-8.44-3.95-3-5.58-4.49c-1.9,3.74-6.45,10.32-16.29,14.43,15.69,16.39,47.52,47.53,50.86,49.87,3.67,2.56,2.57,9.9,0,17.24s-12.11,18-11.74,29.72,4,29.72,3.67,33.39c-.33,3.27-7.65,13.52-9.24,15.72l3.73.42h19.42c-.11-9.84-.1-50,6.63-66C225.8,338.67,231.67,304.92,231.67,304.92Z" style={{ fill: "#92E3A9" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-5--inject-4)" }}>
                                                        <path d="M222.86,300.52c-3.24-1.63-8.4-3.11-12.67-4.71-1.21-2.87-2.81-6.61-3.84-8.87-1.83-4-4.77-1.47-4.77-1.47a21.4,21.4,0,0,1-3.67-5.87c-1.83-4-4.77-3.67-8.8-4.4s-12.48-8.44-12.48-8.44-3.95-3-5.58-4.49a27.13,27.13,0,0,1-2.89,4.49c6.56,5.55,13.8,11.43,16.33,12.6,5,2.31,6.17.38,10,2.7s8.1,10,8.1,10,2.32-6.18,4.25-1.93,6.56,11.57,6.56,11.57,6.17,3.47,7.71,3.47c1.21,0,7.14,3.08,9.66,4.41.56-2.93.87-4.69.87-4.69C230.2,306.75,228,303.08,222.86,300.52Z" style={{ opacity: "0.16" }}></path>
                                                    </g>
                                                    <path d="M231.67,304.92c-1.47,1.83-3.67-1.84-8.81-4.4-3.24-1.63-8.4-3.11-12.67-4.71-1.21-2.87-2.81-6.61-3.84-8.87-1.83-4-4.77-1.47-4.77-1.47a21.4,21.4,0,0,1-3.67-5.87c-1.83-4-4.77-3.67-8.8-4.4s-12.48-8.44-12.48-8.44-3.95-3-5.58-4.49c-1.9,3.74-6.45,10.32-16.29,14.43,15.69,16.39,47.52,47.53,50.86,49.87,3.67,2.56,2.57,9.9,0,17.24s-12.11,18-11.74,29.72,4,29.72,3.67,33.39c-.33,3.27-7.65,13.52-9.24,15.72l3.73.42h19.42c-.11-9.84-.1-50,6.63-66C225.8,338.67,231.67,304.92,231.67,304.92Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M231.93,303.64s-4.56-1.4-7.37,1.06-7,15.08-9.47,28.77a38.26,38.26,0,0,0,3,23.55s5.77-15.13,7.52-22.5S231.93,303.64,231.93,303.64Z" style={{ fill: "#92E3A9" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-6--inject-4)" }}>
                                                        <path d="M223.18,305.87s3.3-.8,4.66-.34a13.3,13.3,0,0,1,3.18,1.93l.91-3.82a7.38,7.38,0,0,0-4.43-.73C225.23,303.37,223.18,305.87,223.18,305.87Z" style={{ opacity: "0.16" }}></path>
                                                    </g>
                                                    <path d="M231.93,303.64s-4.56-1.4-7.37,1.06-7,15.08-9.47,28.77a38.26,38.26,0,0,0,3,23.55s5.77-15.13,7.52-22.5S231.93,303.64,231.93,303.64Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <polyline points="201.22 304.84 207.09 328.69 193.88 298.6" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></polyline>
                                                    <path d="M239.89,423.06h42.78s-11.8-15-11.8-20.13,16.2-70.86,16.93-75.63-2.2-8.07-8.07-8.44-28.25-5.14-29.35-8.81c0,0-8.44,29.72-11.37,49.9C236.49,377.26,239.1,413.18,239.89,423.06Z" style={{ fill: "#92E3A9" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-7--inject-4)" }}>
                                                        <path d="M279.73,318.86c-4.81-.3-20.7-3.56-26.89-6.74l2.25,5.2a45.11,45.11,0,0,0,13,4.52c7.45,1.33,14.38,1.07,18.91,7.73l.22.33c.28-1.28.47-2.18.53-2.6C288.54,322.53,285.6,319.23,279.73,318.86Z" style={{ opacity: "0.16" }}></path>
                                                    </g>
                                                    <path d="M239.89,423.06h42.78s-11.8-15-11.8-20.13,16.2-70.86,16.93-75.63-2.2-8.07-8.07-8.44-28.25-5.14-29.35-8.81c0,0-8.44,29.72-11.37,49.9C236.49,377.26,239.1,413.18,239.89,423.06Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M250.38,310.05s-11.32,36-11.37,49.9c0,0,16.08-19.47,18.18-33.15S250.38,310.05,250.38,310.05Z" style={{ fill: "#92E3A9" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-8--inject-4)" }}>
                                                        <path d="M248.43,314.65a10.48,10.48,0,0,1,8.79,4.26s-2.22-6.53-6.84-8.86Z" style={{ opacity: "0.16" }}></path>
                                                    </g>
                                                    <path d="M250.38,310.05s-11.32,36-11.37,49.9c0,0,16.08-19.47,18.18-33.15S250.38,310.05,250.38,310.05Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M371.23,416.29s8.29.34,13.72,1.12a99.2,99.2,0,0,0,10.92.87s-3-6.06-6.2-7.77-9-4.77-13.86-4.09S364,412,364.58,413.56,367.75,415.82,371.23,416.29Z" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-9--inject-4)" }}>
                                                        <path d="M371.23,416.29s8.29.34,13.72,1.12a99.2,99.2,0,0,0,10.92.87s-3-6.06-6.2-7.77-9-4.77-13.86-4.09S364,412,364.58,413.56,367.75,415.82,371.23,416.29Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M371.23,416.29s8.29.34,13.72,1.12a99.2,99.2,0,0,0,10.92.87s-3-6.06-6.2-7.77-9-4.77-13.86-4.09S364,412,364.58,413.56,367.75,415.82,371.23,416.29Z" style={{ fill: "#fff", opacity: "0.5" }}></path>
                                                    </g>
                                                    <path d="M371.23,416.29s8.29.34,13.72,1.12a99.2,99.2,0,0,0,10.92.87s-3-6.06-6.2-7.77-9-4.77-13.86-4.09S364,412,364.58,413.56,367.75,415.82,371.23,416.29Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M385,413.81s6.57-3.41,8.21-3.36,12.54,7.42,12,8.6a3.14,3.14,0,0,1-3.44,1.28c-1.21-.57-8.55-3.69-8.55-3.69l-4.8,1.13Z" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-10--inject-4)" }}>
                                                        <path d="M385,413.81s6.57-3.41,8.21-3.36,12.54,7.42,12,8.6-3.12,2.14-3.44,1.28-8.55-3.69-8.55-3.69l-4.8,1.13Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M385,413.81s6.57-3.41,8.21-3.36,12.54,7.42,12,8.6-3.12,2.14-3.44,1.28-8.55-3.69-8.55-3.69l-4.8,1.13Z" style={{ fill: "#fff", opacity: "0.5" }}></path>
                                                    </g>
                                                    <path d="M385,413.81s6.57-3.41,8.21-3.36,12.54,7.42,12,8.6a3.14,3.14,0,0,1-3.44,1.28c-1.21-.57-8.55-3.69-8.55-3.69l-4.8,1.13Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M380.31,408.2s8.76-.28,10.5.6,9.6,14.36,8.42,15.34-4.44.69-4.34-.4-7.24-8.31-7.24-8.31l-5.71-1.25Z" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-11--inject-4)" }}>
                                                        <path d="M380.31,408.2s8.76-.28,10.5.6,9.6,14.36,8.42,15.34-4.44.69-4.34-.4-7.24-8.31-7.24-8.31l-5.71-1.25Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M380.31,408.2s8.76-.28,10.5.6,9.6,14.36,8.42,15.34-4.44.69-4.34-.4-7.24-8.31-7.24-8.31l-5.71-1.25Z" style={{ fill: "#fff", opacity: "0.5" }}></path>
                                                    </g>
                                                    <path d="M380.31,408.2s8.76-.28,10.5.6,9.6,14.36,8.42,15.34-4.44.69-4.34-.4-7.24-8.31-7.24-8.31l-5.71-1.25Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M375.12,406.39s8.87-.29,10.63.61,9.72,14.53,8.52,15.53-4.48.69-4.38-.41-7.33-8.41-7.33-8.41l-5.78-1.27Z" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-12--inject-4)" }}>
                                                        <path d="M375.12,406.39s8.87-.29,10.63.61,9.72,14.53,8.52,15.53-4.48.69-4.38-.41-7.33-8.41-7.33-8.41l-5.78-1.27Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M375.12,406.39s8.87-.29,10.63.61,9.72,14.53,8.52,15.53-4.48.69-4.38-.41-7.33-8.41-7.33-8.41l-5.78-1.27Z" style={{ fill: "#fff", opacity: "0.5" }}></path>
                                                    </g>
                                                    <path d="M375.12,406.39s8.87-.29,10.63.61,9.72,14.53,8.52,15.53-4.48.69-4.38-.41-7.33-8.41-7.33-8.41l-5.78-1.27Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M274.27,355.57c6.42,9.89,19.31,34.95,23.07,37.77,5.87,4.4,45.11,15.08,48.89,18s3.52,5.85,7.1,6.92,17,4.14,22.12,4.62,2.83-2.69,2.83-2.69l-8.73-6,7.61-1.88s7.63,9.18,9.06,9.68,3.95,0,3.79-1.13c-.28-1.81-8.42-16.62-11.31-17.25s-20.43,1.8-20.43,1.8-36.79-24.81-37.45-25.69c0,0-2.2-6.24-4-8.81s-2.94-1.83-2.94-1.83.74-3.31-.36-4.41l-5.87-5.87-.21.28c-1-2-2-4.28-3.1-6.88-3.07-7.23-13.94-27.52-15.77-30.45-1.37-2.19-12.85-3.76-18.67-4.42" style={{ fill: "#92E3A9" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-13--inject-4)" }}>
                                                        <path d="M299.83,356.2c4.8,4.26,3.2,4.26,2.13,8s.8-1.33,5.33-1.06,3.2,6.12,2.66,7.19,5.6,2.4,4.53,4.79-7.19,5.86-10.65,9.33,9.05-5.6,13.31-5.86c1.3-.09,2.37.08,3.27.06a42,42,0,0,0-3.62-7.68c-1.84-2.57-2.94-1.83-2.94-1.83s.74-3.31-.36-4.41l-5.87-5.87-.21.28c-1-2-2-4.28-3.1-6.88-3.07-7.23-13.94-27.52-15.77-30.45-1.37-2.19-12.85-3.76-18.67-4.42l.53,4.63.13.1s7.19,1.33,9.59,1.6,5.33,2.39,5.06,4-7.19,8.79-5.06,9.33,4.53-5.33,6.93-4.53S295,351.94,299.83,356.2Z" style={{ opacity: "0.16" }}></path>
                                                    </g>
                                                    <path d="M274.27,355.57c6.42,9.89,19.31,34.95,23.07,37.77,5.87,4.4,45.11,15.08,48.89,18s3.52,5.85,7.1,6.92,17,4.14,22.12,4.62,2.83-2.69,2.83-2.69l-8.73-6,7.61-1.88s7.63,9.18,9.06,9.68,3.95,0,3.79-1.13c-.28-1.81-8.42-16.62-11.31-17.25s-20.43,1.8-20.43,1.8-36.79-24.81-37.45-25.69c0,0-2.2-6.24-4-8.81s-2.94-1.83-2.94-1.83.74-3.31-.36-4.41l-5.87-5.87-.21.28c-1-2-2-4.28-3.1-6.88-3.07-7.23-13.94-27.52-15.77-30.45-1.37-2.19-12.85-3.76-18.67-4.42" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M274.37,342c-.27.9-.5,1.8-.68,2.72" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M284.09,325.45a53.53,53.53,0,0,0-7.88,11.85" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M298.78,382.23c2.7-4,7-9.07,11.74-10.52" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M295.79,387.15s.48-.94,1.34-2.36" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M295.79,380.83s4.91-12.28,9.82-15.44,2.1,3.16,2.1,3.16" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M346.23,411.35c3.79,2.93,3.52,5.85,7.1,6.92s17,4.14,22.12,4.62,2.83-2.69,2.83-2.69l-8.73-6,7.61-1.88s7.63,9.18,9.06,9.68,4.15.68,3.79-1.13c-.7-3.5-8.42-16.62-11.31-17.25s-20.43,1.8-20.43,1.8-33.51-23-37.18-25.49c-14.23,1.37-21,8.82-23.85,13.29l.1.08C303.21,397.74,342.45,408.42,346.23,411.35Z" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-14--inject-4)" }}>
                                                        <path d="M390,420.91c-1.82-4.45-8.42-16.62-11.31-17.25s-20.43,1.8-20.43,1.8-33.51-23-37.18-25.49a37.26,37.26,0,0,0-10.87,2.63c5.29,3,40.55,23,45,23.89,4.72,1,20.47-1.59,23.24.27,1.76,1.18,7,9.49,10.54,15.39C390,422,390.37,421.81,390,420.91Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M390,420.91c-2.84-6.37-8.42-16.62-11.31-17.25s-20.43,1.8-20.43,1.8-33.51-23-37.18-25.49a37.26,37.26,0,0,0-10.87,2.63c5.29,3,40.55,23,45,23.89,4.72,1,20.47-1.59,23.24.27,1.76,1.18,7,9.49,10.54,15.39C390,422,390.4,421.8,390,420.91Z" style={{ fill: "#fff", opacity: "0.5" }}></path>
                                                    </g>
                                                    <path d="M346.23,411.35c3.79,2.93,3.52,5.85,7.1,6.92s17,4.14,22.12,4.62,2.83-2.69,2.83-2.69l-8.73-6,7.61-1.88s7.63,9.18,9.06,9.68,4.15.68,3.79-1.13c-.7-3.5-8.42-16.62-11.31-17.25s-20.43,1.8-20.43,1.8-33.51-23-37.18-25.49c-14.23,1.37-21,8.82-23.85,13.29l.1.08C303.21,397.74,342.45,408.42,346.23,411.35Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M257.85,236.73,227.73,249.3a44.41,44.41,0,0,1-3.87,15.31c-3.56,7.53-1.48,21.78,1.94,29.47s18.49,4.68,24,3.72a59.4,59.4,0,0,0,10.93-3.19,10.16,10.16,0,0,0,9.76-1.36S254.37,248,257.85,236.73Z" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-15--inject-4)" }}>
                                                        <path d="M257.85,236.73,227.73,249.3a44.41,44.41,0,0,1-3.87,15.31c-3.56,7.53-1.48,21.78,1.94,29.47a7,7,0,0,0,2.65,3v-.58s-5.59-13.85-4.53-21.84,5.6-12,6.13-17.05.26-7.45,10.39-11.18,14.38-7.19,15.44-3.47,5.33,28.24,8.26,34.1,2.66,12-1.86,14.65a63.55,63.55,0,0,1-14.57,6.42l2.13-.37a59.4,59.4,0,0,0,10.93-3.19,10.16,10.16,0,0,0,9.76-1.36S254.37,248,257.85,236.73Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M257.85,236.73,227.73,249.3a44.41,44.41,0,0,1-3.87,15.31c-3.56,7.53-1.48,21.78,1.94,29.47a7,7,0,0,0,2.65,3v-.58s-5.59-13.85-4.53-21.84,5.6-12,6.13-17.05.26-7.45,10.39-11.18,14.38-7.19,15.44-3.47,5.33,28.24,8.26,34.1,2.66,12-1.86,14.65a63.55,63.55,0,0,1-14.57,6.42l2.13-.37a59.4,59.4,0,0,0,10.93-3.19,10.16,10.16,0,0,0,9.76-1.36S254.37,248,257.85,236.73Z" style={{ fill: "#fff", opacity: "0.5" }}></path>
                                                    </g>
                                                    <path d="M257.85,236.73,227.73,249.3a44.41,44.41,0,0,1-3.87,15.31c-3.56,7.53-1.48,21.78,1.94,29.47s18.49,4.68,24,3.72a59.4,59.4,0,0,0,10.93-3.19,10.16,10.16,0,0,0,9.76-1.36S254.37,248,257.85,236.73Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M242.63,256.44a15.65,15.65,0,0,1-.65,5.24c-.8,2-8.35,9.86-8.12,10.71s.91,3.58,2.25,3.84" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M251,263.47c1.05-2.1,4.5-.05,4.45,4.68" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M233.9,257.29s2.94-1.29,5.57,3.47" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M246.82,270.4a14.56,14.56,0,0,1,9.13,3.83" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round", strokeWidth: "0.5px" }}></path>
                                                    <path d="M230.35,264.15a19.37,19.37,0,0,1,5.1,1.41" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round", strokeWidth: "0.5px" }}></path>
                                                    <path d="M242.3,252a5.67,5.67,0,0,0-5.06-.12c-2.69,1.29-4.34,2.71-4.16,1.06s3.34-3.47,4.29-3.71S242.57,248.33,242.3,252Z" style={{ fill: "#263238" }}></path>
                                                    <path d="M249.84,248.27a22.87,22.87,0,0,1,6.5,8.46c2,5,3.58-.46,2-3.73S252.19,246.25,249.84,248.27Z" style={{ fill: "#263238" }}></path>
                                                    <path d="M270.93,301.8c0,2.33-1.32,4.22-2.94,4.22s-2.93-1.89-2.93-4.22,1.31-8.26,2.93-8.26S270.93,299.47,270.93,301.8Z" style={{ fill: "#92E3A9", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M251.26,262.56a6.11,6.11,0,0,0-.27.94c-.29,1.48-.58,4.57,0,4.7s2-2.76,2.25-4.24a5.65,5.65,0,0,0,.1-.88A18.23,18.23,0,0,0,251.26,262.56Z" style={{ fill: "#263238" }}></path>
                                                    <path d="M234.2,257a5.82,5.82,0,0,0-.21.8c-.3,1.48-.29,4.73.34,4.85s1.66-2.92,1.95-4.4a6.15,6.15,0,0,0,.12-1.09A5.67,5.67,0,0,0,234.2,257Z" style={{ fill: "#263238" }}></path>
                                                    <path d="M251,263.52l1-1.86a7.23,7.23,0,0,1,4.08,2.36" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round", strokeWidth: "0.75px" }}></path>
                                                    <path d="M234.2,257l1-1.17s.43-.21,2.79.86" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round", strokeWidth: "0.75px" }}></path>
                                                    <path d="M230.41,284.12s1.68-3.09,3.93-3.09,3.93,5.05,3.93,5.05" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                </g>
                                                <g id="freepik--Mug--inject-4">
                                                    <path d="M158,417.38a17.69,17.69,0,0,1-6.3-1.5,2.18,2.18,0,1,1,1.72-4c2,.85,4.59,1.38,5.28,1.08,1.27-1.42,3.22-10,.7-14.14-.57-.92-1.1-1.09-1.45-1.13-1.43-.2-3.55,1.27-4.3,2a2.18,2.18,0,1,1-3-3.18c.39-.38,4-3.63,7.85-3.11a6.28,6.28,0,0,1,4.58,3.16c3.71,6.05,1.17,17.56-1.68,19.84A5.38,5.38,0,0,1,158,417.38Z" style={{ fill: "#fff" }}></path>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-16--inject-4)" }}>
                                                        <path d="M160.93,398.16a4.12,4.12,0,0,0-3-2.44c-2.5-.4-4.85,2.11-5.11,2.39a1.88,1.88,0,0,0-.21,2.09,2.16,2.16,0,0,0,1.05-.54c.75-.7,2.87-2.17,4.3-2,.35,0,.88.21,1.45,1.13,2.52,4.1.57,12.72-.7,14.14-.69.3-3.27-.23-5.28-1.08a2.19,2.19,0,0,0-.78-.17,1.65,1.65,0,0,0,.84,1.33,10,10,0,0,0,4.09,1.16,3.15,3.15,0,0,0,2.23-.78C161.69,411.66,163.35,402.81,160.93,398.16Z" style={{ fill: "#92E3A9" }}></path>
                                                        <path d="M160.93,398.16a4.12,4.12,0,0,0-3-2.44c-2.5-.4-4.85,2.11-5.11,2.39a1.88,1.88,0,0,0-.21,2.09,2.16,2.16,0,0,0,1.05-.54c.75-.7,2.87-2.17,4.3-2,.35,0,.88.21,1.45,1.13,2.52,4.1.57,12.72-.7,14.14-.69.3-3.27-.23-5.28-1.08a2.19,2.19,0,0,0-.78-.17,1.65,1.65,0,0,0,.84,1.33,10,10,0,0,0,4.09,1.16,3.15,3.15,0,0,0,2.23-.78C161.69,411.66,163.35,402.81,160.93,398.16Z" style={{ fill: "#fff", opacity: "0.5" }}></path>
                                                    </g>
                                                    <path d="M158,417.38a17.69,17.69,0,0,1-6.3-1.5,2.18,2.18,0,1,1,1.72-4c2,.85,4.59,1.38,5.28,1.08,1.27-1.42,3.22-10,.7-14.14-.57-.92-1.1-1.09-1.45-1.13-1.43-.2-3.55,1.27-4.3,2a2.18,2.18,0,1,1-3-3.18c.39-.38,4-3.63,7.85-3.11a6.28,6.28,0,0,1,4.58,3.16c3.71,6.05,1.17,17.56-1.68,19.84A5.38,5.38,0,0,1,158,417.38Z" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <rect x="130.13" y="391.58" width="24.05" height="31.92" style={{ fill: "#fff" }}></rect>
                                                    <g style={{ clipPath: "url(#freepik--clip-path-17--inject-4)" }}>
                                                        <rect x="130.13" y="391.58" width="9.85" height="31.92" style={{ fill: "#92E3A9" }}></rect>
                                                        <rect x="130.13" y="391.58" width="9.85" height="31.92" style={{ fill: "#fff", opacity: "0.5" }}></rect>
                                                    </g>
                                                    <rect x="130.13" y="391.58" width="24.05" height="31.92" style={{ fill: "none", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                </g>
                                                <g id="freepik--Device--inject-4">
                                                    <path d="M286.34,423.06H183.6l-3.35-56.48A3.84,3.84,0,0,1,184,362.1H285.9a3.84,3.84,0,0,1,3.79,4.48Z" style={{ fill: "#263238", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M188.66,363.45h96.5a3.74,3.74,0,0,1,3.73,4.34" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <path d="M181,366.9a3.77,3.77,0,0,1,3.78-3.45" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round" }}></path>
                                                    <rect x="183.17" y="417.56" width="103.6" height="5.5" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></rect>
                                                    <ellipse cx="234.6" cy="392.8" rx="7.34" ry="4.4" style={{ fill: "#fff", stroke: "#263238", strokeLineCap: "round", strokeLineJoin: "round" }}></ellipse>
                                                </g>
                                                <g id="freepik--Table--inject-4">
                                                    <rect x="57.17" y="422.41" width="385.86" height="9.37" style={{ fill: "#263238" }}></rect>
                                                </g>
                                                <g id="freepik--pop-up-window--inject-4">
                                                    <rect x="146.02" y="75" width="208.29" height="129.17" rx="11.33" style={{ fill: "#92E3A9" }}></rect>
                                                    <circle cx="250.16" cy="118.75" r="30.88" transform="translate(-15.67 41.19) rotate(-9.13)" style={{ fill: "#263238" }}></circle>
                                                    <path d="M249.93,124.45l-10.29,13.21a3.93,3.93,0,0,1-3.26,1.82,3.39,3.39,0,0,1-2.4-.95,3.09,3.09,0,0,1-1-2.37,4.64,4.64,0,0,1,1-2.73l11.73-14.51-11-14.52a4,4,0,0,1-.8-2.36,3.68,3.68,0,0,1,1.17-2.71,3.73,3.73,0,0,1,2.7-1.15A3.87,3.87,0,0,1,241,100l9.94,13.09,10-12.87a4.25,4.25,0,0,1,3.43-2.07,3.15,3.15,0,0,1,2.31,1,3.18,3.18,0,0,1,1,2.31,3.5,3.5,0,0,1-.76,2.13l-11.77,15.06,11.37,15a3.87,3.87,0,0,1,.85,2.36,3.43,3.43,0,0,1-1.19,2.62,3.94,3.94,0,0,1-2.73,1.1,3.88,3.88,0,0,1-3.24-1.82Z" style={{ fill: "#fff" }}></path>
                                                    <path d="M309,181.8H191.29a9,9,0,0,1-9-9h0a9,9,0,0,1,9-9H309a9,9,0,0,1,9,9h0A9,9,0,0,1,309,181.8Z" style={{ fill: "#fff" }}></path>
                                                    <path d="M207.42,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.78.78,0,0,1,.11-.4l.9-1.4-1.84,0a.6.6,0,0,1-.46-.18.66.66,0,0,1,0-.86.6.6,0,0,1,.46-.18l1.81.05L207,170.8a.91.91,0,0,1-.13-.44.61.61,0,0,1,.18-.45.6.6,0,0,1,.43-.18.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.58.58,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.17.44.57.57,0,0,1-.41.18.65.65,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,207.42,175.7Z"></path>
                                                    <path d="M216.6,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.78.78,0,0,1,.11-.4l.9-1.4-1.84,0a.6.6,0,0,1-.46-.18.66.66,0,0,1,0-.86.6.6,0,0,1,.46-.18l1.81.05-.85-1.35a.91.91,0,0,1-.13-.44.61.61,0,0,1,.18-.45.6.6,0,0,1,.43-.18.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.58.58,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.17.44.57.57,0,0,1-.41.18.64.64,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,216.6,175.7Z"></path>
                                                    <path d="M225.78,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.78.78,0,0,1,.11-.4l.9-1.4-1.84,0a.6.6,0,0,1-.46-.18.66.66,0,0,1,0-.86.6.6,0,0,1,.46-.18l1.81.05-.85-1.35a.91.91,0,0,1-.13-.44.61.61,0,0,1,.18-.45.6.6,0,0,1,.43-.18.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.58.58,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.17.44.57.57,0,0,1-.41.18.64.64,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,225.78,175.7Z"></path>
                                                    <path d="M235,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.78.78,0,0,1,.11-.4l.9-1.4-1.84,0a.6.6,0,0,1-.46-.18.66.66,0,0,1,0-.86.6.6,0,0,1,.46-.18l1.81.05-.85-1.35a.91.91,0,0,1-.13-.44.61.61,0,0,1,.18-.45.6.6,0,0,1,.43-.18.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.58.58,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.17.44.57.57,0,0,1-.41.18.65.65,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,235,175.7Z"></path>
                                                    <path d="M244.14,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.89.89,0,0,1,.11-.4l.9-1.4-1.84,0a.6.6,0,0,1-.46-.18.66.66,0,0,1,0-.86.6.6,0,0,1,.46-.18l1.81.05-.85-1.35a.91.91,0,0,1-.13-.44.61.61,0,0,1,.18-.45.6.6,0,0,1,.43-.18.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.56.56,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.17.44.57.57,0,0,1-.41.18.65.65,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,244.14,175.7Z"></path>
                                                    <path d="M253.32,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.89.89,0,0,1,.11-.4l.9-1.4-1.83,0a.61.61,0,0,1-.47-.18.66.66,0,0,1,0-.86.61.61,0,0,1,.47-.18l1.8.05-.85-1.35a.91.91,0,0,1-.13-.44.61.61,0,0,1,.18-.45.6.6,0,0,1,.43-.18.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.56.56,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.17.44.57.57,0,0,1-.41.18.65.65,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,253.32,175.7Z"></path>
                                                    <path d="M262.5,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.78.78,0,0,1,.11-.4l.9-1.4-1.84,0a.6.6,0,0,1-.46-.18.66.66,0,0,1,0-.86.6.6,0,0,1,.46-.18l1.81.05L262,170.8a.91.91,0,0,1-.13-.44.61.61,0,0,1,.18-.45.6.6,0,0,1,.43-.18.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.56.56,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.17.44.57.57,0,0,1-.41.18.65.65,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,262.5,175.7Z"></path>
                                                    <path d="M271.68,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.89.89,0,0,1,.11-.4l.9-1.4-1.83,0a.57.57,0,0,1-.46-.18.63.63,0,0,1,0-.86.57.57,0,0,1,.46-.18l1.8.05-.85-1.35a.91.91,0,0,1-.13-.44.61.61,0,0,1,.61-.63.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.54.54,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.58.62.65.65,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,271.68,175.7Z"></path>
                                                    <path d="M280.86,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.89.89,0,0,1,.11-.4l.9-1.4-1.84,0a.57.57,0,0,1-.45-.18.63.63,0,0,1,0-.86.57.57,0,0,1,.45-.18l1.81.05-.85-1.35a.91.91,0,0,1-.13-.44.61.61,0,0,1,.61-.63.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.54.54,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.58.62.65.65,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,280.86,175.7Z"></path>
                                                    <path d="M290,175.7a.58.58,0,0,1-.42-.18.61.61,0,0,1-.18-.45.89.89,0,0,1,.11-.4l.9-1.4-1.84,0a.57.57,0,0,1-.45-.18.63.63,0,0,1,0-.86.57.57,0,0,1,.45-.18l1.81.05-.85-1.35a.91.91,0,0,1-.13-.44.61.61,0,0,1,.18-.45.6.6,0,0,1,.43-.18.57.57,0,0,1,.53.34l.88,1.57.84-1.5a.7.7,0,0,1,.6-.41.54.54,0,0,1,.42.18.57.57,0,0,1,.18.43.75.75,0,0,1-.12.4l-.88,1.41,1.83-.05a.59.59,0,0,1,.46.18.66.66,0,0,1,0,.86.59.59,0,0,1-.46.18l-1.85,0,.82,1.28a1.06,1.06,0,0,1,.15.51.6.6,0,0,1-.17.44.57.57,0,0,1-.41.18.65.65,0,0,1-.58-.39l-.83-1.47-.83,1.47A.67.67,0,0,1,290,175.7Z"></path>
                                                    <line x1="321.46" y1="197.82" x2="333.69" y2="197.82" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round", strokeWidth: "3px" }}></line>
                                                    <path d="M151.83,107.77V189a8.87,8.87,0,0,0,8.87,8.87H309.85" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round", strokeWidth: "3px" }}></path>
                                                    <line x1="151.83" y1="86.23" x2="151.83" y2="98.41" style={{ fill: "none", stroke: "#fff", strokeLineCap: "round", strokeLineJoin: "round", strokeWidth: "3px" }}></line>
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="row">
                                            <span style={{ color: "var(--color-success)", fontSize: "1.5rem", fontWeight: "700", letterSpacing: "2px", width: "100%", textAlign: "center" }}>Bạn đã quên mật khẩu của mình?</span>
                                        </div>
                                    </div>
                                    <div className="col-lg-7" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
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
                                                <Right>
                                                    <ChangePasswordProgress step={"finish"} />
                                                    <CheckCircleRounded style={{ fontSize: "6rem", color: "var(--color-success)", margin: "20px 0px 25px 0px" }} />
                                                    <span style={{ color: "var(--color-success)", fontSize: "1.5rem", fontWeight: "700", letterSpacing: "2px" }}>TÌM LẠI MẬT KHẨU THÀNH CÔNG!</span>
                                                    <SuccessButtonContainer>
                                                        <SuccessButton
                                                            onClick={() => setShowModal(prev => !prev)}
                                                        ><ArrowRightAltOutlined />   Quay về trang đăng nhập</SuccessButton>
                                                    </SuccessButtonContainer>
                                                </Right>
                                            ) : isFillKey ? (
                                                <Right style={{ paddingBottom: "50px", height: "100%" }}>
                                                    <ChangePasswordProgress step={"fillKey"} />
                                                    <Title style={{ marginBottom: "5px", marginTop: "150px" }}>Mã xác thực của bạn là:</Title>
                                                    <FormInput style={{ marginBottom: "5px" }} type="password" placeholder="Mã xác thực của bạn"
                                                        maxLength={4}
                                                        value={key}
                                                        onChange={(e) => handleChangeKey(e)}
                                                    />
                                                    <Title style={{ marginBottom: "5px" }}>Nhập mật khẩu mới:</Title>
                                                    <Label>
                                                        <FormInput type={passwordType} placeholder="Mật khẩu của bạn"
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
                                                    <Title style={{ marginBottom: "5px" }}>Xác nhận mật khẩu mới:</Title>
                                                    <Label>
                                                        <FormInput type={rePasswordType} placeholder="Nhập lại mật khẩu"
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
                                                    <FormChucNang style={{ marginTop: "25px" }}>
                                                        <SignInBtn onClick={() => handleAuthenKey()}>Xác thực</SignInBtn>
                                                        <SignUpBtn>Gửi lại</SignUpBtn>
                                                    </FormChucNang>
                                                </Right>
                                            )
                                                // Choose Email way
                                                : isEmailWay ?
                                                    (
                                                        <Right>
                                                            <ChangePasswordProgress step={"fillInfo"} />
                                                            <Title style={{ marginBottom: "5px" }}>Email của bạn là:</Title>
                                                            <FormInput style={{ marginBottom: "25px" }} type="email" placeholder="Email của bạn"
                                                                value={email}
                                                                onChange={(e) => handleChangeEmail(e)}
                                                            />
                                                            <FormChucNang>
                                                                <SignInBtn onClick={() => handleSendEmail()}>Gửi mã xác nhận</SignInBtn>
                                                                <SignUpBtn onClick={() => {
                                                                    setIsEmailWay(false);
                                                                    setIsPhoneWay(false);
                                                                }}>Quay lại</SignUpBtn>
                                                            </FormChucNang>
                                                        </Right>
                                                        // Choose Phone way

                                                    ) : isPhoneWay ? (
                                                        <Right>
                                                            <ChangePasswordProgress step={"fillInfo"} />
                                                            <Title style={{ marginBottom: "5px" }}>Số điện thoại của bạn là:</Title>
                                                            <FormInput style={{ marginBottom: "25px" }} type="text" placeholder="Số điện thoại của bạn"
                                                                maxLength={11}
                                                                value={phoneNumber}
                                                                onChange={(e) => handleChangePhoneNumber(e)}
                                                            />
                                                            <FormChucNang>
                                                                <SignInBtn onClick={() => handleSendPhoneNumber()}>Gửi mã xác nhận</SignInBtn>
                                                                <SignUpBtn onClick={() => {
                                                                    setIsEmailWay(false);
                                                                    setIsPhoneWay(false);
                                                                }}>Quay lại</SignUpBtn>
                                                            </FormChucNang>
                                                        </Right>
                                                    ) : (
                                                        // Home
                                                        <Right>
                                                            <ChangePasswordProgress step={"findWay"} />
                                                            <Title>Chọn phương thức nhận mã xác nhận:</Title>
                                                            <FormChucNang>
                                                                <SignInBtn onClick={() => handleChooseEmailWay()}>Gửi mã xác nhận về Email</SignInBtn>
                                                                <SignUpBtn onClick={() => handleChoosePhoneWay()}>Gửi mã xác nhận về Số điện thoại</SignUpBtn>
                                                            </FormChucNang>
                                                        </Right>
                                                    )
                                        }
                                    </div>
                                </div>
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
}

export default Modal;