import { Add, ArrowRightAltOutlined, CheckCircleRounded, Close, CloseOutlined, MoreHorizOutlined, Remove } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Carousel, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { logoutCart, updateFood } from "../../redux/foodCartRedux";
import { format_money } from "../../utils/utils";
import Toast from "../Toast";
import MiniImage from "./MiniImage";
import MiniImagePayment from "./MiniImagePayment";

// SERVICES
import { Rating, Stack } from "@mui/material";
import * as FoodService from "../../service/FoodService";
import * as FoodVoteService from "../../service/FoodVoteService";
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
// Left
const LeftVote = styled.div``
const LeftVoteItem = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: white;
`
const LeftImage = styled.img`
    margin: auto;
    width: 95%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 20px;
`
const LeftVoteTitle = styled.span`
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 15px 0px;
    color: var(--color-dark);
`
const LeftVoteItemRating = styled.div`
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 95%;
    height: auto;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: white;
`
// Rating total
const RatingTotal = styled.div`
    padding: 0px 10px 10px 10px;
`
const RatingTotalItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const RatingNumber = styled.div`
    font-size: 3rem;
    font-weight: bold;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 10px 0px 10px;
`
const RatingNumberStar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const RatingNumberTotal = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 300;
`

// Rating progress
const RatingProgress = styled.div`
    padding: 10px;
`
const RatingProgressItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`
const RatingProgressItemName = styled.div`
    font-size: 1rem;
    font-weight: bold;
    text-align: right;
`
const Progress = styled.div``

// Right vote
const RightVote = styled.div``
const CommentContainer = styled.div`
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 95%;
    height: auto;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: white;
    padding: 15px;
    margin-bottom: 10px;
`
const CommentListContainer = styled.div`
   margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 95%;
    height: auto;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: white;
    padding: 15px;
`
const CommentInfo = styled.div``
const InfoContainer = styled.div``
const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const InfoImage = styled.img`
    margin-right: 2px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
`
const CommentDetailContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
`
const CommentDetailName = styled.span`
    margin-left: 4px;
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--color-dark);
    letter-spacing: 2px;
`
const CommentDetailTitle = styled.span`
    margin-left: 4px;
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--color-dark);
    letter-spacing: 2px;
`

const TextArea = styled.textarea`
  width: 100% !important;
  resize: none;
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
const ButtonCommentContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
`
const ButtonComment = styled.button`
    width: 120px;
    height: 40px;
    margin: 10px 10px;
    border: none;
    font-weight: bold;
    letter-spacing: 2px;
    outline: none;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 12px 12px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &:active {
        transform: scale(1.05);
    }
    &:hover {
        background-color: var(--color-primary);
        color: #ffffff;
        transition: all ease 0.3s;
    }
`

// CommentList
const CommentListTitle = styled.span`
    font-size: 1.1rem;
    font-weight: bold;
    letter-spacing: 2px;
    color: var(--color-dark);
    margin-left: 30px;
`

const CommentList = styled.div`
    max-height: 300px;
    overflow-y: scroll;
`
const CommentListItem = styled.div`
    margin-bottom: 8px;
    margin-right: -5px;
    position: relative;
`
const Comment = styled.div``
const CommentTitle = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
`
const AvatarComment = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
`
const AvatarCommentImage = styled.img`
    margin-right: 2px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
`
const VoteComment = styled.div`
    background-color: #F0F2F5;
    border-radius: 20px;
    padding: 10px 15px;
`
const VoteCommentName = styled.div`
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-dark);
    letter-spacing: 1px;
    margin-left: 12px;
`
const VoteCommentDate = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--color-info-dark);
`
const VoteCommentStar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const CommentDate = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`
const VoteCommentContent = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 2px;
    color: var(--color-dark);
    font-size: 0.95rem;
    padding: 0px 20px 0px 20px;
`
const NavbarUserMenu = styled.ul`
    position: absolute;
    z-index: 1;
    padding-left: 0;
    top: calc(30% + 10px);
    right: -5px;
    width: 150px;
    padding: 0;
    border-radius: 20px;
    background-color: white;
    list-style: none;
    display: none;
    box-shadow: 0 1px 3rem 0 rgba(0, 0, 0, 0.2);
    animation: fadeIn ease-in 0.2s;
    &.show-option {
        display: block;
    }
    &::before {
        content: "";
        border-width: 8px 14px;
        border-style: solid;
        border-color: transparent transparent white transparent;
        position: absolute;
        right: 20px;
        top: -16px;
    }
    &::after {
        content: "";
        display: block;
        position: absolute;
        top: -6px;
        right: 0;
        width: 100%;
        height: 8px;
    }
`

const NavbarUser = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    padding: 0;
    position: absolute;
    top: 12px;
    right: 15px;
    border-radius: 50%;
    transition: all ease 0.3s;
    cursor: pointer;
    &:hover {
        transform: scale(1.35);
        background-color: #E4E6EB;
    }
`
const NavbarUserItem = styled.li`
    text-decoration: none;
    color: #333;
    font-size: 1.1rem;
    padding: 6px 0px;
    display: block;
`
const NavbarUserItemLi = styled.li`
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    padding: 8px 0px 8px 0;
    color: black;
    font-weight: 500;
    position: relative;
    border-radius: 20px;
    cursor: pointer;
    &:hover {
        color: white;
        background-color: #41F1B6;
        text-decoration: none;
        transition: color 0.5s, background-color 0.56s;
        &::after{
            display: block;
        }
    }
    &::after {
        content: "";
        display: none;
        position: absolute;
        top: 0px;
        left: -5px;
        width: 3%;
        height: 43px;
        background-color: var(--color-primary);
    }
`

// Admin rep
const AdminRepContainer = styled.div``
const AdminContainer = styled.div``
const CommentTitleAdmin = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
`
const AvatarCommentAdmin = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
`
const AvatarCommentImageAdmin = styled.img`
    margin-right: 2px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.1);
`
const VoteCommentAdmin = styled.div`
    background-color: #DDDDDD;
    border-radius: 20px;
    padding: 10px 15px;
`
const VoteCommentNameAdmin = styled.div`
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-dark);
    letter-spacing: 1px;
    margin-left: 12px;
`
const VoteCommentDateAdmin = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--color-info-dark);
`
const VoteCommentStarAdmin = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    font-weight: bold;
    color: var(--color-info-dark);
`
const CommentDateAdmin = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`
const VoteCommentContentAdmin = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 2px;
    color: var(--color-dark);
    font-size: 0.95rem;
    padding: 0px 20px 0px 20px;
`

const TextAreaUpdate = styled.textarea`
  width: 90% !important;
  resize: none;
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
const Modal = ({ showModal, setShowModal, type, food }) => {
    console.log("Food: ", food);
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
    const [isRenderData, setIsRenderData] = useState(false);
    const [isShowOption, setIsShowOption] = useState(false);
    const [foodVoteList, setFoodVoteList] = useState();
    const [displayFoodVoteList, setDisplayFoodVoteList] = useState([]);
    const [comment, setComment] = useState();
    const [star, setStar] = useState();
    const [foodRes, setFoodRes] = useState();

    useEffect(() => {
        const getFoodVoteList = async () => {
            try {
                const foodVoteListRes = await FoodVoteService.getFoodVoteList({
                    customerId: customer.customer_id,
                    foodId: food.food_id
                });
                setFoodVoteList(foodVoteListRes.data.data);
                setDisplayFoodVoteList(foodVoteListRes.data.data.foodVoteList);
            } catch (err) {
                console.log(err);
            }
        };
        const getFoodAndType = async () => {
            try {
                const foodAndTypeRes = await FoodService.getFoodByFoodId(food.food_id);
                setFoodRes(foodAndTypeRes.data.data);
            } catch (err) {
                console.log(err);
            }
        }
        if (food) {
            getFoodVoteList();
            getFoodAndType();
            setStar();
            setComment();
        }
    }, [showModal, food, isRenderData]);

    // Toogle option for each comment id
    const setToggleOption = (id) => {
        var checkList = document.getElementById('comment_' + id);
        if (checkList.classList.contains('show-option')) {
            checkList.classList.remove('show-option');
        } else {
            checkList.classList.add('show-option');
        }
    }

    // Hide comment
    const handleHideComment = (id) => {
        var filterFoodVoteList = [];
        filterFoodVoteList = displayFoodVoteList.filter(prev => prev.food_vote_id !== id);
        setDisplayFoodVoteList(prev => filterFoodVoteList);
        // Toast
        const dataToast = { message: "Đã ẩn bình luận này!", type: "success" };
        showToastFromOut(dataToast);
        return;
    };

    // Handle create comment
    const handleComment = () => {
        const createComment = async () => {
            try {
                const createCommentRes = await FoodVoteService.createFoodVote({
                    foodVoteNumber: star,
                    foodVoteComment: comment,
                    customerId: customer.customer_id,
                    foodId: food.food_id
                });
                if (!createCommentRes) {
                    // Toast
                    const dataToast = { message: createCommentRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                setIsRenderData(prev => !prev);
                setStar();
                setComment();

                // Toast
                const dataToast = { message: createCommentRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
            }
        };
        createComment();
    };

    // Handle delete comment
    const handleDeleteFoodVote = (foodVoteId) => {
        const deleteFoodVote = async () => {
            try {
                const deleteFoodVoteRes = await FoodVoteService.deleteFoodVote({
                    foodId: food.food_id,
                    foodVoteId: foodVoteId
                });
                if (!deleteFoodVoteRes) {
                    // Toast
                    const dataToast = { message: deleteFoodVoteRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                setIsRenderData(prev => !prev);
                // Toast
                const dataToast = { message: deleteFoodVoteRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
        deleteFoodVote();
        console.log("foodId: ", food.food_id, foodVoteId);
    }

    // Handle update comment
    const [isUpdate, setIsUpdate] = useState(false);
    const [commentUpdate, setCommentUpdate] = useState();
    const [starUpdate, setStarUpdate] = useState();
    const handleUpdateFoodVote = (foodVote) => {
        let foodVoteId = foodVote.food_vote_id;
        let foodVoteComment = foodVote.food_vote_comment;
        let foodVoteNumber = foodVote.food_vote_number;
        setIsUpdate(true);
        setCommentUpdate(foodVoteComment);
        setStarUpdate(foodVoteNumber);
    }
    const handleUpdateComment = (foodVoteId) => {
        const updateFoodVote = async () => {
            try {
                const updateFoodVoteRes = await FoodVoteService.updateFoodVote({
                    foodId: food.food_id,
                    foodVoteId: foodVoteId,
                    foodVoteNumber: starUpdate,
                    foodVoteComment: commentUpdate
                });
                if (!updateFoodVoteRes) {
                    // Toast
                    const dataToast = { message: updateFoodVoteRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                setIsRenderData(prev => !prev);
                setIsUpdate(false);
                // Toast
                const dataToast = { message: updateFoodVoteRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
        updateFoodVote();
    }
    console.log("foodVoteList: ", foodVoteList, foodRes);
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
    }
    if (type === "showVote") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal}>

                            <ModalContent>
                                <div className="col-lg-12" style={{ width: "95%" }}>
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Điểm xếp hạng và Bài đánh giá</LeftVoteTitle>

                                                <LeftImage src={foodRes ? foodRes.food_image : null} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {foodRes ? foodRes.food_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{format_money(foodRes ? foodRes.food_price : 0)} VNĐ</span>
                                                        </Content>
                                                        <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>1</span> x {foodRes ? foodRes.food_type_name : null}</span>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItemRating className="row">
                                                <RatingTotal className="col-lg-5">
                                                    <RatingTotalItem className="row">
                                                        <RatingNumber>{foodRes ? foodRes.food_vote : null}</RatingNumber>
                                                        <RatingNumberStar>
                                                            <Stack spacing={1}>
                                                                <Rating name="size-medium" value={foodRes ? foodRes.food_vote : null} precision={0.5} readOnly />
                                                            </Stack>
                                                        </RatingNumberStar>
                                                        <RatingNumberTotal>Có {foodVoteList ? foodVoteList.foodVoteTotal : 0} lượt đánh giá</RatingNumberTotal>
                                                    </RatingTotalItem>
                                                </RatingTotal>
                                                <RatingProgress className="col-lg-7">
                                                    {/* 5 sao */}
                                                    {
                                                        foodVoteList && foodVoteList.foodVoteTotal > 0 ?
                                                            foodVoteList.foodVoteDetail.map((star, key) => {
                                                                if (star.food_vote_number === 5 && star.vote_quantity) {
                                                                    return (
                                                                        <RatingProgressItem className="row">
                                                                            <RatingProgressItemName className="col-lg-2">5</RatingProgressItemName>
                                                                            <Progress className="col-lg-10">
                                                                                <ProgressBar variant="success" now={(star.vote_quantity * 100) / foodVoteList.foodVoteTotal} style={{ height: "12px", borderRadius: "20px" }} />
                                                                            </Progress>
                                                                        </RatingProgressItem>
                                                                    )
                                                                }
                                                            }) : (
                                                                <RatingProgressItem className="row">
                                                                    <RatingProgressItemName className="col-lg-2">5</RatingProgressItemName>
                                                                    <Progress className="col-lg-10">
                                                                        <ProgressBar variant="success" now={0} style={{ height: "12px", borderRadius: "20px" }} />
                                                                    </Progress>
                                                                </RatingProgressItem>
                                                            )
                                                    }
                                                    {/* 4 sao */}
                                                    {
                                                        foodVoteList && foodVoteList.foodVoteTotal > 0 ?
                                                            foodVoteList.foodVoteDetail.map((star, key) => {
                                                                if (star.food_vote_number === 4 && star.vote_quantity) {
                                                                    return (
                                                                        <RatingProgressItem className="row">
                                                                            <RatingProgressItemName className="col-lg-2">4</RatingProgressItemName>
                                                                            <Progress className="col-lg-10">
                                                                                <ProgressBar variant="success" now={(star.vote_quantity * 100) / foodVoteList.foodVoteTotal} style={{ height: "12px", borderRadius: "20px" }} />
                                                                            </Progress>
                                                                        </RatingProgressItem>
                                                                    )
                                                                }
                                                            }) : (
                                                                <RatingProgressItem className="row">
                                                                    <RatingProgressItemName className="col-lg-2">4</RatingProgressItemName>
                                                                    <Progress className="col-lg-10">
                                                                        <ProgressBar variant="success" now={0} style={{ height: "12px", borderRadius: "20px" }} />
                                                                    </Progress>
                                                                </RatingProgressItem>
                                                            )
                                                    }
                                                    {/* 3 sao */}
                                                    {
                                                        foodVoteList && foodVoteList.foodVoteTotal > 0 ?
                                                            foodVoteList.foodVoteDetail.map((star, key) => {
                                                                console.log("KEY: ", foodVoteList.foodVoteDetail.length, key)
                                                                if (star.food_vote_number === 3 && star.vote_quantity) {
                                                                    return (
                                                                        <RatingProgressItem className="row">
                                                                            <RatingProgressItemName className="col-lg-2">3</RatingProgressItemName>
                                                                            <Progress className="col-lg-10">
                                                                                <ProgressBar variant="warning" now={(star.vote_quantity * 100) / foodVoteList.foodVoteTotal} style={{ height: "12px", borderRadius: "20px" }} />
                                                                            </Progress>
                                                                        </RatingProgressItem>
                                                                    )
                                                                }
                                                            }) : (
                                                                <RatingProgressItem className="row">
                                                                    <RatingProgressItemName className="col-lg-2">3</RatingProgressItemName>
                                                                    <Progress className="col-lg-10">
                                                                        <ProgressBar variant="warning" now={0} style={{ height: "12px", borderRadius: "20px" }} />
                                                                    </Progress>
                                                                </RatingProgressItem>
                                                            )
                                                    }
                                                    {/* 2 sao */}
                                                    {
                                                        foodVoteList && foodVoteList.foodVoteTotal > 0 ?
                                                            foodVoteList.foodVoteDetail.map((star, key) => {
                                                                if (star.food_vote_number === 2 && star.vote_quantity) {
                                                                    return (
                                                                        <RatingProgressItem className="row">
                                                                            <RatingProgressItemName className="col-lg-2">2</RatingProgressItemName>
                                                                            <Progress className="col-lg-10">
                                                                                <ProgressBar variant="warning" now={(star.vote_quantity * 100) / foodVoteList.foodVoteTotal} style={{ height: "12px", borderRadius: "20px" }} />
                                                                            </Progress>
                                                                        </RatingProgressItem>
                                                                    )
                                                                }
                                                            }) : (
                                                                <RatingProgressItem className="row">
                                                                    <RatingProgressItemName className="col-lg-2">2</RatingProgressItemName>
                                                                    <Progress className="col-lg-10">
                                                                        <ProgressBar variant="warning" now={0} style={{ height: "12px", borderRadius: "20px" }} />
                                                                    </Progress>
                                                                </RatingProgressItem>
                                                            )
                                                    }
                                                    {/* 1 sao */}
                                                    {
                                                        foodVoteList && foodVoteList.foodVoteTotal > 0 ?
                                                            foodVoteList.foodVoteDetail.map((star, key) => {
                                                                if (star.food_vote_number === 1 && star.vote_quantity) {
                                                                    return (
                                                                        <RatingProgressItem className="row">
                                                                            <RatingProgressItemName className="col-lg-2">1</RatingProgressItemName>
                                                                            <Progress className="col-lg-10">
                                                                                <ProgressBar variant="danger" now={(star.vote_quantity * 100) / foodVoteList.foodVoteTotal} style={{ height: "12px", borderRadius: "20px" }} />
                                                                            </Progress>
                                                                        </RatingProgressItem>
                                                                    )
                                                                }
                                                            }) : (
                                                                <RatingProgressItem className="row">
                                                                    <RatingProgressItemName className="col-lg-2">1</RatingProgressItemName>
                                                                    <Progress className="col-lg-10">
                                                                        <ProgressBar variant="danger" now={0} style={{ height: "12px", borderRadius: "20px" }} />
                                                                    </Progress>
                                                                </RatingProgressItem>
                                                            )
                                                    }
                                                </RatingProgress>
                                            </LeftVoteItemRating>
                                        </LeftVote>
                                        <RightVote className="col-lg-6">
                                            <CommentContainer className="row">
                                                <CommentInfo className="col-lg-12">
                                                    <InfoContainer className="row">
                                                        <ImageContainer className="col-lg-3">
                                                            <InfoImage src={customer.customer_image ? customer.customer_image : "https://bootdey.com/img/Content/avatar/avatar1.png"} />
                                                        </ImageContainer>
                                                        <CommentDetailContainer className="col-lg-9">
                                                            <CommentDetailName>{customer.customer_first_name + " " + customer.customer_last_name}</CommentDetailName>
                                                            <CommentDetailTitle>Hãy cho chúng tôi biết về những trải nghiệm của bạn về món ăn này!</CommentDetailTitle>
                                                        </CommentDetailContainer>
                                                    </InfoContainer>
                                                    <RatingNumberStar style={{ marginTop: "5px" }}>
                                                        <Stack spacing={1}>
                                                            <Rating name="size-large"
                                                                value={star}
                                                                size="large"
                                                                onChange={(event, newValue) => setStar(newValue)}
                                                            />
                                                        </Stack>
                                                    </RatingNumberStar>

                                                    <TextArea rows="1" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Dịch vụ của chúng tôi có khiến bạn hài lòng?" />

                                                    <ButtonCommentContainer className="row">
                                                        <ButtonComment onClick={() => handleComment()}>Bình luận</ButtonComment>
                                                        <ButtonComment onClick={() => setShowModal(false)}>Hủy</ButtonComment>
                                                    </ButtonCommentContainer>
                                                </CommentInfo>
                                            </CommentContainer>
                                            <CommentListTitle className="row">Bình luận ({foodVoteList ? foodVoteList.foodVoteTotal : 0})</CommentListTitle>
                                            <CommentListContainer className="row">
                                                <CommentList className="col-lg-12">
                                                    {
                                                        displayFoodVoteList.length > 0 ? (
                                                            displayFoodVoteList.map((foodVote, key) => {
                                                                return (
                                                                    <CommentListItem className="row">
                                                                        <Comment className="col-lg-12">
                                                                            <CommentTitle className="row">
                                                                                <AvatarComment className="col-lg-2">
                                                                                    <AvatarCommentImage src={foodVote.customer_image ? foodVote.customer_image : "https://bootdey.com/img/Content/avatar/avatar1.png"} />
                                                                                </AvatarComment>
                                                                                <VoteComment className="col-lg-10">
                                                                                    <VoteCommentName className="row">{foodVote.customer_id === customer.customer_id ? foodVote.customer_first_name + " " + foodVote.customer_last_name + " (Bình luận của bạn)" : foodVote.customer_first_name + " " + foodVote.customer_last_name}</VoteCommentName>
                                                                                    <VoteCommentDate className="row">
                                                                                        <VoteCommentStar className="col-lg-4">
                                                                                            <Stack spacing={1}>
                                                                                                {
                                                                                                    isUpdate && foodVote.customer_id === customer.customer_id ? (
                                                                                                        <Rating name="size-small"
                                                                                                            size="small"
                                                                                                            value={starUpdate}
                                                                                                            onChange={(event, newValue) => setStarUpdate(newValue)}
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <Rating name="size-small" value={foodVote.food_vote_number} size="small" readOnly />
                                                                                                    )
                                                                                                }
                                                                                            </Stack>
                                                                                        </VoteCommentStar>
                                                                                        <CommentDate className="col-lg-8">{foodVote.food_vote_date}</CommentDate>
                                                                                    </VoteCommentDate>
                                                                                    <div className="row">

                                                                                        {/* Chỉnh sửa bình luận */}
                                                                                        {isUpdate && foodVote.customer_id === customer.customer_id ? (
                                                                                            <>
                                                                                                <TextAreaUpdate
                                                                                                    style={{ marginLeft: "20px", width: "90% !important" }}
                                                                                                    rows="1"
                                                                                                    value={commentUpdate}
                                                                                                    onChange={(e) => setCommentUpdate(e.target.value)}
                                                                                                />
                                                                                                <ButtonCommentContainer className="row">
                                                                                                    <ButtonComment
                                                                                                        onClick={() => handleUpdateComment(foodVote.food_vote_id)}
                                                                                                    >
                                                                                                        Cập nhật
                                                                                                    </ButtonComment>
                                                                                                    <ButtonComment
                                                                                                        onClick={() => setIsUpdate(false)}
                                                                                                    >
                                                                                                        Hủy
                                                                                                    </ButtonComment>
                                                                                                </ButtonCommentContainer>
                                                                                            </>
                                                                                        ) : (<VoteCommentContent>{foodVote.food_vote_comment}</VoteCommentContent>)
                                                                                        }

                                                                                    </div>
                                                                                </VoteComment>
                                                                            </CommentTitle>
                                                                            {
                                                                                foodVote.food_vote_reply ? (
                                                                                    <AdminRepContainer className="row" style={{ marginTop: "8px" }}>
                                                                                        <div className="col-lg-2"></div>
                                                                                        <AdminContainer className="col-lg-10">
                                                                                            <CommentTitleAdmin className="row">
                                                                                                <AvatarCommentAdmin className="col-lg-2">
                                                                                                    <AvatarCommentImageAdmin src={foodVote.employee_image} />
                                                                                                </AvatarCommentAdmin>
                                                                                                <VoteCommentAdmin className="col-lg-10">
                                                                                                    <VoteCommentNameAdmin className="row">{foodVote.employee_first_name + " " + foodVote.employee_last_name}</VoteCommentNameAdmin>
                                                                                                    <VoteCommentDateAdmin className="row">
                                                                                                        <VoteCommentStarAdmin className="col-lg-5">
                                                                                                            Quản trị viên
                                                                                                        </VoteCommentStarAdmin>
                                                                                                        <CommentDateAdmin className="col-lg-7">{foodVote.food_vote_reply_date}</CommentDateAdmin>
                                                                                                    </VoteCommentDateAdmin>
                                                                                                    <div className="row">
                                                                                                        <VoteCommentContentAdmin>
                                                                                                            {foodVote.food_vote_reply}
                                                                                                        </VoteCommentContentAdmin>
                                                                                                    </div>
                                                                                                </VoteCommentAdmin>
                                                                                            </CommentTitleAdmin>
                                                                                        </AdminContainer>
                                                                                    </AdminRepContainer>
                                                                                ) : null
                                                                            }
                                                                        </Comment>
                                                                        {/* Edit button */}
                                                                        <NavbarUser onClick={() => setToggleOption(key)}>
                                                                            <MoreHorizOutlined />
                                                                        </NavbarUser>
                                                                        <NavbarUserMenu onClick={(() => setToggleOption(key))} className="" id={"comment_" + key}>
                                                                            <NavbarUserItem>
                                                                                {
                                                                                    foodVote.customer_id === customer.customer_id ? (
                                                                                        <>
                                                                                            <NavbarUserItemLi onClick={() => handleHideComment(foodVote.food_vote_id)}>
                                                                                                Ẩn bình luận
                                                                                            </NavbarUserItemLi>
                                                                                            <NavbarUserItemLi
                                                                                                style={{ marginTop: "10px" }}
                                                                                                onClick={() => handleDeleteFoodVote(foodVote.food_vote_id)}
                                                                                            >
                                                                                                Xóa bình luận
                                                                                            </NavbarUserItemLi>
                                                                                            <NavbarUserItemLi
                                                                                                onClick={() => handleUpdateFoodVote(foodVote)}
                                                                                            >
                                                                                                Chỉnh sửa
                                                                                            </NavbarUserItemLi>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <NavbarUserItemLi onClick={() => handleHideComment(foodVote.food_vote_id)}>
                                                                                                Ẩn bình luận
                                                                                            </NavbarUserItemLi>
                                                                                        </>
                                                                                    )
                                                                                }
                                                                            </NavbarUserItem>
                                                                        </NavbarUserMenu>
                                                                    </CommentListItem>
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
                                                                <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Hiện tại chưa có bình luận nào!</EmptyContent>
                                                            </EmptyItem>
                                                        )
                                                    }
                                                </CommentList>
                                            </CommentListContainer>
                                        </RightVote>
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
};

export default Modal;