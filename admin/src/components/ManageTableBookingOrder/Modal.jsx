import { Add, ClearOutlined, CloseOutlined, FilePresentOutlined, FindInPageOutlined, HideImageOutlined, ImageOutlined, MoreHorizOutlined, PictureAsPdfOutlined, Remove, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Box, Checkbox, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, useTheme } from "@mui/material";
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
import * as FoodService from "../../service/FoodService";
import * as FoodTypeService from "../../service/FoodTypeService";
import * as StatisticService from "../../service/StatisticService";
import * as TableBookingOrderService from "../../service/TableBookingOrderService";
import * as TableDetailService from "../../service/TableDetailService";
import * as TableTypeService from "../../service/TableTypeService";
import * as WardService from "../../service/WardService";
import { format_money } from "../../utils/utils";
import PDFFile from "./PDFFile";
import PDFFileByDate from "./PDFFileByDate";
import PDFFileByQuarter from "./PDFFileByQuarter";
import PDFFileCity from "./PDFFileCity";
import PDFFileCityByDate from "./PDFFileCityByDate";
import PDFFileCityByQuarter from "./PDFFileCityByQuarter";
import PDFFileCustomerByDate from "./PDFFileCustomerByDate";
import PDFFileCustomerByQuarter from "./PDFFileCustomerByQuarter";
import PDFFileTypeByDate from "./PDFFileTypeByDate";
import PDFFileTypeByQuarter from "./PDFFileTypeByQuarter";

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
    width: 35%;
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
    height: 40px;
    object-fit: cover;
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

const Modal = ({ showModal, setShowModal, type, tableBookingOrder, tableBookingOrderAddFood, setReRenderData, handleClose, showToastFromOut }) => {
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
    // CHI TIẾT ĐẶT BÀN
    const [tableBookingOrderModal, setTableBookingOrderModal] = useState();
    const [tableBookingOrderIdModal, setTableBookingOrderIdModal] = useState();
    const [tableBookingOrderDetailFoodListModal, setTableBookingOrderDetailFoodListModal] = useState([]);
    const [tableDetailListModal, setTableDetailListModal] = useState([]);

    const [isShowDetailTableBookingOrder, setIsShowDetailTableBookingOrder] = useState(false);
    useEffect(() => {
        // Lấy thông tin chi tiết của Đặt bàn
        const getTableBookingOrderById = async () => {
            try {
                const tableBookingOrderRes = await TableBookingOrderService.findTableBookingById({
                    tableBookingId: tableBookingOrder.table_booking_order_id
                });
                setTableBookingOrderModal(tableBookingOrderRes.data.data);
                setTableBookingOrderIdModal(tableBookingOrderRes.data.data.table_booking_order_id);
            } catch (err) {
                console.log("Lỗi lấy table booking order: ", err.response);
            }
        }
        // Lấy Món ăn của Đặt bàn
        const getTableDetails = async () => {
            try {
                const tableDetailsRes = await TableDetailService.findAllTableDetailByTableBookingOrderId(
                    tableBookingOrder.table_booking_order_id
                );
                setTableDetailListModal(tableDetailsRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy table detail list: ", err.response);
            }
        }
        if (tableBookingOrder) {
            getTableBookingOrderById();
            getTableDetails();
        }
    }, [tableBookingOrder, showModal]);

    // Check in
    const [tableBookingOrderIdentityCardModal, setTableBookingOrderIdentityCardModal] = useState();
    const [tableBookingOrderPhoneNumberModal, setTableBookingOrderPhoneNumberModal] = useState();
    const [tableBookingOrderEmailModal, setTableBookingOrderEmailModal] = useState();
    const [tableBookingOrderNationModal, setTableBookingOrderNationModal] = useState();
    const [tableBookingOrderAddressModal, setTableBookingOrderAddressModal] = useState();
    const [tableBookingOrderFirstNameModal, setTableBookingOrderFirstNameModal] = useState();
    const [tableBookingOrderLastNameModal, setTableBookingOrderLastNameModal] = useState();

    // TỈNH - HUYỆN - XÃ
    const [tableBookingOrderCityIdModal, setTableBookingOrderCityIdModal] = useState("");
    const [tableBookingOrderDistrictIdModal, setTableBookingOrderDistrictIdModal] = useState("");
    const [tableBookingOrderWardIdModal, setTableBookingOrderWardIdModal] = useState("");

    const [tableBookingOrderCityListModal, setTableBookingOrderCityListModal] = useState([]);
    const [tableBookingOrderDistrictListModal, setTableBookingOrderDistrictListModal] = useState([]);
    const [tableBookingOrderWardListModal, setTableBookingOrderWardListModal] = useState([]);

    useEffect(() => {
        const getCityList = async () => {
            const cityRes = await CityService.getAllCitys();
            setTableBookingOrderCityListModal(cityRes.data.data);
            console.log("Tỉnh TPUpdate [res]: ", tableBookingOrderCityListModal);
        }
        getCityList();

        setTableBookingOrderDistrictListModal([]);
        setTableBookingOrderWardListModal([]);

        setTableBookingOrderWardIdModal('');
        setTableBookingOrderCityIdModal('');
        setTableBookingOrderDistrictIdModal('');
    }, [showModal])

    useEffect(() => {
        const getDistrictList = async () => {
            const districtRes = await DistrictService.getAllDistrictsByCityId(tableBookingOrderCityIdModal)
            setTableBookingOrderDistrictListModal(districtRes.data.data);
            console.log("Quận huyện Update [res]: ", tableBookingOrderDistrictListModal);
        }
        getDistrictList();
    }, [tableBookingOrderCityIdModal])

    useEffect(() => {
        const getWardList = async () => {
            const wardRes = await WardService.getAllWardByDistrictId(tableBookingOrderDistrictIdModal)
            setTableBookingOrderWardListModal(wardRes.data.data);
            console.log("Xã phường Update res: ", tableBookingOrderWardListModal);
        }
        getWardList();
    }, [tableBookingOrderDistrictIdModal])

    const handleChangeIdentityCard = (e) => {
        const resultKey = e.target.value.replace(/[^0-9 ]/gi, '');
        setTableBookingOrderIdentityCardModal(resultKey);
    }
    const handleChangePhoneNumber = (e) => {
        const resultKey = e.target.value.replace(/[^0-9 ]/gi, '');
        setTableBookingOrderPhoneNumberModal(resultKey);
    }
    const handleChangeEmail = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultEmail = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setTableBookingOrderEmailModal(resultEmail);
    }
    const handleChangeNation = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultNation = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setTableBookingOrderNationModal(resultNation);
    }
    const handleChangeAddress = (e) => {
        setTableBookingOrderAddressModal(e.target.value);
    }
    const handleChangeFirstName = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultFirstName = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setTableBookingOrderFirstNameModal(resultFirstName);
    }
    const handleChangeLastName = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultLastName = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setTableBookingOrderLastNameModal(resultLastName);
    }

    const handleCheckin = async (
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhoneNumber,
        tableBookingOrderIdentityCard,
        tableBookingOrderNation,
        tableBookingOrderAddress,
        tableBookingOrderWardId,
        tableBookingOrderId
    ) => {
        try {
            const checkInRes = await TableBookingOrderService.checkIn({
                customerFirstName: customerFirstName,
                customerLastName: customerLastName,
                customerEmail: customerEmail,
                customerPhoneNumber: customerPhoneNumber,
                tableBookingOrderIdentityCard: tableBookingOrderIdentityCard,
                tableBookingOrderNation: tableBookingOrderNation,
                tableBookingOrderAddress: tableBookingOrderAddress,
                tableBookingOrderWardId: tableBookingOrderWardId,
                tableBookingOrderId: tableBookingOrderId
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

    const handleCheckout = async (tableBookingOrderId) => {
        try {
            const checkOutRes = await TableBookingOrderService.checkOut({
                tableBookingOrderId: tableBookingOrderId
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
    const [tableBookingOrderAddFoodModal, setTableBookingOrderAddFoodModal] = useState();
    const [tableBookingOrderIdModalAddFood, setTableBookingOrderIdModalAddFood] = useState();
    const [foodTypeIdModalAddFood, setFoodTypeIdModalAddFood] = useState();
    const [isUpdateAddFoodModal, setIsUpdateAddFoodModal] = useState();
    const [tableDetailListAddFood, setTableDetailListAddFood] = useState([]);
    const [foodListAddFood, setFoodListAddFood] = useState([]);
    // Lấy Loại Món ăn Đặt bàn
    const [foodTypeList, setFoodTypeList] = useState([]);
    useEffect(() => {
        const getFoodTypes = async () => {
            try {
                const foodTypeRes = await FoodTypeService.getAllFoodTypes();
                setFoodTypeList(foodTypeRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy food type: ", err.response);
            }
        }
        getFoodTypes();
    }, []);

    useEffect(() => {
        // Lấy thông tin Đặt bàn cần thêm Món ăn
        const getTableBookingOrderWhenAddFood = async () => {
            try {
                const tableBookingOrderRes = await TableBookingOrderService.findTableBookingById({
                    tableBookingId: tableBookingOrderAddFood.table_booking_order_id
                });
                setTableBookingOrderAddFoodModal(tableBookingOrderRes.data.data);
                setTableBookingOrderIdModalAddFood(tableBookingOrderRes.data.data.table_booking_order_id);
            } catch (err) {
                console.log("Lỗi lấy table booking order modal add food: ", err.response);
            }
        }
        // Lấy Món ăn dựa vào foodTypeId
        const getFoodByfoodTypeId = async () => {
            // Reset lại check box chọn Món ăn khi thay đổi Loại Món ăn
            setFoodChooseList([]);
            try {
                const foodListRes = await FoodService.getFoodByFoodTypeId({
                    foodTypeId: foodTypeIdModalAddFood
                });
                // Thêm số lượng tăng giảm cho từng service
                var arrayAfterAddQuantity = [];
                for (var i = 0; i < foodListRes.data.data.length; i++) {
                    var food = foodListRes.data.data[i];
                    arrayAfterAddQuantity.push({
                        ...food,
                        foodChooseQuantity: 1
                    });
                }
                setFoodListAddFood(arrayAfterAddQuantity);
            } catch (err) {
                console.log("ERR getFoodByfoodTypeId: ", err);
            }
        };
        // Lấy những Chi tiết Món ăn của Đặt bàn
        const getAllTableDetailByTableBookingId = async () => {
            try {
                const tableDetailRes = await TableDetailService.findAllTableDetailByTableBookingOrderId(tableBookingOrderAddFood.table_booking_order_id);
                setTableDetailListAddFood(tableDetailRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        if (tableBookingOrderAddFood && !foodTypeIdModalAddFood) {
            getTableBookingOrderWhenAddFood();
            getAllTableDetailByTableBookingId();
        }
        if (tableBookingOrderAddFood && foodTypeIdModalAddFood) {
            getTableBookingOrderWhenAddFood();
            getAllTableDetailByTableBookingId();
            getFoodByfoodTypeId();
        }
    }, [tableBookingOrderAddFood, showModal, foodTypeIdModalAddFood, isUpdateAddFoodModal]);

    // Create table list check box
    const [foodChooseList, setFoodChooseList] = useState([]);
    const handleCheckfood = (e, food) => {

        console.log("handleCheckfood food: ", food)
        var filteredArray = [...foodChooseList];
        if (e.currentTarget.checked) {
            if (filteredArray.filter((prev) => prev.food_id === food.food_id).length === 0) {
                filteredArray.push(food);
                setFoodChooseList(filteredArray);
            }
        } else {
            if (filteredArray.filter((prev) => prev.food_id === food.food_id).length > 0) {
                let index = filteredArray.indexOf(food);
                filteredArray.splice(index, 1);
                setFoodChooseList(filteredArray);
            }
        }
    };
    const handleCreateTableDetail = async (e, foodList, tableBookingOrderId) => {
        console.log("e, foodList, tableBookingOrderId: ", e, foodList, tableBookingOrderId);
        e.preventDefault();
        try {
            const createTableDetailRes = await TableDetailService.createTableDetailByFoodListAndTableBookingOrderId({
                foodList: foodList,
                tableBookingOrderId: tableBookingOrderId
            });
            if (!createTableDetailRes) {
                // Toast
                const dataToast = { message: createTableDetailRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddFoodModal(prev => !prev);
            setReRenderData(prev => !prev);
            setFoodChooseList([]);   //Thêm thành công thì bỏ mảng chọn cũ

            // Toast
            const dataToast = { message: createTableDetailRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    const handleCancleCreateTableDetail = async (e, foodList) => {
        e.preventDefault();
        if (foodList.length === 0) {
            // Toast
            const dataToast = { message: "Bạn vẫn chưa chọn Món ăn Đặt bàn nào!", type: "warning" };
            showToastFromOut(dataToast);
            return;
        } else {
            setFoodChooseList([]);
            setIsUpdateAddFoodModal(prev => !prev);
            // Toast
            const dataToast = { message: "Hủy chọn thành công!", type: "success" };
            showToastFromOut(dataToast);
            return;
        }
    };

    const handleUpdateTableDetailQuantity = async (quantity, tableDetailId) => {
        try {
            const updateTableDetailQuantityRes = await TableDetailService.updateTableDetailQuantityByTableDetailId({
                tableDetailQuantity: quantity,
                tableDetailId: tableDetailId
            });
            if (!updateTableDetailQuantityRes) {
                // Toast
                const dataToast = { message: updateTableDetailQuantityRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddFoodModal(prev => !prev);
            setReRenderData(prev => !prev);

            // Toast
            const dataToast = { message: updateTableDetailQuantityRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // console.log("setTableBookingOrderAddFoodModal: ", tableBookingOrderAddFoodModal, foodListAddFood);
    // console.log("foodChooseList: ", foodChooseList);

    // --------------------------------------- Handle Statistic City ---------------------------------------
    const [statisticWay, setStatisticWay] = useState(); //byQuarter - byDate
    const [sortWay, setSortWay] = useState(); //byQuarter - byDate
    const [startDate, setStartDate] = useState(); //Date: YYYY/MM/DD
    const [finishDate, setFinishDate] = useState(); //Date: YYYY/MM/DD
    const [quarter, setQuarter] = useState(); //Quarter: 1, 2, 3, 4
    const [limit, setLimit] = useState(); //Quarter: 1, 2, 3, 4

    const [isShowChart, setIsShowChart] = useState(true);
    const [isShowTable, setIsShowTable] = useState(false);

    const handleShowChart = () => {
        setIsShowChart(true);
        setIsShowTable(false);
    }
    const handleHideChart = () => {
        setIsShowChart(false);
        setIsShowTable(true);
    }

    // -- Statistic way
    const handleCheckByQuarter = (e) => {
        const value = e.target.value;
        setStatisticWay(value);
    }
    const handleCheckByDate = (e) => {
        const value = e.target.value;
        setStatisticWay(value);
    }
    // --Sort way
    const handleCheckAsc = (e) => {
        const value = e.target.value;
        setSortWay(value);
    }
    const handleCheckDesc = (e) => {
        const value = e.target.value;
        setSortWay(value);
    }
    //  --Limit
    const handleCheckLimit = (e) => {
        const value = e.target.value;
        setLimit(value);
    }
    // -- By Date
    const handleChangeStartDate = (newValue) => {
        setStartDate(moment(newValue).format("YYYY/MM/DD"));
    };
    const handleChangeFinishDate = (newValue) => {
        setFinishDate(moment(newValue).format("YYYY/MM/DD"));
    };
    // -- By Quarter
    const handleChangeQuarter = (e) => {
        setQuarter(parseInt(e.target.value));
    };

    // ---------------------- STATE THỐNG KÊ DOANH THU TỪNG THÀNH PHỐ THEO 4 QUÝ ----------------------
    const [isTotalOfCityForEachQuarter, setIsTotalOfCityForEachQuarter] = useState(true);
    const [totalOfCityForEachQuarter, setTotalOfCityForEachQuarter] = useState();
    const [totalOfCityForEachQuarterData, setTotalOfCityForEachQuarterData] = useState([]);
    const [totalOfCityForEachQuarterDataTable, setTotalOfCityForEachQuarterDataTable] = useState([]);
    const [totalOfCityForEachQuarterPDFImage, setTotalOfCityForEachQuarterPDFImage] = useState();
    const statisticImageTotalForEachQuarterCity = useRef();
    // ---------------------- STATE THỐNG KÊ DOANH THU TỪNG THÀNH PHỐ THEO NGÀY ----------------------
    const [isTotalOfCityByDate, setIsTotalOfCityByDate] = useState(false);
    const [totalOfCityByDate, setTotalOfCityByDate] = useState();
    const [totalOfCityByDateData, setTotalOfCityByDateData] = useState([]);
    const [totalOfCityByDatePDFImage, setTotalOfCityByDatePDFImage] = useState();
    const [totalOfCityByDateDataTable, setTotalOfCityByDateDataTable] = useState([]);
    const totalOfCityByDateRef = useCallback(node => {
        console.log("ref-quarter", node);
        if (node !== null) {
            setTimeout(() => {
                setTotalOfCityByDatePDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChart, isTotalOfCityForEachQuarter, isTotalOfCityByDate]);
    // ---------------------- STATE THỐNG KÊ DOANH THU TỪNG THÀNH PHỐ THEO QUÝ ----------------------
    const totalOfCityByQuarterRef = useCallback(node => {
        console.log("ref-quarter", node);
        if (node !== null) {
            setTimeout(() => {
                setTotalOfCityByQuarterPDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChart, isTotalOfCityForEachQuarter, isTotalOfCityByDate]);
    const [isTotalOfCityByQuarter, setIsTotalOfCityByQuarter] = useState(false);
    const [totalOfCityByQuarter, setTotalOfCityByQuarter] = useState();
    const [totalOfCityByQuarterData, setTotalOfCityByQuarterData] = useState([]);
    const [totalOfCityByQuarterPDFImage, setTotalOfCityByQuarterPDFImage] = useState();
    const [totalOfCityByQuarterDataTable, setTotalOfCityByQuarterDataTable] = useState([]);

    useEffect(() => {
        const getLimitTableBookingTotalOfCityForEachQuarter = async () => {
            try {
                const tableBookingTotalOfCityForEachQuarterRes = await TableBookingOrderService.getLimitTableBookingTotalOfCityForEachQuarter();
                console.log("tableBookingTotalOfCityForEachQuarterRessssssssssssssssss: ", tableBookingTotalOfCityForEachQuarterRes.data.data);
                setTotalOfCityForEachQuarter(tableBookingTotalOfCityForEachQuarterRes.data.data);

                // Lấy data để hiện ở Biểu đồ
                var arrayInStatistic = [];
                if (tableBookingTotalOfCityForEachQuarterRes.data.data.data.length > 0) {
                    tableBookingTotalOfCityForEachQuarterRes.data.data.data.map((row, key) => {
                        arrayInStatistic.push({
                            data: [row.quy1, row.quy2, row.quy3, row.quy4],
                            label: row.city_name,
                            borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                            backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                            borderWidth: 1,
                            fill: false
                        });
                    })
                    setTotalOfCityForEachQuarterData(arrayInStatistic);
                }

                // Lấy data để hiện ở Bảng - Danh sách này sắp xếp theo thứ tự giảm doanh thu của tp đó
                var arrayInTable = [];
                for (var i = 0; i < tableBookingTotalOfCityForEachQuarterRes.data.data.dataArray.length; i++) {
                    const tableBookingInCity = tableBookingTotalOfCityForEachQuarterRes.data.data.dataArray[i];
                    for (var j = 0; j < tableBookingInCity.data.length; j++) {
                        arrayInTable.push(tableBookingInCity.data[j]);
                    }
                }
                setTotalOfCityForEachQuarterDataTable(arrayInTable);
            } catch (err) {
                console.log("Lỗi khi lấy doanh thu các thành phố theo quý: ", err.response);
            }
        }
        getLimitTableBookingTotalOfCityForEachQuarter().then(() => {
            if (statisticImageTotalForEachQuarterCity.current) {
                setTimeout(() => {
                    setTotalOfCityForEachQuarterPDFImage(statisticImageTotalForEachQuarterCity.current.canvas.toDataURL('image/png', 1));
                }, 3000);
            }
        });;
        setIsTotalOfCityForEachQuarter(true);
        setIsTotalOfCityByDate(false);
        setIsTotalOfCityByQuarter(false);
    }, [showModal]);

    const handleStatisticOfCity = async (e, statisticWay, startDate, finishDate, quarter, sortWay, limit) => {
        e.preventDefault();
        if (!statisticWay) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn Loại thống kê", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        setIsTotalOfCityForEachQuarter(false);
        setIsTotalOfCityByDate(false);
        setIsTotalOfCityByQuarter(false);
        console.log("handleStatisticOfCity input: ", statisticWay, startDate, finishDate, quarter, sortWay, limit)
        if (statisticWay === "byDate") {
            try {
                const statisticRes = await TableBookingOrderService.getStatisticTableBookingTotalOfCityByDate({
                    dateFrom: startDate,
                    dateTo: finishDate,
                    sortWay: sortWay,
                    limit: limit
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsTotalOfCityByDate(true);
                setTotalOfCityByDate(statisticRes.data.data);

                // Lấy data để hiện ở Biểu đồ
                var arrayInStatistic = [];
                if (statisticRes.data.data.statistisData.length > 0) {
                    for (var i = 0; i < statisticRes.data.data.statistisData.length; i++) {
                        var rowValue = statisticRes.data.data.statistisData[i];
                        var rowOfCity = [];
                        for (var j = 0; j < statisticRes.data.data.dateArray.length; j++) {
                            rowOfCity.push(rowValue["date" + (j + 1)]);
                        }
                        arrayInStatistic.push({
                            data: rowOfCity,
                            label: rowValue.city_name,
                            borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                            backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                            borderWidth: 1,
                            fill: false
                        });
                    }
                    setTotalOfCityByDateData(arrayInStatistic);
                }

                console.log("statisticRes of City Date: ", statisticRes);

                // Lấy data để hiện ở Bảng - Danh sách này sắp xếp theo thứ tự giảm doanh thu của tp đó
                var arrayInTable = [];
                for (var i = 0; i < statisticRes.data.data.data.length; i++) {
                    const tableBookingOrderInThisDateList = statisticRes.data.data.data[i].tableBookingOrderDetailList;
                    for (var j = 0; j < tableBookingOrderInThisDateList.length; j++) {
                        arrayInTable.push(tableBookingOrderInThisDateList[j]);
                    }
                }
                setTotalOfCityByDateDataTable(arrayInTable);
                // Toast
                const dataToast = { message: statisticRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                setIsTotalOfCityForEachQuarter(true);
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        } else if (statisticWay === "byQuarter") {
            try {
                const statisticRes = await TableBookingOrderService.getStatisticTableBookingTotalOfCityByQuarter({
                    quarter: quarter,
                    sortWay: sortWay,
                    limit: limit
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsTotalOfCityByQuarter(true);
                setTotalOfCityByQuarter(statisticRes.data.data);

                // Lấy data để hiện ở Biểu đồ
                var arrayInStatistic = [];
                if (statisticRes.data.data.data.length > 0) {
                    statisticRes.data.data.data.map((row, key) => {
                        arrayInStatistic.push({
                            data: [row.monthFirst, row.monthSecond, row.monthThird],
                            label: row.city_name,
                            borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                            backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                            borderWidth: 1,
                            fill: false
                        });
                    })
                    setTotalOfCityByQuarterData(arrayInStatistic);
                }
                console.log("statisticRes of city Quarter: ", statisticRes);

                // Lấy data để hiện ở Bảng 
                setTotalOfCityByQuarterDataTable(statisticRes.data.data.tableBookingOrderDetailList);

                // Toast
                const dataToast = { message: statisticRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                setIsTotalOfCityForEachQuarter(true);
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
    }

    // Xuất ra file EXCEL
    const handleExportExcelCity = () => {
        var dataExport = [];
        if (isTotalOfCityByQuarter) {
            // Khi đang thống kê theo Quý
            dataExport = totalOfCityByQuarter.data;
            const quarter = totalOfCityByQuarter.quarter;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id']
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Tên thành phố", "Tháng đầu quý " + quarter, "Tháng giữa quý " + quarter, "Tháng cuối quý " + quarter, "Cả năm"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuCuaThanhPhoTheoQuy.xlsx");
        } else if (isTotalOfCityByDate) {
            // Khi đang thống kê theo NGÀY
            var titleExport = [];
            titleExport.push("Tên thành phố");
            for (var i = 0; i < totalOfCityByDate.dateArray.length; i++) {
                titleExport.push(totalOfCityByDate.dateArray[i]);
            }
            titleExport.push("Doanh thu cả năm");

            dataExport = totalOfCityByDate.statistisData;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id']
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [titleExport], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuCuaThanhPhoTheoNgay.xlsx");
        } else {
            // Thống kê mặc định 4 Quý
            dataExport = totalOfCityForEachQuarter.data;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id']
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Tên thành phố", "Quý 1", "Quý 2", "Quý 3", "Quý 4", "Cả năm"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuThanhPhoTheoTungQuy.xlsx");
        }

    }
    // Xuất ra file EXCEL Chi tiết
    const handleExportExcelDetailCity = () => {
        var dataExport = [];
        if (isTotalOfCityByQuarter) {
            // Thống kê theo Quý
            dataExport = totalOfCityByQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuThanhPhoTheoTungQuyChiTiet.xlsx");
        } else if (isTotalOfCityByDate) {
            // Thống kê theo Ngày
            dataExport = totalOfCityByDateDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuThanhPhoTheoTungNgayChiTiet.xlsx");
        } else {
            // Thống kê mặc định 4 Quý
            dataExport = totalOfCityForEachQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuThanhPhoTheoTungQuyChiTiet.xlsx");
        }
    }

    console.log("totalOfCityForEachQuarterDataTable: olala", totalOfCityForEachQuarterDataTable);
    // --------------------------------------- Handle Statistic Total ---------------------------------------
    const [statisticWayTotal, setStatisticWayTotal] = useState(); //byQuarter - byDate
    const [sortWayTotal, setSortWayTotal] = useState(); //byQuarter - byDate
    const [startDateTotal, setStartDateTotal] = useState(); //Date: YYYY-MM-DD
    const [finishDateTotal, setFinishDateTotal] = useState(); //Date: YYYY-MM-DD
    const [quarterTotal, setQuarterTotal] = useState(); //Quarter: 1, 2, 3, 4

    const [isShowChartTotal, setIsShowChartTotal] = useState(true);
    const [isShowTableTotal, setIsShowTableTotal] = useState(false);

    // State thống kê mặc định
    const [totalForEachMonthObject, setTotalForEachMonthObject] = useState([]);
    const [totalForEachMonthPDFImage, setTotalForEachMonthPDFImage] = useState();
    const [totalForEachMonthUpdateDate, setTotalForEachMonthUpdateDate] = useState();
    const [isTotalForEachMonth, setIsTotalForEachMonth] = useState(true);
    const [totalForEachMonthDataTable, setTotalForEachMonthDataTable] = useState([]);

    // State khi thống kê theo ngày
    const [isStatisticTableBookingOrderTotalByDate, setIsStatisticTableBookingOrderTotalByDate] = useState(false);
    const [statisticTableBookingOrderTotalByDate, setStatisticTableBookingOrderTotalByDate] = useState();
    const [statisticByDatePDFImage, setStatisticByDatePDFImage] = useState();
    const [statisticByDateDataTable, setStatisticByDateDataTable] = useState([]);
    // State khi thống kê theo Quý
    const [isStatisticTableBookingOrderTotalByQuarter, setIsStatisticTableBookingOrderTotalByQuarter] = useState(false);
    const [statisticTableBookingOrderTotalByQuarter, setStatisticTableBookingOrderTotalByQuarter] = useState();
    const [statisticByQuarterPDFImage, setStatisticByQuarterPDFImage] = useState();
    const [statisticByQuarterDataTable, setStatisticByQuarterDataTable] = useState([]);

    const statisticImageTotalForEachMonth = useRef();
    const statisticImageByQuarter = useCallback(node => {
        console.log("ref-quarter", node);
        if (node !== null) {
            setTimeout(() => {
                setStatisticByQuarterPDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChartTotal, isStatisticTableBookingOrderTotalByDate, isStatisticTableBookingOrderTotalByQuarter]);
    const statisticImageByDate = useCallback(node => {
        if (node !== null) {
            setTimeout(() => {
                setStatisticByDatePDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChartTotal, isStatisticTableBookingOrderTotalByDate, isStatisticTableBookingOrderTotalByQuarter]);

    useEffect(() => {
        const getStatisticTableBookingForEachQuarterByYear = async () => {
            var now = new window.Date();
            try {
                const statisticTableBookingForEachQuarterByYearRes = await StatisticService.getStatisticTableBookingForEachQuarterByYear({
                    year: now.getFullYear()
                });
                console.log("statisticTableBookingForEachQuarterByYearRes: ", statisticTableBookingForEachQuarterByYearRes);
                setTotalForEachMonthObject(statisticTableBookingForEachQuarterByYearRes.data.data);
                setTotalForEachMonthUpdateDate(statisticTableBookingForEachQuarterByYearRes.data.statisticDate);
                setTotalForEachMonthDataTable(statisticTableBookingForEachQuarterByYearRes.data.tableBookingOrderList);
            } catch (err) {
                console.log("Lỗi khi lấy doanh thu theo quý: ", err.response);
            }
        }
        getStatisticTableBookingForEachQuarterByYear().then(() => {
            if (statisticImageTotalForEachMonth.current) {
                setTimeout(() => {
                    setTotalForEachMonthPDFImage(statisticImageTotalForEachMonth.current.canvas.toDataURL('image/png', 1));
                }, 3000);
            }
        });
        // Reset state
        setIsTotalForEachMonth(true);
        setIsStatisticTableBookingOrderTotalByDate(false);
        setIsStatisticTableBookingOrderTotalByQuarter(false);
        setStatisticWayTotal();
        setSortWayTotal();
        setStartDateTotal();
        setFinishDateTotal();
        setQuarterTotal();
    }, [showModal]);

    const handleShowChartTotal = () => {
        setIsShowChartTotal(true);
        setIsShowTableTotal(false);
    }
    const handleHideChartTotal = () => {
        setIsShowChartTotal(false);
        setIsShowTableTotal(true);
    }

    // -- Statistic way
    const handleCheckByQuarterTotal = (e) => {
        const value = e.target.value;
        setStatisticWayTotal(value);
    }
    const handleCheckByDateTotal = (e) => {
        const value = e.target.value;
        setStatisticWayTotal(value);
    }
    // --Sort way
    const handleCheckAscTotal = (e) => {
        const value = e.target.value;
        setSortWayTotal(value);
    }
    const handleCheckDescTotal = (e) => {
        const value = e.target.value;
        setSortWayTotal(value);
    }
    // -- By Date
    const handleChangeStartDateTotal = (newValue) => {
        setStartDateTotal(moment(newValue).format("YYYY-MM-DD"));
    };
    const handleChangeFinishDateTotal = (newValue) => {
        setFinishDateTotal(moment(newValue).format("YYYY-MM-DD"));
    };
    // -- By Quarter
    const handleChangeQuarterTotal = (e) => {
        setQuarterTotal(parseInt(e.target.value));
    };

    const handleStatistic = async (e, statisticWayTotal, startDateTotal, finishDateTotal, quarterTotal, sortWayTotal) => {
        e.preventDefault();
        if (!statisticWayTotal) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn Loại thống kê", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        setIsTotalForEachMonth(false);
        setIsStatisticTableBookingOrderTotalByDate(false);
        setIsStatisticTableBookingOrderTotalByQuarter(false);
        console.log("handleStatistic input: ", statisticWayTotal, startDateTotal, finishDateTotal, sortWayTotal)
        if (statisticWayTotal === "byDate") {
            try {
                const statisticRes = await TableBookingOrderService.getStatisticTableBookingTotalByDate({
                    dateFrom: startDateTotal,
                    dateTo: finishDateTotal,
                    sortWay: sortWayTotal
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsStatisticTableBookingOrderTotalByDate(true);
                setStatisticTableBookingOrderTotalByDate(statisticRes.data.data);
                setStatisticByDateDataTable(statisticRes.data.data.tableBookingOrderList);

                console.log("statisticRes: ", statisticRes);
                // Toast
                const dataToast = { message: statisticRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                setIsTotalForEachMonth(true);
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        } else if (statisticWayTotal === "byQuarter") {
            try {
                const statisticRes = await TableBookingOrderService.getStatisticTableBookingTotalByQuarter({
                    quarter: quarterTotal,
                    sortWay: sortWayTotal
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsStatisticTableBookingOrderTotalByQuarter(true);
                setStatisticTableBookingOrderTotalByQuarter(statisticRes.data.data);
                setStatisticByQuarterDataTable(statisticRes.data.data.tableBookingOrderList);

                console.log("statisticRes: ", statisticRes);
                // Toast
                const dataToast = { message: statisticRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                setIsTotalForEachMonth(true);
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
    }

    // Xuất ra file EXCEL
    const handleExportExcel = () => {
        var dataExport = [];
        if (isStatisticTableBookingOrderTotalByDate) {
            // Khi đang thống kê theo NGÀY
            dataExport = statisticTableBookingOrderTotalByDate.data;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày", "Doanh thu"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoNgay.xlsx");
        } else if (isStatisticTableBookingOrderTotalByQuarter) {
            // Khi đang thống kê theo QUÝ
            dataExport = statisticTableBookingOrderTotalByQuarter.data;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Tháng", "Doanh thu"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungThangCuaQuy.xlsx");
        } else {
            // Thống kê mặc định 4 Quý
            dataExport = totalForEachMonthObject.data;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet([dataExport]);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Quý 1", "Quý 2", "Quý 3", "Quý 4", "Cả năm"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungQuy.xlsx");
        }
    }
    // Xuất ra file EXCEL - Chi tiết
    const handleExportExcelDetail = () => {
        var dataExport = [];
        if (isStatisticTableBookingOrderTotalByDate) {
            // Thống kê theo Ngày
            dataExport = statisticByDateDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungNgayChiTiet.xlsx");
        } else if (isStatisticTableBookingOrderTotalByQuarter) {
            // Thống kê theo Quý
            dataExport = statisticByQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungQuyChiTiet.xlsx");
        } else {
            // Thống kê mặc định 4 Quý
            dataExport = totalForEachMonthDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungQuyChiTiet.xlsx");
        }
    }
    // console.log("statisticByDatePDFImage, statisticByQuarterPDFImage:", statisticByDatePDFImage, statisticByQuarterPDFImage);
    // console.log("statisticTableBookingOrderTotalByDate:", statisticTableBookingOrderTotalByDate, statisticTableBookingOrderTotalByQuarter);


    // ================ Thống kê doanh thu theo Loại bàn ================
    const [statisticWayType, setStatisticWayType] = useState(); //byQuarter - byDate
    const [sortWayType, setSortWayType] = useState(); //byQuarter - byDate
    const [startDateType, setStartDateType] = useState(); //Date: YYYY-MM-DD
    const [finishDateType, setFinishDateType] = useState(); //Date: YYYY-MM-DD
    const [quarterType, setQuarterType] = useState(); //Quarter: 1, 2, 3, 4
    const [tableTypeList, setTableTypeList] = useState([]);

    const [isShowChartType, setIsShowChartType] = useState(true);
    const [isShowTableType, setIsShowTableType] = useState(false);

    // State khi thống kê theo ngày
    const [isStatisticTableBookingOrderTypeByDate, setIsStatisticTableBookingOrderTypeByDate] = useState(false);
    const [statisticTableBookingOrderTypeByDate, setStatisticTableBookingOrderTypeByDate] = useState();
    const [statisticTypeByDatePDFImage, setStatisticTypeByDatePDFImage] = useState();
    const [statisticTypeByDateDataTable, setStatisticTypeByDateDataTable] = useState([]);
    const [statisticTypeByDateDataChart, setStatisticTypeByDateDataChart] = useState([]);
    // State khi thống kê theo Quý
    const [isStatisticTableBookingOrderTypeByQuarter, setIsStatisticTableBookingOrderTypeByQuarter] = useState(false);
    const [statisticTableBookingOrderTypeByQuarter, setStatisticTableBookingOrderTypeByQuarter] = useState();
    const [statisticTypeByQuarterPDFImage, setStatisticTypeByQuarterPDFImage] = useState();
    const [statisticTypeByQuarterDataTable, setStatisticTypeByQuarterDataTable] = useState([]);
    const [statisticTypeByQuarterDataChart, setStatisticTypeByQuarterDataChart] = useState([]);

    const statisticTypeImageByQuarter = useCallback(node => {
        if (node !== null) {
            setTimeout(() => {
                setStatisticTypeByQuarterPDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChartType, isStatisticTableBookingOrderTypeByDate, isStatisticTableBookingOrderTypeByQuarter]);
    const statisticTypeImageByDate = useCallback(node => {
        if (node !== null) {
            setTimeout(() => {
                setStatisticTypeByDatePDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChartType, isStatisticTableBookingOrderTypeByDate, isStatisticTableBookingOrderTypeByQuarter]);

    useEffect(() => {
        const getTableTypeList = async () => {
            const tableTypeRes = await TableTypeService.findAllTableTypeInTableBookingOrder()
            setTableTypeList(tableTypeRes.data.data);
        }
        getTableTypeList();
        // Reset state
        setIsStatisticTableBookingOrderTypeByDate(false);
        setIsStatisticTableBookingOrderTypeByQuarter(false);
        setTableTypeChooseList([]);
        setStatisticWayType();
        setSortWayType();
        setStartDateType();
        setFinishDateType();
        setQuarterType();
    }, [showModal]);

    const handleShowChartType = () => {
        setIsShowChartType(true);
        setIsShowTableType(false);
    }
    const handleHideChartType = () => {
        setIsShowChartType(false);
        setIsShowTableType(true);
    }

    // -- Statistic way
    const handleCheckByQuarterType = (e) => {
        const value = e.target.value;
        setStatisticWayType(value);
    }
    const handleCheckByDateType = (e) => {
        const value = e.target.value;
        setStatisticWayType(value);
    }
    // --Sort way
    const handleCheckAscType = (e) => {
        const value = e.target.value;
        setSortWayType(value);
    }
    const handleCheckDescType = (e) => {
        const value = e.target.value;
        setSortWayType(value);
    }
    // -- By Date
    const handleChangeStartDateType = (newValue) => {
        setStartDateType(moment(newValue).format("YYYY-MM-DD"));
    };
    const handleChangeFinishDateType = (newValue) => {
        setFinishDateType(moment(newValue).format("YYYY-MM-DD"));
    };
    // -- By Quarter
    const handleChangeQuarterType = (e) => {
        setQuarterType(parseInt(e.target.value));
    };

    // Chip
    const theme = useTheme();
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    function getStyles(name, tableTypeChooseList, theme) {
        return {
            fontWeight:
                tableTypeChooseList.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }
    const [tableTypeChooseList, setTableTypeChooseList] = useState([]);
    const handleChangeTableType = (event) => {
        const {
            target: { value },
        } = event;
        setTableTypeChooseList(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    console.log("tableTypeChooseList: ", tableTypeChooseList)
    const handleStatisticOfType = async (e, statisticWayType, startDateType, finishDateType, quarterType, sortWayType, tableTypeChooseList) => {
        e.preventDefault();
        if (!statisticWayType) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn Loại thống kê", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        setIsStatisticTableBookingOrderTypeByDate(false);
        setIsStatisticTableBookingOrderTypeByQuarter(false);
        console.log("handleStatistic input: ", statisticWayType, startDateType, finishDateType, sortWayType)
        if (statisticWayType === "byDate") {
            try {
                const statisticRes = await TableBookingOrderService.getStatisticTableBookingTotalOfTypeByDate({
                    dateFrom: startDateType,
                    dateTo: finishDateType,
                    sortWay: sortWayType,
                    tableTypeList: tableTypeChooseList
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsStatisticTableBookingOrderTypeByDate(true);
                setStatisticTableBookingOrderTypeByDate(statisticRes.data.data);
                setStatisticTypeByDateDataTable(statisticRes.data.data.finalTableBookingOrderList);

                // Lấy data để hiện ở Biểu đồ
                var arrayInStatistic = [];
                if (statisticRes.data.data.statisticArray.length > 0) {
                    for (var i = 0; i < statisticRes.data.data.statisticArray.length; i++) {
                        var rowValue = statisticRes.data.data.statisticArray[i];
                        var rowOfType = [];
                        for (var j = 0; j < statisticRes.data.data.dateArray.length; j++) {
                            rowOfType.push(rowValue["date" + (j + 1)]);
                        }
                        arrayInStatistic.push({
                            data: rowOfType,
                            label: rowValue.table_type_name,
                            borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                            backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                            borderWidth: 1,
                            fill: false
                        });
                    }
                }
                setStatisticTypeByDateDataChart(arrayInStatistic);

                console.log("statisticRes: ", statisticRes);
                // Toast
                const dataToast = { message: statisticRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        } else if (statisticWayType === "byQuarter") {
            try {
                const statisticRes = await TableBookingOrderService.getStatisticTableBookingTotalOfTypeByQuarter({
                    quarter: quarterType,
                    sortWay: sortWayType,
                    tableTypeList: tableTypeChooseList
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsStatisticTableBookingOrderTypeByQuarter(true);
                setStatisticTableBookingOrderTypeByQuarter(statisticRes.data.data);

                // Lấy list detail room booking của các loại bàn
                var tableBookingOrderList = [];
                var arrayInStatistic = [];
                for (var i = 0; i < statisticRes.data.data.data.length; i++) {
                    const tableBookingOrderListRes = statisticRes.data.data.data[i].tableBookingOrderList;
                    tableBookingOrderListRes.map((tableBookingOrder, key) => {
                        tableBookingOrderList.push(tableBookingOrder);
                    });

                    // Lấy data để hiện ở Biểu đồ
                    const totalDataRes = statisticRes.data.data.data[i].totalData;
                    arrayInStatistic.push({
                        data: [totalDataRes.monthFirst, totalDataRes.monthSecond, totalDataRes.monthThird],
                        label: totalDataRes.table_type_name,
                        borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                        backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                        borderWidth: 1,
                        fill: false
                    });
                }
                setStatisticTypeByQuarterDataTable(tableBookingOrderList);
                setStatisticTypeByQuarterDataChart(arrayInStatistic);

                console.log("statisticRes: ", statisticRes);
                // Toast
                const dataToast = { message: statisticRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
    }

    // Xuất ra file EXCEL
    const handleExportExcelType = () => {
        var dataExport = [];
        if (isStatisticTableBookingOrderTypeByDate) {
            // Khi đang thống kê theo NGÀY
            var titleExport = [];
            titleExport.push("Tên Loại bàn");
            for (var i = 0; i < statisticTableBookingOrderTypeByDate.dateArray.length; i++) {
                titleExport.push(statisticTableBookingOrderTypeByDate.dateArray[i]);
            }
            titleExport.push("Doanh thu cả năm");

            dataExport = statisticTableBookingOrderTypeByDate.statisticArray;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [titleExport], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuLoaiBanTheoNgay.xlsx");
        } else if (isStatisticTableBookingOrderTypeByQuarter) {
            var quarter = statisticTableBookingOrderTypeByQuarter.quarter;
            // Khi đang thống kê theo QUÝ
            statisticTableBookingOrderTypeByQuarter.data.map((data, key) => {
                dataExport.push(data.totalData);
            })
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Tên Loại bàn", "Doanh thu đầu quý " + quarter, "Doanh thu giữa quý " + quarter, "Doanh thu cuối quý " + quarter, "Doanh thu cả năm"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuLoaiBanTheoTungThangCuaQuy.xlsx");
        } else {
            return;
        }
    }

    // Xuất ra file EXCEL - Chi tiết
    const handleExportExcelDetailType = () => {
        var dataExport = [];
        if (isStatisticTableBookingOrderTypeByDate) {
            // Thống kê theo Ngày
            dataExport = statisticTypeByDateDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoLoaiBanTungNgayChiTiet.xlsx");
        } else if (isStatisticTableBookingOrderTypeByQuarter) {
            // Thống kê theo Quý
            dataExport = statisticTypeByQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoLoaiBanTungQuyChiTiet.xlsx");
        } else {
            return;
        }
    }


    // ================ Thống kê doanh thu theo Khách hàng ================
    const [statisticWayCustomer, setStatisticWayCustomer] = useState(); //byQuarter - byDate
    const [sortWayCustomer, setSortWayCustomer] = useState(); //byQuarter - byDate
    const [startDateCustomer, setStartDateCustomer] = useState(); //Date: YYYY-MM-DD
    const [finishDateCustomer, setFinishDateCustomer] = useState(); //Date: YYYY-MM-DD
    const [quarterCustomer, setQuarterCustomer] = useState(); //Quarter: 1, 2, 3, 4
    const [customerInfo, setCustomerInfo] = useState();

    const [isShowChartCustomer, setIsShowChartCustomer] = useState(true);
    const [isShowTableCustomer, setIsShowTableCustomer] = useState(false);

    // State khi thống kê theo ngày
    const [isStatisticTableBookingOrderCustomerByDate, setIsStatisticTableBookingOrderCustomerByDate] = useState(false);
    const [statisticTableBookingOrderCustomerByDate, setStatisticTableBookingOrderCustomerByDate] = useState();
    const [statisticCustomerByDatePDFImage, setStatisticCustomerByDatePDFImage] = useState();
    const [statisticCustomerByDateDataTable, setStatisticCustomerByDateDataTable] = useState([]);
    const [statisticCustomerByDateDataChart, setStatisticCustomerByDateDataChart] = useState([]);
    // State khi thống kê theo Quý
    const [isStatisticTableBookingOrderCustomerByQuarter, setIsStatisticTableBookingOrderCustomerByQuarter] = useState(false);
    const [statisticTableBookingOrderCustomerByQuarter, setStatisticTableBookingOrderCustomerByQuarter] = useState();
    const [statisticCustomerByQuarterPDFImage, setStatisticCustomerByQuarterPDFImage] = useState();
    const [statisticCustomerByQuarterDataTable, setStatisticCustomerByQuarterDataTable] = useState([]);
    const [statisticCustomerByQuarterDataChart, setStatisticCustomerByQuarterDataChart] = useState([]);

    const statisticCustomerImageByQuarter = useCallback(node => {
        if (node !== null) {
            setTimeout(() => {
                setStatisticCustomerByQuarterPDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChartCustomer, isStatisticTableBookingOrderCustomerByDate, isStatisticTableBookingOrderCustomerByQuarter]);
    const statisticCustomerImageByDate = useCallback(node => {
        if (node !== null) {
            setTimeout(() => {
                setStatisticCustomerByDatePDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChartCustomer, isStatisticTableBookingOrderCustomerByDate, isStatisticTableBookingOrderCustomerByQuarter]);

    useEffect(() => {
        // Reset state
        setIsStatisticTableBookingOrderCustomerByDate(false);
        setIsStatisticTableBookingOrderCustomerByQuarter(false);
        setCustomerInfo();
        setStatisticWayCustomer();
        setSortWayCustomer();
        setStartDateCustomer();
        setFinishDateCustomer();
        setQuarterCustomer();
    }, [showModal]);

    const handleShowChartCustomer = () => {
        setIsShowChartCustomer(true);
        setIsShowTableCustomer(false);
    }
    const handleHideChartCustomer = () => {
        setIsShowChartCustomer(false);
        setIsShowTableCustomer(true);
    }

    // -- Statistic way
    const handleCheckByQuarterCustomer = (e) => {
        const value = e.target.value;
        setStatisticWayCustomer(value);
    }
    const handleCheckByDateCustomer = (e) => {
        const value = e.target.value;
        setStatisticWayCustomer(value);
    }
    // --Sort way
    const handleCheckAscCustomer = (e) => {
        const value = e.target.value;
        setSortWayCustomer(value);
    }
    const handleCheckDescCustomer = (e) => {
        const value = e.target.value;
        setSortWayCustomer(value);
    }
    // -- By Date
    const handleChangeStartDateCustomer = (newValue) => {
        setStartDateCustomer(moment(newValue).format("YYYY-MM-DD"));
    };
    const handleChangeFinishDateCustomer = (newValue) => {
        setFinishDateCustomer(moment(newValue).format("YYYY-MM-DD"));
    };
    // -- By Quarter
    const handleChangeQuarterCustomer = (e) => {
        setQuarterCustomer(parseInt(e.target.value));
    };

    const handleChangeCustomerInfo = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultCustomerInfo = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setCustomerInfo(resultCustomerInfo);
    }

    const handleStatisticOfCustomer = async (e, statisticWayCustomer, startDateCustomer, finishDateCustomer, quarterCustomer, sortWayCustomer, customerInfo) => {
        e.preventDefault();
        if (!statisticWayCustomer) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn Loại thống kê", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        setIsStatisticTableBookingOrderCustomerByDate(false);
        setIsStatisticTableBookingOrderCustomerByQuarter(false);
        console.log("handleStatistic input: ", statisticWayCustomer, startDateCustomer, finishDateCustomer, sortWayCustomer)
        if (statisticWayCustomer === "byDate") {
            try {
                const statisticRes = await TableBookingOrderService.getStatisticTableBookingTotalOfCustomerByDate({
                    dateFrom: startDateCustomer,
                    dateTo: finishDateCustomer,
                    sortWay: sortWayCustomer,
                    customerInfo: customerInfo
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsStatisticTableBookingOrderCustomerByDate(true);
                setStatisticTableBookingOrderCustomerByDate(statisticRes.data.data);
                setStatisticCustomerByDateDataTable(statisticRes.data.data.finalTableBookingOrderList);

                // Lấy data để hiện ở Biểu đồ
                var arrayInStatistic = [];
                if (statisticRes.data.data.statisticArray) {
                    var rowValue = statisticRes.data.data.statisticArray;
                    var rowOfCustomer = [];
                    for (var j = 0; j < statisticRes.data.data.dateArray.length; j++) {
                        rowOfCustomer.push(rowValue["date" + (j + 1)]);
                    }
                    arrayInStatistic.push({
                        data: rowOfCustomer,
                        label: rowValue.customer_first_name + " " + rowValue.customer_last_name,
                        borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                        backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                        borderWidth: 1,
                        fill: false
                    });
                }
                setStatisticCustomerByDateDataChart(arrayInStatistic);

                console.log("statisticRes: ", statisticRes);
                // Toast
                const dataToast = { message: statisticRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        } else if (statisticWayCustomer === "byQuarter") {
            try {
                const statisticRes = await TableBookingOrderService.getStatisticTableBookingTotalOfCustomerByQuarter({
                    quarter: quarterCustomer,
                    sortWay: sortWayCustomer,
                    customerInfo: customerInfo
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsStatisticTableBookingOrderCustomerByQuarter(true);
                setStatisticTableBookingOrderCustomerByQuarter(statisticRes.data.data);

                // Lấy list detail room booking của các loại bàn
                var tableBookingOrderList = [];
                var arrayInStatistic = [];
                const tableBookingOrderListRes = statisticRes.data.data.data[0].tableBookingOrderList;
                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                    tableBookingOrderList.push(tableBookingOrder);
                });

                // Lấy data để hiện ở Biểu đồ
                const totalDataRes = statisticRes.data.data.data[0].totalData;
                arrayInStatistic.push({
                    data: [totalDataRes.monthFirst, totalDataRes.monthSecond, totalDataRes.monthThird],
                    label: totalDataRes.customer_first_name + " " + totalDataRes.customer_last_name,
                    borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    borderWidth: 1,
                    fill: false
                });

                setStatisticCustomerByQuarterDataTable(tableBookingOrderList);
                setStatisticCustomerByQuarterDataChart(arrayInStatistic);

                console.log("statisticRes: ", statisticRes);
                // Toast
                const dataToast = { message: statisticRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
    }

    // Xuất ra file EXCEL
    const handleExportExcelCustomer = () => {
        var dataExport = [];
        if (isStatisticTableBookingOrderCustomerByDate) {
            // Khi đang thống kê theo NGÀY
            var titleExport = [];
            titleExport.push("Họ khách hàng");
            titleExport.push("Tên khách hàng");
            titleExport.push("Email");
            titleExport.push("Số điện thoại");
            for (var i = 0; i < statisticTableBookingOrderCustomerByDate.dateArray.length; i++) {
                titleExport.push(statisticTableBookingOrderCustomerByDate.dateArray[i]);
            }
            titleExport.push("Doanh thu cả năm");

            var exportArray = [];
            exportArray.push(statisticTableBookingOrderCustomerByDate.statisticArray);
            dataExport = exportArray;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [titleExport], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuKhachHangTheoNgay.xlsx");
        } else if (isStatisticTableBookingOrderCustomerByQuarter) {
            var quarter = statisticTableBookingOrderCustomerByQuarter.quarter;
            // Khi đang thống kê theo QUÝ
            statisticTableBookingOrderCustomerByQuarter.data.map((data, key) => {
                dataExport.push(data.totalData);
            })
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Họ khách hàng", "Tên khách hàng", "Email", "Số điện thoại", "Doanh thu đầu quý " + quarter, "Doanh thu giữa quý " + quarter, "Doanh thu cuối quý " + quarter, "Doanh thu cả năm"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuKhachHangTheoTungThangCuaQuy.xlsx");
        } else {
            return;
        }
    }

    // Xuất ra file EXCEL - Chi tiết
    const handleExportExcelDetailCustomer = () => {
        var dataExport = [];
        if (isStatisticTableBookingOrderCustomerByDate) {
            // Thống kê theo Ngày
            dataExport = statisticCustomerByDateDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoKhachHangTungNgayChiTiet.xlsx");
        } else if (isStatisticTableBookingOrderCustomerByQuarter) {
            // Thống kê theo Quý
            dataExport = statisticCustomerByQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['customer_id'];
                    delete val['floor_id'];
                    delete val['table_booking_id'];
                    delete val['table_booking_order_book_date'];
                    delete val['table_booking_order_id'];
                    delete val['table_booking_order_state'];
                    delete val['table_booking_state'];
                    delete val['table_type_id'];
                    delete val['ward_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ngày đến", "Ngày kết thúc", "Số lượng khách", "Tổng tiền", "Ghi chú", "Ngày đặt bàn", "Số CMND", "Quốc tịch", "Địa chỉ", "Họ của Khách hàng", "Tên của Khách hàng", "Số điện thoại", "Email", "Tên xã phường", "Tên quận huyện", "Tên thành phố", "Tên bàn", "View bàn", "Thuộc tầng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoKhachHangTungQuyChiTiet.xlsx");
        } else {
            return;
        }
    }
    // ================================================================
    //  =============== Thêm Món ăn cho Đặt bàn ===============
    if (type === "addFoodToTable") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "90%" }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thêm Món ăn cho Đặt bàn - Nhà hàng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Thông tin Đặt bàn - Nhà hàng</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Thời gian: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{tableBookingOrderAddFoodModal ? "Vào ngày: " + tableBookingOrderAddFoodModal.table_booking_order_checkin_date : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{tableBookingOrderAddFoodModal ? tableBookingOrderAddFoodModal.table_booking_order_state === 2 ? "Hoàn thành lúc: " + tableBookingOrderAddFoodModal.table_booking_order_finish_date : tableBookingOrderAddFoodModal.table_booking_order_state === 1 ? "Đã checkin lúc: " + tableBookingOrderAddFoodModal.table_booking_order_start_date : tableBookingOrderAddFoodModal.table_booking_order_state === 0 ? "Đã đặt lúc: " + tableBookingOrderAddFoodModal.table_booking_order_book_date : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={"https://i.ibb.co/8m4nCKN/pexels-chan-walrus-941861.jpg"} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {tableBookingOrderAddFoodModal ? tableBookingOrderAddFoodModal.table_booking_name + " - " + tableBookingOrderAddFoodModal.table_type_name + ", " + tableBookingOrderAddFoodModal.floor_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{tableBookingOrderAddFoodModal ? format_money(tableBookingOrderAddFoodModal.table_booking_order_total) : null} VNĐ</span>
                                                        </Content>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItem2 className="row">
                                                <LeftVoteTitle>Những Món ăn hiện tại của Đặt bàn này</LeftVoteTitle>
                                                <DeviceList className="col-lg-12" style={{ minHeight: "260px", maxHeight: "260px" }}>
                                                    {
                                                        tableDetailListAddFood.length > 0
                                                            ?
                                                            tableDetailListAddFood.map((tableDetail, key) => {
                                                                return (
                                                                    <DeviceItem className="row">
                                                                        <DeviceIconContainer className="col-lg-3">
                                                                            <PriceDetail>
                                                                                <ProductAmountContainer>
                                                                                    <div onClick={() => handleUpdateTableDetailQuantity(1, tableDetail.table_detail_id)}>
                                                                                        <Add />
                                                                                    </div>
                                                                                    <ProductAmount>{tableDetail.table_detail_quantity}</ProductAmount>
                                                                                    <div onClick={() => handleUpdateTableDetailQuantity(-1, tableDetail.table_detail_id)}>
                                                                                        <Remove />
                                                                                    </div>
                                                                                </ProductAmountContainer>
                                                                            </PriceDetail>
                                                                        </DeviceIconContainer>
                                                                        <DeviceIconContainer className="col-lg-2">
                                                                            <DeviceIcon src={tableDetail.food_image} />
                                                                        </DeviceIconContainer>
                                                                        <div className="col-lg-7">
                                                                            <DeviceTitle className="row">
                                                                                <DeviceName style={{ marginLeft: "10px" }}>{tableDetail.food_name}</DeviceName>
                                                                            </DeviceTitle>
                                                                            <DeviceInfo className="row">
                                                                                <DeviceTime style={{ margin: "5px 10px 0px 10px" }}>Tổng tiền: <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>{format_money(tableDetail.table_detail_total)}đ</span></DeviceTime>
                                                                            </DeviceInfo>
                                                                        </div>
                                                                        <DeleteService onClick={() => handleUpdateTableDetailQuantity(0, tableDetail.table_detail_id)}>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Hiện tại Đặt bàn này chưa có Món ăn nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </DeviceList>
                                            </LeftVoteItem2>
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Những Món ăn hiện có của Nhà hàng</RightVoteTitle>

                                                <RightVoteTitle style={{ fontSize: "1rem", padding: "0" }} className="col-lg-12"><span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>Hãy chọn Món ăn bạn muốn thêm vào Đặt bàn này!</span></RightVoteTitle>
                                                <Box sx={{ minWidth: 120, width: "80%", margin: "10px auto" }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label"></InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={foodTypeIdModalAddFood}
                                                            label="Age"
                                                            sx={{
                                                                '& legend': { display: 'none' },
                                                                '& fieldset': { top: 0 }
                                                            }}
                                                            onChange={(e) => setFoodTypeIdModalAddFood(parseInt(e.target.value))}
                                                        >
                                                            {
                                                                foodTypeList.length > 0
                                                                    ?
                                                                    foodTypeList.map((foodType, key) => {
                                                                        return (
                                                                            <MenuItem value={foodType.food_type_id}>{foodType.food_type_name}</MenuItem>
                                                                        )
                                                                    }) : null
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                <Surcharge className="col-lg-12" style={{ height: "355px", maxHeight: "355px" }}>

                                                    {
                                                        foodListAddFood.length > 0
                                                            ?
                                                            foodListAddFood.map((food, key) => {
                                                                const handleRemove = (foodQuantityUpdate) => {
                                                                    var fileredArray = [...foodListAddFood];
                                                                    for (var i = 0; i < fileredArray.length; i++) {
                                                                        if (fileredArray[i].food_id === parseInt(food.food_id)) {
                                                                            if (foodQuantityUpdate === 1) {
                                                                                fileredArray[i].foodChooseQuantity += 1;
                                                                            }
                                                                            if (foodQuantityUpdate === -1) {
                                                                                if (fileredArray[i].foodChooseQuantity === 1) {
                                                                                    continue;
                                                                                }
                                                                                fileredArray[i].foodChooseQuantity -= 1;
                                                                            }
                                                                        }
                                                                    }
                                                                    setFoodListAddFood(prev => fileredArray);
                                                                }
                                                                return (
                                                                    <ServiceItem className="row">
                                                                        <div className="col-lg-2">
                                                                            <Checkbox checked={foodChooseList.filter(prev => prev.food_id === food.food_id).length > 0 ? true : false} onChange={(e) => handleCheckfood(e, food)} />
                                                                        </div>
                                                                        <ServiceIconContainer className="col-lg-3">
                                                                            <PriceDetail>
                                                                                <ProductAmountContainer>
                                                                                    <div onClick={() => handleRemove(1)}>
                                                                                        <Add />
                                                                                    </div>
                                                                                    <ProductAmount>{food.foodChooseQuantity}</ProductAmount>
                                                                                    <div onClick={() => handleRemove(-1)}>
                                                                                        <Remove />
                                                                                    </div>
                                                                                </ProductAmountContainer>
                                                                            </PriceDetail>
                                                                        </ServiceIconContainer>
                                                                        <DeviceIconContainer className="col-lg-2">
                                                                            <DeviceIcon src={food.food_image} />
                                                                        </DeviceIconContainer>
                                                                        <div className="col-lg-5">
                                                                            <ServiceTitle className="row">
                                                                                <ServiceName>{food.food_name}</ServiceName>
                                                                            </ServiceTitle>
                                                                            <ServiceInfo className="row">
                                                                                <ServiceTime style={{ margin: "5px 10px 0px 0px" }}>Tổng tiền: <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>{format_money(food.food_price * food.foodChooseQuantity)}đ</span></ServiceTime>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Không có Món ăn nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                                <FormChucNang style={{ marginTop: "20px" }}>
                                                    <SignInBtn
                                                        onClick={(e) => handleCreateTableDetail(e, foodChooseList, tableBookingOrderIdModalAddFood)}
                                                    >Thêm Món ăn</SignInBtn>
                                                    <SignUpBtn
                                                        onClick={(e) => handleCancleCreateTableDetail(e, foodChooseList)}
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
                            <H1>Checkin nhận Đặt bàn</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <FormSpan>Họ của khách hàng:</FormSpan>
                                            <FormInput style={{ width: "100%" }} type="text"
                                                value={tableBookingOrderFirstNameModal}
                                                placeholder="Họ của Khách hàng"
                                                onChange={(e) => handleChangeFirstName(e)}
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <FormSpan>Tên của khách hàng:</FormSpan>
                                            <FormInput style={{ width: "100%" }} type="text"
                                                value={tableBookingOrderLastNameModal}
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
                                        value={tableBookingOrderIdentityCardModal}
                                        onChange={(e) => handleChangeIdentityCard(e)} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <div className="row">
                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Quốc tịch:</FormSpan>
                                            <FormInput type="text"
                                                placeholder="Quốc tịch của Khách hàng"
                                                value={tableBookingOrderNationModal}
                                                onChange={(e) => handleChangeNation(e)}
                                            />
                                        </div>
                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Địa chỉ:</FormSpan>
                                            <FormInput type="text"
                                                placeholder="Địa chỉ của Khách hàng"
                                                value={tableBookingOrderAddressModal}
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
                                                        value={tableBookingOrderCityIdModal}
                                                        label="Age"
                                                        sx={{
                                                            '& legend': { display: 'none' },
                                                            '& fieldset': { top: 0 }
                                                        }}
                                                        onChange={(e) => setTableBookingOrderCityIdModal(e.target.value)}
                                                    >
                                                        <MenuItem value="">-- Chọn thành phố --</MenuItem>
                                                        {tableBookingOrderCityListModal.length > 0
                                                            ?
                                                            tableBookingOrderCityListModal.map((city, key) => {
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
                                                        value={tableBookingOrderDistrictIdModal}
                                                        label="Age"
                                                        sx={{
                                                            '& legend': { display: 'none' },
                                                            '& fieldset': { top: 0 }
                                                        }}
                                                        onChange={(e) => setTableBookingOrderDistrictIdModal(e.target.value)}
                                                    >
                                                        {
                                                            tableBookingOrderDistrictListModal.length > 0
                                                                ?
                                                                tableBookingOrderDistrictListModal.map((district, key) => {
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
                                                        value={tableBookingOrderWardIdModal}
                                                        label="Age"
                                                        sx={{
                                                            '& legend': { display: 'none' },
                                                            '& fieldset': { top: 0 }
                                                        }}
                                                        onChange={(e) => setTableBookingOrderWardIdModal(e.target.value)}
                                                    >    {
                                                            tableBookingOrderWardListModal.length > 0
                                                                ?
                                                                tableBookingOrderWardListModal.map((ward, key) => {
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
                                        value={tableBookingOrderEmailModal}
                                        onChange={(e) => handleChangeEmail(e)}
                                    />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Số điện thoại:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Số điện thoại đã đặt phòng"
                                        value={tableBookingOrderPhoneNumberModal}
                                        onChange={(e) => handleChangePhoneNumber(e)} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCheckin(
                                            tableBookingOrderFirstNameModal,
                                            tableBookingOrderLastNameModal,
                                            tableBookingOrderEmailModal,
                                            tableBookingOrderPhoneNumberModal,
                                            tableBookingOrderIdentityCardModal,
                                            tableBookingOrderNationModal,
                                            tableBookingOrderAddressModal,
                                            tableBookingOrderWardIdModal,
                                            tableBookingOrderIdModal
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
                                    <h1>Bạn muốn Check out <span style={{ color: `var(--color-primary)` }}>{tableBookingOrder ? tableBookingOrder.table_booking_name : null}</span> này?</h1>
                                    <p style={{ marginTop: "10px" }}>Đảm bảo Khách hàng đã thanh toán Phụ phí trước khi tiến hành Check out!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCheckout(tableBookingOrderIdModal)}
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
    if (type === "detailTableBookingOrder") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Chi tiết Đặt bàn</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <span>Thông tin Đặt bàn</span>
                                                    {
                                                        isShowDetailTableBookingOrder ?
                                                            <TooltipMui
                                                                title={"Ẩn chi tiết Đặt bàn"}
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
                                                                    onClick={() => setIsShowDetailTableBookingOrder(prev => !prev)}
                                                                    style={{ marginLeft: "20px", cursor: "pointer" }} />
                                                            </TooltipMui>
                                                            :
                                                            <TooltipMui
                                                                title={"Hiện chi tiết Đặt bàn"}
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
                                                                    onClick={() => setIsShowDetailTableBookingOrder(prev => !prev)}
                                                                    style={{ marginLeft: "20px", cursor: "pointer" }} />
                                                            </TooltipMui>
                                                    }
                                                </LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Thời gian: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">Vào ngày {tableBookingOrderModal ? tableBookingOrderModal.table_booking_order_checkin_date : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{tableBookingOrderModal ? tableBookingOrderModal.table_booking_order_state === 2 ? "Hoàn thành lúc: " + tableBookingOrderModal.table_booking_order_finish_date : tableBookingOrderModal.table_booking_order_state === 1 ? "Đã checkin lúc: " + tableBookingOrderModal.table_booking_order_start_date : tableBookingOrderModal.table_booking_order_state === 0 ? "Đã đặt lúc: " + tableBookingOrderModal.table_booking_order_book_date : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={"https://i.ibb.co/8m4nCKN/pexels-chan-walrus-941861.jpg"} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {tableBookingOrderModal ? tableBookingOrderModal.table_booking_name + " - " + tableBookingOrderModal.table_type_name + ", " + tableBookingOrderModal.floor_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{tableBookingOrderModal ? format_money(tableBookingOrderModal.table_booking_order_total) : null} VNĐ</span>
                                                        </Content>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            {
                                                isShowDetailTableBookingOrder ? (
                                                    <LeftVoteItem2 className="row">
                                                        <LeftVoteTitle>Thông tin Chi tiết Đặt bàn</LeftVoteTitle>
                                                        <InforCustomer className="col-lg-12">
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Sô lượng Khách: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{tableBookingOrderModal ? tableBookingOrderModal.table_booking_order_quantity : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Vị trí: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{tableBookingOrderModal ? tableBookingOrderModal.table_booking_name + " - " + tableBookingOrderModal.table_type_name + ", " + tableBookingOrderModal.floor_name : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Ghi chú của Khách: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{tableBookingOrderModal ? tableBookingOrderModal.table_booking_order_note : "Không có ghi chú gì về Đặt bàn này"}</InfoDetail>
                                                            </InfoItem>
                                                        </InforCustomer>
                                                    </LeftVoteItem2>
                                                ) : (
                                                    <LeftVoteItem2 className="row">
                                                        <LeftVoteTitle>Thông tin Khách hàng</LeftVoteTitle>
                                                        <InforCustomer className="col-lg-12">
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Họ tên: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{tableBookingOrderModal ? tableBookingOrderModal.customer_first_name + " " + tableBookingOrderModal.customer_last_name : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Chứng minh thư: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{tableBookingOrderModal ? tableBookingOrderModal.table_booking_order_state === 0 ? "Chưa Checkin" : tableBookingOrderModal.table_booking_order_identity_card : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Quốc tịch: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{tableBookingOrderModal ? tableBookingOrderModal.table_booking_order_state === 0 ? "Chưa Checkin" : tableBookingOrderModal.table_booking_order_nation : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Địa chỉ: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{tableBookingOrderModal ? tableBookingOrderModal.table_booking_order_state === 0 ? "Chưa Checkin" : tableBookingOrderModal.table_booking_order_address + ", " + tableBookingOrderModal.ward_name + ", " + tableBookingOrderModal.district_name + ", " + tableBookingOrderModal.city_name : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">Email: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{tableBookingOrderModal ? tableBookingOrderModal.customer_email : null}</InfoDetail>
                                                            </InfoItem>
                                                            <InfoItem className="row">
                                                                <InfoTitle className="col-lg-4">SĐT: </InfoTitle>
                                                                <InfoDetail className="col-lg-8">{tableBookingOrderModal ? tableBookingOrderModal.customer_phone_number : null}</InfoDetail>
                                                            </InfoItem>
                                                        </InforCustomer>
                                                    </LeftVoteItem2>
                                                )
                                            }
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Tổng chi phí</RightVoteTitle>
                                                <Surcharge className="col-lg-12">
                                                    {/* Những Món ăn đã chọn: Chưa thanh toán */}
                                                    <RightVoteTitle style={{ fontSize: "1.1rem" }} className="col-lg-12">Những Món ăn đã gọi của: <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}> {tableBookingOrderModal ? tableBookingOrderModal.table_booking_name : null}</span></RightVoteTitle>
                                                    {
                                                        tableDetailListModal.length > 0
                                                            ?
                                                            tableDetailListModal.map((tableDetail, key) => {
                                                                return (
                                                                    <CartItem>
                                                                        <Circle />
                                                                        <Course>
                                                                            <Content>
                                                                                <span style={{ width: "320px", fontWeight: "bold" }}> {tableDetail.food_name} </span>
                                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{format_money(tableDetail.table_detail_price)} VNĐ</span>
                                                                            </Content>
                                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{tableDetail.table_detail_quantity}</span> x {tableDetail.food_type_name}</span>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Khách hàng chưa Gọi Món ăn nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                            </RightVoteItem>
                                            <RightVoteItem2 className="row">
                                                <RightVoteTitle>Tổng cộng</RightVoteTitle>
                                                <InforTotal className="col-lg-12">
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Tiền đặt bàn: </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{tableBookingOrderModal ? format_money(tableBookingOrderModal.table_booking_order_total) : null} VNĐ</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Phụ phí: </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">0.00 VNĐ</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Tổng tiền thanh toán khi Check out: </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{tableBookingOrderModal ? format_money(tableBookingOrderModal.table_booking_order_total) : null} VNĐ</InfoTotalDetail>
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
    //  =============== Tìm kiếm & thống kê Đặt bàn ===============
    if (type === "statisticTableBooking") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thống kê Đặt bàn của từng Thành phố</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-8">
                                            <StatisticTable className="row" style={{ display: isShowTable ? "block" : "none" }}>
                                                {
                                                    // ---------------- THỐNG KÊ THEO QUÝ - BẢNG ----------------
                                                    isTotalOfCityByQuarter ? (
                                                        totalOfCityByQuarter ? (
                                                            <>
                                                                <Table style={{ marginBottom: "15px" }}>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={6}> Doanh thu Quý {totalOfCityByQuarter.quarter}</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Thành phố</Th>
                                                                            <Th>Doanh thu tháng {totalOfCityByQuarter.quarter === 1 ? "1" : totalOfCityByQuarter.quarter === 2 ? "4" : totalOfCityByQuarter.quarter === 3 ? "7" : totalOfCityByQuarter.quarter === 4 ? "10" : null} Quý {totalOfCityByQuarter.quarter}</Th>
                                                                            <Th>Doanh thu tháng {totalOfCityByQuarter.quarter === 1 ? "2" : totalOfCityByQuarter.quarter === 2 ? "5" : totalOfCityByQuarter.quarter === 3 ? "8" : totalOfCityByQuarter.quarter === 4 ? "11" : null} Quý {totalOfCityByQuarter.quarter}</Th>
                                                                            <Th>Doanh thu tháng {totalOfCityByQuarter.quarter === 1 ? "1" : totalOfCityByQuarter.quarter === 2 ? "6" : totalOfCityByQuarter.quarter === 3 ? "9" : totalOfCityByQuarter.quarter === 4 ? "12" : null} Quý {totalOfCityByQuarter.quarter}</Th>
                                                                            <Th>Doanh thu Cả năm</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalOfCityByQuarter.data.map((city, key) => {
                                                                                return (
                                                                                    <Tr>
                                                                                        <Td>{key + 1}</Td>
                                                                                        <Td>{city.city_name}</Td>
                                                                                        <Td>{format_money(city.monthFirst)}đ</Td>
                                                                                        <Td>{format_money(city.monthSecond)}đ</Td>
                                                                                        <Td>{format_money(city.monthThird)}đ</Td>
                                                                                        <Td>{format_money(city.canam)}đ</Td>
                                                                                    </Tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                                {/* Bảng chi tiết Đặt bàn theo Quý thống kê */}
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh sách Đặt bàn theo Quý thống kê</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Họ tên</Th>
                                                                            <Th>SĐT</Th>
                                                                            <Th>Địa chỉ</Th>
                                                                            <Th>Ngày Checkin</Th>
                                                                            <Th>Ngày Checkout</Th>
                                                                            <Th>Bàn số</Th>
                                                                            <Th>Vị trí Bàn</Th>
                                                                            <Th>Tổng tiền</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalOfCityByQuarterDataTable.length > 0 ? (
                                                                                totalOfCityByQuarterDataTable.map((tableBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                            <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                        </Tr>
                                                                                    )
                                                                                })
                                                                            ) : null
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                            </>

                                                        ) : null
                                                    ) : null
                                                }

                                                {
                                                    // ---------------- THỐNG KÊ THEO NGÀY - BẢNG ----------------
                                                    isTotalOfCityByDate ? (
                                                        totalOfCityByDate ? (
                                                            <>
                                                                {

                                                                    totalOfCityByDate.data.map((date, key) => {
                                                                        return (
                                                                            <Table style={{ marginBottom: "15px" }}>
                                                                                <Thead>
                                                                                    <Tr>
                                                                                        <Th colSpan={3}> Doanh thu Ngày {date.date}</Th>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Th>STT</Th>
                                                                                        <Th>Thành phố</Th>
                                                                                        <Th>Doanh thu</Th>
                                                                                    </Tr>
                                                                                </Thead>
                                                                                <Tbody>
                                                                                    {
                                                                                        date.data.map((row, key) => {
                                                                                            return (
                                                                                                <Tr>
                                                                                                    <Td>{key + 1}</Td>
                                                                                                    <Td>{row.city_name}</Td>
                                                                                                    <Td>{format_money(row.total)}đ</Td>
                                                                                                </Tr>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </Tbody>
                                                                            </Table>
                                                                        )
                                                                    })
                                                                }
                                                                {/* Bảng chi tiết Đặt bàn theo Ngày thống kê */}
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh sách Đặt bàn theo Ngày thống kê</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Họ tên</Th>
                                                                            <Th>SĐT</Th>
                                                                            <Th>Địa chỉ</Th>
                                                                            <Th>Ngày Checkin</Th>
                                                                            <Th>Ngày Checkout</Th>
                                                                            <Th>Bàn số</Th>
                                                                            <Th>Vị trí Bàn</Th>
                                                                            <Th>Tổng tiền</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalOfCityByDateDataTable.length > 0 ? (
                                                                                totalOfCityByDateDataTable.map((tableBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                            <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                        </Tr>
                                                                                    )
                                                                                })
                                                                            ) : null
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                            </>
                                                        ) : null
                                                    ) : null
                                                }

                                                {
                                                    // ---------------- THỐNG KÊ THEO 4 QUÝ MẶC ĐỊNH - BẢNG ----------------
                                                    isTotalOfCityForEachQuarter ? (
                                                        totalOfCityForEachQuarter ? (
                                                            <>
                                                                {
                                                                    totalOfCityForEachQuarter.data.map((city, key) => {
                                                                        return (
                                                                            <Table style={{ marginBottom: "15px" }}>
                                                                                <Thead>
                                                                                    <Tr>
                                                                                        <Th colSpan={3}>{city.city_name} - có doanh thu cao thứ: {key + 1}</Th>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Th>STT</Th>
                                                                                        <Th>Quý</Th>
                                                                                        <Th>Doanh thu</Th>
                                                                                    </Tr>
                                                                                </Thead>
                                                                                <Tbody>
                                                                                    <Tr>
                                                                                        <Td>1</Td>
                                                                                        <Td>Quý 1</Td>
                                                                                        <Td>{format_money(city.quy1)}đ</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td>2</Td>
                                                                                        <Td>Quý 2</Td>
                                                                                        <Td>{format_money(city.quy2)}đ</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td>3</Td>
                                                                                        <Td>Quý 3</Td>
                                                                                        <Td>{format_money(city.quy3)}đ</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td>4</Td>
                                                                                        <Td>Quý 4</Td>
                                                                                        <Td>{format_money(city.quy4)}đ</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td>5</Td>
                                                                                        <Td>Cả năm</Td>
                                                                                        <Td>{format_money(city.canam)}đ</Td>
                                                                                    </Tr>
                                                                                </Tbody>
                                                                            </Table>
                                                                        )
                                                                    })
                                                                }
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh sách Đặt bàn của Top 5 Thành phố</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Họ tên</Th>
                                                                            <Th>SĐT</Th>
                                                                            <Th>Địa chỉ</Th>
                                                                            <Th>Ngày Checkin</Th>
                                                                            <Th>Ngày Checkout</Th>
                                                                            <Th>Bàn số</Th>
                                                                            <Th>Vị trí Bàn</Th>
                                                                            <Th>Tổng tiền</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalOfCityForEachQuarterDataTable.length > 0 ? (
                                                                                totalOfCityForEachQuarterDataTable.map((tableBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                            <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                        </Tr>
                                                                                    )
                                                                                })
                                                                            ) : null
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                            </>
                                                        ) : null
                                                    ) : null
                                                }
                                            </StatisticTable>
                                            {/* Biểu đồ */}
                                            <LeftVoteItem className="row" style={{ display: isShowChart ? "block" : "none" }}>
                                                {
                                                    // ---------------- THỐNG KÊ THEO DOANH THU - THEO QUÝ ----------------
                                                    isTotalOfCityByQuarter ? (
                                                        totalOfCityByQuarter ? (
                                                            <>
                                                                <TooltipMui
                                                                    title={totalOfCityByQuarter ? "Cập nhật lúc " + totalOfCityByQuarter.statisticDate : null}
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
                                                                    <LeftVoteTitle>Thống kê Doanh thu Đặt bàn của các Thành phố theo Tháng trong Quý</LeftVoteTitle>
                                                                </TooltipMui>
                                                                <Bar
                                                                    ref={totalOfCityByQuarterRef}
                                                                    data={{
                                                                        labels: totalOfCityByQuarter ?
                                                                            totalOfCityByQuarter.monthArray : null,
                                                                        datasets: totalOfCityByQuarterData
                                                                    }}
                                                                    options={{
                                                                        title: {
                                                                            display: true,
                                                                            text: "World population per region (in millions)"
                                                                        },
                                                                        legend: {
                                                                            display: true,
                                                                            position: "bottom"
                                                                        }
                                                                    }}
                                                                />
                                                            </>
                                                        ) : null
                                                    ) : null
                                                }

                                                {
                                                    // ---------------- THỐNG KÊ THEO DOANH THU - THEO NGÀY ----------------
                                                    isTotalOfCityByDate ? (
                                                        totalOfCityByDate ? (
                                                            <>
                                                                <TooltipMui
                                                                    title={totalOfCityByDate ? "Cập nhật lúc " + totalOfCityByDate.statisticDate : null}
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
                                                                    <LeftVoteTitle>Thống kê Doanh thu Đặt bàn của các Thành phố theo Ngày</LeftVoteTitle>
                                                                </TooltipMui>
                                                                <Line
                                                                    ref={totalOfCityByDateRef}
                                                                    data={{
                                                                        labels: totalOfCityByDate ?
                                                                            totalOfCityByDate.dateArray : null,
                                                                        datasets: totalOfCityByDateData
                                                                    }}
                                                                    options={{
                                                                        title: {
                                                                            display: true,
                                                                            text: "World population per region (in millions)"
                                                                        },
                                                                        legend: {
                                                                            display: true,
                                                                            position: "bottom"
                                                                        }
                                                                    }}
                                                                />
                                                            </>
                                                        ) : null
                                                    ) : null
                                                }

                                                {
                                                    // ---------------- THỐNG KÊ THEO DOANH THU TOP 5 TP 4 QUÝ - MẶC ĐỊNH ----------------
                                                    isTotalOfCityForEachQuarter ? (
                                                        <>
                                                            <TooltipMui
                                                                title={totalOfCityForEachQuarter ? "Cập nhật lúc " + totalOfCityForEachQuarter.statisticDate : null}
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
                                                                <LeftVoteTitle>Thống kê 5 Thành phố có doanh thu Đặt bàn cao nhất các Quý 2022</LeftVoteTitle>
                                                            </TooltipMui>
                                                            <Line
                                                                ref={statisticImageTotalForEachQuarterCity}
                                                                data={{
                                                                    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
                                                                    datasets: totalOfCityForEachQuarterData
                                                                }}
                                                                options={{
                                                                    title: {
                                                                        display: true,
                                                                        text: "World population per region (in millions)"
                                                                    },
                                                                    legend: {
                                                                        display: true,
                                                                        position: "bottom"
                                                                    }
                                                                }}
                                                            />
                                                        </>
                                                    ) : null
                                                }
                                            </LeftVoteItem>
                                            <StatisticLeftButton className="row">
                                                {
                                                    isShowTable ? (
                                                        <TooltipMui
                                                            title={"Hiện biểu đồ"}
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
                                                            <ButtonStatistic onClick={() => handleShowChart()}>
                                                                <ImageOutlined />
                                                            </ButtonStatistic>
                                                        </TooltipMui>
                                                    ) : null
                                                }

                                                {
                                                    isShowChart ? (
                                                        <TooltipMui
                                                            title={"Ẩn biểu đồ"}
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
                                                            <ButtonStatistic onClick={() => handleHideChart()}>
                                                                <HideImageOutlined />
                                                            </ButtonStatistic>
                                                        </TooltipMui>
                                                    ) : null
                                                }

                                                {
                                                    // Khi state isQuarter thì hiện pdf của quarter
                                                    isTotalOfCityByQuarter ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileCityByQuarter dataTable={totalOfCityByQuarterDataTable} data={totalOfCityByQuarter} image={totalOfCityByQuarterPDFImage} />} fileName="BaoCaoThongKeDoanhThuThanhPhoTheoQuy.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"Đang xuất ra file PDF Quý - Thành phố"}
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
                                                                                <ButtonStatistic>
                                                                                    <MoreHorizOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        ) : (
                                                                            <TooltipMui
                                                                                title={"Xuất ra file PDF Quý - Thành phố"}
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
                                                                                <ButtonStatistic>
                                                                                    <PictureAsPdfOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        )
                                                                    }
                                                                </PDFDownloadLink>
                                                            </div>
                                                        ) : null
                                                }

                                                {
                                                    // Khi state isDate thì hiện pdf của date
                                                    isTotalOfCityByDate ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileCityByDate dataTable={totalOfCityByDateDataTable} data={totalOfCityByDate} image={totalOfCityByDatePDFImage} />} fileName="BaoCaoThongKeDoanhThuTheoNgay.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"Đang xuất ra file PDF theo ngày - Thành phố"}
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
                                                                                <ButtonStatistic>
                                                                                    <MoreHorizOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        ) : (
                                                                            <TooltipMui
                                                                                title={"Xuất ra file PDF theo ngày - Thành phố"}
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
                                                                                <ButtonStatistic>
                                                                                    <PictureAsPdfOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        )
                                                                    }
                                                                </PDFDownloadLink>
                                                            </div>
                                                        ) : null
                                                }

                                                {
                                                    // Mặc định thì pdf của 4 quý
                                                    isTotalOfCityForEachQuarter ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileCity dataTable={totalOfCityForEachQuarterDataTable} data={totalOfCityForEachQuarter} image={totalOfCityForEachQuarterPDFImage} />} fileName="BaoCaoThongKeDoanhThuThanhPho.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"Đang xuất ra file PDF 4 quý - Thành phố"}
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
                                                                                <ButtonStatistic>
                                                                                    <MoreHorizOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        ) : (
                                                                            <TooltipMui
                                                                                title={"Xuất ra file PDF 4 quý - Thành phố"}
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
                                                                                <ButtonStatistic>
                                                                                    <PictureAsPdfOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        )
                                                                    }
                                                                </PDFDownloadLink>
                                                            </div>
                                                        ) : null
                                                }

                                                {/* ---------------- BUTTON XUẤT EXCEL ---------------- */}
                                                <TooltipMui
                                                    title={"Xuất ra file Excel - Thành phố"}
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
                                                    <ButtonStatistic onClick={() => handleExportExcelCity()}>
                                                        <FilePresentOutlined />
                                                    </ButtonStatistic>
                                                </TooltipMui>

                                                {/* ---------------- BUTTON XUẤT EXCEL CHI TIẾT ---------------- */}
                                                <TooltipMui
                                                    title={"Xuất ra file Excel Chi tiết - Thành phố"}
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
                                                    <ButtonStatistic onClick={() => handleExportExcelDetailCity()}>
                                                        <FindInPageOutlined />
                                                    </ButtonStatistic>
                                                </TooltipMui>
                                            </StatisticLeftButton>
                                        </LeftVote>

                                        <FilterStatistic className="col-lg-4">
                                            <FilterStatisticItem className="row" style={{ padding: "5px 10px" }}>
                                                <FilterStatisticTitle className="col-lg-12">Thống kê theo</FilterStatisticTitle>

                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWay === "byQuarter" ? true : false} value={"byQuarter"} onClick={(e) => handleCheckByQuarter(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo quý
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWay === "byDate" ? true : false} value={"byDate"} onClick={(e) => handleCheckByDate(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo ngày
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            {
                                                statisticWay && statisticWay === "byDate" ? (
                                                    // ---------------- THỐNG KÊ THEO NGÀY ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Từ ngày:</FilterSpan>

                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ngày bắt đầu"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        maxDate={new Date()}
                                                                        value={startDate}
                                                                        onChange={(newValue) => handleChangeStartDate(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>

                                                            <FilterSpan>Đến ngày:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ngày kết thúc"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        maxDate={new Date()}
                                                                        value={finishDate}
                                                                        onChange={(newValue) => handleChangeFinishDate(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>
                                                        </div>
                                                    </FilterStatisticItem>
                                                ) : (
                                                    // ---------------- THỐNG KÊ THEO QUÝ ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Chọn quý:</FilterSpan>
                                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        label="Age"
                                                                        sx={{
                                                                            '& legend': { display: 'none' },
                                                                            '& fieldset': { top: 0 }
                                                                        }}
                                                                        onChange={(e) => handleChangeQuarter(e)}
                                                                    >
                                                                        <MenuItem value={1}>Quý 1: Từ đầu tháng 1 cho đến hết tháng 3.</MenuItem>
                                                                        <MenuItem value={2}>Quý 2: Từ đầu tháng 4 cho đến hết tháng 6.</MenuItem>
                                                                        <MenuItem value={3}>Quý 3: Từ đầu tháng 7 cho đến hết tháng 9.</MenuItem>
                                                                        <MenuItem value={4}>Quý 4: Từ đầu tháng 10 cho đến hết tháng 12.</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </div>
                                                    </FilterStatisticItem>
                                                )
                                            }


                                            <FilterStatisticItem className="row" style={{ marginBottom: "10px", paddingBottom: "5px" }}>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Số lượng Thành phố hiển thị</FilterStatisticTitle>
                                                <LabelCheckbox className="col-lg-4">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={limit === "five" ? true : false} value={"five"} onClick={(e) => handleCheckLimit(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            5
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-4">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={limit === "ten" ? true : false} value={"ten"} onClick={(e) => handleCheckLimit(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            10
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-4">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={limit === "all" ? true : false} value={"all"} onClick={(e) => handleCheckLimit(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Tất cả
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Hiển thị kết quả theo Doanh thu cả năm</FilterStatisticTitle>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWay === "desc" ? true : false} value={"desc"} onClick={(e) => handleCheckDesc(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Giảm dần
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWay === "asc" ? true : false} value={"asc"} onClick={(e) => handleCheckAsc(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Tăng dần
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            <FormChucNang style={{ marginTop: "0" }}>
                                                <SignInBtn
                                                    onClick={(e) => handleStatisticOfCity(e, statisticWay, startDate, finishDate, quarter, sortWay, limit)}
                                                >Thống kê</SignInBtn>
                                            </FormChucNang>
                                        </FilterStatistic>
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
    //  =============== Tìm kiếm & thống kê Đặt bàn Doanh thu ===============
    if (type === "statisticTableBookingTotal") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thống kê Doanh thu Đặt bàn - Nhà hàng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-8">
                                            <StatisticTable className="row" style={{ display: isShowTableTotal ? "block" : "none" }}>
                                                {
                                                    // ---------------- THỐNG KÊ THEO QUÝ - BẢNG ----------------
                                                    isStatisticTableBookingOrderTotalByQuarter ? (
                                                        statisticTableBookingOrderTotalByQuarter ? (
                                                            <>
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Tháng</Th>
                                                                            <Th>Doanh thu</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            statisticTableBookingOrderTotalByQuarter.data.map((row, key) => {
                                                                                return (
                                                                                    <Tr>
                                                                                        <Td>{key + 1}</Td>
                                                                                        <Td>{row.month}</Td>
                                                                                        <Td>{format_money(row.data)}đ</Td>
                                                                                    </Tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                                {/* Bảng chi tiết Đặt bàn theo Quý thống kê */}
                                                                <Table style={{ marginTop: "20px" }}>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh sách Đặt bàn theo Quý thống kê</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Họ tên</Th>
                                                                            <Th>SĐT</Th>
                                                                            <Th>Địa chỉ</Th>
                                                                            <Th>Ngày Checkin</Th>
                                                                            <Th>Ngày Checkout</Th>
                                                                            <Th>Bàn số</Th>
                                                                            <Th>Vị trí Bàn</Th>
                                                                            <Th>Tổng tiền</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            statisticByQuarterDataTable.length > 0 ? (
                                                                                statisticByQuarterDataTable.map((tableBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                            <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                        </Tr>
                                                                                    )
                                                                                })
                                                                            ) : null
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                            </>
                                                        ) : null
                                                    ) : null
                                                }

                                                {
                                                    // ---------------- THỐNG KÊ THEO NGÀY - BẢNG ----------------
                                                    isStatisticTableBookingOrderTotalByDate ? (
                                                        statisticTableBookingOrderTotalByDate ? (
                                                            <>
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Ngày</Th>
                                                                            <Th>Doanh thu</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            statisticTableBookingOrderTotalByDate.data.map((row, key) => {
                                                                                return (
                                                                                    <Tr>
                                                                                        <Td>{key + 1}</Td>
                                                                                        <Td>{row.date}</Td>
                                                                                        <Td>{format_money(row.data)}đ</Td>
                                                                                    </Tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                                {/* Bảng chi tiết Đặt bàn theo ngày thống kê */}
                                                                <Table style={{ marginTop: "20px" }}>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh sách Đặt bàn theo ngày thống kê</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Họ tên</Th>
                                                                            <Th>SĐT</Th>
                                                                            <Th>Địa chỉ</Th>
                                                                            <Th>Ngày Checkin</Th>
                                                                            <Th>Ngày Checkout</Th>
                                                                            <Th>Bàn số</Th>
                                                                            <Th>Vị trí Bàn</Th>
                                                                            <Th>Tổng tiền</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            statisticByDateDataTable.length > 0 ? (
                                                                                statisticByDateDataTable.map((tableBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                            <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                        </Tr>
                                                                                    )
                                                                                })
                                                                            ) : null
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                            </>
                                                        ) : null
                                                    ) : null
                                                }

                                                {
                                                    // ---------------- THỐNG KÊ THEO DOANH THU CÁC QUÝ - BẢNG MẶC ĐỊNH ----------------
                                                    isTotalForEachMonth ?
                                                        totalForEachMonthObject ? (
                                                            <>
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Quý</Th>
                                                                            <Th>Doanh thu</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        <Tr>
                                                                            <Td>1</Td>
                                                                            <Td>Quý 1</Td>
                                                                            <Td>{format_money(totalForEachMonthObject.data.quy1)}đ</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td>2</Td>
                                                                            <Td>Quý 2</Td>
                                                                            <Td>{format_money(totalForEachMonthObject.data.quy2)}đ</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td>3</Td>
                                                                            <Td>Quý 3</Td>
                                                                            <Td>{format_money(totalForEachMonthObject.data.quy3)}đ</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td>4</Td>
                                                                            <Td>Quý 4</Td>
                                                                            <Td>{format_money(totalForEachMonthObject.data.quy4)}đ</Td>
                                                                        </Tr>
                                                                    </Tbody>
                                                                </Table>
                                                                {/* Bảng chi tiết Đặt bàn theo 4 quý thống kê */}
                                                                <Table style={{ marginTop: "20px" }}>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh sách Đặt bàn theo 4 quý thống kê</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Họ tên</Th>
                                                                            <Th>SĐT</Th>
                                                                            <Th>Địa chỉ</Th>
                                                                            <Th>Ngày Checkin</Th>
                                                                            <Th>Ngày Checkout</Th>
                                                                            <Th>Bàn số</Th>
                                                                            <Th>Vị trí Bàn</Th>
                                                                            <Th>Tổng tiền</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalForEachMonthDataTable.length > 0 ? (
                                                                                totalForEachMonthDataTable.map((tableBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                            <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                            <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                            <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                        </Tr>
                                                                                    )
                                                                                })
                                                                            ) : null
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                            </>
                                                        ) : null
                                                        : null
                                                }
                                            </StatisticTable>
                                            {/* Biểu đồ */}
                                            <LeftVoteItem className="row" style={{ display: isShowChartTotal ? "block" : "none" }}>
                                                {
                                                    // ---------------- THỐNG KÊ THEO DOANH THU - THEO QUÝ ----------------
                                                    isStatisticTableBookingOrderTotalByQuarter ? (
                                                        statisticTableBookingOrderTotalByQuarter ? (
                                                            <>
                                                                <TooltipMui
                                                                    title={statisticTableBookingOrderTotalByQuarter ? "Cập nhật lúc " + statisticTableBookingOrderTotalByQuarter.statisticDate : null}
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
                                                                    <LeftVoteTitle>Thống kê Doanh thu Đặt bàn theo Tháng trong Quý</LeftVoteTitle>
                                                                </TooltipMui>
                                                                <Bar
                                                                    ref={statisticImageByQuarter}
                                                                    data={{
                                                                        labels: statisticTableBookingOrderTotalByQuarter ?
                                                                            statisticTableBookingOrderTotalByQuarter.monthArray : null,
                                                                        datasets: [
                                                                            statisticTableBookingOrderTotalByQuarter ?
                                                                                {
                                                                                    data: statisticTableBookingOrderTotalByQuarter.dataArray,
                                                                                    label: "Doanh thu",
                                                                                    backgroundColor: [
                                                                                        'rgba(255, 99, 132, 0.2)',
                                                                                        'rgba(54, 162, 235, 0.2)',
                                                                                        'rgba(255, 206, 86, 0.2)'
                                                                                    ],
                                                                                    borderColor: [
                                                                                        'rgba(255,99,132,1)',
                                                                                        'rgba(54, 162, 235, 1)',
                                                                                        'rgba(255, 206, 86, 1)'
                                                                                    ],
                                                                                    borderWidth: 1,
                                                                                    fill: false
                                                                                }
                                                                                : null
                                                                        ]
                                                                    }}
                                                                    options={{
                                                                        title: {
                                                                            display: true,
                                                                            text: "World population per region (in millions)"
                                                                        },
                                                                        legend: {
                                                                            display: true,
                                                                            position: "bottom"
                                                                        }
                                                                    }}
                                                                />
                                                            </>
                                                        ) : null
                                                    ) : null
                                                }

                                                {
                                                    // ---------------- THỐNG KÊ THEO DOANH THU - THEO NGÀY ----------------
                                                    isStatisticTableBookingOrderTotalByDate ? (
                                                        statisticTableBookingOrderTotalByDate ? (
                                                            <>
                                                                <TooltipMui
                                                                    title={statisticTableBookingOrderTotalByDate ? "Cập nhật lúc " + statisticTableBookingOrderTotalByDate.statisticDate : null}
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
                                                                    <LeftVoteTitle>Thống kê Doanh thu Đặt bàn theo Ngày</LeftVoteTitle>
                                                                </TooltipMui>
                                                                <Line
                                                                    ref={statisticImageByDate}
                                                                    data={{
                                                                        labels: statisticTableBookingOrderTotalByDate ?
                                                                            statisticTableBookingOrderTotalByDate.dateArray : null,
                                                                        datasets: [
                                                                            statisticTableBookingOrderTotalByDate ?
                                                                                {
                                                                                    data: statisticTableBookingOrderTotalByDate.dataArray,
                                                                                    label: "Doanh thu",
                                                                                    borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                                                                                    fill: false
                                                                                }
                                                                                : null
                                                                        ]
                                                                    }}
                                                                    options={{
                                                                        title: {
                                                                            display: true,
                                                                            text: "World population per region (in millions)"
                                                                        },
                                                                        legend: {
                                                                            display: true,
                                                                            position: "bottom"
                                                                        }
                                                                    }}
                                                                />
                                                            </>
                                                        ) : null
                                                    ) : null
                                                }
                                                {
                                                    // ---------------- THỐNG KÊ THEO DOANH THU CÁC QUÝ - MẶC ĐỊNH ----------------
                                                    isTotalForEachMonth ? (
                                                        <>
                                                            <TooltipMui
                                                                title={totalForEachMonthUpdateDate ? "Cập nhật lúc " + totalForEachMonthUpdateDate : null}
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
                                                                <LeftVoteTitle>Doanh thu Đặt bàn - Nhà hàng theo Quý năm 2022</LeftVoteTitle>
                                                            </TooltipMui>
                                                            <Bar
                                                                ref={statisticImageTotalForEachMonth}
                                                                data={{
                                                                    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
                                                                    datasets: [
                                                                        totalForEachMonthObject ? (
                                                                            {
                                                                                data: [totalForEachMonthObject.data.quy1, totalForEachMonthObject.data.quy2, totalForEachMonthObject.data.quy3, totalForEachMonthObject.data.quy4],
                                                                                label: totalForEachMonthObject.name,
                                                                                // borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                                                                                // backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                                                                                backgroundColor: [
                                                                                    'rgba(255, 99, 132, 0.2)',
                                                                                    'rgba(54, 162, 235, 0.2)',
                                                                                    'rgba(255, 206, 86, 0.2)',
                                                                                    'rgba(75, 192, 192, 0.2)'
                                                                                ],
                                                                                borderColor: [
                                                                                    'rgba(255,99,132,1)',
                                                                                    'rgba(54, 162, 235, 1)',
                                                                                    'rgba(255, 206, 86, 1)',
                                                                                    'rgba(75, 192, 192, 1)'
                                                                                ],
                                                                                borderWidth: 1,
                                                                                fill: false
                                                                            }
                                                                        ) : null
                                                                    ]
                                                                }}
                                                                options={{
                                                                    title: {
                                                                        display: true,
                                                                        text: "World population per region (in millions)"
                                                                    },
                                                                    legend: {
                                                                        display: true,
                                                                        position: "bottom"
                                                                    }
                                                                }}
                                                            />
                                                        </>
                                                    ) : null
                                                }

                                            </LeftVoteItem>
                                            <StatisticLeftButton className="row">
                                                {
                                                    // ---------------- BUTTON HIỆN BIỂU ĐỒ ----------------
                                                    isShowTableTotal ? (
                                                        <TooltipMui
                                                            title={"Hiện biểu đồ"}
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
                                                            <ButtonStatistic onClick={() => handleShowChartTotal()}>
                                                                <ImageOutlined />
                                                            </ButtonStatistic>
                                                        </TooltipMui>
                                                    ) : null
                                                }

                                                {
                                                    // ---------------- BUTTON ẨN BIỂU ĐỒ ----------------
                                                    isShowChartTotal ? (
                                                        <TooltipMui
                                                            title={"Ẩn biểu đồ"}
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
                                                            <ButtonStatistic onClick={() => handleHideChartTotal()}>
                                                                <HideImageOutlined />
                                                            </ButtonStatistic>
                                                        </TooltipMui>
                                                    ) : null
                                                }

                                                {
                                                    // Khi state isQuarter thì hiện pdf của quarter
                                                    isStatisticTableBookingOrderTotalByQuarter ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileByQuarter data={statisticTableBookingOrderTotalByQuarter} image={statisticByQuarterPDFImage} dataTable={statisticByQuarterDataTable} />} fileName="BaoCaoThongKeDoanhThuTheoQuy.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"Xuất ra file PDF - Quarter"}
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
                                                                                <ButtonStatistic>
                                                                                    <MoreHorizOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        ) : (
                                                                            <TooltipMui
                                                                                title={"Xuất ra file PDF theo quý"}
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
                                                                                <ButtonStatistic>
                                                                                    <PictureAsPdfOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        )
                                                                    }
                                                                </PDFDownloadLink>
                                                            </div>
                                                        ) : null
                                                }
                                                {
                                                    // Khi state isDate thì hiện pdf của date
                                                    isStatisticTableBookingOrderTotalByDate ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileByDate data={statisticTableBookingOrderTotalByDate} image={statisticByDatePDFImage} dataTable={statisticByDateDataTable} />} fileName="BaoCaoThongKeDoanhThuTheoNgay.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"Xuất ra file PDF"}
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
                                                                                <ButtonStatistic>
                                                                                    <MoreHorizOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        ) : (
                                                                            <TooltipMui
                                                                                title={"Xuất ra file PDF theo ngày"}
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
                                                                                <ButtonStatistic>
                                                                                    <PictureAsPdfOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        )
                                                                    }
                                                                </PDFDownloadLink>
                                                            </div>
                                                        ) : null
                                                }
                                                {
                                                    // Mặc định thì pdf của 4 quý
                                                    isTotalForEachMonth ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFile data={totalForEachMonthObject} image={totalForEachMonthPDFImage} dataTable={totalForEachMonthDataTable} />} fileName="BaoCaoThongKeDoanhThu.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"Xuất ra file PDF"}
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
                                                                                <ButtonStatistic>
                                                                                    <MoreHorizOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        ) : (
                                                                            <TooltipMui
                                                                                title={"Xuất ra file PDF"}
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
                                                                                <ButtonStatistic>
                                                                                    <PictureAsPdfOutlined />
                                                                                </ButtonStatistic>
                                                                            </TooltipMui>
                                                                        )
                                                                    }
                                                                </PDFDownloadLink>
                                                            </div>
                                                        ) : null
                                                }

                                                {/* ---------------- BUTTON XUẤT EXCEL ---------------- */}
                                                <TooltipMui
                                                    title={"Xuất ra file Excel"}
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
                                                    <ButtonStatistic onClick={() => handleExportExcel()}>
                                                        <FilePresentOutlined />
                                                    </ButtonStatistic>
                                                </TooltipMui>

                                                {/* ---------------- BUTTON XUẤT EXCEL CHI TIẾT ---------------- */}
                                                <TooltipMui
                                                    title={"Xuất ra file Excel Chi tiết - Thành phố"}
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
                                                    <ButtonStatistic onClick={() => handleExportExcelDetail()}>
                                                        <FindInPageOutlined />
                                                    </ButtonStatistic>
                                                </TooltipMui>
                                            </StatisticLeftButton>

                                        </LeftVote>

                                        <FilterStatistic className="col-lg-4">
                                            <FilterStatisticItem className="row">
                                                <FilterStatisticTitle className="col-lg-12">Thống kê theo</FilterStatisticTitle>

                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row">
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayTotal === "byQuarter" ? true : false} value={"byQuarter"} onClick={(e) => handleCheckByQuarterTotal(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo quý
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row">
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayTotal === "byDate" ? true : false} value={"byDate"} onClick={(e) => handleCheckByDateTotal(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo ngày
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            {
                                                statisticWayTotal && statisticWayTotal === "byDate" ? (
                                                    // ---------------- THỐNG KÊ THEO NGÀY ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Từ ngày:</FilterSpan>

                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ngày bắt đầu"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        maxDate={new Date()}
                                                                        value={startDateTotal}
                                                                        onChange={(newValue) => handleChangeStartDateTotal(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>

                                                            <FilterSpan>Đến ngày:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ngày kết thúc"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        maxDate={new Date()}
                                                                        value={finishDateTotal}
                                                                        onChange={(newValue) => handleChangeFinishDateTotal(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>
                                                        </div>
                                                    </FilterStatisticItem>
                                                ) : (
                                                    // ---------------- THỐNG KÊ THEO QUÝ ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Chọn quý:</FilterSpan>
                                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        label="Age"
                                                                        sx={{
                                                                            '& legend': { display: 'none' },
                                                                            '& fieldset': { top: 0 }
                                                                        }}
                                                                        onChange={(e) => handleChangeQuarterTotal(e)}
                                                                    >
                                                                        <MenuItem value={1}>Quý 1: Từ đầu tháng 1 cho đến hết tháng 3.</MenuItem>
                                                                        <MenuItem value={2}>Quý 2: Từ đầu tháng 4 cho đến hết tháng 6.</MenuItem>
                                                                        <MenuItem value={3}>Quý 3: Từ đầu tháng 7 cho đến hết tháng 9.</MenuItem>
                                                                        <MenuItem value={4}>Quý 4: Từ đầu tháng 10 cho đến hết tháng 12.</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </div>
                                                    </FilterStatisticItem>
                                                )
                                            }

                                            <FilterStatisticItem className="row" style={{ marginBottom: "10px", paddingBottom: "5px" }}>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Hiển thị kết quả theo</FilterStatisticTitle>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row">
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayTotal === "desc" ? true : false} value={"desc"} onClick={(e) => handleCheckDescTotal(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Giảm dần
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row">
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayTotal === "asc" ? true : false} value={"asc"} onClick={(e) => handleCheckAscTotal(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Tăng dần
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            <FormChucNang style={{ marginTop: "0" }}>
                                                <SignInBtn
                                                    onClick={(e) => handleStatistic(e, statisticWayTotal, startDateTotal, finishDateTotal, quarterTotal, sortWayTotal)}
                                                >Thống kê</SignInBtn>
                                            </FormChucNang>
                                        </FilterStatistic>
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
    //  =============== Tìm kiếm & thống kê doanh thu theo Loại bàn ===============
    if (type === "statisticTableBookingByType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thống kê Doanh thu Đặt bàn - Nhà hàng theo Loại bàn</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        {
                                            !isStatisticTableBookingOrderTypeByDate && !isStatisticTableBookingOrderTypeByQuarter ? (
                                                <LeftVote className="col-lg-8">
                                                    <EmptyItem>
                                                        <EmptyItemSvg>
                                                            <img src="https://i.ibb.co/GdjDwGT/pie-chart.png" alt="" />
                                                        </EmptyItemSvg>
                                                        <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Không có kết quả thống kê phù hợp</EmptyContent>
                                                    </EmptyItem>
                                                </LeftVote>
                                            ) : (
                                                <LeftVote className="col-lg-8">
                                                    <StatisticTable className="row" style={{ display: isShowTableType ? "block" : "none" }}>
                                                        {
                                                            // ---------------- THỐNG KÊ THEO QUÝ - BẢNG ----------------
                                                            isStatisticTableBookingOrderTypeByQuarter ? (
                                                                statisticTableBookingOrderTypeByQuarter ? (
                                                                    <>
                                                                        <Table>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>Tên Loại bàn</Th>
                                                                                    <Th>Tháng đầu Quý {statisticTableBookingOrderTypeByQuarter.quarter}</Th>
                                                                                    <Th>Tháng giữa Quý {statisticTableBookingOrderTypeByQuarter.quarter}</Th>
                                                                                    <Th>Tháng cuối Quý {statisticTableBookingOrderTypeByQuarter.quarter}</Th>
                                                                                    <Th>Doanh thu cả năm</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticTableBookingOrderTypeByQuarter.data.map((row, key) => {
                                                                                        const totalDataRes = row.totalData;
                                                                                        return (
                                                                                            <Tr>
                                                                                                <Td>{key + 1}</Td>
                                                                                                <Td>{totalDataRes.table_type_name}</Td>
                                                                                                <Td>{format_money(totalDataRes.monthFirst)}đ</Td>
                                                                                                <Td>{format_money(totalDataRes.monthSecond)}đ</Td>
                                                                                                <Td>{format_money(totalDataRes.monthThird)}đ</Td>
                                                                                                <Td>{format_money(totalDataRes.canam)}đ</Td>
                                                                                            </Tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Tbody>
                                                                        </Table>
                                                                        {/* Bảng chi tiết Đặt bàn theo Quý thống kê */}
                                                                        <Table style={{ marginTop: "20px" }}>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th colSpan={9}>Danh sách Đặt bàn theo Quý thống kê</Th>
                                                                                </Tr>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>Họ tên</Th>
                                                                                    <Th>SĐT</Th>
                                                                                    <Th>Địa chỉ</Th>
                                                                                    <Th>Ngày Checkin</Th>
                                                                                    <Th>Ngày Checkout</Th>
                                                                                    <Th>Bàn số</Th>
                                                                                    <Th>Vị trí Bàn</Th>
                                                                                    <Th>Tổng tiền</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticTypeByQuarterDataTable.length > 0 ? (
                                                                                        statisticTypeByQuarterDataTable.map((tableBookingOrder, key) => {
                                                                                            return (
                                                                                                <Tr>
                                                                                                    <Td>{key + 1}</Td>
                                                                                                    <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                                    <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                                    <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                                    <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                                </Tr>
                                                                                            )
                                                                                        })
                                                                                    ) : null
                                                                                }
                                                                            </Tbody>
                                                                        </Table>
                                                                    </>
                                                                ) : null
                                                            ) : null
                                                        }

                                                        {
                                                            // ---------------- THỐNG KÊ THEO NGÀY - BẢNG ----------------
                                                            isStatisticTableBookingOrderTypeByDate ? (
                                                                isStatisticTableBookingOrderTypeByDate ? (
                                                                    <>
                                                                        {
                                                                            statisticTableBookingOrderTypeByDate.dataArray.map((statisticRow, key) => {
                                                                                const date = statisticRow.date;
                                                                                const dataArray = statisticRow.dataArray;
                                                                                return (
                                                                                    <Table style={{ marginBottom: "15px" }}>
                                                                                        <Thead>
                                                                                            <Tr>
                                                                                                <Th colSpan={3}> Doanh thu Ngày {date}</Th>
                                                                                            </Tr>
                                                                                            <Tr>
                                                                                                <Th>STT</Th>
                                                                                                <Th>Loại bàn</Th>
                                                                                                <Th>Doanh thu</Th>
                                                                                            </Tr>
                                                                                        </Thead>
                                                                                        <Tbody>
                                                                                            {
                                                                                                dataArray.map((row, key) => {
                                                                                                    return (
                                                                                                        <Tr>
                                                                                                            <Td>{key + 1}</Td>
                                                                                                            <Td>{row.totalData.table_type_name}</Td>
                                                                                                            <Td>{format_money(row.totalData.total)}đ</Td>
                                                                                                        </Tr>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </Tbody>
                                                                                    </Table>
                                                                                )
                                                                            })
                                                                        }
                                                                        {/* Bảng chi tiết Đặt bàn theo Ngày thống kê */}
                                                                        <Table style={{ marginTop: "20px" }}>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th colSpan={9}>Danh sách Đặt bàn theo Ngày thống kê</Th>
                                                                                </Tr>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>Họ tên</Th>
                                                                                    <Th>SĐT</Th>
                                                                                    <Th>Địa chỉ</Th>
                                                                                    <Th>Ngày Checkin</Th>
                                                                                    <Th>Ngày Checkout</Th>
                                                                                    <Th>Bàn số</Th>
                                                                                    <Th>Vị trí Bàn</Th>
                                                                                    <Th>Tổng tiền</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticTypeByDateDataTable.length > 0 ? (
                                                                                        statisticTypeByDateDataTable.map((tableBookingOrder, key) => {
                                                                                            return (
                                                                                                <Tr>
                                                                                                    <Td>{key + 1}</Td>
                                                                                                    <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                                    <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                                    <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                                    <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                                </Tr>
                                                                                            )
                                                                                        })
                                                                                    ) : null
                                                                                }
                                                                            </Tbody>
                                                                        </Table>
                                                                    </>
                                                                ) : null
                                                            ) : null
                                                        }
                                                    </StatisticTable>
                                                    {/* Biểu đồ */}
                                                    <LeftVoteItem className="row" style={{ display: isShowChartType ? "block" : "none" }}>
                                                        {
                                                            // ---------------- THỐNG KÊ THEO DOANH THU - THEO QUÝ ----------------
                                                            isStatisticTableBookingOrderTypeByQuarter ? (
                                                                statisticTableBookingOrderTypeByQuarter ? (
                                                                    <>
                                                                        <TooltipMui
                                                                            title={statisticTableBookingOrderTypeByQuarter ? "Cập nhật lúc " + statisticTableBookingOrderTypeByQuarter.statisticDate : null}
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
                                                                            <LeftVoteTitle>Thống kê Doanh thu Đặt bàn theo Tháng trong Quý</LeftVoteTitle>
                                                                        </TooltipMui>
                                                                        <Bar
                                                                            ref={statisticTypeImageByQuarter}
                                                                            data={{
                                                                                labels: statisticTableBookingOrderTypeByQuarter ?
                                                                                    statisticTableBookingOrderTypeByQuarter.monthArray : null,
                                                                                datasets: statisticTypeByQuarterDataChart
                                                                            }}
                                                                            options={{
                                                                                title: {
                                                                                    display: true,
                                                                                    text: "World population per region (in millions)"
                                                                                },
                                                                                legend: {
                                                                                    display: true,
                                                                                    position: "bottom"
                                                                                }
                                                                            }}
                                                                        />
                                                                    </>
                                                                ) : null
                                                            ) : null
                                                        }

                                                        {
                                                            // ---------------- THỐNG KÊ THEO DOANH THU - THEO NGÀY ----------------
                                                            isStatisticTableBookingOrderTypeByDate ? (
                                                                statisticTableBookingOrderTypeByDate ? (
                                                                    <>
                                                                        <TooltipMui
                                                                            title={statisticTableBookingOrderTypeByDate ? "Cập nhật lúc " + statisticTableBookingOrderTypeByDate.statisticDate : null}
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
                                                                            <LeftVoteTitle>Thống kê Doanh thu Đặt bàn theo Ngày</LeftVoteTitle>
                                                                        </TooltipMui>
                                                                        <Line
                                                                            ref={statisticTypeImageByDate}
                                                                            data={{
                                                                                labels: statisticTableBookingOrderTypeByDate ?
                                                                                    statisticTableBookingOrderTypeByDate.dateArray : null,
                                                                                datasets: statisticTypeByDateDataChart
                                                                            }}
                                                                            options={{
                                                                                title: {
                                                                                    display: true,
                                                                                    text: "World population per region (in millions)"
                                                                                },
                                                                                legend: {
                                                                                    display: true,
                                                                                    position: "bottom"
                                                                                }
                                                                            }}
                                                                        />
                                                                    </>
                                                                ) : null
                                                            ) : null
                                                        }
                                                    </LeftVoteItem>
                                                    <StatisticLeftButton className="row">
                                                        {
                                                            // ---------------- BUTTON HIỆN BIỂU ĐỒ ----------------
                                                            isShowTableType ? (
                                                                <TooltipMui
                                                                    title={"Hiện biểu đồ"}
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
                                                                    <ButtonStatistic onClick={() => handleShowChartType()}>
                                                                        <ImageOutlined />
                                                                    </ButtonStatistic>
                                                                </TooltipMui>
                                                            ) : null
                                                        }

                                                        {
                                                            // ---------------- BUTTON ẨN BIỂU ĐỒ ----------------
                                                            isShowChartType ? (
                                                                <TooltipMui
                                                                    title={"Ẩn biểu đồ"}
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
                                                                    <ButtonStatistic onClick={() => handleHideChartType()}>
                                                                        <HideImageOutlined />
                                                                    </ButtonStatistic>
                                                                </TooltipMui>
                                                            ) : null
                                                        }

                                                        {
                                                            // Khi state isQuarter thì hiện pdf của quarter
                                                            isStatisticTableBookingOrderTypeByQuarter ?
                                                                (
                                                                    <div>
                                                                        <PDFDownloadLink document={<PDFFileTypeByQuarter data={statisticTableBookingOrderTypeByQuarter} image={statisticTypeByQuarterPDFImage} dataTable={statisticTypeByQuarterDataTable} />} fileName="BaoCaoThongKeDoanhThuLoaiBanTheoQuy.pdf">
                                                                            {({ blob, url, loading, error }) =>
                                                                                loading ? (
                                                                                    <TooltipMui
                                                                                        title={"Xuất ra file PDF - Quarter"}
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
                                                                                        <ButtonStatistic>
                                                                                            <MoreHorizOutlined />
                                                                                        </ButtonStatistic>
                                                                                    </TooltipMui>
                                                                                ) : (
                                                                                    <TooltipMui
                                                                                        title={"Xuất ra file PDF theo quý"}
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
                                                                                        <ButtonStatistic>
                                                                                            <PictureAsPdfOutlined />
                                                                                        </ButtonStatistic>
                                                                                    </TooltipMui>
                                                                                )
                                                                            }
                                                                        </PDFDownloadLink>
                                                                    </div>
                                                                ) : null
                                                        }
                                                        {
                                                            // Khi state isDate thì hiện pdf của date
                                                            isStatisticTableBookingOrderTypeByDate ?
                                                                (
                                                                    <div>
                                                                        <PDFDownloadLink document={<PDFFileTypeByDate data={statisticTableBookingOrderTypeByDate} image={statisticTypeByDatePDFImage} dataTable={statisticTypeByDateDataTable} />} fileName="BaoCaoThongKeDoanhThuLoaiBanTheoNgay.pdf">
                                                                            {({ blob, url, loading, error }) =>
                                                                                loading ? (
                                                                                    <TooltipMui
                                                                                        title={"Xuất ra file PDF"}
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
                                                                                        <ButtonStatistic>
                                                                                            <MoreHorizOutlined />
                                                                                        </ButtonStatistic>
                                                                                    </TooltipMui>
                                                                                ) : (
                                                                                    <TooltipMui
                                                                                        title={"Xuất ra file PDF theo ngày"}
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
                                                                                        <ButtonStatistic>
                                                                                            <PictureAsPdfOutlined />
                                                                                        </ButtonStatistic>
                                                                                    </TooltipMui>
                                                                                )
                                                                            }
                                                                        </PDFDownloadLink>
                                                                    </div>
                                                                ) : null
                                                        }

                                                        {/* ---------------- BUTTON XUẤT EXCEL ---------------- */}
                                                        <TooltipMui
                                                            title={"Xuất ra file Excel"}
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
                                                            <ButtonStatistic
                                                                onClick={() => handleExportExcelType()}
                                                            >
                                                                <FilePresentOutlined />
                                                            </ButtonStatistic>
                                                        </TooltipMui>

                                                        {/* ---------------- BUTTON XUẤT EXCEL CHI TIẾT ---------------- */}
                                                        <TooltipMui
                                                            title={"Xuất ra file Excel Chi tiết - Loại bàn"}
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
                                                            <ButtonStatistic
                                                                onClick={() => handleExportExcelDetailType()}
                                                            >
                                                                <FindInPageOutlined />
                                                            </ButtonStatistic>
                                                        </TooltipMui>
                                                    </StatisticLeftButton>

                                                </LeftVote>
                                            )
                                        }
                                        <FilterStatistic className="col-lg-4">
                                            <FilterStatisticItem className="row" style={{ padding: "5px 10px" }}>
                                                <FilterStatisticTitle className="col-lg-12">Thống kê theo</FilterStatisticTitle>

                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayType === "byQuarter" ? true : false} value={"byQuarter"} onClick={(e) => handleCheckByQuarterType(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo quý
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayType === "byDate" ? true : false} value={"byDate"} onClick={(e) => handleCheckByDateType(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo ngày
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            {
                                                statisticWayType && statisticWayType === "byDate" ? (
                                                    // ---------------- THỐNG KÊ THEO NGÀY ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Từ ngày:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ngày bắt đầu"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        maxDate={new Date()}
                                                                        value={startDateType}
                                                                        onChange={(newValue) => handleChangeStartDateType(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>
                                                        </div>
                                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Đến ngày:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ngày kết thúc"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        minDate={startDateType}
                                                                        maxDate={new Date()}
                                                                        value={finishDateType}
                                                                        onChange={(newValue) => handleChangeFinishDateType(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>
                                                        </div>
                                                    </FilterStatisticItem>
                                                ) : (
                                                    // ---------------- THỐNG KÊ THEO QUÝ ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Chọn quý:</FilterSpan>
                                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        label="Age"
                                                                        sx={{
                                                                            '& legend': { display: 'none' },
                                                                            '& fieldset': { top: 0 }
                                                                        }}
                                                                        onChange={(e) => handleChangeQuarterType(e)}
                                                                    >
                                                                        <MenuItem value={1}>Quý 1: Từ đầu tháng 1 cho đến hết tháng 3.</MenuItem>
                                                                        <MenuItem value={2}>Quý 2: Từ đầu tháng 4 cho đến hết tháng 6.</MenuItem>
                                                                        <MenuItem value={3}>Quý 3: Từ đầu tháng 7 cho đến hết tháng 9.</MenuItem>
                                                                        <MenuItem value={4}>Quý 4: Từ đầu tháng 10 cho đến hết tháng 12.</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </div>
                                                    </FilterStatisticItem>
                                                )
                                            }


                                            <FilterStatisticItem className="row" style={{ marginBottom: "10px", paddingBottom: "5px" }}>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Những loại bàn muốn thống kê</FilterStatisticTitle>
                                                <div className="col-lg-12">
                                                    <FormControl sx={{ m: 1, width: 380 }}>
                                                        <InputLabel id="demo-multiple-chip-label">Loại</InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-chip-label"
                                                            id="demo-multiple-chip"
                                                            multiple
                                                            value={tableTypeChooseList}
                                                            onChange={handleChangeTableType}
                                                            input={<OutlinedInput id="select-multiple-chip" label="Loại" />}
                                                            renderValue={(selected) => (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={value} />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                            MenuProps={MenuProps}
                                                        >
                                                            {tableTypeList.map((tableType) => (
                                                                <MenuItem
                                                                    key={tableType.table_type_id}
                                                                    value={tableType.table_type_name}
                                                                    style={getStyles(tableType.table_type_id, tableTypeChooseList, theme)}
                                                                >
                                                                    {tableType.table_type_name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Hiển thị kết quả theo Doanh thu cả năm</FilterStatisticTitle>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayType === "desc" ? true : false} value={"desc"} onClick={(e) => handleCheckDescType(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Giảm dần
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayType === "asc" ? true : false} value={"asc"} onClick={(e) => handleCheckAscType(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Tăng dần
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            <FormChucNang style={{ marginTop: "0" }}>
                                                <SignInBtn
                                                    onClick={(e) => handleStatisticOfType(e, statisticWayType, startDateType, finishDateType, quarterType, sortWayType, tableTypeChooseList)}
                                                >Thống kê</SignInBtn>
                                            </FormChucNang>
                                        </FilterStatistic>
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
    //  =============== Tìm kiếm & thống kê doanh thu theo Khách hàng ===============
    if (type === "statisticTableBookingByCustomer") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thống kê Doanh thu Đặt bàn - Nhà hàng theo Khách hàng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        {
                                            !isStatisticTableBookingOrderCustomerByDate && !isStatisticTableBookingOrderCustomerByQuarter ? (
                                                <LeftVote className="col-lg-8">
                                                    <EmptyItem>
                                                        <EmptyItemSvg>
                                                            <img src="https://i.ibb.co/GdjDwGT/pie-chart.png" alt="" />
                                                        </EmptyItemSvg>
                                                        <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Không có kết quả thống kê phù hợp</EmptyContent>
                                                    </EmptyItem>
                                                </LeftVote>
                                            ) : (
                                                <LeftVote className="col-lg-8">
                                                    <StatisticTable className="row" style={{ display: isShowTableCustomer ? "block" : "none" }}>
                                                        {
                                                            // ---------------- THỐNG KÊ THEO QUÝ - BẢNG ----------------
                                                            isStatisticTableBookingOrderCustomerByQuarter ? (
                                                                statisticTableBookingOrderCustomerByQuarter ? (
                                                                    <>
                                                                        <Table>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>Tên Khách hàng</Th>
                                                                                    <Th>Tháng đầu Quý {statisticTableBookingOrderCustomerByQuarter.quarter}</Th>
                                                                                    <Th>Tháng giữa Quý {statisticTableBookingOrderCustomerByQuarter.quarter}</Th>
                                                                                    <Th>Tháng cuối Quý {statisticTableBookingOrderCustomerByQuarter.quarter}</Th>
                                                                                    <Th>Doanh thu cả năm</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticTableBookingOrderCustomerByQuarter.data.map((row, key) => {
                                                                                        const totalDataRes = row.totalData;
                                                                                        return (
                                                                                            <Tr>
                                                                                                <Td>{key + 1}</Td>
                                                                                                <Td>{totalDataRes.customer_first_name + " " + totalDataRes.customer_last_name}</Td>
                                                                                                <Td>{format_money(totalDataRes.monthFirst)}đ</Td>
                                                                                                <Td>{format_money(totalDataRes.monthSecond)}đ</Td>
                                                                                                <Td>{format_money(totalDataRes.monthThird)}đ</Td>
                                                                                                <Td>{format_money(totalDataRes.canam)}đ</Td>
                                                                                            </Tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Tbody>
                                                                        </Table>
                                                                        {/* Bảng chi tiết Đặt bàn theo Quý thống kê */}
                                                                        <Table style={{ marginTop: "20px" }}>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th colSpan={9}>Danh sách Đặt bàn Khách hàng theo Quý thống kê</Th>
                                                                                </Tr>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>Họ tên</Th>
                                                                                    <Th>SĐT</Th>
                                                                                    <Th>Địa chỉ</Th>
                                                                                    <Th>Ngày Checkin</Th>
                                                                                    <Th>Ngày Checkout</Th>
                                                                                    <Th>Bàn số</Th>
                                                                                    <Th>Vị trí Bàn</Th>
                                                                                    <Th>Tổng tiền</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticCustomerByQuarterDataTable.length > 0 ? (
                                                                                        statisticCustomerByQuarterDataTable.map((tableBookingOrder, key) => {
                                                                                            return (
                                                                                                <Tr>
                                                                                                    <Td>{key + 1}</Td>
                                                                                                    <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                                    <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                                    <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                                    <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                                </Tr>
                                                                                            )
                                                                                        })
                                                                                    ) : null
                                                                                }
                                                                            </Tbody>
                                                                        </Table>
                                                                    </>
                                                                ) : null
                                                            ) : null
                                                        }

                                                        {
                                                            // ---------------- THỐNG KÊ THEO NGÀY - BẢNG ----------------
                                                            isStatisticTableBookingOrderCustomerByDate ? (
                                                                isStatisticTableBookingOrderCustomerByDate ? (
                                                                    <>
                                                                        {
                                                                            statisticTableBookingOrderCustomerByDate.dataArray.map((statisticRow, key) => {
                                                                                const date = statisticRow.date;
                                                                                const dataArray = statisticRow.dataArray;
                                                                                return (
                                                                                    <Table style={{ marginBottom: "15px" }}>
                                                                                        <Thead>
                                                                                            <Tr>
                                                                                                <Th colSpan={3}> Doanh thu Ngày {date}</Th>
                                                                                            </Tr>
                                                                                            <Tr>
                                                                                                <Th>STT</Th>
                                                                                                <Th>Khách hàng</Th>
                                                                                                <Th>Doanh thu</Th>
                                                                                            </Tr>
                                                                                        </Thead>
                                                                                        <Tbody>
                                                                                            <Tr>
                                                                                                <Td>{key + 1}</Td>
                                                                                                <Td>{dataArray.totalData.customer_first_name + " " + dataArray.totalData.customer_last_name}</Td>
                                                                                                <Td>{format_money(dataArray.totalData.total)}đ</Td>
                                                                                            </Tr>
                                                                                        </Tbody>
                                                                                    </Table>
                                                                                )
                                                                            })
                                                                        }
                                                                        {/* Bảng chi tiết Đặt bàn theo Ngày thống kê */}
                                                                        <Table style={{ marginTop: "20px" }}>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th colSpan={9}>Danh sách Đặt bàn Khách hàng theo Ngày thống kê</Th>
                                                                                </Tr>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>Họ tên</Th>
                                                                                    <Th>SĐT</Th>
                                                                                    <Th>Địa chỉ</Th>
                                                                                    <Th>Ngày Checkin</Th>
                                                                                    <Th>Ngày Checkout</Th>
                                                                                    <Th>Bàn số</Th>
                                                                                    <Th>Vị trí Bàn</Th>
                                                                                    <Th>Tổng tiền</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticCustomerByDateDataTable.length > 0 ? (
                                                                                        statisticCustomerByDateDataTable.map((tableBookingOrder, key) => {
                                                                                            return (
                                                                                                <Tr>
                                                                                                    <Td>{key + 1}</Td>
                                                                                                    <Td>{tableBookingOrder.customer_first_name + " " + tableBookingOrder.customer_last_name}</Td>
                                                                                                    <Td>{tableBookingOrder.customer_phone_number}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_address + ", " + tableBookingOrder.ward_name + ", " + tableBookingOrder.district_name + ", " + tableBookingOrder.city_name}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_start_date}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_order_finish_date}</Td>
                                                                                                    <Td>{tableBookingOrder.table_booking_name}</Td>
                                                                                                    <Td>{tableBookingOrder.table_type_name + ", " + tableBookingOrder.floor_name}</Td>
                                                                                                    <Td>{format_money(tableBookingOrder.table_booking_order_total)}đ</Td>
                                                                                                </Tr>
                                                                                            )
                                                                                        })
                                                                                    ) : null
                                                                                }
                                                                            </Tbody>
                                                                        </Table>
                                                                    </>
                                                                ) : null
                                                            ) : null
                                                        }
                                                    </StatisticTable>
                                                    {/* Biểu đồ */}
                                                    <LeftVoteItem className="row" style={{ display: isShowChartCustomer ? "block" : "none" }}>
                                                        {
                                                            // ---------------- THỐNG KÊ THEO DOANH THU - THEO QUÝ ----------------
                                                            isStatisticTableBookingOrderCustomerByQuarter ? (
                                                                statisticTableBookingOrderCustomerByQuarter ? (
                                                                    <>
                                                                        <TooltipMui
                                                                            title={statisticTableBookingOrderCustomerByQuarter ? "Cập nhật lúc " + statisticTableBookingOrderCustomerByQuarter.statisticDate : null}
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
                                                                            <LeftVoteTitle>Thống kê Doanh thu Đặt bàn theo Tháng trong Quý</LeftVoteTitle>
                                                                        </TooltipMui>
                                                                        <Bar
                                                                            ref={statisticCustomerImageByQuarter}
                                                                            data={{
                                                                                labels: statisticTableBookingOrderCustomerByQuarter ?
                                                                                    statisticTableBookingOrderCustomerByQuarter.monthArray : null,
                                                                                datasets: statisticCustomerByQuarterDataChart
                                                                            }}
                                                                            options={{
                                                                                title: {
                                                                                    display: true,
                                                                                    text: "World population per region (in millions)"
                                                                                },
                                                                                legend: {
                                                                                    display: true,
                                                                                    position: "bottom"
                                                                                }
                                                                            }}
                                                                        />
                                                                    </>
                                                                ) : null
                                                            ) : null
                                                        }

                                                        {
                                                            // ---------------- THỐNG KÊ THEO DOANH THU - THEO NGÀY ----------------
                                                            isStatisticTableBookingOrderCustomerByDate ? (
                                                                statisticTableBookingOrderCustomerByDate ? (
                                                                    <>
                                                                        <TooltipMui
                                                                            title={statisticTableBookingOrderCustomerByDate ? "Cập nhật lúc " + statisticTableBookingOrderCustomerByDate.statisticDate : null}
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
                                                                            <LeftVoteTitle>Thống kê Doanh thu Đặt bàn theo Ngày</LeftVoteTitle>
                                                                        </TooltipMui>
                                                                        <Line
                                                                            ref={statisticCustomerImageByDate}
                                                                            data={{
                                                                                labels: statisticTableBookingOrderCustomerByDate ?
                                                                                    statisticTableBookingOrderCustomerByDate.dateArray : null,
                                                                                datasets: statisticCustomerByDateDataChart
                                                                            }}
                                                                            options={{
                                                                                title: {
                                                                                    display: true,
                                                                                    text: "World population per region (in millions)"
                                                                                },
                                                                                legend: {
                                                                                    display: true,
                                                                                    position: "bottom"
                                                                                }
                                                                            }}
                                                                        />
                                                                    </>
                                                                ) : null
                                                            ) : null
                                                        }
                                                    </LeftVoteItem>
                                                    <StatisticLeftButton className="row">
                                                        {
                                                            // ---------------- BUTTON HIỆN BIỂU ĐỒ ----------------
                                                            isShowTableCustomer ? (
                                                                <TooltipMui
                                                                    title={"Hiện biểu đồ"}
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
                                                                    <ButtonStatistic onClick={() => handleShowChartCustomer()}>
                                                                        <ImageOutlined />
                                                                    </ButtonStatistic>
                                                                </TooltipMui>
                                                            ) : null
                                                        }

                                                        {
                                                            // ---------------- BUTTON ẨN BIỂU ĐỒ ----------------
                                                            isShowChartCustomer ? (
                                                                <TooltipMui
                                                                    title={"Ẩn biểu đồ"}
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
                                                                    <ButtonStatistic onClick={() => handleHideChartCustomer()}>
                                                                        <HideImageOutlined />
                                                                    </ButtonStatistic>
                                                                </TooltipMui>
                                                            ) : null
                                                        }

                                                        {
                                                            // Khi state isQuarter thì hiện pdf của quarter
                                                            isStatisticTableBookingOrderCustomerByQuarter ?
                                                                (
                                                                    <div>
                                                                        <PDFDownloadLink document={<PDFFileCustomerByQuarter data={statisticTableBookingOrderCustomerByQuarter} image={statisticCustomerByQuarterPDFImage} dataTable={statisticCustomerByQuarterDataTable} />} fileName="BaoCaoThongKeDoanhThuLoaiBanTheoQuy.pdf">
                                                                            {({ blob, url, loading, error }) =>
                                                                                loading ? (
                                                                                    <TooltipMui
                                                                                        title={"Xuất ra file PDF - Quarter"}
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
                                                                                        <ButtonStatistic>
                                                                                            <MoreHorizOutlined />
                                                                                        </ButtonStatistic>
                                                                                    </TooltipMui>
                                                                                ) : (
                                                                                    <TooltipMui
                                                                                        title={"Xuất ra file PDF theo quý"}
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
                                                                                        <ButtonStatistic>
                                                                                            <PictureAsPdfOutlined />
                                                                                        </ButtonStatistic>
                                                                                    </TooltipMui>
                                                                                )
                                                                            }
                                                                        </PDFDownloadLink>
                                                                    </div>
                                                                ) : null
                                                        }
                                                        {
                                                            // Khi state isDate thì hiện pdf của date
                                                            isStatisticTableBookingOrderCustomerByDate ?
                                                                (
                                                                    <div>
                                                                        <PDFDownloadLink document={<PDFFileCustomerByDate data={statisticTableBookingOrderCustomerByDate} image={statisticCustomerByDatePDFImage} dataTable={statisticCustomerByDateDataTable} />} fileName="BaoCaoThongKeDoanhThuLoaiBanTheoNgay.pdf">
                                                                            {({ blob, url, loading, error }) =>
                                                                                loading ? (
                                                                                    <TooltipMui
                                                                                        title={"Xuất ra file PDF"}
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
                                                                                        <ButtonStatistic>
                                                                                            <MoreHorizOutlined />
                                                                                        </ButtonStatistic>
                                                                                    </TooltipMui>
                                                                                ) : (
                                                                                    <TooltipMui
                                                                                        title={"Xuất ra file PDF theo ngày"}
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
                                                                                        <ButtonStatistic>
                                                                                            <PictureAsPdfOutlined />
                                                                                        </ButtonStatistic>
                                                                                    </TooltipMui>
                                                                                )
                                                                            }
                                                                        </PDFDownloadLink>
                                                                    </div>
                                                                ) : null
                                                        }

                                                        {/* ---------------- BUTTON XUẤT EXCEL ---------------- */}
                                                        <TooltipMui
                                                            title={"Xuất ra file Excel"}
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
                                                            <ButtonStatistic
                                                                onClick={() => handleExportExcelCustomer()}
                                                            >
                                                                <FilePresentOutlined />
                                                            </ButtonStatistic>
                                                        </TooltipMui>

                                                        {/* ---------------- BUTTON XUẤT EXCEL CHI TIẾT ---------------- */}
                                                        <TooltipMui
                                                            title={"Xuất ra file Excel Chi tiết - Khách hàng"}
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
                                                            <ButtonStatistic
                                                                onClick={() => handleExportExcelDetailCustomer()}
                                                            >
                                                                <FindInPageOutlined />
                                                            </ButtonStatistic>
                                                        </TooltipMui>
                                                    </StatisticLeftButton>

                                                </LeftVote>
                                            )
                                        }
                                        <FilterStatistic className="col-lg-4">
                                            <FilterStatisticItem className="row" style={{ padding: "5px 10px" }}>
                                                <FilterStatisticTitle className="col-lg-12">Thống kê theo</FilterStatisticTitle>

                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayCustomer === "byQuarter" ? true : false} value={"byQuarter"} onClick={(e) => handleCheckByQuarterCustomer(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo quý
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayCustomer === "byDate" ? true : false} value={"byDate"} onClick={(e) => handleCheckByDateCustomer(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo ngày
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            {
                                                statisticWayCustomer && statisticWayCustomer === "byDate" ? (
                                                    // ---------------- THỐNG KÊ THEO NGÀY ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Từ ngày:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ngày bắt đầu"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        maxDate={new Date()}
                                                                        value={startDateCustomer}
                                                                        onChange={(newValue) => handleChangeStartDateCustomer(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>
                                                        </div>
                                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Đến ngày:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ngày kết thúc"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        minDate={startDateCustomer}
                                                                        maxDate={new Date()}
                                                                        value={finishDateCustomer}
                                                                        onChange={(newValue) => handleChangeFinishDateCustomer(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>
                                                        </div>
                                                    </FilterStatisticItem>
                                                ) : (
                                                    // ---------------- THỐNG KÊ THEO QUÝ ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Chọn quý:</FilterSpan>
                                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                                    <Select
                                                                        labelId="demo-simple-select-label"
                                                                        id="demo-simple-select"
                                                                        label="Age"
                                                                        sx={{
                                                                            '& legend': { display: 'none' },
                                                                            '& fieldset': { top: 0 }
                                                                        }}
                                                                        onChange={(e) => handleChangeQuarterCustomer(e)}
                                                                    >
                                                                        <MenuItem value={1}>Quý 1: Từ đầu tháng 1 cho đến hết tháng 3.</MenuItem>
                                                                        <MenuItem value={2}>Quý 2: Từ đầu tháng 4 cho đến hết tháng 6.</MenuItem>
                                                                        <MenuItem value={3}>Quý 3: Từ đầu tháng 7 cho đến hết tháng 9.</MenuItem>
                                                                        <MenuItem value={4}>Quý 4: Từ đầu tháng 10 cho đến hết tháng 12.</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </div>
                                                    </FilterStatisticItem>
                                                )
                                            }


                                            <FilterStatisticItem className="row" style={{ marginBottom: "10px", paddingBottom: "5px" }}>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Thông tin Khách hàng muốn thống kê</FilterStatisticTitle>
                                                <div className="col-lg-12">
                                                    <FormInput style={{ width: "100%" }} type="text"
                                                        value={customerInfo}
                                                        placeholder="Email/ Số điện thoại Khách hàng"
                                                        onChange={(e) => handleChangeCustomerInfo(e)}
                                                    />
                                                </div>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Hiển thị kết quả theo Doanh thu cả năm</FilterStatisticTitle>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayCustomer === "desc" ? true : false} value={"desc"} onClick={(e) => handleCheckDescCustomer(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Giảm dần
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayCustomer === "asc" ? true : false} value={"asc"} onClick={(e) => handleCheckAscCustomer(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Tăng dần
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            <FormChucNang style={{ marginTop: "0" }}>
                                                <SignInBtn
                                                    onClick={(e) => handleStatisticOfCustomer(e, statisticWayCustomer, startDateCustomer, finishDateCustomer, quarterCustomer, sortWayCustomer, customerInfo)}
                                                >Thống kê</SignInBtn>
                                            </FormChucNang>
                                        </FilterStatistic>
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