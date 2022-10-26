import { AutoGraphOutlined, BarChartOutlined, Close, InsertChart } from "@mui/icons-material";
import { Tooltip as TooltipMui } from '@mui/material';
import axios from "axios";
import {
    CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
    Tooltip
} from 'chart.js';
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Line } from 'react-chartjs-2';
// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
// Time picker
import { format_money } from '../../utils/utils';
// SERVICES
import * as StatisticService from "../../service/StatisticService";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const Container = styled.div`
    margin-top: 1.4rem;
`

const H1 = styled.h1`
    font-weight: 800;
    font-size: 1.5rem;
`

const Date = styled.div`
    display: inline-block;
    background: var(--color-light);
    border-radius: var(--border-radius-1);
    margin-top: 1rem;
    padding: 0.5rem 1.6rem;
    position: relative;
`

const InputDate = styled.input`
    background: transparent;
    color: var(--color-dark);
`

const Insights = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.6rem;
    & > div {
        background: var(--color-white);
        padding: var(--card-padding);
        border-radius: var(--card-border-radius);
        margin-top: 1rem;
        box-shadow: var(--box-shadow);
        transition: all 300 ease; 
        &:hover {
            box-shadow: none;  
        }
    }
`

const Sales = styled.div`
    // & svg circle {
    //     stroke-dashoffset: -30;
    //     stroke-dasharray: 200;
    // }
`

const Expenses = styled.div`
    // & svg circle {
    //     stroke-dashoffset: 20;
    //     stroke-dasharray: 80;
    // }
`

const Income = styled.div`
    // & svg circle {
    //     stroke-dashoffset: 35;
    //     stroke-dasharray: 110;
    // }
`

const Icon = styled.span`
    
`

const Middle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Left = styled.div`

`

const H3 = styled.h3`
    margin: 1rem 0 0.6rem;
    font-size: 1rem;
`

const Progress = styled.div`
    position: relative;
    width: 92px;
    height: 92px;
    border-radius: 50%;
`

const Svg = styled.svg`
    width: 7rem;
    height: 7rem;
`

const Circle = styled.circle`
    fill: none;
    stroke: var(--color-primary);
    stroke-width: 14;
    stroke-linecap: round;
    transform: translate(5px, 5px);
`

const ProgressNumber = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ProgressNumberP = styled.p`

`

const Small = styled.small`
    display: block;
    margin-top: 1.3rem;
`

// Recent Orders
const RecentOrders = styled.div`
    margin-top: 2rem;
`

const H2 = styled.h2`
    margin-bottom: 0.8rem;
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
`

const Th = styled.th`

`

const Tbody = styled.tbody`

`

const Td = styled.td`
    height: 2.8rem;
    border-bottom: 1px solid var(--color-light);
`

const A = styled.a`
    text-align: center;
    display: block;
    margin: 1rem auto;
    color: var(--color-primary);
`

const CloseDate = styled.div` 
    width: 40px;
    height: 40px;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    border-radius: 20px;
    background-color: var(--color-white);
    box-shadow: 12px 12px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: -55px;
    &:active {
        transform: scale(1.05);
    }
    &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
        transition: all ease 0.3s;
    }
`

const Main = () => {
    const [ngayThangNam, setNgayThangNam] = useState();
    const [nam, setNam] = useState("");
    const [thang, setThang] = useState("");
    const [ngay, setNgay] = useState("");

    const [tongDoanhThu, setTongDoanhThu] = useState();
    const [doanhThuCho, setDoanhThuCho] = useState();
    const [hienThiDoanhThuCho, setHienThiDoanhThuCho] = useState();
    const [doanhThuMeo, setDoanhThuMeo] = useState();
    const [hienThiDoanhThuMeo, setHienThiDoanhThuMeo] = useState();
    const [doanhThuKhac, setDoanhThuKhac] = useState();
    const [hienThiDoanhThuKhac, setHienThiDoanhThuKhac] = useState();
    // Thống kê doanh thu theo tháng từng danh mục
    const [doanhThuTheoThang, setDoanhThuTheoThang] = useState([]);


    useEffect(() => {
        console.log("Ngày, tháng, năm: ", ngay, thang, nam, ngayThangNam);

        // const getThongKeTheoDanhMuc = async () => {
        //     const thongketheodanhmucres = await axios.post("http://localhost:3001/api/products/getThongKeTheoDanhMuc", {});
        //     setThongKeTheoDanhMuc(thongketheodanhmucres.data);
        //     thongKeTheoDanhMuc.map((danhmuc, key) => {
        //         setTongDoanhThu(prev => prev + danhmuc.tongtiengiaodich);
        //     })
        // }
        const getDoanhThuCho = async () => {
            const doanhthuchores = await axios.post("http://localhost:3001/api/products/getDoanhThuCho", { ngay: ngay, thang: thang, nam: nam });
            setDoanhThuCho(doanhthuchores.data[0].tongtiengiaodich);
            // setHienThiDoanhThuCho(format_money((doanhthuchores.data[0].tongtiengiaodich).toString()))
        }
        const getDoanhThuMeo = async () => {
            const doanhthumeores = await axios.post("http://localhost:3001/api/products/getDoanhThuMeo", { ngay: ngay, thang: thang, nam: nam });
            setDoanhThuMeo(doanhthumeores.data[0].tongtiengiaodich);
            // setHienThiDoanhThuMeo(format_money((doanhthumeores.data[0].tongtiengiaodich).toString()))
        }
        const getDoanhThuKhac = async () => {
            const doanhthukhacres = await axios.post("http://localhost:3001/api/products/getDoanhThuKhac", { ngay: ngay, thang: thang, nam: nam });
            setDoanhThuKhac(doanhthukhacres.data[0].tongtiengiaodich);
            // setHienThiDoanhThuKhac(format_money((doanhthukhacres.data[0].tongtiengiaodich).toString()))
        }
        const getTongDoanhThu = async () => {
            const tongdoanhthures = await axios.post("http://localhost:3001/api/products/getTongDoanhThu", { ngay: ngay, thang: thang, nam: nam });
            setTongDoanhThu(tongdoanhthures.data[0].tongtiengiaodich);
        }
        // getThongKeTheoDanhMuc();
        getDoanhThuCho();
        getDoanhThuMeo();
        getDoanhThuKhac();
        getTongDoanhThu();
        return () => {
            setHienThiDoanhThuCho("");
            setHienThiDoanhThuMeo("");
            setHienThiDoanhThuKhac("");
        }

    }, [ngayThangNam])
    console.log(tongDoanhThu, doanhThuCho);
    const handleChangeNgay = (ngaythangnam) => {
        setNgayThangNam(ngaythangnam);
        setNam(ngaythangnam.substring(0, 4));
        setThang(ngaythangnam.substring(5, 7));
        setNgay(ngaythangnam.substring(8, 10));
    }



    // -----------------------------------TEST-----------------------------------
    // console.log("Ngày, tháng, năm: ", ngay, thang, nam, ngayThangNam);
    console.log("DATASET: ", dataset);
    console.log("DATASET-run duoc: ", [
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
    ]);

    // HANDLE
    const [dateBooking, setDateBooking] = useState(null);
    const [statistic, setStatistic] = useState();
    const handleChangeDate = (newValue) => {
        setDateBooking(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };

    useEffect(() => {
        const getStatisticRoomAndTableAndPartyBooking = async () => {
            if (dateBooking === null) {
                try {
                    const statisticRes = await StatisticService.getStatisticRoomAndTableAndPartyBooking({
                        date: null
                    });
                    console.log("statisticRes: ", statisticRes);

                    setStatistic(statisticRes.data.data);
                } catch (err) {
                    console.log("Lỗi khi lấy thống kê: ", err);
                }
            } else {
                try {
                    const statisticRes = await StatisticService.getStatisticRoomAndTableAndPartyBooking({
                        date: moment(dateBooking).format("YYYY-MM-DD")
                    });
                    console.log("statisticRes: ", statisticRes);

                    setStatistic(statisticRes.data.data);
                } catch (err) {
                    console.log("Lỗi khi lấy thống kê: ", err);
                }
            }
        }
        getStatisticRoomAndTableAndPartyBooking();
    }, [dateBooking]);

    // Thống kê doanh thu theo tháng từng danh mục
    const [totalForEachMonthArray, setTotalForEachMonthArray] = useState([]);
    const [totalForEachMonthUpdateDate, setTotalForEachMonthUpdateDate] = useState([]);
    useEffect(() => {
        const getStatisticRoomAndTableAndPartyBookingForEachMonthByYear = async () => {
            var now = new window.Date();
            try {
                const statisticRoomAndTableAndPartyBookingForEachMonthRes = await StatisticService.getStatisticRoomAndTableAndPartyBookingForEachMonthByYear({
                    year: now.getFullYear()
                });
                console.log("statisticRoomAndTableAndPartyBookingForEachMonthRes: ", statisticRoomAndTableAndPartyBookingForEachMonthRes);
                setTotalForEachMonthArray(statisticRoomAndTableAndPartyBookingForEachMonthRes.data.data);
                setTotalForEachMonthUpdateDate(statisticRoomAndTableAndPartyBookingForEachMonthRes.data.statisticDate);
            } catch (err) {
                console.log("Lỗi khi lấy doanh thu theo tháng: ", err);
            }
        }
        getStatisticRoomAndTableAndPartyBookingForEachMonthByYear();
    }, [])

    var dataset = [
        totalForEachMonthArray.map((categoryType, key) => {
            return (
                {
                    data: [categoryType.data.thang1, categoryType.data.thang2, categoryType.data.thang3, categoryType.data.thang4, categoryType.data.thang5, categoryType.data.thang6, categoryType.data.thang7, categoryType.data.thang8, categoryType.data.thang9, categoryType.data.thang10, categoryType.data.thang11, categoryType.data.thang12],
                    label: categoryType.name,
                    borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    fill: false
                }
            );
        })
    ];
    console.log("statistic: ", statistic, totalForEachMonthArray);
    return (
        <Container>
            <H1>Dashboard</H1>

            <Date>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={1}>
                        <DesktopDatePicker
                            label="Thống kê theo ngày"
                            inputFormat="dd/MM/yyyy"
                            disableFuture
                            value={dateBooking}
                            onChange={(newValue) => handleChangeDate(newValue)}
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
                                    padding: "20px 25px"
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--color-dark)',
                                    fontWeight: "bold"
                                },
                                '& .MuiOutlinedInput-root': {
                                    color: 'var(--color-dark)',
                                    fontWeight: 'bold',
                                    letterSpacing: '2px'
                                }
                            }}
                            />}
                            InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "var(--color-dark)" } } }}
                        />
                    </Stack>
                </LocalizationProvider>
                <CloseDate style={{ display: dateBooking ? "flex" : "none" }} onClick={() => setDateBooking(null)}>
                    <Close />
                </CloseDate>
            </Date>

            <Insights>
                <Sales>
                    <Icon>
                        <InsertChart style={{ background: "var(--color-primary)", padding: "0.5rem", borderRadius: "50%", color: "var(--color-white)", fontSize: "3rem" }} />
                    </Icon>
                    <Middle>
                        <Left>
                            <H3>Doanh thu Khách sạn</H3>
                            <H1>{statistic ? (
                                <>
                                    {format_money(statistic.roomTotalPrice)}
                                    <span style={{ textDecoration: "underline" }}><b>đ</b></span>
                                </>
                            )
                                : "Chưa có"}</H1>
                        </Left>
                        <Progress>
                            <Svg>
                                <Circle cx="38" cy="38" r="36" strokeDasharray="315" strokeDashoffset={statistic && statistic.totalPrice > 0 ? Math.round(315 - (statistic.roomTotalPrice * 100 / statistic.totalPrice) * 2 * (360 / 315)) : 315}></Circle>
                            </Svg>
                            <ProgressNumber>
                                <ProgressNumberP>{statistic && statistic.totalPrice > 0 ? (
                                    <>
                                        {Math.round(statistic.roomTotalPrice * 100 / statistic.totalPrice)}%
                                    </>
                                ) : "Chưa có"}</ProgressNumberP>
                            </ProgressNumber>
                        </Progress>
                    </Middle>
                    <Small className="text-muted">{statistic ? statistic.bookingOrderStatisticDate : "Chưa có"}</Small>
                </Sales>
                {/* END OF SALES */}
                <Expenses>
                    <Icon>
                        <BarChartOutlined style={{ background: "var(--color-danger)", padding: "0.5rem", borderRadius: "50%", color: "var(--color-white)", fontSize: "3rem" }} />
                    </Icon>
                    <Middle>
                        <Left>
                            <H3>Doanh thu Nhà hàng - Bàn ăn</H3>
                            <H1>{statistic ? (
                                <>
                                    {format_money(statistic.tableTotalPrice)}
                                    <span style={{ textDecoration: "underline" }}><b>đ</b></span>
                                </>
                            )
                                : "Chưa có"}</H1>
                        </Left>
                        <Progress>
                            <Svg>
                                <Circle cx="38" cy="38" r="36" strokeDasharray="315" strokeDashoffset={statistic && statistic.totalPrice > 0 ? Math.round(315 - (statistic.tableTotalPrice * 100 / statistic.totalPrice) * 2 * (360 / 315)) : 315}></Circle>
                            </Svg>
                            <ProgressNumber>
                                <ProgressNumberP>{statistic && statistic.totalPrice > 0 ? (
                                    <>
                                        {Math.round(statistic.tableTotalPrice * 100 / statistic.totalPrice)}%
                                    </>
                                ) : "Chưa có"}</ProgressNumberP>
                            </ProgressNumber>
                        </Progress>
                    </Middle>
                    <Small className="text-muted">{statistic ? statistic.bookingOrderStatisticDate : "Chưa có"}</Small>
                </Expenses>
                {/* END OF EXPENSE */}
                <Income>
                    <Icon>
                        <AutoGraphOutlined style={{ background: "var(--color-success)", padding: "0.5rem", borderRadius: "50%", color: "var(--color-white)", fontSize: "3rem" }} />
                    </Icon>
                    <Middle>
                        <Left>
                            <H3>Doanh thu Nhà hàng - Tiệc</H3>
                            <H1>{statistic ? (
                                <>
                                    {format_money(statistic.partyTotalPrice)}
                                    <span style={{ textDecoration: "underline" }}><b>đ</b></span>
                                </>
                            )
                                : "Chưa có"}
                            </H1>
                        </Left>
                        <Progress>
                            <Svg>
                                <Circle cx="38" cy="38" r="36" strokeDasharray="315" strokeDashoffset={statistic && statistic.totalPrice > 0 ? Math.round(315 - (statistic.partyTotalPrice * 100 / statistic.totalPrice) * 2 * (360 / 315)) : 315}></Circle>
                            </Svg>
                            <ProgressNumber>
                                <ProgressNumberP>{statistic && statistic.totalPrice > 0 ? (
                                    <>
                                        {Math.round(statistic.partyTotalPrice * 100 / statistic.totalPrice)}%
                                    </>
                                ) : "Chưa có"}</ProgressNumberP>
                            </ProgressNumber>
                        </Progress>
                    </Middle>
                    <Small className="text-muted">{statistic ? statistic.bookingOrderStatisticDate : "Chưa có"}</Small>
                </Income>
                {/* END OF INCOME */}
            </Insights>
            {/* END OF INSIGHTS */}
            <RecentOrders>
                <TooltipMui
                    title={"Cập nhật lúc " + totalForEachMonthUpdateDate}
                    arrow
                    followCursor={true}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                // bgcolor: 'var(--color-white)',
                                fontSize: "12px",
                                fontWeight: "bold",
                                letterSpacing: "1px",
                                padding: "10px 20px",
                                borderRadius: "20px",
                                // color: "var(--color-dark)",
                                // '& .MuiTooltip-arrow': {
                                //     color: 'var(--color-white)',
                                // },
                            },
                        },
                    }}
                >
                    <H2>Thống kê Doanh thu từng danh mục thú cưng theo tháng ({new window.Date().getFullYear()})</H2>
                </TooltipMui>
                <Line
                    data={{
                        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
                        datasets: dataset[0]
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
                <A href="#">Show all</A>
            </RecentOrders>
        </Container>
    );
}

export default Main;