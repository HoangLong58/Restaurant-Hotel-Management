import { CloseOutlined, FilePresentOutlined, FindInPageOutlined, HideImageOutlined, ImageOutlined, MoreHorizOutlined, PictureAsPdfOutlined } from "@mui/icons-material";
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
import * as RoomBookingFoodDetailService from "../../service/RoomBookingFoodDetailService";
import * as RoomBookingOrderService from "../../service/RoomBookingOrderService";
import * as StatisticService from "../../service/StatisticService";
import * as WardService from "../../service/WardService";
import * as RoomTypeService from "../../service/RoomTypeService";
import PDFFile from "./PDFFile";
import PDFFileByDate from "./PDFFileByDate";
import PDFFileByQuarter from "./PDFFileByQuarter";
import PDFFileCity from "./PDFFileCity";
import PDFFileCityByDate from "./PDFFileCityByDate";
import PDFFileCityByQuarter from "./PDFFileCityByQuarter";
import PDFFileTypeByDate from "./PDFFileTypeByDate";
import PDFFileTypeByQuarter from "./PDFFileTypeByQuarter";
import PDFFileCustomerByDate from "./PDFFileCustomerByDate";
import PDFFileCustomerByQuarter from "./PDFFileCustomerByQuarter";

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
const Modal = ({ showModal, setShowModal, type, roomBookingOrder, setReRenderData, handleClose, showToastFromOut }) => {
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

    // Chi ti???t ?????t ph??ng
    useEffect(() => {
        setRoomBookingOrderIdentityCardModal();
        setRoomBookingOrderPhoneNumberModal();
        setRoomBookingOrderEmailModal();
        setRoomBookingOrderNationModal();
        setRoomBookingOrderAddressModal();
        setRoomBookingOrderFirstNameModal();
        setRoomBookingOrderLastNameModal();
    }, [showModal]);

    const [roomBookingOrderModal, setRoomBookingOrderModal] = useState();
    const [roomBookingOrderIdModal, setRoomBookingOrderIdModal] = useState();
    const [roomBookingFoodDetailListModal, setRoomBookingFoodDetailListModal] = useState([]);
    useEffect(() => {
        const getRoomBookingOrderById = async () => {
            try {
                const roomBookingOrderRes = await RoomBookingOrderService.findRoomBookingById({
                    roomBookingId: roomBookingOrder.room_booking_order_id
                });
                setRoomBookingOrderModal(roomBookingOrderRes.data.data);
                setRoomBookingOrderIdModal(roomBookingOrderRes.data.data.room_booking_order_id);
            } catch (err) {
                console.log("L???i l???y room booking order: ", err.response);
            }
        }
        const getRoomBookingFoodDetails = async () => {
            try {
                const roomBookingFoodDetailRes = await RoomBookingFoodDetailService.getRoomBookingFoodDetailsByRoomBookingOrderId(
                    roomBookingOrder.room_booking_detail_id
                );
                setRoomBookingFoodDetailListModal(roomBookingFoodDetailRes.data.data);
            } catch (err) {
                console.log("L???i l???y room booking food detail: ", err.response);
            }
        }
        if (roomBookingOrder) {
            getRoomBookingOrderById();
            getRoomBookingFoodDetails();
        }
    }, [roomBookingOrder, showModal]);

    // Check in
    const [roomBookingOrderIdentityCardModal, setRoomBookingOrderIdentityCardModal] = useState();
    const [roomBookingOrderPhoneNumberModal, setRoomBookingOrderPhoneNumberModal] = useState();
    const [roomBookingOrderEmailModal, setRoomBookingOrderEmailModal] = useState();
    const [roomBookingOrderNationModal, setRoomBookingOrderNationModal] = useState();
    const [roomBookingOrderAddressModal, setRoomBookingOrderAddressModal] = useState();
    const [roomBookingOrderFirstNameModal, setRoomBookingOrderFirstNameModal] = useState();
    const [roomBookingOrderLastNameModal, setRoomBookingOrderLastNameModal] = useState();

    // T???NH - HUY???N - X??
    const [roomBookingOrderCityIdModal, setRoomBookingOrderCityIdModal] = useState("");
    const [roomBookingOrderDistrictIdModal, setRoomBookingOrderDistrictIdModal] = useState("");
    const [roomBookingOrderWardIdModal, setRoomBookingOrderWardIdModal] = useState("");

    const [roomBookingOrderCityListModal, setRoomBookingOrderCityListModal] = useState([]);
    const [roomBookingOrderDistrictListModal, setRoomBookingOrderDistrictListModal] = useState([]);
    const [roomBookingOrderWardListModal, setRoomBookingOrderWardListModal] = useState([]);

    useEffect(() => {
        const getCityList = async () => {
            const cityRes = await CityService.getAllCitys();
            setRoomBookingOrderCityListModal(cityRes.data.data);
            console.log("T???nh TPUpdate [res]: ", roomBookingOrderCityListModal);
        }
        getCityList();

        setRoomBookingOrderDistrictListModal([]);
        setRoomBookingOrderWardListModal([]);

        setRoomBookingOrderWardIdModal('');
        setRoomBookingOrderCityIdModal('');
        setRoomBookingOrderDistrictIdModal('');
    }, [showModal])

    useEffect(() => {
        const getDistrictList = async () => {
            const districtRes = await DistrictService.getAllDistrictsByCityId(roomBookingOrderCityIdModal)
            setRoomBookingOrderDistrictListModal(districtRes.data.data);
            console.log("Qu???n huy???n Update [res]: ", roomBookingOrderDistrictListModal);
        }
        getDistrictList();
    }, [roomBookingOrderCityIdModal])

    useEffect(() => {
        const getWardList = async () => {
            const wardRes = await WardService.getAllWardByDistrictId(roomBookingOrderDistrictIdModal)
            setRoomBookingOrderWardListModal(wardRes.data.data);
            console.log("X?? ph?????ng Update res: ", roomBookingOrderWardListModal);
        }
        getWardList();
    }, [roomBookingOrderDistrictIdModal])

    const handleChangeIdentityCard = (e) => {
        const resultKey = e.target.value.replace(/[^0-9 ]/gi, '');
        setRoomBookingOrderIdentityCardModal(resultKey);
    }
    const handleChangePhoneNumber = (e) => {
        const resultKey = e.target.value.replace(/[^0-9 ]/gi, '');
        setRoomBookingOrderPhoneNumberModal(resultKey);
    }
    const handleChangeEmail = (e) => {
        // ???????c nh???p @ v?? . nh??ng k?? t??? ??b kh??c th?? kh??ng
        const resultEmail = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setRoomBookingOrderEmailModal(resultEmail);
    }
    const handleChangeNation = (e) => {
        // ???????c nh???p @ v?? . nh??ng k?? t??? ??b kh??c th?? kh??ng
        const resultNation = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setRoomBookingOrderNationModal(resultNation);
    }
    const handleChangeAddress = (e) => {
        setRoomBookingOrderAddressModal(e.target.value);
    }
    const handleChangeFirstName = (e) => {
        // ???????c nh???p @ v?? . nh??ng k?? t??? ??b kh??c th?? kh??ng
        const resultFirstName = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setRoomBookingOrderFirstNameModal(resultFirstName);
    }
    const handleChangeLastName = (e) => {
        // ???????c nh???p @ v?? . nh??ng k?? t??? ??b kh??c th?? kh??ng
        const resultLastName = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setRoomBookingOrderLastNameModal(resultLastName);
    }

    const handleCheckin = async (
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhoneNumber,
        roomBookingOrderIdentityCard,
        roomBookingOrderNation,
        roomBookingOrderAddress,
        roomBookingOrderWardId,
        roomBookingOrderId
    ) => {
        try {
            const checkInRes = await RoomBookingOrderService.checkIn({
                customerFirstName: customerFirstName,
                customerLastName: customerLastName,
                customerEmail: customerEmail,
                customerPhoneNumber: customerPhoneNumber,
                roomBookingOrderIdentityCard: roomBookingOrderIdentityCard,
                roomBookingOrderNation: roomBookingOrderNation,
                roomBookingOrderAddress: roomBookingOrderAddress,
                roomBookingOrderWardId: roomBookingOrderWardId,
                roomBookingOrderId: roomBookingOrderId
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

    const handleCheckout = async (roomBookingOrderId) => {
        try {
            const checkOutRes = await RoomBookingOrderService.checkOut({
                roomBookingOrderId: roomBookingOrderId
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

    // -----------------------------------TH???NG K??-----------------------------------
    const dataset = [
        {
            data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
            label: "Africa",
            borderColor: "#3e95cd",
            fill: false
        },
        {
            data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
            label: "Asia",
            borderColor: "#8e5ea2",
            fill: false
        },
        {
            data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
            label: "Europe",
            borderColor: "#3cba9f",
            fill: false
        },
        {
            data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
            label: "Latin America",
            borderColor: "#e8c3b9",
            fill: false
        },
        {
            data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
            label: "North America",
            borderColor: "#c45850",
            fill: false
        }
    ];

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

    // ---------------------- STATE TH???NG K?? DOANH THU T???NG TH??NH PH??? THEO 4 QU?? ----------------------
    const [isTotalOfCityForEachQuarter, setIsTotalOfCityForEachQuarter] = useState(true);
    const [totalOfCityForEachQuarter, setTotalOfCityForEachQuarter] = useState();
    const [totalOfCityForEachQuarterData, setTotalOfCityForEachQuarterData] = useState([]);
    const [totalOfCityForEachQuarterDataTable, setTotalOfCityForEachQuarterDataTable] = useState([]);
    const [totalOfCityForEachQuarterPDFImage, setTotalOfCityForEachQuarterPDFImage] = useState();
    const statisticImageTotalForEachQuarterCity = useRef();
    // ---------------------- STATE TH???NG K?? DOANH THU T???NG TH??NH PH??? THEO NG??Y ----------------------
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
    // ---------------------- STATE TH???NG K?? DOANH THU T???NG TH??NH PH??? THEO QU?? ----------------------
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
        const getLimitRoomBookingTotalOfCityForEachQuarter = async () => {
            try {
                const roomBookingTotalOfCityForEachQuarterRes = await RoomBookingOrderService.getLimitRoomBookingTotalOfCityForEachQuarter();
                console.log("roomBookingTotalOfCityForEachQuarterRessssssssssssssssss: ", roomBookingTotalOfCityForEachQuarterRes.data.data);
                setTotalOfCityForEachQuarter(roomBookingTotalOfCityForEachQuarterRes.data.data);

                // L???y data ????? hi???n ??? Bi???u ?????
                var arrayInStatistic = [];
                if (roomBookingTotalOfCityForEachQuarterRes.data.data.data.length > 0) {
                    roomBookingTotalOfCityForEachQuarterRes.data.data.data.map((row, key) => {
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

                // L???y data ????? hi???n ??? B???ng - Danh s??ch n??y s???p x???p theo th??? t??? gi???m doanh thu c???a tp ????
                var arrayInTable = [];
                for (var i = 0; i < roomBookingTotalOfCityForEachQuarterRes.data.data.dataArray.length; i++) {
                    const roomBookingInCity = roomBookingTotalOfCityForEachQuarterRes.data.data.dataArray[i];
                    for (var j = 0; j < roomBookingInCity.data.length; j++) {
                        arrayInTable.push(roomBookingInCity.data[j]);
                    }
                }
                setTotalOfCityForEachQuarterDataTable(arrayInTable);
            } catch (err) {
                console.log("L???i khi l???y doanh thu c??c th??nh ph??? theo qu??: ", err.response);
            }
        }
        getLimitRoomBookingTotalOfCityForEachQuarter().then(() => {
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
            const dataToast = { message: "B???n ch??a ch???n Lo???i th???ng k??", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        setIsTotalOfCityForEachQuarter(false);
        setIsTotalOfCityByDate(false);
        setIsTotalOfCityByQuarter(false);
        console.log("handleStatisticOfCity input: ", statisticWay, startDate, finishDate, quarter, sortWay, limit)
        if (statisticWay === "byDate") {
            try {
                const statisticRes = await RoomBookingOrderService.getStatisticRoomBookingTotalOfCityByDate({
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

                // L???y data ????? hi???n ??? Bi???u ?????
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

                // L???y data ????? hi???n ??? B???ng - Danh s??ch n??y s???p x???p theo th??? t??? gi???m doanh thu c???a tp ????
                var arrayInTable = [];
                for (var i = 0; i < statisticRes.data.data.data.length; i++) {
                    const roomBookingOrderInThisDateList = statisticRes.data.data.data[i].roomBookingOrderDetailList;
                    for (var j = 0; j < roomBookingOrderInThisDateList.length; j++) {
                        arrayInTable.push(roomBookingOrderInThisDateList[j]);
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
                const statisticRes = await RoomBookingOrderService.getStatisticRoomBookingTotalOfCityByQuarter({
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

                // L???y data ????? hi???n ??? Bi???u ?????
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

                // L???y data ????? hi???n ??? B???ng 
                setTotalOfCityByQuarterDataTable(statisticRes.data.data.roomBookingOrderDetailList);

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

    // Xu???t ra file EXCEL
    const handleExportExcelCity = () => {
        var dataExport = [];
        if (isTotalOfCityByQuarter) {
            // Khi ??ang th???ng k?? theo Qu??
            dataExport = totalOfCityByQuarter.data;
            const quarter = totalOfCityByQuarter.quarter;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id']
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["T??n th??nh ph???", "Th??ng ?????u qu?? " + quarter, "Th??ng gi???a qu?? " + quarter, "Th??ng cu???i qu?? " + quarter, "C??? n??m"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuCuaThanhPhoTheoQuy.xlsx");
        } else if (isTotalOfCityByDate) {
            // Khi ??ang th???ng k?? theo NG??Y
            var titleExport = [];
            titleExport.push("T??n th??nh ph???");
            for (var i = 0; i < totalOfCityByDate.dateArray.length; i++) {
                titleExport.push(totalOfCityByDate.dateArray[i]);
            }
            titleExport.push("Doanh thu c??? n??m");

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
            // Th???ng k?? m???c ?????nh 4 Qu??
            dataExport = totalOfCityForEachQuarter.data;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id']
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["T??n th??nh ph???", "Qu?? 1", "Qu?? 2", "Qu?? 3", "Qu?? 4", "C??? n??m"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuThanhPhoTheoTungQuy.xlsx");
        }

    }
    // Xu???t ra file EXCEL Chi ti???t
    const handleExportExcelDetailCity = () => {
        var dataExport = [];
        if (isTotalOfCityByQuarter) {
            // Th???ng k?? theo Qu??
            dataExport = totalOfCityByQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuThanhPhoTheoTungQuyChiTiet.xlsx");
        } else if (isTotalOfCityByDate) {
            // Th???ng k?? theo Ng??y
            dataExport = totalOfCityByDateDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuThanhPhoTheoTungNgayChiTiet.xlsx");
        } else {
            // Th???ng k?? m???c ?????nh 4 Qu??
            dataExport = totalOfCityForEachQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
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

    // State th???ng k?? m???c ?????nh
    const [totalForEachMonthObject, setTotalForEachMonthObject] = useState([]);
    const [totalForEachMonthPDFImage, setTotalForEachMonthPDFImage] = useState();
    const [totalForEachMonthUpdateDate, setTotalForEachMonthUpdateDate] = useState();
    const [isTotalForEachMonth, setIsTotalForEachMonth] = useState(true);
    const [totalForEachMonthDataTable, setTotalForEachMonthDataTable] = useState([]);

    // State khi th???ng k?? theo ng??y
    const [isStatisticRoomBookingOrderTotalByDate, setIsStatisticRoomBookingOrderTotalByDate] = useState(false);
    const [statisticRoomBookingOrderTotalByDate, setStatisticRoomBookingOrderTotalByDate] = useState();
    const [statisticByDatePDFImage, setStatisticByDatePDFImage] = useState();
    const [statisticByDateDataTable, setStatisticByDateDataTable] = useState([]);
    // State khi th???ng k?? theo Qu??
    const [isStatisticRoomBookingOrderTotalByQuarter, setIsStatisticRoomBookingOrderTotalByQuarter] = useState(false);
    const [statisticRoomBookingOrderTotalByQuarter, setStatisticRoomBookingOrderTotalByQuarter] = useState();
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
    }, [isShowChartTotal, isStatisticRoomBookingOrderTotalByDate, isStatisticRoomBookingOrderTotalByQuarter]);
    const statisticImageByDate = useCallback(node => {
        if (node !== null) {
            setTimeout(() => {
                setStatisticByDatePDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChartTotal, isStatisticRoomBookingOrderTotalByDate, isStatisticRoomBookingOrderTotalByQuarter]);

    useEffect(() => {
        const getStatisticRoomBookingForEachQuarterByYear = async () => {
            var now = new window.Date();
            try {
                const statisticRoomBookingForEachQuarterByYearRes = await StatisticService.getStatisticRoomBookingForEachQuarterByYear({
                    year: now.getFullYear()
                });
                console.log("statisticRoomBookingForEachQuarterByYearRes: ", statisticRoomBookingForEachQuarterByYearRes);
                setTotalForEachMonthObject(statisticRoomBookingForEachQuarterByYearRes.data.data);
                setTotalForEachMonthUpdateDate(statisticRoomBookingForEachQuarterByYearRes.data.statisticDate);
                setTotalForEachMonthDataTable(statisticRoomBookingForEachQuarterByYearRes.data.roomBookingOrderList);
            } catch (err) {
                console.log("L???i khi l???y doanh thu theo qu??: ", err.response);
            }
        }
        getStatisticRoomBookingForEachQuarterByYear().then(() => {
            if (statisticImageTotalForEachMonth.current) {
                setTimeout(() => {
                    setTotalForEachMonthPDFImage(statisticImageTotalForEachMonth.current.canvas.toDataURL('image/png', 1));
                }, 3000);
            }
        });
        // Reset state
        setIsTotalForEachMonth(true);
        setIsStatisticRoomBookingOrderTotalByDate(false);
        setIsStatisticRoomBookingOrderTotalByQuarter(false);
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
            const dataToast = { message: "B???n ch??a ch???n Lo???i th???ng k??", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        setIsTotalForEachMonth(false);
        setIsStatisticRoomBookingOrderTotalByDate(false);
        setIsStatisticRoomBookingOrderTotalByQuarter(false);
        console.log("handleStatistic input: ", statisticWayTotal, startDateTotal, finishDateTotal, sortWayTotal)
        if (statisticWayTotal === "byDate") {
            try {
                const statisticRes = await RoomBookingOrderService.getStatisticRoomBookingTotalByDate({
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
                setIsStatisticRoomBookingOrderTotalByDate(true);
                setStatisticRoomBookingOrderTotalByDate(statisticRes.data.data);
                setStatisticByDateDataTable(statisticRes.data.data.roomBookingOrderList);
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
                const statisticRes = await RoomBookingOrderService.getStatisticRoomBookingTotalByQuarter({
                    quarter: quarterTotal,
                    sortWay: sortWayTotal
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsStatisticRoomBookingOrderTotalByQuarter(true);
                setStatisticRoomBookingOrderTotalByQuarter(statisticRes.data.data);
                setStatisticByQuarterDataTable(statisticRes.data.data.roomBookingOrderList);

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

    // Xu???t ra file EXCEL
    const handleExportExcel = () => {
        var dataExport = [];
        if (isStatisticRoomBookingOrderTotalByDate) {
            // Khi ??ang th???ng k?? theo NG??Y
            dataExport = statisticRoomBookingOrderTotalByDate.data;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y", "Doanh thu"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoNgay.xlsx");
        } else if (isStatisticRoomBookingOrderTotalByQuarter) {
            // Khi ??ang th???ng k?? theo QU??
            dataExport = statisticRoomBookingOrderTotalByQuarter.data;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Th??ng", "Doanh thu"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungThangCuaQuy.xlsx");
        } else {
            // Th???ng k?? m???c ?????nh 4 Qu??
            dataExport = totalForEachMonthObject.data;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet([dataExport]);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Qu?? 1", "Qu?? 2", "Qu?? 3", "Qu?? 4", "C??? n??m"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungQuy.xlsx");
        }
    }

    // Xu???t ra file EXCEL - Chi ti???t
    const handleExportExcelDetail = () => {
        var dataExport = [];
        if (isStatisticRoomBookingOrderTotalByDate) {
            // Th???ng k?? theo Ng??y
            dataExport = statisticByDateDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungNgayChiTiet.xlsx");
        } else if (isStatisticRoomBookingOrderTotalByQuarter) {
            // Th???ng k?? theo Qu??
            dataExport = statisticByQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungQuyChiTiet.xlsx");
        } else {
            // Th???ng k?? m???c ?????nh 4 Qu??
            dataExport = totalForEachMonthDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoTungQuyChiTiet.xlsx");
        }
    }
    // console.log("statisticByDatePDFImage, statisticByQuarterPDFImage:", statisticByDatePDFImage, statisticByQuarterPDFImage);
    // console.log("statisticRoomBookingOrderTotalByDate:", statisticRoomBookingOrderTotalByDate, statisticRoomBookingOrderTotalByQuarter);

    // ================ Th???ng k?? doanh thu theo Lo???i ph??ng ================
    const [statisticWayType, setStatisticWayType] = useState(); //byQuarter - byDate
    const [sortWayType, setSortWayType] = useState(); //byQuarter - byDate
    const [startDateType, setStartDateType] = useState(); //Date: YYYY-MM-DD
    const [finishDateType, setFinishDateType] = useState(); //Date: YYYY-MM-DD
    const [quarterType, setQuarterType] = useState(); //Quarter: 1, 2, 3, 4
    const [roomTypeList, setRoomTypeList] = useState([]);

    const [isShowChartType, setIsShowChartType] = useState(true);
    const [isShowTableType, setIsShowTableType] = useState(false);

    // State khi th???ng k?? theo ng??y
    const [isStatisticRoomBookingOrderTypeByDate, setIsStatisticRoomBookingOrderTypeByDate] = useState(false);
    const [statisticRoomBookingOrderTypeByDate, setStatisticRoomBookingOrderTypeByDate] = useState();
    const [statisticTypeByDatePDFImage, setStatisticTypeByDatePDFImage] = useState();
    const [statisticTypeByDateDataTable, setStatisticTypeByDateDataTable] = useState([]);
    const [statisticTypeByDateDataChart, setStatisticTypeByDateDataChart] = useState([]);
    // State khi th???ng k?? theo Qu??
    const [isStatisticRoomBookingOrderTypeByQuarter, setIsStatisticRoomBookingOrderTypeByQuarter] = useState(false);
    const [statisticRoomBookingOrderTypeByQuarter, setStatisticRoomBookingOrderTypeByQuarter] = useState();
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
    }, [isShowChartType, isStatisticRoomBookingOrderTypeByDate, isStatisticRoomBookingOrderTypeByQuarter]);
    const statisticTypeImageByDate = useCallback(node => {
        if (node !== null) {
            setTimeout(() => {
                setStatisticTypeByDatePDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChartType, isStatisticRoomBookingOrderTypeByDate, isStatisticRoomBookingOrderTypeByQuarter]);

    useEffect(() => {
        const getRoomTypeList = async () => {
            const roomTypeRes = await RoomTypeService.findAllRoomTypeInRoomBookingOrder()
            setRoomTypeList(roomTypeRes.data.data);
        }
        getRoomTypeList();
        // Reset state
        setIsStatisticRoomBookingOrderTypeByDate(false);
        setIsStatisticRoomBookingOrderTypeByQuarter(false);
        setRoomTypeChooseList([]);
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
    function getStyles(name, roomTypeChooseList, theme) {
        return {
            fontWeight:
                roomTypeChooseList.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }
    const [roomTypeChooseList, setRoomTypeChooseList] = useState([]);
    const handleChangeRoomType = (event) => {
        const {
            target: { value },
        } = event;
        setRoomTypeChooseList(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    console.log("roomTypeChooseList: ", roomTypeChooseList)
    const handleStatisticOfType = async (e, statisticWayType, startDateType, finishDateType, quarterType, sortWayType, roomTypeChooseList) => {
        e.preventDefault();
        if (!statisticWayType) {
            // Toast
            const dataToast = { message: "B???n ch??a ch???n Lo???i th???ng k??", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        setIsStatisticRoomBookingOrderTypeByDate(false);
        setIsStatisticRoomBookingOrderTypeByQuarter(false);
        console.log("handleStatistic input: ", statisticWayType, startDateType, finishDateType, sortWayType)
        if (statisticWayType === "byDate") {
            try {
                const statisticRes = await RoomBookingOrderService.getStatisticRoomBookingTotalOfTypeByDate({
                    dateFrom: startDateType,
                    dateTo: finishDateType,
                    sortWay: sortWayType,
                    roomTypeList: roomTypeChooseList
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsStatisticRoomBookingOrderTypeByDate(true);
                setStatisticRoomBookingOrderTypeByDate(statisticRes.data.data);
                setStatisticTypeByDateDataTable(statisticRes.data.data.finalRoomBookingOrderList);

                // L???y data ????? hi???n ??? Bi???u ?????
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
                            label: rowValue.room_type_name,
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
                const statisticRes = await RoomBookingOrderService.getStatisticRoomBookingTotalOfTypeByQuarter({
                    quarter: quarterType,
                    sortWay: sortWayType,
                    roomTypeList: roomTypeChooseList
                });
                if (!statisticRes) {
                    // Toast
                    const dataToast = { message: statisticRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                setIsStatisticRoomBookingOrderTypeByQuarter(true);
                setStatisticRoomBookingOrderTypeByQuarter(statisticRes.data.data);

                // L???y list detail room booking c???a c??c lo???i ph??ng
                var roomBookingOrderList = [];
                var arrayInStatistic = [];
                for (var i = 0; i < statisticRes.data.data.data.length; i++) {
                    const roomBookingOrderListRes = statisticRes.data.data.data[i].roomBookingOrderList;
                    roomBookingOrderListRes.map((roomBookingOrder, key) => {
                        roomBookingOrderList.push(roomBookingOrder);
                    });

                    // L???y data ????? hi???n ??? Bi???u ?????
                    const totalDataRes = statisticRes.data.data.data[i].totalData;
                    arrayInStatistic.push({
                        data: [totalDataRes.monthFirst, totalDataRes.monthSecond, totalDataRes.monthThird],
                        label: totalDataRes.room_type_name,
                        borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                        backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                        borderWidth: 1,
                        fill: false
                    });
                }
                setStatisticTypeByQuarterDataTable(roomBookingOrderList);
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

    // Xu???t ra file EXCEL
    const handleExportExcelType = () => {
        var dataExport = [];
        if (isStatisticRoomBookingOrderTypeByDate) {
            // Khi ??ang th???ng k?? theo NG??Y
            var titleExport = [];
            titleExport.push("T??n Lo???i ph??ng");
            for (var i = 0; i < statisticRoomBookingOrderTypeByDate.dateArray.length; i++) {
                titleExport.push(statisticRoomBookingOrderTypeByDate.dateArray[i]);
            }
            titleExport.push("Doanh thu c??? n??m");

            dataExport = statisticRoomBookingOrderTypeByDate.statisticArray;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [titleExport], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuLoaiPhongTheoNgay.xlsx");
        } else if (isStatisticRoomBookingOrderTypeByQuarter) {
            var quarter = statisticRoomBookingOrderTypeByQuarter.quarter;
            // Khi ??ang th???ng k?? theo QU??
            statisticRoomBookingOrderTypeByQuarter.data.map((data, key) => {
                dataExport.push(data.totalData);
            })
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["T??n Lo???i ph??ng", "Doanh thu ?????u qu?? " + quarter, "Doanh thu gi???a qu?? " + quarter, "Doanh thu cu???i qu?? " + quarter, "Doanh thu c??? n??m"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuLoaiPhongTheoTungThangCuaQuy.xlsx");
        } else {
            return;
        }
    }

    // Xu???t ra file EXCEL - Chi ti???t
    const handleExportExcelDetailType = () => {
        var dataExport = [];
        if (isStatisticRoomBookingOrderTypeByDate) {
            // Th???ng k?? theo Ng??y
            dataExport = statisticTypeByDateDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoLoaiPhongTungNgayChiTiet.xlsx");
        } else if (isStatisticRoomBookingOrderTypeByQuarter) {
            // Th???ng k?? theo Qu??
            dataExport = statisticTypeByQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoLoaiPhongTungQuyChiTiet.xlsx");
        } else {
            return;
        }
    }


    // ================ Th???ng k?? doanh thu theo Kh??ch h??ng ================
    const [statisticWayCustomer, setStatisticWayCustomer] = useState(); //byQuarter - byDate
    const [sortWayCustomer, setSortWayCustomer] = useState(); //byQuarter - byDate
    const [startDateCustomer, setStartDateCustomer] = useState(); //Date: YYYY-MM-DD
    const [finishDateCustomer, setFinishDateCustomer] = useState(); //Date: YYYY-MM-DD
    const [quarterCustomer, setQuarterCustomer] = useState(); //Quarter: 1, 2, 3, 4
    const [customerInfo, setCustomerInfo] = useState();

    const [isShowChartCustomer, setIsShowChartCustomer] = useState(true);
    const [isShowTableCustomer, setIsShowTableCustomer] = useState(false);

    // State khi th???ng k?? theo ng??y
    const [isStatisticRoomBookingOrderCustomerByDate, setIsStatisticRoomBookingOrderCustomerByDate] = useState(false);
    const [statisticRoomBookingOrderCustomerByDate, setStatisticRoomBookingOrderCustomerByDate] = useState();
    const [statisticCustomerByDatePDFImage, setStatisticCustomerByDatePDFImage] = useState();
    const [statisticCustomerByDateDataTable, setStatisticCustomerByDateDataTable] = useState([]);
    const [statisticCustomerByDateDataChart, setStatisticCustomerByDateDataChart] = useState([]);
    // State khi th???ng k?? theo Qu??
    const [isStatisticRoomBookingOrderCustomerByQuarter, setIsStatisticRoomBookingOrderCustomerByQuarter] = useState(false);
    const [statisticRoomBookingOrderCustomerByQuarter, setStatisticRoomBookingOrderCustomerByQuarter] = useState();
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
    }, [isShowChartCustomer, isStatisticRoomBookingOrderCustomerByDate, isStatisticRoomBookingOrderCustomerByQuarter]);
    const statisticCustomerImageByDate = useCallback(node => {
        if (node !== null) {
            setTimeout(() => {
                setStatisticCustomerByDatePDFImage(node.canvas.toDataURL('image/png', 1));
            }, 1000);
            console.log("ref", node);
        }
    }, [isShowChartCustomer, isStatisticRoomBookingOrderCustomerByDate, isStatisticRoomBookingOrderCustomerByQuarter]);

    useEffect(() => {
        // Reset state
        setIsStatisticRoomBookingOrderCustomerByDate(false);
        setIsStatisticRoomBookingOrderCustomerByQuarter(false);
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
        // ???????c nh???p @ v?? . nh??ng k?? t??? ??b kh??c th?? kh??ng
        const resultCustomerInfo = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setCustomerInfo(resultCustomerInfo);
    }

    const handleStatisticOfCustomer = async (e, statisticWayCustomer, startDateCustomer, finishDateCustomer, quarterCustomer, sortWayCustomer, customerInfo) => {
        e.preventDefault();
        if (!statisticWayCustomer) {
            // Toast
            const dataToast = { message: "B???n ch??a ch???n Lo???i th???ng k??", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        setIsStatisticRoomBookingOrderCustomerByDate(false);
        setIsStatisticRoomBookingOrderCustomerByQuarter(false);
        console.log("handleStatistic input: ", statisticWayCustomer, startDateCustomer, finishDateCustomer, sortWayCustomer)
        if (statisticWayCustomer === "byDate") {
            try {
                const statisticRes = await RoomBookingOrderService.getStatisticRoomBookingTotalOfCustomerByDate({
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
                setIsStatisticRoomBookingOrderCustomerByDate(true);
                setStatisticRoomBookingOrderCustomerByDate(statisticRes.data.data);
                setStatisticCustomerByDateDataTable(statisticRes.data.data.finalRoomBookingOrderList);

                // L???y data ????? hi???n ??? Bi???u ?????
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
                const statisticRes = await RoomBookingOrderService.getStatisticRoomBookingTotalOfCustomerByQuarter({
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
                setIsStatisticRoomBookingOrderCustomerByQuarter(true);
                setStatisticRoomBookingOrderCustomerByQuarter(statisticRes.data.data);

                // L???y list detail room booking c???a c??c lo???i ph??ng
                var roomBookingOrderList = [];
                var arrayInStatistic = [];
                const roomBookingOrderListRes = statisticRes.data.data.data[0].roomBookingOrderList;
                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                    roomBookingOrderList.push(roomBookingOrder);
                });

                // L???y data ????? hi???n ??? Bi???u ?????
                const totalDataRes = statisticRes.data.data.data[0].totalData;
                arrayInStatistic.push({
                    data: [totalDataRes.monthFirst, totalDataRes.monthSecond, totalDataRes.monthThird],
                    label: totalDataRes.customer_first_name + " " + totalDataRes.customer_last_name,
                    borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    borderWidth: 1,
                    fill: false
                });

                setStatisticCustomerByQuarterDataTable(roomBookingOrderList);
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

    // Xu???t ra file EXCEL
    const handleExportExcelCustomer = () => {
        var dataExport = [];
        if (isStatisticRoomBookingOrderCustomerByDate) {
            // Khi ??ang th???ng k?? theo NG??Y
            var titleExport = [];
            titleExport.push("H??? kh??ch h??ng");
            titleExport.push("T??n kh??ch h??ng");
            titleExport.push("Email");
            titleExport.push("S??? ??i???n tho???i");
            for (var i = 0; i < statisticRoomBookingOrderCustomerByDate.dateArray.length; i++) {
                titleExport.push(statisticRoomBookingOrderCustomerByDate.dateArray[i]);
            }
            titleExport.push("Doanh thu c??? n??m");

            var exportArray = [];
            exportArray.push(statisticRoomBookingOrderCustomerByDate.statisticArray);
            dataExport = exportArray;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [titleExport], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuKhachHangTheoNgay.xlsx");
        } else if (isStatisticRoomBookingOrderCustomerByQuarter) {
            var quarter = statisticRoomBookingOrderCustomerByQuarter.quarter;
            // Khi ??ang th???ng k?? theo QU??
            statisticRoomBookingOrderCustomerByQuarter.data.map((data, key) => {
                dataExport.push(data.totalData);
            })
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport);
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["H??? kh??ch h??ng", "T??n kh??ch h??ng", "Email", "S??? ??i???n tho???i", "Doanh thu ?????u qu?? " + quarter, "Doanh thu gi???a qu?? " + quarter, "Doanh thu cu???i qu?? " + quarter, "Doanh thu c??? n??m"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuKhachHangTheoTungThangCuaQuy.xlsx");
        } else {
            return;
        }
    }

    // Xu???t ra file EXCEL - Chi ti???t
    const handleExportExcelDetailCustomer = () => {
        var dataExport = [];
        if (isStatisticRoomBookingOrderCustomerByDate) {
            // Th???ng k?? theo Ng??y
            dataExport = statisticCustomerByDateDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoKhachHangTungNgayChiTiet.xlsx");
        } else if (isStatisticRoomBookingOrderCustomerByQuarter) {
            // Th???ng k?? theo Qu??
            dataExport = statisticCustomerByQuarterDataTable;
            console.log("Export: dataExport =", dataExport);
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.json_to_sheet(dataExport.map((val, key) => {
                    delete val['city_id'];
                    delete val['customer_id'];
                    delete val['customer_image'];
                    delete val['discount_id'];
                    delete val['discount_id'];
                    delete val['room_booking_detail_id'];
                    delete val['room_booking_detail_checkin_date'];
                    delete val['room_booking_detail_checkout_date'];
                    delete val['room_booking_detail_key'];
                    delete val['room_booking_order_id'];
                    delete val['room_booking_order_state'];
                    delete val['room_booking_order_book_date'];
                    delete val['room_id'];
                    return val
                }));
            XLSX.utils.book_append_sheet(wb, ws, "ThongKeDoanhThu");
            XLSX.utils.sheet_add_aoa(ws, [["Ng??y check-in", "Ng??y check-out", "Ti???n ?????t ph??ng", "Ti???n ph??? ph??", "Ghi ch??", "S??? CMND", "Qu???c t???ch", "?????a ch???", "T???ng ti???n", "H??? c???a Kh??ch h??ng", "T??n c???a Kh??ch h??ng", "S??? ??i???n tho???i", "Email", "T??n ph??ng", "Lo???i ph??ng", "Thu???c t???ng", "T??n th??nh ph???", "T??n qu???n huy???n", "T??n x?? ph?????ng"]], { origin: "A1" });
            XLSX.writeFile(wb, "ThongKeDoanhThuTheoKhachHangTungQuyChiTiet.xlsx");
        } else {
            return;
        }
    }
    // ================================================================
    //  =============== Checkin ===============
    if (type === "checkin") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "50%" }}>
                            <H1>Checkin nh???n {roomBookingOrder ? roomBookingOrder.room_name : null}</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <FormSpan>H??? c???a kh??ch h??ng:</FormSpan>
                                            <FormInput style={{ width: "100%" }} type="text"
                                                value={roomBookingOrderFirstNameModal}
                                                placeholder="H??? c???a Kh??ch h??ng"
                                                onChange={(e) => handleChangeFirstName(e)}
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <FormSpan>T??n c???a kh??ch h??ng:</FormSpan>
                                            <FormInput style={{ width: "100%" }} type="text"
                                                value={roomBookingOrderLastNameModal}
                                                placeholder="T??n c???a Kh??ch h??ng"
                                                onChange={(e) => handleChangeLastName(e)}
                                            />
                                        </div>
                                    </div>
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Ch???ng minh nh??n d??n:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Ch???ng minh th?? c???a Kh??ch h??ng"
                                        value={roomBookingOrderIdentityCardModal}
                                        onChange={(e) => handleChangeIdentityCard(e)} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <div className="row">
                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Qu???c t???ch:</FormSpan>
                                            <FormInput type="text"
                                                placeholder="Qu???c t???ch c???a Kh??ch h??ng"
                                                value={roomBookingOrderNationModal}
                                                onChange={(e) => handleChangeNation(e)}
                                            />
                                        </div>
                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>?????a ch???:</FormSpan>
                                            <FormInput type="text"
                                                placeholder="?????a ch??? c???a Kh??ch h??ng"
                                                value={roomBookingOrderAddressModal}
                                                onChange={(e) => handleChangeAddress(e)}
                                            />
                                        </div>
                                    </div>
                                </ModalFormItem>

                                <ModalFormItem>
                                    <div className="row">
                                        <div className="col-lg-4" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Thu???c Th??nh ph???:</FormSpan>
                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={roomBookingOrderCityIdModal}
                                                        label="Age"
                                                        sx={{
                                                            '& legend': { display: 'none' },
                                                            '& fieldset': { top: 0 }
                                                        }}
                                                        onChange={(e) => setRoomBookingOrderCityIdModal(e.target.value)}
                                                    >
                                                        <MenuItem value="">-- Ch???n th??nh ph??? --</MenuItem>
                                                        {roomBookingOrderCityListModal.length > 0
                                                            ?
                                                            roomBookingOrderCityListModal.map((city, key) => {
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
                                            <FormSpan>Thu???c Qu???n, huy???n:</FormSpan>
                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={roomBookingOrderDistrictIdModal}
                                                        label="Age"
                                                        sx={{
                                                            '& legend': { display: 'none' },
                                                            '& fieldset': { top: 0 }
                                                        }}
                                                        onChange={(e) => setRoomBookingOrderDistrictIdModal(e.target.value)}
                                                    >
                                                        {
                                                            roomBookingOrderDistrictListModal.length > 0
                                                                ?
                                                                roomBookingOrderDistrictListModal.map((district, key) => {
                                                                    return (
                                                                        <MenuItem value={district.district_id}> {district.district_name} </MenuItem>
                                                                    )
                                                                })
                                                                :
                                                                <MenuItem value="">-- B???n ch??a ch???n Th??nh ph??? -- </MenuItem>
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </div>
                                        <div className="col-lg-4" style={{ display: "flex", flexDirection: "column" }}>
                                            <FormSpan>Thu???c X??:</FormSpan>
                                            <Box sx={{ minWidth: 120, margin: "5px 0" }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label"></InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={roomBookingOrderWardIdModal}
                                                        label="Age"
                                                        sx={{
                                                            '& legend': { display: 'none' },
                                                            '& fieldset': { top: 0 }
                                                        }}
                                                        onChange={(e) => setRoomBookingOrderWardIdModal(e.target.value)}
                                                    >    {
                                                            roomBookingOrderWardListModal.length > 0
                                                                ?
                                                                roomBookingOrderWardListModal.map((ward, key) => {
                                                                    return (
                                                                        <MenuItem value={ward.ward_id}> {ward.ward_name} </MenuItem>
                                                                    )
                                                                })
                                                                :
                                                                <MenuItem value="">-- B???n ch??a ch???n Qu???n huy???n -- </MenuItem>
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </div>
                                    </div>
                                </ModalFormItem>

                                <ModalFormItem>
                                    <FormSpan>Email Kh??ch h??ng:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Email ???? ?????t ph??ng"
                                        value={roomBookingOrderEmailModal}
                                        onChange={(e) => handleChangeEmail(e)}
                                    />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>S??? ??i???n tho???i:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="S??? ??i???n tho???i ???? ?????t ph??ng"
                                        value={roomBookingOrderPhoneNumberModal}
                                        onChange={(e) => handleChangePhoneNumber(e)} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCheckin(
                                            roomBookingOrderFirstNameModal,
                                            roomBookingOrderLastNameModal,
                                            roomBookingOrderEmailModal,
                                            roomBookingOrderPhoneNumberModal,
                                            roomBookingOrderIdentityCardModal,
                                            roomBookingOrderNationModal,
                                            roomBookingOrderAddressModal,
                                            roomBookingOrderWardIdModal,
                                            roomBookingOrderIdModal
                                        )}
                                    >Check in</ButtonClick>
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
    // =============== Checkout ===============
    if (type === "checkout") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal} >
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>B???n mu???n Check out <span style={{ color: `var(--color-primary)` }}>{roomBookingOrder ? roomBookingOrder.room_name : null}</span> n??y?</h1>
                                    <p style={{ marginTop: "10px" }}>?????m b???o Kh??ch h??ng ???? thanh to??n Ph??? ph?? tr?????c khi ti???n h??nh Check out!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCheckout(roomBookingOrderIdModal)}
                                    >Check out</ButtonClick>
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
    //  =============== Xem chi ti???t Ph??ng ===============
    if (type === "detailRoomBookingOrder") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Chi ti???t ?????t ph??ng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Th??ng tin ?????t ph??ng</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Th???i gian: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">T??? ng??y {roomBookingOrderModal ? roomBookingOrderModal.room_booking_detail_checkin_date : null} ?????n {roomBookingOrderModal ? roomBookingOrderModal.room_booking_detail_checkout_date : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Tr???ng th??i: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_state === 2 ? "Ho??n th??nh l??c: " + roomBookingOrderModal.room_booking_order_finish_date : roomBookingOrderModal.room_booking_order_state === 1 ? "???? checkin l??c: " + roomBookingOrderModal.room_booking_order_start_date : roomBookingOrderModal.room_booking_order_state === 0 ? "???? ?????t l??c: " + roomBookingOrderModal.room_booking_order_book_date : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={roomBookingOrderModal ? roomBookingOrderModal.room_image_content : null} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {roomBookingOrderModal ? roomBookingOrderModal.room_name + ", " + roomBookingOrderModal.floor_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_price : null} VN??</span>
                                                        </Content>
                                                        <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>1</span> x {roomBookingOrderModal ? roomBookingOrderModal.room_type_name : null}</span>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItem2 className="row">
                                                <LeftVoteTitle>Th??ng tin Kh??ch h??ng</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">H??? t??n: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.customer_first_name + " " + roomBookingOrderModal.customer_last_name : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Ch???ng minh th??: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_state === 0 ? "Ch??a Checkin" : roomBookingOrderModal.room_booking_order_identity_card : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Qu???c t???ch: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_state === 0 ? "Ch??a Checkin" : roomBookingOrderModal.room_booking_order_nation : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">?????a ch???: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_state === 0 ? "Ch??a Checkin" : roomBookingOrderModal.room_booking_order_address + ", " + roomBookingOrderModal.ward_name + ", " + roomBookingOrderModal.district_name + ", " + roomBookingOrderModal.city_name : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Email: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.customer_email : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">SDT: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.customer_phone_number : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                            </LeftVoteItem2>
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Th??ng tin Ph??? ph??</RightVoteTitle>
                                                <Surcharge className="col-lg-12">
                                                    {
                                                        roomBookingFoodDetailListModal.length > 0
                                                            ?
                                                            roomBookingFoodDetailListModal.map((roomBookingFoodDetail, key) => {
                                                                const foodArray = roomBookingFoodDetail.foodArray;
                                                                const bookDate = roomBookingFoodDetail.bookDate;
                                                                const total = roomBookingFoodDetail.total;
                                                                return (
                                                                    <>
                                                                        <RightVoteTitle style={{ fontSize: "1.1rem" }} className="col-lg-12">Ng??y {bookDate}: ???? ?????t <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}> {total}VN??</span></RightVoteTitle>
                                                                        {
                                                                            foodArray.map((food, key) => {
                                                                                return (
                                                                                    <CartItem>
                                                                                        <Circle />
                                                                                        <Course>
                                                                                            <Content>
                                                                                                <span style={{ width: "320px", fontWeight: "bold" }}> {food.food_name} </span>
                                                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{food.room_booking_food_detail_price} VN??</span>
                                                                                            </Content>
                                                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{food.room_booking_food_detail_quantity}</span> x {food.food_type_name}</span>
                                                                                        </Course>
                                                                                    </CartItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Kh??ch h??ng ch??a c?? Ph??? ph?? n??o!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                            </RightVoteItem>
                                            <RightVoteItem2 className="row">
                                                <RightVoteTitle>T???ng c???ng</RightVoteTitle>
                                                <InforTotal className="col-lg-12">
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Ti???n ?????t ph??ng: (???? thanh to??n) </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_price : null} VN??</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Ph??? ph??: </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_surcharge : null} VN??</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">T???ng ti???n thanh to??n khi Check out: </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_surcharge : null} VN??</InfoTotalDetail>
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
                                    >????ng</ButtonClick>
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
    //  =============== T??m ki???m & th???ng k?? ?????t ph??ng ===============
    if (type === "statisticRoomBooking") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Th???ng k?? ?????t ph??ng c???a t???ng Th??nh ph???</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-8">
                                            <StatisticTable className="row" style={{ display: isShowTable ? "block" : "none" }}>
                                                {
                                                    // ---------------- TH???NG K?? THEO QU?? - B???NG ----------------
                                                    isTotalOfCityByQuarter ? (
                                                        totalOfCityByQuarter ? (
                                                            <>
                                                                <Table style={{ marginBottom: "15px" }}>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={6}> Doanh thu Qu?? {totalOfCityByQuarter.quarter}</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Th??nh ph???</Th>
                                                                            <Th>Doanh thu th??ng {totalOfCityByQuarter.quarter === 1 ? "1" : totalOfCityByQuarter.quarter === 2 ? "4" : totalOfCityByQuarter.quarter === 3 ? "7" : totalOfCityByQuarter.quarter === 4 ? "10" : null} Qu?? {totalOfCityByQuarter.quarter}</Th>
                                                                            <Th>Doanh thu th??ng {totalOfCityByQuarter.quarter === 1 ? "2" : totalOfCityByQuarter.quarter === 2 ? "5" : totalOfCityByQuarter.quarter === 3 ? "8" : totalOfCityByQuarter.quarter === 4 ? "11" : null} Qu?? {totalOfCityByQuarter.quarter}</Th>
                                                                            <Th>Doanh thu th??ng {totalOfCityByQuarter.quarter === 1 ? "1" : totalOfCityByQuarter.quarter === 2 ? "6" : totalOfCityByQuarter.quarter === 3 ? "9" : totalOfCityByQuarter.quarter === 4 ? "12" : null} Qu?? {totalOfCityByQuarter.quarter}</Th>
                                                                            <Th>Doanh thu C??? n??m</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalOfCityByQuarter.data.map((city, key) => {
                                                                                return (
                                                                                    <Tr>
                                                                                        <Td>{key + 1}</Td>
                                                                                        <Td>{city.city_name}</Td>
                                                                                        <Td>{city.monthFirst}</Td>
                                                                                        <Td>{city.monthSecond}</Td>
                                                                                        <Td>{city.monthThird}</Td>
                                                                                        <Td>{city.canam}</Td>
                                                                                    </Tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                                {/* B???ng chi ti???t ?????t ph??ng theo Qu?? th???ng k?? */}
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh s??ch ?????t ph??ng theo Qu?? th???ng k??</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>H??? t??n</Th>
                                                                            <Th>S??T</Th>
                                                                            <Th>?????a ch???</Th>
                                                                            <Th>Ng??y Checkin</Th>
                                                                            <Th>Ng??y Checkout</Th>
                                                                            <Th>Lo???i ph??ng</Th>
                                                                            <Th>V??? tr?? Ph??ng</Th>
                                                                            <Th>T???ng ti???n</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalOfCityByQuarterDataTable.length > 0 ? (
                                                                                totalOfCityByQuarterDataTable.map((roomBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                            <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                                    // ---------------- TH???NG K?? THEO NG??Y - B???NG ----------------
                                                    isTotalOfCityByDate ? (
                                                        totalOfCityByDate ? (
                                                            <>
                                                                {
                                                                    totalOfCityByDate.data.map((date, key) => {
                                                                        return (
                                                                            <Table style={{ marginBottom: "15px" }}>
                                                                                <Thead>
                                                                                    <Tr>
                                                                                        <Th colSpan={3}> Doanh thu Ng??y {date.date}</Th>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Th>STT</Th>
                                                                                        <Th>Th??nh ph???</Th>
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
                                                                                                    <Td>{row.total}</Td>
                                                                                                </Tr>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </Tbody>
                                                                            </Table>
                                                                        )
                                                                    })
                                                                }
                                                                {/* B???ng chi ti???t ?????t ph??ng theo ng??y th???ng k?? */}
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh s??ch ?????t ph??ng theo ng??y th???ng k??</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>H??? t??n</Th>
                                                                            <Th>S??T</Th>
                                                                            <Th>?????a ch???</Th>
                                                                            <Th>Ng??y Checkin</Th>
                                                                            <Th>Ng??y Checkout</Th>
                                                                            <Th>Lo???i ph??ng</Th>
                                                                            <Th>V??? tr?? Ph??ng</Th>
                                                                            <Th>T???ng ti???n</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalOfCityByDateDataTable.length > 0 ? (
                                                                                totalOfCityByDateDataTable.map((roomBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                            <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                                    // ---------------- TH???NG K?? THEO 4 QU?? M???C ?????NH - B???NG ----------------
                                                    isTotalOfCityForEachQuarter ? (
                                                        totalOfCityForEachQuarter ? (
                                                            <>
                                                                {
                                                                    totalOfCityForEachQuarter.data.map((city, key) => {
                                                                        return (
                                                                            <Table style={{ marginBottom: "15px" }}>
                                                                                <Thead>
                                                                                    <Tr>
                                                                                        <Th colSpan={3}>{city.city_name} - c?? doanh thu cao th???: {key + 1}</Th>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Th>STT</Th>
                                                                                        <Th>Qu??</Th>
                                                                                        <Th>Doanh thu</Th>
                                                                                    </Tr>
                                                                                </Thead>
                                                                                <Tbody>
                                                                                    <Tr>
                                                                                        <Td>1</Td>
                                                                                        <Td>Qu?? 1</Td>
                                                                                        <Td>{city.quy1}</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td>2</Td>
                                                                                        <Td>Qu?? 2</Td>
                                                                                        <Td>{city.quy2}</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td>3</Td>
                                                                                        <Td>Qu?? 3</Td>
                                                                                        <Td>{city.quy3}</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td>4</Td>
                                                                                        <Td>Qu?? 4</Td>
                                                                                        <Td>{city.quy4}</Td>
                                                                                    </Tr>
                                                                                    <Tr>
                                                                                        <Td>5</Td>
                                                                                        <Td>C??? n??m</Td>
                                                                                        <Td>{city.canam}</Td>
                                                                                    </Tr>
                                                                                </Tbody>
                                                                            </Table>
                                                                        )
                                                                    })
                                                                }
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh s??ch ?????t ph??ng c???a Top 5 Th??nh ph???</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>H??? t??n</Th>
                                                                            <Th>S??T</Th>
                                                                            <Th>?????a ch???</Th>
                                                                            <Th>Ng??y Checkin</Th>
                                                                            <Th>Ng??y Checkout</Th>
                                                                            <Th>Lo???i ph??ng</Th>
                                                                            <Th>V??? tr?? Ph??ng</Th>
                                                                            <Th>T???ng ti???n</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalOfCityForEachQuarterDataTable.length > 0 ? (
                                                                                totalOfCityForEachQuarterDataTable.map((roomBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                            <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                            {/* Bi???u ????? */}
                                            <LeftVoteItem className="row" style={{ display: isShowChart ? "block" : "none" }}>
                                                {
                                                    // ---------------- TH???NG K?? THEO DOANH THU - THEO QU?? ----------------
                                                    isTotalOfCityByQuarter ? (
                                                        totalOfCityByQuarter ? (
                                                            <>
                                                                <TooltipMui
                                                                    title={totalOfCityByQuarter ? "C???p nh???t l??c " + totalOfCityByQuarter.statisticDate : null}
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
                                                                    <LeftVoteTitle>Th???ng k?? Doanh thu ?????t ph??ng c???a c??c Th??nh ph??? theo Th??ng trong Qu??</LeftVoteTitle>
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
                                                    // ---------------- TH???NG K?? THEO DOANH THU - THEO NG??Y ----------------
                                                    isTotalOfCityByDate ? (
                                                        totalOfCityByDate ? (
                                                            <>
                                                                <TooltipMui
                                                                    title={totalOfCityByDate ? "C???p nh???t l??c " + totalOfCityByDate.statisticDate : null}
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
                                                                    <LeftVoteTitle>Th???ng k?? Doanh thu ?????t ph??ng c???a c??c Th??nh ph??? theo Ng??y</LeftVoteTitle>
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
                                                    // ---------------- TH???NG K?? THEO DOANH THU TOP 5 TP 4 QU?? - M???C ?????NH ----------------
                                                    isTotalOfCityForEachQuarter ? (
                                                        <>
                                                            <TooltipMui
                                                                title={totalOfCityForEachQuarter ? "C???p nh???t l??c " + totalOfCityForEachQuarter.statisticDate : null}
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
                                                                <LeftVoteTitle>Th???ng k?? 5 Th??nh ph??? c?? doanh thu ?????t ph??ng cao nh???t c??c Qu?? 2022</LeftVoteTitle>
                                                            </TooltipMui>
                                                            <Line
                                                                ref={statisticImageTotalForEachQuarterCity}
                                                                data={{
                                                                    labels: ["Qu?? 1", "Qu?? 2", "Qu?? 3", "Qu?? 4"],
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
                                                            title={"Hi???n bi???u ?????"}
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
                                                            title={"???n bi???u ?????"}
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
                                                    // Khi state isQuarter th?? hi???n pdf c???a quarter
                                                    isTotalOfCityByQuarter ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileCityByQuarter dataTable={totalOfCityByQuarterDataTable} data={totalOfCityByQuarter} image={totalOfCityByQuarterPDFImage} />} fileName="BaoCaoThongKeDoanhThuThanhPhoTheoQuy.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"??ang xu???t ra file PDF Qu?? - Th??nh ph???"}
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
                                                                                title={"Xu???t ra file PDF Qu?? - Th??nh ph???"}
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
                                                    // Khi state isDate th?? hi???n pdf c???a date
                                                    isTotalOfCityByDate ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileCityByDate dataTable={totalOfCityByDateDataTable} data={totalOfCityByDate} image={totalOfCityByDatePDFImage} />} fileName="BaoCaoThongKeDoanhThuTheoNgay.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"??ang xu???t ra file PDF theo ng??y - Th??nh ph???"}
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
                                                                                title={"Xu???t ra file PDF theo ng??y - Th??nh ph???"}
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
                                                    // M???c ?????nh th?? pdf c???a 4 qu??
                                                    isTotalOfCityForEachQuarter ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileCity dataTable={totalOfCityForEachQuarterDataTable} data={totalOfCityForEachQuarter} image={totalOfCityForEachQuarterPDFImage} />} fileName="BaoCaoThongKeDoanhThuThanhPho.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"??ang xu???t ra file PDF 4 qu?? - Th??nh ph???"}
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
                                                                                title={"Xu???t ra file PDF 4 qu?? - Th??nh ph???"}
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

                                                {/* ---------------- BUTTON XU???T EXCEL ---------------- */}
                                                <TooltipMui
                                                    title={"Xu???t ra file Excel - Th??nh ph???"}
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

                                                {/* ---------------- BUTTON XU???T EXCEL CHI TI???T ---------------- */}
                                                <TooltipMui
                                                    title={"Xu???t ra file Excel Chi ti???t - Th??nh ph???"}
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
                                                <FilterStatisticTitle className="col-lg-12">Th???ng k?? theo</FilterStatisticTitle>

                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWay === "byQuarter" ? true : false} value={"byQuarter"} onClick={(e) => handleCheckByQuarter(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo qu??
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWay === "byDate" ? true : false} value={"byDate"} onClick={(e) => handleCheckByDate(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo ng??y
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            {
                                                statisticWay && statisticWay === "byDate" ? (
                                                    // ---------------- TH???NG K?? THEO NG??Y ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>T??? ng??y:</FilterSpan>

                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ng??y b???t ?????u"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        maxDate={new Date()}
                                                                        value={startDate}
                                                                        onChange={(newValue) => handleChangeStartDate(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>

                                                            <FilterSpan>?????n ng??y:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ng??y k???t th??c"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        minDate={startDate}
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
                                                    // ---------------- TH???NG K?? THEO QU?? ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Ch???n qu??:</FilterSpan>
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
                                                                        <MenuItem value={1}>Qu?? 1: T??? ?????u th??ng 1 cho ?????n h???t th??ng 3.</MenuItem>
                                                                        <MenuItem value={2}>Qu?? 2: T??? ?????u th??ng 4 cho ?????n h???t th??ng 6.</MenuItem>
                                                                        <MenuItem value={3}>Qu?? 3: T??? ?????u th??ng 7 cho ?????n h???t th??ng 9.</MenuItem>
                                                                        <MenuItem value={4}>Qu?? 4: T??? ?????u th??ng 10 cho ?????n h???t th??ng 12.</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </div>
                                                    </FilterStatisticItem>
                                                )
                                            }


                                            <FilterStatisticItem className="row" style={{ marginBottom: "10px", paddingBottom: "5px" }}>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">S??? l?????ng Th??nh ph??? hi???n th???</FilterStatisticTitle>
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
                                                            T???t c???
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Hi???n th??? k???t qu??? theo Doanh thu c??? n??m</FilterStatisticTitle>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWay === "desc" ? true : false} value={"desc"} onClick={(e) => handleCheckDesc(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Gi???m d???n
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWay === "asc" ? true : false} value={"asc"} onClick={(e) => handleCheckAsc(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            T??ng d???n
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            <FormChucNang style={{ marginTop: "0" }}>
                                                <SignInBtn
                                                    onClick={(e) => handleStatisticOfCity(e, statisticWay, startDate, finishDate, quarter, sortWay, limit)}
                                                >Th???ng k??</SignInBtn>
                                            </FormChucNang>
                                        </FilterStatistic>
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
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    //  =============== T??m ki???m & th???ng k?? ?????t ph??ng Doanh thu ===============
    if (type === "statisticRoomBookingTotal") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Th???ng k?? Doanh thu ?????t ph??ng - Kh??ch s???n</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-8">
                                            <StatisticTable className="row" style={{ display: isShowTableTotal ? "block" : "none" }}>
                                                {
                                                    // ---------------- TH???NG K?? THEO QU?? - B???NG ----------------
                                                    isStatisticRoomBookingOrderTotalByQuarter ? (
                                                        statisticRoomBookingOrderTotalByQuarter ? (
                                                            <>
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Th??ng</Th>
                                                                            <Th>Doanh thu</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            statisticRoomBookingOrderTotalByQuarter.data.map((row, key) => {
                                                                                return (
                                                                                    <Tr>
                                                                                        <Td>{key + 1}</Td>
                                                                                        <Td>{row.month}</Td>
                                                                                        <Td>{row.data}</Td>
                                                                                    </Tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                                {/* B???ng chi ti???t ?????t ph??ng theo Qu?? th???ng k?? */}
                                                                <Table style={{ marginTop: "20px" }}>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh s??ch ?????t ph??ng theo Qu?? th???ng k??</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>H??? t??n</Th>
                                                                            <Th>S??T</Th>
                                                                            <Th>?????a ch???</Th>
                                                                            <Th>Ng??y Checkin</Th>
                                                                            <Th>Ng??y Checkout</Th>
                                                                            <Th>Lo???i ph??ng</Th>
                                                                            <Th>V??? tr?? Ph??ng</Th>
                                                                            <Th>T???ng ti???n</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            statisticByQuarterDataTable.length > 0 ? (
                                                                                statisticByQuarterDataTable.map((roomBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                            <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                                    // ---------------- TH???NG K?? THEO NG??Y - B???NG ----------------
                                                    isStatisticRoomBookingOrderTotalByDate ? (
                                                        statisticRoomBookingOrderTotalByDate ? (
                                                            <>
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Ng??y</Th>
                                                                            <Th>Doanh thu</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            statisticRoomBookingOrderTotalByDate.data.map((row, key) => {
                                                                                return (
                                                                                    <Tr>
                                                                                        <Td>{key + 1}</Td>
                                                                                        <Td>{row.date}</Td>
                                                                                        <Td>{row.data}</Td>
                                                                                    </Tr>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Tbody>
                                                                </Table>
                                                                {/* B???ng chi ti???t ?????t ph??ng theo ng??y th???ng k?? */}
                                                                <Table style={{ marginTop: "20px" }}>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh s??ch ?????t ph??ng theo ng??y th???ng k??</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>H??? t??n</Th>
                                                                            <Th>S??T</Th>
                                                                            <Th>?????a ch???</Th>
                                                                            <Th>Ng??y Checkin</Th>
                                                                            <Th>Ng??y Checkout</Th>
                                                                            <Th>Lo???i ph??ng</Th>
                                                                            <Th>V??? tr?? Ph??ng</Th>
                                                                            <Th>T???ng ti???n</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            statisticByDateDataTable.length > 0 ? (
                                                                                statisticByDateDataTable.map((roomBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                            <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                                    // ---------------- TH???NG K?? THEO DOANH THU C??C QU?? - B???NG M???C ?????NH ----------------
                                                    isTotalForEachMonth ?
                                                        totalForEachMonthObject ? (
                                                            <>
                                                                <Table>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>Qu??</Th>
                                                                            <Th>Doanh thu</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        <Tr>
                                                                            <Td>1</Td>
                                                                            <Td>Qu?? 1</Td>
                                                                            <Td>{totalForEachMonthObject.data.quy1}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td>2</Td>
                                                                            <Td>Qu?? 2</Td>
                                                                            <Td>{totalForEachMonthObject.data.quy2}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td>3</Td>
                                                                            <Td>Qu?? 3</Td>
                                                                            <Td>{totalForEachMonthObject.data.quy3}</Td>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Td>4</Td>
                                                                            <Td>Qu?? 4</Td>
                                                                            <Td>{totalForEachMonthObject.data.quy4}</Td>
                                                                        </Tr>
                                                                    </Tbody>
                                                                </Table>
                                                                {/* B???ng chi ti???t ?????t ph??ng theo 4 qu?? th???ng k?? */}
                                                                <Table style={{ marginTop: "20px" }}>
                                                                    <Thead>
                                                                        <Tr>
                                                                            <Th colSpan={9}>Danh s??ch ?????t ph??ng theo 4 Qu?? th???ng k??</Th>
                                                                        </Tr>
                                                                        <Tr>
                                                                            <Th>STT</Th>
                                                                            <Th>H??? t??n</Th>
                                                                            <Th>S??T</Th>
                                                                            <Th>?????a ch???</Th>
                                                                            <Th>Ng??y Checkin</Th>
                                                                            <Th>Ng??y Checkout</Th>
                                                                            <Th>Lo???i ph??ng</Th>
                                                                            <Th>V??? tr?? Ph??ng</Th>
                                                                            <Th>T???ng ti???n</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {
                                                                            totalForEachMonthDataTable.length > 0 ? (
                                                                                totalForEachMonthDataTable.map((roomBookingOrder, key) => {
                                                                                    return (
                                                                                        <Tr>
                                                                                            <Td>{key + 1}</Td>
                                                                                            <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                            <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                            <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                            <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                            <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                            {/* Bi???u ????? */}
                                            <LeftVoteItem className="row" style={{ display: isShowChartTotal ? "block" : "none" }}>
                                                {
                                                    // ---------------- TH???NG K?? THEO DOANH THU - THEO QU?? ----------------
                                                    isStatisticRoomBookingOrderTotalByQuarter ? (
                                                        statisticRoomBookingOrderTotalByQuarter ? (
                                                            <>
                                                                <TooltipMui
                                                                    title={statisticRoomBookingOrderTotalByQuarter ? "C???p nh???t l??c " + statisticRoomBookingOrderTotalByQuarter.statisticDate : null}
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
                                                                    <LeftVoteTitle>Th???ng k?? Doanh thu ?????t ph??ng theo Th??ng trong Qu??</LeftVoteTitle>
                                                                </TooltipMui>
                                                                <Bar
                                                                    ref={statisticImageByQuarter}
                                                                    data={{
                                                                        labels: statisticRoomBookingOrderTotalByQuarter ?
                                                                            statisticRoomBookingOrderTotalByQuarter.monthArray : null,
                                                                        datasets: [
                                                                            statisticRoomBookingOrderTotalByQuarter ?
                                                                                {
                                                                                    data: statisticRoomBookingOrderTotalByQuarter.dataArray,
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
                                                    // ---------------- TH???NG K?? THEO DOANH THU - THEO NG??Y ----------------
                                                    isStatisticRoomBookingOrderTotalByDate ? (
                                                        statisticRoomBookingOrderTotalByDate ? (
                                                            <>
                                                                <TooltipMui
                                                                    title={statisticRoomBookingOrderTotalByDate ? "C???p nh???t l??c " + statisticRoomBookingOrderTotalByDate.statisticDate : null}
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
                                                                    <LeftVoteTitle>Th???ng k?? Doanh thu ?????t ph??ng theo Ng??y</LeftVoteTitle>
                                                                </TooltipMui>
                                                                <Line
                                                                    ref={statisticImageByDate}
                                                                    data={{
                                                                        labels: statisticRoomBookingOrderTotalByDate ?
                                                                            statisticRoomBookingOrderTotalByDate.dateArray : null,
                                                                        datasets: [
                                                                            statisticRoomBookingOrderTotalByDate ?
                                                                                {
                                                                                    data: statisticRoomBookingOrderTotalByDate.dataArray,
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
                                                    // ---------------- TH???NG K?? THEO DOANH THU C??C QU?? - M???C ?????NH ----------------
                                                    isTotalForEachMonth ? (
                                                        <>
                                                            <TooltipMui
                                                                title={totalForEachMonthUpdateDate ? "C???p nh???t l??c " + totalForEachMonthUpdateDate : null}
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
                                                                <LeftVoteTitle>Doanh thu ?????t ph??ng - Kh??ch s???n theo Qu?? n??m 2022</LeftVoteTitle>
                                                            </TooltipMui>
                                                            <Bar
                                                                ref={statisticImageTotalForEachMonth}
                                                                data={{
                                                                    labels: ["Qu?? 1", "Qu?? 2", "Qu?? 3", "Qu?? 4"],
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
                                                    // ---------------- BUTTON HI???N BI???U ????? ----------------
                                                    isShowTableTotal ? (
                                                        <TooltipMui
                                                            title={"Hi???n bi???u ?????"}
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
                                                    // ---------------- BUTTON ???N BI???U ????? ----------------
                                                    isShowChartTotal ? (
                                                        <TooltipMui
                                                            title={"???n bi???u ?????"}
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
                                                    // Khi state isQuarter th?? hi???n pdf c???a quarter
                                                    isStatisticRoomBookingOrderTotalByQuarter ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileByQuarter data={statisticRoomBookingOrderTotalByQuarter} image={statisticByQuarterPDFImage} dataTable={statisticByQuarterDataTable} />} fileName="BaoCaoThongKeDoanhThuTheoQuy.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"Xu???t ra file PDF - Quarter"}
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
                                                                                title={"Xu???t ra file PDF theo qu??"}
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
                                                    // Khi state isDate th?? hi???n pdf c???a date
                                                    isStatisticRoomBookingOrderTotalByDate ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFileByDate data={statisticRoomBookingOrderTotalByDate} image={statisticByDatePDFImage} dataTable={statisticByDateDataTable} />} fileName="BaoCaoThongKeDoanhThuTheoNgay.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"Xu???t ra file PDF"}
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
                                                                                title={"Xu???t ra file PDF theo ng??y"}
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
                                                    // M???c ?????nh th?? pdf c???a 4 qu??
                                                    isTotalForEachMonth ?
                                                        (
                                                            <div>
                                                                <PDFDownloadLink document={<PDFFile data={totalForEachMonthObject} image={totalForEachMonthPDFImage} dataTable={totalForEachMonthDataTable} />} fileName="BaoCaoThongKeDoanhThu.pdf">
                                                                    {({ blob, url, loading, error }) =>
                                                                        loading ? (
                                                                            <TooltipMui
                                                                                title={"Xu???t ra file PDF"}
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
                                                                                title={"Xu???t ra file PDF"}
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

                                                {/* ---------------- BUTTON XU???T EXCEL ---------------- */}
                                                <TooltipMui
                                                    title={"Xu???t ra file Excel"}
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

                                                {/* ---------------- BUTTON XU???T EXCEL CHI TI???T ---------------- */}
                                                <TooltipMui
                                                    title={"Xu???t ra file Excel Chi ti???t - Th??nh ph???"}
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
                                                <FilterStatisticTitle className="col-lg-12">Th???ng k?? theo</FilterStatisticTitle>

                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row">
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayTotal === "byQuarter" ? true : false} value={"byQuarter"} onClick={(e) => handleCheckByQuarterTotal(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo qu??
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row">
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayTotal === "byDate" ? true : false} value={"byDate"} onClick={(e) => handleCheckByDateTotal(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo ng??y
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            {
                                                statisticWayTotal && statisticWayTotal === "byDate" ? (
                                                    // ---------------- TH???NG K?? THEO NG??Y ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>T??? ng??y:</FilterSpan>

                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ng??y b???t ?????u"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        maxDate={new Date()}
                                                                        value={startDateTotal}
                                                                        onChange={(newValue) => handleChangeStartDateTotal(newValue)}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                        InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                                                                    />
                                                                </Stack>
                                                            </LocalizationProvider>

                                                            <FilterSpan>?????n ng??y:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ng??y k???t th??c"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        minDate={startDateTotal}
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
                                                    // ---------------- TH???NG K?? THEO QU?? ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Ch???n qu??:</FilterSpan>
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
                                                                        <MenuItem value={1}>Qu?? 1: T??? ?????u th??ng 1 cho ?????n h???t th??ng 3.</MenuItem>
                                                                        <MenuItem value={2}>Qu?? 2: T??? ?????u th??ng 4 cho ?????n h???t th??ng 6.</MenuItem>
                                                                        <MenuItem value={3}>Qu?? 3: T??? ?????u th??ng 7 cho ?????n h???t th??ng 9.</MenuItem>
                                                                        <MenuItem value={4}>Qu?? 4: T??? ?????u th??ng 10 cho ?????n h???t th??ng 12.</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </div>
                                                    </FilterStatisticItem>
                                                )
                                            }

                                            <FilterStatisticItem className="row" style={{ marginBottom: "10px", paddingBottom: "5px" }}>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Hi???n th??? k???t qu??? theo</FilterStatisticTitle>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row">
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayTotal === "desc" ? true : false} value={"desc"} onClick={(e) => handleCheckDescTotal(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Gi???m d???n
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row">
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayTotal === "asc" ? true : false} value={"asc"} onClick={(e) => handleCheckAscTotal(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            T??ng d???n
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            <FormChucNang style={{ marginTop: "0" }}>
                                                <SignInBtn
                                                    onClick={(e) => handleStatistic(e, statisticWayTotal, startDateTotal, finishDateTotal, quarterTotal, sortWayTotal)}
                                                >Th???ng k??</SignInBtn>
                                            </FormChucNang>
                                        </FilterStatistic>
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
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    //  =============== T??m ki???m & th???ng k?? doanh thu theo Lo???i ph??ng ===============
    if (type === "statisticRoomBookingByType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Th???ng k?? Doanh thu ?????t ph??ng - Kh??ch s???n theo Lo???i ph??ng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        {
                                            !isStatisticRoomBookingOrderTypeByDate && !isStatisticRoomBookingOrderTypeByQuarter ? (
                                                <LeftVote className="col-lg-8">
                                                    <EmptyItem>
                                                        <EmptyItemSvg>
                                                            <img src="https://i.ibb.co/GdjDwGT/pie-chart.png" alt="" />
                                                        </EmptyItemSvg>
                                                        <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Kh??ng c?? k???t qu??? th???ng k?? ph?? h???p</EmptyContent>
                                                    </EmptyItem>
                                                </LeftVote>
                                            ) : (
                                                <LeftVote className="col-lg-8">
                                                    <StatisticTable className="row" style={{ display: isShowTableType ? "block" : "none" }}>
                                                        {
                                                            // ---------------- TH???NG K?? THEO QU?? - B???NG ----------------
                                                            isStatisticRoomBookingOrderTypeByQuarter ? (
                                                                statisticRoomBookingOrderTypeByQuarter ? (
                                                                    <>
                                                                        <Table>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>T??n Lo???i ph??ng</Th>
                                                                                    <Th>Th??ng ?????u Qu?? {statisticRoomBookingOrderTypeByQuarter.quarter}</Th>
                                                                                    <Th>Th??ng gi???a Qu?? {statisticRoomBookingOrderTypeByQuarter.quarter}</Th>
                                                                                    <Th>Th??ng cu???i Qu?? {statisticRoomBookingOrderTypeByQuarter.quarter}</Th>
                                                                                    <Th>Doanh thu c??? n??m</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticRoomBookingOrderTypeByQuarter.data.map((row, key) => {
                                                                                        const totalDataRes = row.totalData;
                                                                                        return (
                                                                                            <Tr>
                                                                                                <Td>{key + 1}</Td>
                                                                                                <Td>{totalDataRes.room_type_name}</Td>
                                                                                                <Td>{totalDataRes.monthFirst}</Td>
                                                                                                <Td>{totalDataRes.monthSecond}</Td>
                                                                                                <Td>{totalDataRes.monthThird}</Td>
                                                                                                <Td>{totalDataRes.canam}</Td>
                                                                                            </Tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Tbody>
                                                                        </Table>
                                                                        {/* B???ng chi ti???t ?????t ph??ng theo Qu?? th???ng k?? */}
                                                                        <Table style={{ marginTop: "20px" }}>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th colSpan={9}>Danh s??ch ?????t ph??ng c???a Lo???i Ph??ng theo Qu?? th???ng k??</Th>
                                                                                </Tr>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>H??? t??n</Th>
                                                                                    <Th>S??T</Th>
                                                                                    <Th>?????a ch???</Th>
                                                                                    <Th>Ng??y Checkin</Th>
                                                                                    <Th>Ng??y Checkout</Th>
                                                                                    <Th>Lo???i ph??ng</Th>
                                                                                    <Th>V??? tr?? Ph??ng</Th>
                                                                                    <Th>T???ng ti???n</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticTypeByQuarterDataTable.length > 0 ? (
                                                                                        statisticTypeByQuarterDataTable.map((roomBookingOrder, key) => {
                                                                                            return (
                                                                                                <Tr>
                                                                                                    <Td>{key + 1}</Td>
                                                                                                    <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                                    <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                                    <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                                    <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                                            // ---------------- TH???NG K?? THEO NG??Y - B???NG ----------------
                                                            isStatisticRoomBookingOrderTypeByDate ? (
                                                                isStatisticRoomBookingOrderTypeByDate ? (
                                                                    <>
                                                                        {
                                                                            statisticRoomBookingOrderTypeByDate.dataArray.map((statisticRow, key) => {
                                                                                const date = statisticRow.date;
                                                                                const dataArray = statisticRow.dataArray;
                                                                                return (
                                                                                    <Table style={{ marginBottom: "15px" }}>
                                                                                        <Thead>
                                                                                            <Tr>
                                                                                                <Th colSpan={3}> Doanh thu Ng??y {date}</Th>
                                                                                            </Tr>
                                                                                            <Tr>
                                                                                                <Th>STT</Th>
                                                                                                <Th>Lo???i ph??ng</Th>
                                                                                                <Th>Doanh thu</Th>
                                                                                            </Tr>
                                                                                        </Thead>
                                                                                        <Tbody>
                                                                                            {
                                                                                                dataArray.map((row, key) => {
                                                                                                    return (
                                                                                                        <Tr>
                                                                                                            <Td>{key + 1}</Td>
                                                                                                            <Td>{row.totalData.room_type_name}</Td>
                                                                                                            <Td>{row.totalData.total}</Td>
                                                                                                        </Tr>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </Tbody>
                                                                                    </Table>
                                                                                )
                                                                            })
                                                                        }
                                                                        {/* B???ng chi ti???t ?????t ph??ng theo ng??y th???ng k?? */}
                                                                        <Table>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th colSpan={9}>Danh s??ch ?????t ph??ng theo ng??y th???ng k??</Th>
                                                                                </Tr>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>H??? t??n</Th>
                                                                                    <Th>S??T</Th>
                                                                                    <Th>?????a ch???</Th>
                                                                                    <Th>Ng??y Checkin</Th>
                                                                                    <Th>Ng??y Checkout</Th>
                                                                                    <Th>Lo???i ph??ng</Th>
                                                                                    <Th>V??? tr?? Ph??ng</Th>
                                                                                    <Th>T???ng ti???n</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticTypeByDateDataTable.length > 0 ? (
                                                                                        statisticTypeByDateDataTable.map((roomBookingOrder, key) => {
                                                                                            return (
                                                                                                <Tr>
                                                                                                    <Td>{key + 1}</Td>
                                                                                                    <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                                    <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                                    <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                                    <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                                    {/* Bi???u ????? */}
                                                    <LeftVoteItem className="row" style={{ display: isShowChartType ? "block" : "none" }}>
                                                        {
                                                            // ---------------- TH???NG K?? THEO DOANH THU - THEO QU?? ----------------
                                                            isStatisticRoomBookingOrderTypeByQuarter ? (
                                                                statisticRoomBookingOrderTypeByQuarter ? (
                                                                    <>
                                                                        <TooltipMui
                                                                            title={statisticRoomBookingOrderTypeByQuarter ? "C???p nh???t l??c " + statisticRoomBookingOrderTypeByQuarter.statisticDate : null}
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
                                                                            <LeftVoteTitle>Th???ng k?? Doanh thu ?????t ph??ng theo Th??ng trong Qu??</LeftVoteTitle>
                                                                        </TooltipMui>
                                                                        <Bar
                                                                            ref={statisticTypeImageByQuarter}
                                                                            data={{
                                                                                labels: statisticRoomBookingOrderTypeByQuarter ?
                                                                                    statisticRoomBookingOrderTypeByQuarter.monthArray : null,
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
                                                            // ---------------- TH???NG K?? THEO DOANH THU - THEO NG??Y ----------------
                                                            isStatisticRoomBookingOrderTypeByDate ? (
                                                                statisticRoomBookingOrderTypeByDate ? (
                                                                    <>
                                                                        <TooltipMui
                                                                            title={statisticRoomBookingOrderTypeByDate ? "C???p nh???t l??c " + statisticRoomBookingOrderTypeByDate.statisticDate : null}
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
                                                                            <LeftVoteTitle>Th???ng k?? Doanh thu ?????t ph??ng theo Ng??y</LeftVoteTitle>
                                                                        </TooltipMui>
                                                                        <Line
                                                                            ref={statisticTypeImageByDate}
                                                                            data={{
                                                                                labels: statisticRoomBookingOrderTypeByDate ?
                                                                                    statisticRoomBookingOrderTypeByDate.dateArray : null,
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
                                                            // ---------------- BUTTON HI???N BI???U ????? ----------------
                                                            isShowTableType ? (
                                                                <TooltipMui
                                                                    title={"Hi???n bi???u ?????"}
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
                                                            // ---------------- BUTTON ???N BI???U ????? ----------------
                                                            isShowChartType ? (
                                                                <TooltipMui
                                                                    title={"???n bi???u ?????"}
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
                                                            // Khi state isQuarter th?? hi???n pdf c???a quarter
                                                            isStatisticRoomBookingOrderTypeByQuarter ?
                                                                (
                                                                    <div>
                                                                        <PDFDownloadLink document={<PDFFileTypeByQuarter data={statisticRoomBookingOrderTypeByQuarter} image={statisticTypeByQuarterPDFImage} dataTable={statisticTypeByQuarterDataTable} />} fileName="BaoCaoThongKeDoanhThuLoaiPhongTheoQuy.pdf">
                                                                            {({ blob, url, loading, error }) =>
                                                                                loading ? (
                                                                                    <TooltipMui
                                                                                        title={"Xu???t ra file PDF - Quarter"}
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
                                                                                        title={"Xu???t ra file PDF theo qu??"}
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
                                                            // Khi state isDate th?? hi???n pdf c???a date
                                                            isStatisticRoomBookingOrderTypeByDate ?
                                                                (
                                                                    <div>
                                                                        <PDFDownloadLink document={<PDFFileTypeByDate data={statisticRoomBookingOrderTypeByDate} image={statisticTypeByDatePDFImage} dataTable={statisticTypeByDateDataTable} />} fileName="BaoCaoThongKeDoanhThuLoaiPhongTheoNgay.pdf">
                                                                            {({ blob, url, loading, error }) =>
                                                                                loading ? (
                                                                                    <TooltipMui
                                                                                        title={"Xu???t ra file PDF"}
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
                                                                                        title={"Xu???t ra file PDF theo ng??y"}
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

                                                        {/* ---------------- BUTTON XU???T EXCEL ---------------- */}
                                                        <TooltipMui
                                                            title={"Xu???t ra file Excel"}
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

                                                        {/* ---------------- BUTTON XU???T EXCEL CHI TI???T ---------------- */}
                                                        <TooltipMui
                                                            title={"Xu???t ra file Excel Chi ti???t - Th??nh ph???"}
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
                                                <FilterStatisticTitle className="col-lg-12">Th???ng k?? theo</FilterStatisticTitle>

                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayType === "byQuarter" ? true : false} value={"byQuarter"} onClick={(e) => handleCheckByQuarterType(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo qu??
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayType === "byDate" ? true : false} value={"byDate"} onClick={(e) => handleCheckByDateType(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo ng??y
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            {
                                                statisticWayType && statisticWayType === "byDate" ? (
                                                    // ---------------- TH???NG K?? THEO NG??Y ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>T??? ng??y:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ng??y b???t ?????u"
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
                                                            <FilterSpan>?????n ng??y:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ng??y k???t th??c"
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
                                                    // ---------------- TH???NG K?? THEO QU?? ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Ch???n qu??:</FilterSpan>
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
                                                                        <MenuItem value={1}>Qu?? 1: T??? ?????u th??ng 1 cho ?????n h???t th??ng 3.</MenuItem>
                                                                        <MenuItem value={2}>Qu?? 2: T??? ?????u th??ng 4 cho ?????n h???t th??ng 6.</MenuItem>
                                                                        <MenuItem value={3}>Qu?? 3: T??? ?????u th??ng 7 cho ?????n h???t th??ng 9.</MenuItem>
                                                                        <MenuItem value={4}>Qu?? 4: T??? ?????u th??ng 10 cho ?????n h???t th??ng 12.</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </div>
                                                    </FilterStatisticItem>
                                                )
                                            }


                                            <FilterStatisticItem className="row" style={{ marginBottom: "10px", paddingBottom: "5px" }}>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Nh???ng lo???i ph??ng mu???n th???ng k??</FilterStatisticTitle>
                                                <div className="col-lg-12">
                                                    <FormControl sx={{ m: 1, width: 380 }}>
                                                        <InputLabel id="demo-multiple-chip-label">Lo???i</InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-chip-label"
                                                            id="demo-multiple-chip"
                                                            multiple
                                                            value={roomTypeChooseList}
                                                            onChange={handleChangeRoomType}
                                                            input={<OutlinedInput id="select-multiple-chip" label="Lo???i" />}
                                                            renderValue={(selected) => (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={value} />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                            MenuProps={MenuProps}
                                                        >
                                                            {roomTypeList.map((roomType) => (
                                                                <MenuItem
                                                                    key={roomType.room_type_id}
                                                                    value={roomType.room_type_name}
                                                                    style={getStyles(roomType.room_type_id, roomTypeChooseList, theme)}
                                                                >
                                                                    {roomType.room_type_name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Hi???n th??? k???t qu??? theo Doanh thu c??? n??m</FilterStatisticTitle>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayType === "desc" ? true : false} value={"desc"} onClick={(e) => handleCheckDescType(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Gi???m d???n
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayType === "asc" ? true : false} value={"asc"} onClick={(e) => handleCheckAscType(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            T??ng d???n
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            <FormChucNang style={{ marginTop: "0" }}>
                                                <SignInBtn
                                                    onClick={(e) => handleStatisticOfType(e, statisticWayType, startDateType, finishDateType, quarterType, sortWayType, roomTypeChooseList)}
                                                >Th???ng k??</SignInBtn>
                                            </FormChucNang>
                                        </FilterStatistic>
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
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    //  =============== T??m ki???m & th???ng k?? doanh thu theo Kh??ch h??ng ===============
    if (type === "statisticRoomBookingByCustomer") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Th???ng k?? Doanh thu ?????t ph??ng - Kh??ch s???n theo Kh??ch h??ng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        {
                                            !isStatisticRoomBookingOrderCustomerByDate && !isStatisticRoomBookingOrderCustomerByQuarter ? (
                                                <LeftVote className="col-lg-8">
                                                    <EmptyItem>
                                                        <EmptyItemSvg>
                                                            <img src="https://i.ibb.co/GdjDwGT/pie-chart.png" alt="" />
                                                        </EmptyItemSvg>
                                                        <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Kh??ng c?? k???t qu??? th???ng k?? ph?? h???p</EmptyContent>
                                                    </EmptyItem>
                                                </LeftVote>
                                            ) : (
                                                <LeftVote className="col-lg-8">
                                                    <StatisticTable className="row" style={{ display: isShowTableCustomer ? "block" : "none" }}>
                                                        {
                                                            // ---------------- TH???NG K?? THEO QU?? - B???NG ----------------
                                                            isStatisticRoomBookingOrderCustomerByQuarter ? (
                                                                statisticRoomBookingOrderCustomerByQuarter ? (
                                                                    <>
                                                                        <Table>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>T??n Kh??ch h??ng</Th>
                                                                                    <Th>Th??ng ?????u Qu?? {statisticRoomBookingOrderCustomerByQuarter.quarter}</Th>
                                                                                    <Th>Th??ng gi???a Qu?? {statisticRoomBookingOrderCustomerByQuarter.quarter}</Th>
                                                                                    <Th>Th??ng cu???i Qu?? {statisticRoomBookingOrderCustomerByQuarter.quarter}</Th>
                                                                                    <Th>Doanh thu c??? n??m</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticRoomBookingOrderCustomerByQuarter.data.map((row, key) => {
                                                                                        const totalDataRes = row.totalData;
                                                                                        return (
                                                                                            <Tr>
                                                                                                <Td>{key + 1}</Td>
                                                                                                <Td>{totalDataRes.customer_first_name + " " + totalDataRes.customer_last_name}</Td>
                                                                                                <Td>{totalDataRes.monthFirst}</Td>
                                                                                                <Td>{totalDataRes.monthSecond}</Td>
                                                                                                <Td>{totalDataRes.monthThird}</Td>
                                                                                                <Td>{totalDataRes.canam}</Td>
                                                                                            </Tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Tbody>
                                                                        </Table>
                                                                        {/* B???ng chi ti???t ?????t ph??ng theo Qu?? th???ng k?? */}
                                                                        <Table style={{ marginTop: "20px" }}>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th colSpan={9}>Danh s??ch ?????t ph??ng c???a Kh??ch h??ng theo Qu?? th???ng k??</Th>
                                                                                </Tr>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>H??? t??n</Th>
                                                                                    <Th>S??T</Th>
                                                                                    <Th>?????a ch???</Th>
                                                                                    <Th>Ng??y Checkin</Th>
                                                                                    <Th>Ng??y Checkout</Th>
                                                                                    <Th>Lo???i ph??ng</Th>
                                                                                    <Th>V??? tr?? Ph??ng</Th>
                                                                                    <Th>T???ng ti???n</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticCustomerByQuarterDataTable.length > 0 ? (
                                                                                        statisticCustomerByQuarterDataTable.map((roomBookingOrder, key) => {
                                                                                            return (
                                                                                                <Tr>
                                                                                                    <Td>{key + 1}</Td>
                                                                                                    <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                                    <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                                    <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                                    <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                                            // ---------------- TH???NG K?? THEO NG??Y - B???NG ----------------
                                                            isStatisticRoomBookingOrderCustomerByDate ? (
                                                                isStatisticRoomBookingOrderCustomerByDate ? (
                                                                    <>
                                                                        {
                                                                            statisticRoomBookingOrderCustomerByDate.dataArray.map((statisticRow, key) => {
                                                                                const date = statisticRow.date;
                                                                                const dataArray = statisticRow.dataArray;
                                                                                return (
                                                                                    <Table style={{ marginBottom: "15px" }}>
                                                                                        <Thead>
                                                                                            <Tr>
                                                                                                <Th colSpan={3}> Doanh thu Ng??y {date}</Th>
                                                                                            </Tr>
                                                                                            <Tr>
                                                                                                <Th>STT</Th>
                                                                                                <Th>Kh??ch h??ng</Th>
                                                                                                <Th>Doanh thu</Th>
                                                                                            </Tr>
                                                                                        </Thead>
                                                                                        <Tbody>
                                                                                            <Tr>
                                                                                                <Td>{key + 1}</Td>
                                                                                                <Td>{dataArray.totalData.customer_first_name + " " + dataArray.totalData.customer_last_name}</Td>
                                                                                                <Td>{dataArray.totalData.total}</Td>
                                                                                            </Tr>
                                                                                        </Tbody>
                                                                                    </Table>
                                                                                )
                                                                            })
                                                                        }
                                                                        {/* B???ng chi ti???t ?????t ph??ng theo ng??y th???ng k?? */}
                                                                        <Table>
                                                                            <Thead>
                                                                                <Tr>
                                                                                    <Th colSpan={9}>Danh s??ch ?????t ph??ng theo ng??y th???ng k??</Th>
                                                                                </Tr>
                                                                                <Tr>
                                                                                    <Th>STT</Th>
                                                                                    <Th>H??? t??n</Th>
                                                                                    <Th>S??T</Th>
                                                                                    <Th>?????a ch???</Th>
                                                                                    <Th>Ng??y Checkin</Th>
                                                                                    <Th>Ng??y Checkout</Th>
                                                                                    <Th>Lo???i ph??ng</Th>
                                                                                    <Th>V??? tr?? Ph??ng</Th>
                                                                                    <Th>T???ng ti???n</Th>
                                                                                </Tr>
                                                                            </Thead>
                                                                            <Tbody>
                                                                                {
                                                                                    statisticCustomerByDateDataTable.length > 0 ? (
                                                                                        statisticCustomerByDateDataTable.map((roomBookingOrder, key) => {
                                                                                            return (
                                                                                                <Tr>
                                                                                                    <Td>{key + 1}</Td>
                                                                                                    <Td>{roomBookingOrder.customer_first_name + " " + roomBookingOrder.customer_last_name}</Td>
                                                                                                    <Td>{roomBookingOrder.customer_phone_number}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_address + ", " + roomBookingOrder.ward_name + ", " + roomBookingOrder.district_name + ", " + roomBookingOrder.city_name}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_start_date}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_finish_date}</Td>
                                                                                                    <Td>{roomBookingOrder.room_type_name}</Td>
                                                                                                    <Td>{roomBookingOrder.floor_name + ", " + roomBookingOrder.room_name}</Td>
                                                                                                    <Td>{roomBookingOrder.room_booking_order_total}</Td>
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
                                                    {/* Bi???u ????? */}
                                                    <LeftVoteItem className="row" style={{ display: isShowChartCustomer ? "block" : "none" }}>
                                                        {
                                                            // ---------------- TH???NG K?? THEO DOANH THU - THEO QU?? ----------------
                                                            isStatisticRoomBookingOrderCustomerByQuarter ? (
                                                                statisticRoomBookingOrderCustomerByQuarter ? (
                                                                    <>
                                                                        <TooltipMui
                                                                            title={statisticRoomBookingOrderCustomerByQuarter ? "C???p nh???t l??c " + statisticRoomBookingOrderCustomerByQuarter.statisticDate : null}
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
                                                                            <LeftVoteTitle>Th???ng k?? Doanh thu ?????t ph??ng theo Th??ng trong Qu??</LeftVoteTitle>
                                                                        </TooltipMui>
                                                                        <Bar
                                                                            ref={statisticCustomerImageByQuarter}
                                                                            data={{
                                                                                labels: statisticRoomBookingOrderCustomerByQuarter ?
                                                                                    statisticRoomBookingOrderCustomerByQuarter.monthArray : null,
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
                                                            // ---------------- TH???NG K?? THEO DOANH THU - THEO NG??Y ----------------
                                                            isStatisticRoomBookingOrderCustomerByDate ? (
                                                                statisticRoomBookingOrderCustomerByDate ? (
                                                                    <>
                                                                        <TooltipMui
                                                                            title={statisticRoomBookingOrderCustomerByDate ? "C???p nh???t l??c " + statisticRoomBookingOrderCustomerByDate.statisticDate : null}
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
                                                                            <LeftVoteTitle>Th???ng k?? Doanh thu ?????t ph??ng theo Ng??y</LeftVoteTitle>
                                                                        </TooltipMui>
                                                                        <Line
                                                                            ref={statisticCustomerImageByDate}
                                                                            data={{
                                                                                labels: statisticRoomBookingOrderCustomerByDate ?
                                                                                    statisticRoomBookingOrderCustomerByDate.dateArray : null,
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
                                                            // ---------------- BUTTON HI???N BI???U ????? ----------------
                                                            isShowTableCustomer ? (
                                                                <TooltipMui
                                                                    title={"Hi???n bi???u ?????"}
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
                                                            // ---------------- BUTTON ???N BI???U ????? ----------------
                                                            isShowChartCustomer ? (
                                                                <TooltipMui
                                                                    title={"???n bi???u ?????"}
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
                                                            // Khi state isQuarter th?? hi???n pdf c???a quarter
                                                            isStatisticRoomBookingOrderCustomerByQuarter ?
                                                                (
                                                                    <div>
                                                                        <PDFDownloadLink document={<PDFFileCustomerByQuarter data={statisticRoomBookingOrderCustomerByQuarter} image={statisticCustomerByQuarterPDFImage} dataTable={statisticCustomerByQuarterDataTable} />} fileName="BaoCaoThongKeDoanhThuLoaiPhongTheoQuy.pdf">
                                                                            {({ blob, url, loading, error }) =>
                                                                                loading ? (
                                                                                    <TooltipMui
                                                                                        title={"Xu???t ra file PDF - Quarter"}
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
                                                                                        title={"Xu???t ra file PDF theo qu??"}
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
                                                            // Khi state isDate th?? hi???n pdf c???a date
                                                            isStatisticRoomBookingOrderCustomerByDate ?
                                                                (
                                                                    <div>
                                                                        <PDFDownloadLink document={<PDFFileCustomerByDate data={statisticRoomBookingOrderCustomerByDate} image={statisticCustomerByDatePDFImage} dataTable={statisticCustomerByDateDataTable} />} fileName="BaoCaoThongKeDoanhThuLoaiPhongTheoNgay.pdf">
                                                                            {({ blob, url, loading, error }) =>
                                                                                loading ? (
                                                                                    <TooltipMui
                                                                                        title={"Xu???t ra file PDF"}
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
                                                                                        title={"Xu???t ra file PDF theo ng??y"}
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

                                                        {/* ---------------- BUTTON XU???T EXCEL ---------------- */}
                                                        <TooltipMui
                                                            title={"Xu???t ra file Excel"}
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

                                                        {/* ---------------- BUTTON XU???T EXCEL CHI TI???T ---------------- */}
                                                        <TooltipMui
                                                            title={"Xu???t ra file Excel Chi ti???t - Kh??ch h??ng"}
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
                                                <FilterStatisticTitle className="col-lg-12">Th???ng k?? theo</FilterStatisticTitle>

                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayCustomer === "byQuarter" ? true : false} value={"byQuarter"} onClick={(e) => handleCheckByQuarterCustomer(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo qu??
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={statisticWayCustomer === "byDate" ? true : false} value={"byDate"} onClick={(e) => handleCheckByDateCustomer(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Theo ng??y
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            {
                                                statisticWayCustomer && statisticWayCustomer === "byDate" ? (
                                                    // ---------------- TH???NG K?? THEO NG??Y ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-6" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>T??? ng??y:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ng??y b???t ?????u"
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
                                                            <FilterSpan>?????n ng??y:</FilterSpan>
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ng??y k???t th??c"
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
                                                    // ---------------- TH???NG K?? THEO QU?? ----------------
                                                    <FilterStatisticItem className="row">
                                                        <div className="col-lg-12" style={{ display: "flex", flexDirection: "column" }}>
                                                            <FilterSpan>Ch???n qu??:</FilterSpan>
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
                                                                        <MenuItem value={1}>Qu?? 1: T??? ?????u th??ng 1 cho ?????n h???t th??ng 3.</MenuItem>
                                                                        <MenuItem value={2}>Qu?? 2: T??? ?????u th??ng 4 cho ?????n h???t th??ng 6.</MenuItem>
                                                                        <MenuItem value={3}>Qu?? 3: T??? ?????u th??ng 7 cho ?????n h???t th??ng 9.</MenuItem>
                                                                        <MenuItem value={4}>Qu?? 4: T??? ?????u th??ng 10 cho ?????n h???t th??ng 12.</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </div>
                                                    </FilterStatisticItem>
                                                )
                                            }


                                            <FilterStatisticItem className="row" style={{ marginBottom: "10px", paddingBottom: "5px" }}>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Th??ng tin Kh??ch h??ng mu???n th???ng k??</FilterStatisticTitle>
                                                <div className="col-lg-12">
                                                    <FormInput style={{ width: "100%" }} type="text"
                                                        value={customerInfo}
                                                        placeholder="Email/ S??? ??i???n tho???i Kh??ch h??ng"
                                                        onChange={(e) => handleChangeCustomerInfo(e)}
                                                    />
                                                </div>
                                                <FilterStatisticTitle style={{ fontSize: "1.1rem", padding: "10px 0 10px 0" }} className="col-lg-12">Hi???n th??? k???t qu??? theo Doanh thu c??? n??m</FilterStatisticTitle>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayCustomer === "desc" ? true : false} value={"desc"} onClick={(e) => handleCheckDescCustomer(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            Gi???m d???n
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                                <LabelCheckbox className="col-lg-6">
                                                    <ServiceItem className="row" style={{ padding: "0 10px" }}>
                                                        <div className="col-lg-4" style={{ padding: "0" }}>
                                                            <Checkbox checked={sortWayCustomer === "asc" ? true : false} value={"asc"} onClick={(e) => handleCheckAscCustomer(e)} />
                                                        </div>
                                                        <ServiceName className="col-lg-8" style={{ padding: "0" }}>
                                                            T??ng d???n
                                                        </ServiceName>
                                                    </ServiceItem>
                                                </LabelCheckbox>
                                            </FilterStatisticItem>

                                            <FormChucNang style={{ marginTop: "0" }}>
                                                <SignInBtn
                                                    onClick={(e) => handleStatisticOfCustomer(e, statisticWayCustomer, startDateCustomer, finishDateCustomer, quarterCustomer, sortWayCustomer, customerInfo)}
                                                >Th???ng k??</SignInBtn>
                                            </FormChucNang>
                                        </FilterStatistic>
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
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
};

export default Modal;