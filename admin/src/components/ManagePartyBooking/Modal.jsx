import { Add, ClearOutlined, CloseOutlined, FilePresentOutlined, HideImageOutlined, ImageOutlined, MoreHorizOutlined, PictureAsPdfOutlined, Remove, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';

import { Tooltip as TooltipMui } from '@mui/material';
import {
    CategoryScale, Chart, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, registerables, Title,
    Tooltip
} from 'chart.js';
import { Bar, Line } from "react-chartjs-2";


// Export excel
import * as XLSX from "xlsx";

// SERVICES
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as CityService from "../../service/CityService";
import * as DistrictService from "../../service/DistrictService";
// import * as PartyBookingFoodDetailService from "../../service/PartyBookingFoodDetailService";
import * as PartyBookingOrderService from "../../service/PartyBookingOrderService";
import * as PartyServiceDetailService from "../../service/PartyServiceDetailService";
import * as PartyBookingOrderDetailFoodService from "../../service/PartyBookingOrderDetailFoodService";
import * as PartyServiceTypeService from "../../service/PartyServiceTypeService";
import * as PartyServiceService from "../../service/PartyServiceService";
import * as StatisticService from "../../service/StatisticService";
import * as WardService from "../../service/WardService";
import PDFFile from "./PDFFile";
import PDFFileByDate from "./PDFFileByDate";
import PDFFileByQuarter from "./PDFFileByQuarter";
import PDFFileCity from "./PDFFileCity";
import PDFFileCityByDate from "./PDFFileCityByDate";
import PDFFileCityByQuarter from "./PDFFileCityByQuarter";

Chart.register(...registerables);
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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
    width: 90%;
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
margin: 0px 30px;
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
    color: var(--color-white);
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
    width: 100px;
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

// Left
const LeftVote = styled.div``
const LeftVoteItem = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`
const LeftImage = styled.img`
    margin: auto;
    width: 95%;
    max-height: 90px;
    object-fit: cover;
    border-radius: 20px;
`
const LeftVoteTitle = styled.span`
    margin: auto;
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
    /* position: relative; */
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 95%;
    height: auto;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`
const CartItem = styled.div`
display: flex;
width: 100%;
font-size: 1.1rem;
background: var(--color-grey);
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
color: var(--color-dark);
`

const Content = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`

const InforCustomer = styled.div``
const InfoItem = styled.div``
const InfoTitle = styled.div`
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 1px;
    padding: 10px 0px 10px 50px;
    color: var(--color-dark);
`
const InfoDetail = styled.div`
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 1px;
    padding: 10px 20px;
    color: var(--color-dark);
`
const LeftVoteItem2 = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
    display: flex;
    flex-direction: column;
`

// Right
const RightVote = styled.div`
    padding-left: 40px;
`
const RightVoteItem = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`

const RightVoteTitle = styled.span`
    margin: auto;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 15px 0px;
    color: var(--color-dark);
`
const Surcharge = styled.div`
    height: 310px;
    max-height: 310px;
    overflow-y: scroll;
`
const RightVoteItem2 = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
    display: flex;
    flex-direction: column;
`

const InforTotal = styled.div``
const InfoTotalItem = styled.div``
const InfoTotalTitle = styled.div`
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 1px;
    padding: 10px 0px 10px 50px;
    color: var(--color-dark);
`
const InfoTotalDetail = styled.div`
    font-size: 1.1rem;
    font-weight: bold;
    letter-spacing: 1px;
    padding: 10px 20px;
    color: var(--color-primary);
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

// Statistic
const FilterStatistic = styled.div`
    padding-left: 40px;
`
const FilterStatisticItem = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`
const StatisticLeftButton = styled.div`
    width: 25%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 10px 30px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`

const FilterStatisticTitle = styled.span`
    margin: auto;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 15px 0px;
    color: var(--color-dark);
`

// Service Item
const ServiceItem = styled.div`
    background-color: var(--color-light);
    padding: 10px 10px;
    width: 100%;
    margin: 5px auto 10px auto;
    border-radius: 20px;
    position: relative;
`;
const ServiceName = styled.div`
    font-size: 1rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const ServiceTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const LabelCheckbox = styled.label`
    cursor: pointer;
`

const FilterSpan = styled.span`
    margin: auto;
    font-size: 1.1rem;
    font-weight: bold;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 10px 0px;
    color: var(--color-dark);
`

const FormChucNang = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    /* position: absolute;
    left: 50%;
    bottom: 50%; */
    /* transform: translateX(-50%); */
    text-align: center;
    justify-content: space-around;
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
    color: var(--color-dark);
    background-color: var(--color-light);
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

const ButtonStatistic = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--color-light);
    color: var(--color-dark);
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: scale(1.1);
    }
`

const Table = styled.table`
    background: var(--color-white);
    width: 100%;
    border-radius: var(--card-border-radius);
    padding: var(--card-padding);
    text-align: center;
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
    &:hover {
        box-shadow: none;
    }
`

const Thead = styled.thead`

`

const Tr = styled.tr`
    &:last-child td {
        border: none;
    }
    &:hover {
        background: var(--color-light);
    }
`

const Th = styled.th`

`

const Tbody = styled.tbody`

`

const Td = styled.td`
    height: 2.8rem;
    border-bottom: 1px solid var(--color-light);
`

const StatisticTable = styled.div`
position: relative;
margin-bottom: 20px;
box-shadow: 6px 6px 30px #d1d9e6;
border-radius: 30px;
background-color: var(--color-white);
max-height: 520px;
overflow-y: scroll;
`

// Device Item
const DeviceList = styled.div`
    min-height: 200px;
    max-height: 200px;
    overflow-y: scroll;
`;
const DeviceIcon = styled.img`
    width: 40px;
    height: auto;
`;
const DeviceName = styled.div`
    font-size: 1rem;
    font-weight: bold;
`;
const DeviceTime = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 2px;
`;
const DeviceTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const DeviceInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const DeviceIconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Device detail
const DeviceDetailContainer = styled.div`
    border-radius: 5px;
    padding: 12px;
    /* position: absolute;
    bottom: calc(100% + 20px);
    right: -100px; */
    position: fixed;
    bottom: 400px;
    left: 650px;
    background-color: #f5f5f5;
    width: 250px;
    border-radius: 2px;
    box-shadow: 0 1px 3.125rem 0 rgb(0 0 0 / 20%);
    -webkit-animation: fadeIn ease-in 0.2s;
    animation: fadeIn ease-in 0.2s;
    transition: all 0.85s ease;
    cursor: default;
    z-index: 10;
    display: none;
    /* opacity: 0; */
    &::after {
        content: "";
        position: absolute;
        cursor: pointer;
        left: 24px;
        bottom: -28px;
        border-width: 16px 20px;
        border-style: solid;
        border-color: #f5f5f5 transparent transparent transparent;
    }
`;
const DeviceDetailImage = styled.img`
    border-radius: 5px;
    width: 100%;
`;

const DeviceItem = styled.div`
    border-radius: 20px;
    background-color: var(--color-light);
    padding: 10px 30px;
    width: 80%;
    margin: 5px auto 10px auto;
    position: relative;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        background-color: #f5f5f5;
        ${DeviceDetailContainer} {
            /* opacity: 1; */
            display: block;
        }
        &::after {
            opacity: 1;
        }
    }
    &::after {
        content: "";
        position: absolute;
        top: 20px;
        left: 20px;
        height: 5px;
        width: 5px;
        background: var(--color-primary);
        border-radius: 50%;
        margin-right: 15px;
        border: 4px solid transparent;
        display: block;
        opacity: 0;
    }
`;


const DeleteService = styled.span`
    cursor: pointer;
    color: var(--color-dark);
    position: absolute;
    top: 17px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
    &:hover {
        color: var(--color-primary);
        transform: scale(1.3);
        transition: all 200ms linear; 
    }
`

const ServiceIcon = styled.img`
    width: 40px;
    height: auto;
`;

const ServiceTime = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 2px;
`;

const ServiceInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const ServiceIconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PriceDetail = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

`
// Thông tin - Thông tin giá
const ProductAmountContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`

const ProductAmount = styled.div`
    font-size: 1.4rem;
    margin: 5px;
    padding: 0px 10px;
`

const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
`

const Modal = ({ showModal, setShowModal, type, partyBookingOrder, partyBookingOrderAddService, setReRenderData, handleClose, showToastFromOut }) => {
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
    // CHI TIẾT ĐẶT SẢNH
    const [partyBookingOrderModal, setPartyBookingOrderModal] = useState();
    const [partyBookingOrderIdModal, setPartyBookingOrderIdModal] = useState();
    const [partyBookingOrderDetailFoodListModal, setPartyBookingOrderDetailFoodListModal] = useState([]);
    const [partyServiceDetailListNoPaymentModal, setPartyServiceDetailListNoPaymentModal] = useState([]);
    const [partyServiceDetailListNeedPaymentModal, setPartyServiceDetailListNeedPaymentModal] = useState([]);

    const [isShowDetailPartyBookingOrder, setIsShowDetailPartyBookingOrder] = useState(false);
    useEffect(() => {
        // Lấy thông tin chi tiết của Tiệc
        const getpartyBookingOrderById = async () => {
            try {
                const partyBookingOrderRes = await PartyBookingOrderService.findPartyBookingById({
                    partyBookingId: partyBookingOrder.party_booking_order_id
                });
                setPartyBookingOrderModal(partyBookingOrderRes.data.data);
                setPartyBookingOrderIdModal(partyBookingOrderRes.data.data.party_booking_order_id);
            } catch (err) {
                console.log("Lỗi lấy party booking order: ", err.response);
            }
        }
        // Lấy những món ăn chi tiết của menu đã chọn
        const getPartyBookingOrderDetailFoods = async () => {
            try {
                const partyBookingOrderDetailFoodRes = await PartyBookingOrderDetailFoodService.findAllPartyBookingOrderDetailFoodByPartyBookingOrderId(
                    partyBookingOrder.party_booking_order_id
                );
                setPartyBookingOrderDetailFoodListModal(partyBookingOrderDetailFoodRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy party booking order detail food: ", err.response);
            }
        }
        // Lấy dịch vụ đã thanh toán của Tiệc
        const getPartyServiceDetailsNoPayment = async () => {
            try {
                const partyServiceDetailNoPaymentRes = await PartyServiceDetailService.findAllPartyServiceDetailByPartyBookingOrderIdAndState0NoPayment(
                    partyBookingOrder.party_booking_order_id
                );
                setPartyServiceDetailListNoPaymentModal(partyServiceDetailNoPaymentRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy party service detail list no payment: ", err.response);
            }
        }
        const getPartyServiceDetailsNeedPayment = async () => {
            try {
                const partyServiceDetailNeedPaymentRes = await PartyServiceDetailService.findAllPartyServiceDetailByPartyBookingOrderIdAndState1NeedPayment(
                    partyBookingOrder.party_booking_order_id
                );
                setPartyServiceDetailListNeedPaymentModal(partyServiceDetailNeedPaymentRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy party service detail list need payment: ", err.response);
            }
        }
        if (partyBookingOrder) {
            getpartyBookingOrderById();
            getPartyBookingOrderDetailFoods();
            getPartyServiceDetailsNoPayment();
            getPartyServiceDetailsNeedPayment();
        }
    }, [partyBookingOrder, showModal]);

    // Check in
    const [partyBookingOrderIdentityCardModal, setPartyBookingOrderIdentityCardModal] = useState();
    const [partyBookingOrderPhoneNumberModal, setPartyBookingOrderPhoneNumberModal] = useState();
    const [partyBookingOrderEmailModal, setPartyBookingOrderEmailModal] = useState();
    const [partyBookingOrderNationModal, setPartyBookingOrderNationModal] = useState();
    const [partyBookingOrderAddressModal, setPartyBookingOrderAddressModal] = useState();
    const [partyBookingOrderFirstNameModal, setPartyBookingOrderFirstNameModal] = useState();
    const [partyBookingOrderLastNameModal, setPartyBookingOrderLastNameModal] = useState();

    // TỈNH - HUYỆN - XÃ
    const [partyBookingOrderCityIdModal, setPartyBookingOrderCityIdModal] = useState("");
    const [partyBookingOrderDistrictIdModal, setPartyBookingOrderDistrictIdModal] = useState("");
    const [partyBookingOrderWardIdModal, setPartyBookingOrderWardIdModal] = useState("");

    const [partyBookingOrderCityListModal, setPartyBookingOrderCityListModal] = useState([]);
    const [partyBookingOrderDistrictListModal, setPartyBookingOrderDistrictListModal] = useState([]);
    const [partyBookingOrderWardListModal, setPartyBookingOrderWardListModal] = useState([]);

    useEffect(() => {
        const getCityList = async () => {
            const cityRes = await CityService.getAllCitys();
            setPartyBookingOrderCityListModal(cityRes.data.data);
            console.log("Tỉnh TPUpdate [res]: ", partyBookingOrderCityListModal);
        }
        getCityList();

        setPartyBookingOrderDistrictListModal([]);
        setPartyBookingOrderWardListModal([]);

        setPartyBookingOrderWardIdModal('');
        setPartyBookingOrderCityIdModal('');
        setPartyBookingOrderDistrictIdModal('');
    }, [showModal])

    useEffect(() => {
        const getDistrictList = async () => {
            const districtRes = await DistrictService.getAllDistrictsByCityId(partyBookingOrderCityIdModal)
            setPartyBookingOrderDistrictListModal(districtRes.data.data);
            console.log("Quận huyện Update [res]: ", partyBookingOrderDistrictListModal);
        }
        getDistrictList();
    }, [partyBookingOrderCityIdModal])

    useEffect(() => {
        const getWardList = async () => {
            const wardRes = await WardService.getAllWardByDistrictId(partyBookingOrderDistrictIdModal)
            setPartyBookingOrderWardListModal(wardRes.data.data);
            console.log("Xã phường Update res: ", partyBookingOrderWardListModal);
        }
        getWardList();
    }, [partyBookingOrderDistrictIdModal])

    const handleChangeIdentityCard = (e) => {
        const resultKey = e.target.value.replace(/[^0-9 ]/gi, '');
        setPartyBookingOrderIdentityCardModal(resultKey);
    }
    const handleChangePhoneNumber = (e) => {
        const resultKey = e.target.value.replace(/[^0-9 ]/gi, '');
        setPartyBookingOrderPhoneNumberModal(resultKey);
    }
    const handleChangeEmail = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultEmail = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setPartyBookingOrderEmailModal(resultEmail);
    }
    const handleChangeNation = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultNation = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setPartyBookingOrderNationModal(resultNation);
    }
    const handleChangeAddress = (e) => {
        setPartyBookingOrderAddressModal(e.target.value);
    }
    const handleChangeFirstName = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultFirstName = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setPartyBookingOrderFirstNameModal(resultFirstName);
    }
    const handleChangeLastName = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultLastName = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setPartyBookingOrderLastNameModal(resultLastName);
    }

    const handleCheckin = async (
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhoneNumber,
        partyBookingOrderIdentityCard,
        partyBookingOrderNation,
        partyBookingOrderAddress,
        partyBookingOrderWardId,
        partyBookingOrderId
    ) => {
        try {
            const checkInRes = await PartyBookingOrderService.checkIn({
                customerFirstName: customerFirstName,
                customerLastName: customerLastName,
                customerEmail: customerEmail,
                customerPhoneNumber: customerPhoneNumber,
                partyBookingOrderIdentityCard: partyBookingOrderIdentityCard,
                partyBookingOrderNation: partyBookingOrderNation,
                partyBookingOrderAddress: partyBookingOrderAddress,
                partyBookingOrderWardId: partyBookingOrderWardId,
                partyBookingOrderId: partyBookingOrderId
            });
            if (!checkInRes) {
                // Toast
                const dataToast = { message: checkInRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();
            // Toast
            const dataToast = { message: checkInRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    const handleCheckout = async (partyBookingOrderId) => {
        try {
            const checkOutRes = await PartyBookingOrderService.checkOut({
                partyBookingOrderId: partyBookingOrderId
            });
            if (!checkOutRes) {
                // Toast
                const dataToast = { message: checkOutRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();
            // Toast
            const dataToast = { message: checkOutRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }
    // ADD SERVICE
    const [partyBookingOrderAddServiceModal, setPartyBookingOrderAddServiceModal] = useState();
    const [partyBookingOrderIdModalAddService, setPartyBookingOrderIdModalAddService] = useState();
    const [partyServiceTypeIdModalAddService, setPartyServiceTypeIdModalAddService] = useState();
    const [isUpdateAddServiceModal, setIsUpdateAddServiceModal] = useState();
    const [partyServiceDetailListNeedPaymentAddService, setPartyServiceDetailListNeedPaymentAddService] = useState([]);
    const [partyServiceListAddService, setPartyServiceListAddService] = useState([]);
    // Lấy Loại dịch vụ tiệc
    const [partyServiceTypeList, setPartyServiceTypeList] = useState([]);
    useEffect(() => {
        const getPartyServiceTypes = async () => {
            try {
                const partyServiceTypeRes = await PartyServiceTypeService.getAllPartyServiceTypes();
                setPartyServiceTypeList(partyServiceTypeRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy party service type: ", err.response);
            }
        }
        getPartyServiceTypes();
    }, []);

    useEffect(() => {
        // Lấy thông tin Tiệc cần thêm Dịch vụ
        const getPartyBookingOrderWhenAddService = async () => {
            try {
                const partyBookingOrderRes = await PartyBookingOrderService.findPartyBookingById({
                    partyBookingId: partyBookingOrderAddService.party_booking_order_id
                });
                setPartyBookingOrderAddServiceModal(partyBookingOrderRes.data.data);
                setPartyBookingOrderIdModalAddService(partyBookingOrderRes.data.data.party_booking_order_id);
            } catch (err) {
                console.log("Lỗi lấy party booking order modal add employee: ", err.response);
            }
        }
        // Lấy Dịch vụ dựa vào partyServiceTypeId
        const getPartyServiceByPartyServiceTypeId = async () => {
            // Reset lại check box chọn dịch vụ khi thay đổi Loại dịch vụ
            setPartyServiceChooseList([]);
            try {
                const partyServiceListRes = await PartyServiceService.getPartyServiceByPartyServiceTypeId({
                    partyServiceTypeId: partyServiceTypeIdModalAddService
                });
                // Thêm số lượng tăng giảm cho từng service
                var arrayAfterAddQuantity = [];
                for (var i = 0; i < partyServiceListRes.data.data.length; i++) {
                    var service = partyServiceListRes.data.data[i];
                    arrayAfterAddQuantity.push({
                        ...service,
                        serviceChooseQuantity: 1
                    });
                }
                setPartyServiceListAddService(arrayAfterAddQuantity);
            } catch (err) {
                console.log("ERR getPartyServiceByPartyServiceTypeId: ", err.response);
            }
        };
        // Lấy những Chi tiết dịch vụ của Tiệc - Cần thanh toán
        const getAllPartyServiceDetailByPartyBookingIdAndStateNeedPayment = async () => {
            try {
                const partyServiceDetailRes = await PartyServiceDetailService.findAllPartyServiceDetailByPartyBookingOrderIdAndState1NeedPayment(partyBookingOrderAddService.party_booking_order_id);
                setPartyServiceDetailListNeedPaymentAddService(partyServiceDetailRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        if (partyBookingOrderAddService && !partyServiceTypeIdModalAddService) {
            getPartyBookingOrderWhenAddService();
            getAllPartyServiceDetailByPartyBookingIdAndStateNeedPayment();
        }
        if (partyBookingOrderAddService && partyServiceTypeIdModalAddService) {
            getPartyBookingOrderWhenAddService();
            getAllPartyServiceDetailByPartyBookingIdAndStateNeedPayment();
            getPartyServiceByPartyServiceTypeId();
        }
    }, [partyBookingOrderAddService, showModal, partyServiceTypeIdModalAddService, isUpdateAddServiceModal]);

    // Create party service list check box
    const [partyServiceChooseList, setPartyServiceChooseList] = useState([]);
    const handleCheckPartyService = (e, partyService) => {

        console.log("handleCheckPartyService partyService: ", partyService)
        var filteredArray = [...partyServiceChooseList];
        if (e.currentTarget.checked) {
            if (filteredArray.filter((prev) => prev.party_service_id === partyService.party_service_id).length === 0) {
                filteredArray.push(partyService);
                setPartyServiceChooseList(filteredArray);
            }
        } else {
            if (filteredArray.filter((prev) => prev.party_service_id === partyService.party_service_id).length > 0) {
                let index = filteredArray.indexOf(partyService);
                filteredArray.splice(index, 1);
                setPartyServiceChooseList(filteredArray);
            }
        }
    };
    const handleCreatePartyServiceDetail = async (e, partyServiceList, partyBookingOrderId) => {
        console.log("e, partyServiceList, partyBookingOrderId: ", e, partyServiceList, partyBookingOrderId);
        e.preventDefault();
        try {
            const createPartyServiceDetailRes = await PartyServiceDetailService.createPartyServiceDetailByListPartyServiceDetailAndPartyBookingOrderId({
                partyServiceList: partyServiceList,
                partyBookingOrderId: partyBookingOrderId
            });
            if (!createPartyServiceDetailRes) {
                // Toast
                const dataToast = { message: createPartyServiceDetailRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddServiceModal(prev => !prev);
            setReRenderData(prev => !prev);
            setPartyServiceChooseList([]);   //Thêm thành công thì bỏ mảng chọn cũ

            // Toast
            const dataToast = { message: createPartyServiceDetailRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    const handleCancleCreatePartyServiceDetail = async (e, partyServiceList) => {
        e.preventDefault();
        if (partyServiceList.length === 0) {
            // Toast
            const dataToast = { message: "Bạn vẫn chưa chọn Dịch vụ tiệc nào!", type: "warning" };
            showToastFromOut(dataToast);
            return;
        } else {
            setPartyServiceChooseList([]);
            setIsUpdateAddServiceModal(prev => !prev);
            // Toast
            const dataToast = { message: "Hủy chọn thành công!", type: "success" };
            showToastFromOut(dataToast);
            return;
        }
    };

    const handleUpdatePartyServiceDetailQuantity = async (quantity, partyServiceDetailId) => {
        try {
            const updatePartyServiceDetailQuantityRes = await PartyServiceDetailService.updatePartyServiceDetailQuantityByPartyServiceDetailId({
                partyServiceDetailQuantity: quantity,
                partyServiceDetailId: partyServiceDetailId
            });
            if (!updatePartyServiceDetailQuantityRes) {
                // Toast
                const dataToast = { message: updatePartyServiceDetailQuantityRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddServiceModal(prev => !prev);
            setReRenderData(prev => !prev);

            // Toast
            const dataToast = { message: updatePartyServiceDetailQuantityRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    console.log("setPartyBookingOrderAddServiceModal: ", partyBookingOrderAddServiceModal, partyServiceListAddService);
    console.log("partyServiceChooseList: ", partyServiceChooseList);
    // ================================================================
    //  =============== Thêm Dịch vụ cho Tiệc ===============
    if (type === "addServiceToParty") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "90%" }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thêm Dịch vụ cho Tiệc - Nhà hàng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Thông tin Tiệc - Nhà hàng</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Thời gian: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{partyBookingOrderAddServiceModal ? "Vào ngày: " + partyBookingOrderAddServiceModal.party_hall_detail_date : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{partyBookingOrderAddServiceModal ? partyBookingOrderAddServiceModal.party_booking_order_state === 2 ? "Hoàn thành lúc: " + partyBookingOrderAddServiceModal.party_booking_order_finish_date : partyBookingOrderAddServiceModal.party_booking_order_state === 1 ? "Đã checkin lúc: " + partyBookingOrderAddServiceModal.party_booking_order_start_date : partyBookingOrderAddServiceModal.party_booking_order_state === 0 ? "Đã đặt lúc: " + partyBookingOrderAddServiceModal.party_booking_order_book_date : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={partyBookingOrderAddServiceModal ? partyBookingOrderAddServiceModal.party_hall_image_content : null} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {partyBookingOrderAddServiceModal ? partyBookingOrderAddServiceModal.party_hall_name + ", " + partyBookingOrderAddServiceModal.floor_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{partyBookingOrderAddServiceModal ? partyBookingOrderAddServiceModal.party_booking_order_total : null} VNĐ</span>
                                                        </Content>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItem2 className="row">
                                                <LeftVoteTitle>Những Dịch vụ Phụ phí hiện tại của Tiệc này</LeftVoteTitle>
                                                <DeviceList className="col-lg-12" style={{ minHeight: "260px", maxHeight: "260px" }}>
                                                    {
                                                        partyServiceDetailListNeedPaymentAddService.length > 0
                                                            ?
                                                            partyServiceDetailListNeedPaymentAddService.map((partyServiceDetail, key) => {
                                                                return (
                                                                    <DeviceItem className="row">
                                                                        <DeviceIconContainer className="col-lg-3">
                                                                            <PriceDetail>
                                                                                <ProductAmountContainer>
                                                                                    <div onClick={() => handleUpdatePartyServiceDetailQuantity(1, partyServiceDetail.party_service_detail_id)}>
                                                                                        <Add />
                                                                                    </div>
                                                                                    <ProductAmount>{partyServiceDetail.party_service_detail_quantity}</ProductAmount>
                                                                                    <div onClick={() => handleUpdatePartyServiceDetailQuantity(-1, partyServiceDetail.party_service_detail_id)}>
                                                                                        <Remove />
                                                                                    </div>
                                                                                </ProductAmountContainer>
                                                                            </PriceDetail>
                                                                        </DeviceIconContainer>
                                                                        <div className="col-lg-9">
                                                                            <DeviceTitle className="row">
                                                                                <DeviceName style={{ marginLeft: "10px" }}>{partyServiceDetail.party_service_name}</DeviceName>
                                                                            </DeviceTitle>
                                                                            <DeviceInfo className="row">
                                                                                <DeviceTime style={{ margin: "5px 10px 0px 10px" }}>Tổng tiền: <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>{partyServiceDetail.party_service_detail_total}</span></DeviceTime>
                                                                            </DeviceInfo>
                                                                        </div>
                                                                        <DeleteService onClick={() => handleUpdatePartyServiceDetailQuantity(0, partyServiceDetail.party_service_detail_id)}>
                                                                            <ClearOutlined />
                                                                        </DeleteService>
                                                                    </DeviceItem>
                                                                )
                                                            }) : (
                                                                <EmptyItem>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Hiện tại Tiệc này chưa có Phụ phí nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </DeviceList>
                                            </LeftVoteItem2>
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Những Dịch vụ hiện có của Nhà hàng</RightVoteTitle>

                                                <RightVoteTitle style={{ fontSize: "1rem", padding: "0" }} className="col-lg-12"><span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>Hãy chọn Dịch vụ bạn muốn thêm vào Tiệc này!</span></RightVoteTitle>
                                                <Box sx={{ minWidth: 120, width: "80%", margin: "10px auto" }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label"></InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={partyServiceTypeIdModalAddService}
                                                            label="Age"
                                                            sx={{
                                                                '& legend': { display: 'none' },
                                                                '& fieldset': { top: 0 }
                                                            }}
                                                            onChange={(e) => setPartyServiceTypeIdModalAddService(parseInt(e.target.value))}
                                                        >
                                                            {
                                                                partyServiceTypeList.length > 0
                                                                    ?
                                                                    partyServiceTypeList.map((partyServiceType, key) => {
                                                                        return (
                                                                            <MenuItem value={partyServiceType.party_service_type_id}>{partyServiceType.party_service_type_name}</MenuItem>
                                                                        )
                                                                    }) : null
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                <Surcharge className="col-lg-12" style={{ height: "355px", maxHeight: "355px" }}>

                                                    {
                                                        partyServiceListAddService.length > 0
                                                            ?
                                                            partyServiceListAddService.map((service, key) => {
                                                                const handleRemove = (partyServiceQuantityUpdate) => {
                                                                    var fileredArray = [...partyServiceListAddService];
                                                                    for (var i = 0; i < fileredArray.length; i++) {
                                                                        if (fileredArray[i].party_service_id === parseInt(service.party_service_id)) {
                                                                            if (partyServiceQuantityUpdate === 1) {
                                                                                fileredArray[i].serviceChooseQuantity += 1;
                                                                            }
                                                                            if (partyServiceQuantityUpdate === -1) {
                                                                                if (fileredArray[i].serviceChooseQuantity === 1) {
                                                                                    continue;
                                                                                }
                                                                                fileredArray[i].serviceChooseQuantity -= 1;
                                                                            }
                                                                        }
                                                                    }
                                                                    setPartyServiceListAddService(prev => fileredArray);
                                                                }
                                                                return (
                                                                    <ServiceItem className="row">
                                                                        <div className="col-lg-2">
                                                                            <Checkbox checked={partyServiceChooseList.filter(prev => prev.party_service_id === service.party_service_id).length > 0 ? true : false} onChange={(e) => handleCheckPartyService(e, service)} />
                                                                        </div>
                                                                        <ServiceIconContainer className="col-lg-3">
                                                                            <PriceDetail>
                                                                                <ProductAmountContainer>
                                                                                    <div onClick={() => handleRemove(1)}>
                                                                                        <Add />
                                                                                    </div>
                                                                                    <ProductAmount>{service.serviceChooseQuantity}</ProductAmount>
                                                                                    <div onClick={() => handleRemove(-1)}>
                                                                                        <Remove />
                                                                                    </div>
                                                                                </ProductAmountContainer>
                                                                            </PriceDetail>
                                                                        </ServiceIconContainer>
                                                                        <div className="col-lg-7">
                                                                            <ServiceTitle className="row">
                                                                                <ServiceName>{service.party_service_name}</ServiceName>
                                                                            </ServiceTitle>
                                                                            <ServiceInfo className="row">
                                                                                <ServiceTime style={{ margin: "5px 10px 0px 0px" }}>Tổng tiền: <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>{service.party_service_price * service.serviceChooseQuantity}</span></ServiceTime>
                                                                            </ServiceInfo>
                                                                        </div>
                                                                    </ServiceItem>
                                                                )
                                                            }) : (
                                                                <EmptyItem>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Không có Dịch vụ nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                                <FormChucNang style={{ marginTop: "20px" }}>
                                                    <SignInBtn
                                                        onClick={(e) => handleCreatePartyServiceDetail(e, partyServiceChooseList, partyBookingOrderIdModalAddService)}
                                                    >Thêm Dịch vụ</SignInBtn>
                                                    <SignUpBtn
                                                        onClick={(e) => handleCancleCreatePartyServiceDetail(e, partyServiceChooseList)}
                                                    >Hủy chọn</SignUpBtn>
                                                </FormChucNang>
                                            </RightVoteItem>
                                        </RightVote>
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
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    };
    //  =============== Checkin ===============
    if (type === "checkin") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "50%" }}>
                            <H1>Checkin nhận Tiệc</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <FormSpan>Họ của khách hàng:</FormSpan>
                                            <FormInput style={{ width: "100%" }} type="text"
                                                value={partyBookingOrderFirstNameModal}
                                                placeholder="Họ của Khách hàng"
                                                onChange={(e) => handleChangeFirstName(e)}
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <FormSpan>Tên của khách hàng:</FormSpan>
                                            <FormInput style={{ width: "100%" }} type="text"
                                                value={partyBookingOrderLastNameModal}
                                                placeholder="Tên của Khách hàng"
                                                onChange={(e) => handleChangeLastName(e)}
                                            />
                                        </div>
                                    </div>
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Chứng minh nhân dân:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Chứng minh thư của Khách hàng"
                                        value={partyBookingOrderIdentityCardModal}
                                        onChange={(e) => handleChangeIdentityCard(e)} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <div className="row">
                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Quốc tịch:</FormSpan>
                                            <FormInput type="text"
                                                placeholder="Quốc tịch của Khách hàng"
                                                value={partyBookingOrderNationModal}
                                                onChange={(e) => handleChangeNation(e)}
                                            />
                                        </div>
                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Địa chỉ:</FormSpan>
                                            <FormInput type="text"
                                                placeholder="Địa chỉ của Khách hàng"
                                                value={partyBookingOrderAddressModal}
                                                onChange={(e) => handleChangeAddress(e)}
                                            />
                                        </div>
                                    </div>
                                </ModalFormItem>

                                <ModalFormItem>
                                    <div className="row">
                                        <div className="col-lg-4" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Thuộc Thành phố:</FormSpan>
                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={partyBookingOrderCityIdModal}
                                                        label="Age"
                                                        sx={{
                                                            '& legend': { display: 'none' },
                                                            '& fieldset': { top: 0 }
                                                        }}
                                                        onChange={(e) => setPartyBookingOrderCityIdModal(e.target.value)}
                                                    >
                                                        <MenuItem value="">-- Chọn thành phố --</MenuItem>
                                                        {partyBookingOrderCityListModal.length > 0
                                                            ?
                                                            partyBookingOrderCityListModal.map((city, key) => {
                                                                return (
                                                                    <MenuItem value={city.city_id}> {city.city_name} </MenuItem>
                                                                )
                                                            }) : null
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </div>
                                        <div className="col-lg-4" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Thuộc Quận, huyện:</FormSpan>
                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={partyBookingOrderDistrictIdModal}
                                                        label="Age"
                                                        sx={{
                                                            '& legend': { display: 'none' },
                                                            '& fieldset': { top: 0 }
                                                        }}
                                                        onChange={(e) => setPartyBookingOrderDistrictIdModal(e.target.value)}
                                                    >
                                                        {
                                                            partyBookingOrderDistrictListModal.length > 0
                                                                ?
                                                                partyBookingOrderDistrictListModal.map((district, key) => {
                                                                    return (
                                                                        <MenuItem value={district.district_id}> {district.district_name} </MenuItem>
                                                                    )
                                                                })
                                                                :
                                                                <MenuItem value="">-- Bạn chưa chọn Thành phố -- </MenuItem>
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </div>
                                        <div className="col-lg-4" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Thuộc Xã:</FormSpan>
                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={partyBookingOrderWardIdModal}
                                                        label="Age"
                                                        sx={{
                                                            '& legend': { display: 'none' },
                                                            '& fieldset': { top: 0 }
                                                        }}
                                                        onChange={(e) => setPartyBookingOrderWardIdModal(e.target.value)}
                                                    >    {
                                                            partyBookingOrderWardListModal.length > 0
                                                                ?
                                                                partyBookingOrderWardListModal.map((ward, key) => {
                                                                    return (
                                                                        <MenuItem value={ward.ward_id}> {ward.ward_name} </MenuItem>
                                                                    )
                                                                })
                                                                :
                                                                <MenuItem value="">-- Bạn chưa chọn Quận huyện -- </MenuItem>
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </div>
                                    </div>
                                </ModalFormItem>

                                <ModalFormItem>
                                    <FormSpan>Email Khách hàng:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Email đã đặt phòng"
                                        value={partyBookingOrderEmailModal}
                                        onChange={(e) => handleChangeEmail(e)}
                                    />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Số điện thoại:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Số điện thoại đã đặt phòng"
                                        value={partyBookingOrderPhoneNumberModal}
                                        onChange={(e) => handleChangePhoneNumber(e)} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCheckin(
                                            partyBookingOrderFirstNameModal,
                                            partyBookingOrderLastNameModal,
                                            partyBookingOrderEmailModal,
                                            partyBookingOrderPhoneNumberModal,
                                            partyBookingOrderIdentityCardModal,
                                            partyBookingOrderNationModal,
                                            partyBookingOrderAddressModal,
                                            partyBookingOrderWardIdModal,
                                            partyBookingOrderIdModal
                                        )}
                                    >Check in</ButtonClick>
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
    // =============== Checkout ===============
    if (type === "checkout") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal} >
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Check out <span style={{ color: `var(--color-primary)` }}>{partyBookingOrder ? partyBookingOrder.party_hall_name : null}</span> này?</h1>
                                    <p style={{ marginTop: "10px" }}>Đảm bảo Khách hàng đã thanh toán Phụ phí trước khi tiến hành Check out!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCheckout(partyBookingOrderIdModal)}
                                    >Check out</ButtonClick>
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
                        </AlertWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    //  =============== Xem chi tiết Phòng ===============
    if (type === "detailPartyBookingOrder") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Chi tiết Đặt tiệc</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <span>Thông tin Đặt Tiệc</span>
                                                    {
                                                        isShowDetailPartyBookingOrder ?
                                                            <TooltipMui
                                                                title={"Ẩn chi tiết Đặt tiệc"}
                                                                arrow
                                                                followCursor={true}
                                                                componentsProps={{
                                                                    tooltip: {
                                                                        sx: {
                                                                            fontSize: "12px",
                                                                            fontWeight: "bold",
                                                                            letterSpacing: "1px",
                                                                            padding: "10px 20px",
                                                                            borderRadius: "20px"
                                                                        },
                                                                    },
                                                                }}
                                                            >
                                                                <VisibilityOffOutlined
                                                                    onClick={() => setIsShowDetailPartyBookingOrder(prev => !prev)}
                                                                    style={{ marginLeft: "20px", cursor: "pointer" }} />
                                                            </TooltipMui>
                                                            :
                                                            <TooltipMui
                                                                title={"Hiện chi tiết Đặt tiệc"}
                                                                arrow
                                                                followCursor={true}
                                                                componentsProps={{
                                                                    tooltip: {
                                                                        sx: {
                                                                            fontSize: "12px",
                                                                            fontWeight: "bold",
                                                                            letterSpacing: "1px",
                                                                            padding: "10px 20px",
                                                                            borderRadius: "20px"
                                                                        },
                                                                    },
                                                                }}
                                                            >
                                                                <VisibilityOutlined
                                                                    onClick={() => setIsShowDetailPartyBookingOrder(prev => !prev)}
                                                                    style={{ marginLeft: "20px", cursor: "pointer" }} />
                                                            </TooltipMui>
                                                    }
                                                </LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Thời gian: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">Vào ngày {partyBookingOrderModal ? partyBookingOrderModal.party_hall_detail_date : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_state === 2 ? "Hoàn thành lúc: " + partyBookingOrderModal.party_booking_order_finish_date : partyBookingOrderModal.party_booking_order_state === 1 ? "Đã checkin lúc: " + partyBookingOrderModal.party_booking_order_start_date : partyBookingOrderModal.party_booking_order_state === 0 ? "Đã đặt lúc: " + partyBookingOrderModal.party_booking_order_book_date : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={partyBookingOrderModal ? partyBookingOrderModal.party_hall_image_content : null} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {partyBookingOrderModal ? partyBookingOrderModal.party_hall_name + ", " + partyBookingOrderModal.floor_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_total : null} VNĐ</span>
                                                        </Content>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            {
                                                isShowDetailPartyBookingOrder ? (
                                                    <LeftVoteItem2 className="row">
                                                        <LeftVoteTitle>Thông tin Chi tiết Tiệc</LeftVoteTitle>
                                                        <InforCustomer className="col-lg-12">
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Nội dung tiệc: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.party_hall_detail_name : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Vị trí: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.party_hall_name + ", " + partyBookingOrderModal.floor_name : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Menu đã chọn: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.set_menu_name : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Số lượng bàn: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_table_quantity : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Thông tin Giảm giá: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? "Tiệc này được Áp dụng giảm " + partyBookingOrderModal.discount_percent + " %" : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Ghi chú của Khách: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_note : "Không có ghi chú gì về Tiệc này"}</InfoDetail>
                                                            </InfoItem>
                                                        </InforCustomer>
                                                    </LeftVoteItem2>
                                                ) : (
                                                    <LeftVoteItem2 className="row">
                                                        <LeftVoteTitle>Thông tin Khách hàng</LeftVoteTitle>
                                                        <InforCustomer className="col-lg-12">
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Họ tên: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.customer_first_name + " " + partyBookingOrderModal.customer_last_name : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Chứng minh thư: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_state === 0 ? "Chưa Checkin" : partyBookingOrderModal.party_booking_order_identity_card : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Quốc tịch: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_state === 0 ? "Chưa Checkin" : partyBookingOrderModal.party_booking_order_nation : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Địa chỉ: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_state === 0 ? "Chưa Checkin" : partyBookingOrderModal.party_booking_order_address + ", " + partyBookingOrderModal.ward_name + ", " + partyBookingOrderModal.district_name + ", " + partyBookingOrderModal.city_name : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Email: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.customer_email : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">SĐT: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{partyBookingOrderModal ? partyBookingOrderModal.customer_phone_number : null}</InfoDetail>
                                                            </InfoItem>
                                                        </InforCustomer>
                                                    </LeftVoteItem2>
                                                )
                                            }
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Thông tin Phụ phí</RightVoteTitle>
                                                <Surcharge className="col-lg-12">
                                                    {/* Những món ăn đã chọn cho menu */}
                                                    <RightVoteTitle style={{ fontSize: "1.1rem" }} className="col-lg-12">Set Menu chi tiết những Món ăn cho <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_table_quantity + " Bàn" : null}</span>: <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}> Đã thanh toán</span></RightVoteTitle>
                                                    {
                                                        partyBookingOrderDetailFoodListModal.length > 0
                                                            ?
                                                            partyBookingOrderDetailFoodListModal.map((partyBookingOrderDetailFood, key) => {
                                                                return (
                                                                    <CartItem>
                                                                        <Circle />
                                                                        <Course>
                                                                            <Content>
                                                                                <span style={{ width: "320px", fontWeight: "bold" }}> {partyBookingOrderDetailFood.food_name} </span>
                                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{partyBookingOrderDetailFood.food_type_name}</span>
                                                                            </Content>
                                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "grey" }}>{partyBookingOrderDetailFood.food_ingredient}</span></span>
                                                                        </Course>
                                                                    </CartItem>
                                                                )
                                                            })
                                                            : (
                                                                <EmptyItem>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Khách hàng chưa có Phụ phí nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }

                                                    {/* Những dịch vụ đã chọn: Đã thanh toán */}
                                                    <RightVoteTitle style={{ fontSize: "1.1rem" }} className="col-lg-12">Những Dịch vụ đã chọn cho Tiệc: <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}> Đã thanh toán</span></RightVoteTitle>
                                                    {
                                                        partyServiceDetailListNoPaymentModal.length > 0
                                                            ?
                                                            partyServiceDetailListNoPaymentModal.map((partyServiceDetail, key) => {
                                                                return (
                                                                    <CartItem>
                                                                        <Circle />
                                                                        <Course>
                                                                            <Content>
                                                                                <span style={{ width: "320px", fontWeight: "bold" }}> {partyServiceDetail.party_service_name} </span>
                                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{partyServiceDetail.party_service_price} VNĐ</span>
                                                                            </Content>
                                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{partyServiceDetail.party_service_detail_quantity}</span> x {partyServiceDetail.party_service_type_name}</span>
                                                                        </Course>
                                                                    </CartItem>
                                                                )
                                                            })
                                                            : (
                                                                <EmptyItem>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Khách hàng chưa có Dịch vụ nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }

                                                    {/* Những dịch vụ đã chọn: Chưa thanh toán */}
                                                    <RightVoteTitle style={{ fontSize: "1.1rem" }} className="col-lg-12">Những Dịch vụ bổ sung cho Tiệc: <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}> Thanh toán khi kết thúc</span></RightVoteTitle>
                                                    {
                                                        partyServiceDetailListNeedPaymentModal.length > 0
                                                            ?
                                                            partyServiceDetailListNeedPaymentModal.map((partyServiceDetail, key) => {
                                                                return (
                                                                    <CartItem>
                                                                        <Circle />
                                                                        <Course>
                                                                            <Content>
                                                                                <span style={{ width: "320px", fontWeight: "bold" }}> {partyServiceDetail.party_service_name} </span>
                                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{partyServiceDetail.party_service_price} VNĐ</span>
                                                                            </Content>
                                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{partyServiceDetail.party_service_detail_quantity}</span> x {partyServiceDetail.party_service_type_name}</span>
                                                                        </Course>
                                                                    </CartItem>
                                                                )
                                                            })
                                                            : (
                                                                <EmptyItem>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Khách hàng chưa có Phụ phí nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                            </RightVoteItem>
                                            <RightVoteItem2 className="row">
                                                <RightVoteTitle>Tổng cộng</RightVoteTitle>
                                                <InforTotal className="col-lg-12">
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Tiền đặt Tiệc: (Đã thanh toán) </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_price : null} VNĐ</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Phụ phí: </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_surcharge : null} VNĐ</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Tổng tiền thanh toán khi Check out: </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{partyBookingOrderModal ? partyBookingOrderModal.party_booking_order_surcharge : null} VNĐ</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                </InforTotal>
                                            </RightVoteItem2>
                                        </RightVote>
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
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
};

export default Modal;