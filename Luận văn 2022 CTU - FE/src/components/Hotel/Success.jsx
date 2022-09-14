import React, { useState } from 'react';
import styled from 'styled-components';
// Date picker
import { ArrowRightAltOutlined, CheckCircleRounded } from '@mui/icons-material';


import { Link, useNavigate } from 'react-router-dom';
import HotelProgress from './HotelProgress';

const Wrapper = styled.div`
max-width: 1200px;
margin: 20px auto;
overflow: hidden;
background-color: #f8f9fa;
box-shadow: 0 2px 3px #e0e0e0;
display: flex;
justify-content: center;
text-align: center;
flex-direction: column;
`
const H2 = styled.h2`
font-size: 1.8rem;
margin-top: 20px;
`
const Small = styled.small`
margin-top: 15px;
font-size: 1.3rem;
`
const ButtonContainer = styled.div`
    justify-content: center;
    position: relative;
    margin: 22px 0;
    display: flex;
    &::after {
        content: "";
        border: 2px solid black;
        position: absolute;
        top: 5px;
        left: 400px;
        background-color: transperent;
        width: 300px;
        height: 100%;
        z-index: 5;
    }
`

const Button = styled.button`
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


const Success = (props) => {
    // Truyền data Từ trang chi tiết vào
    console.log("props data: ", props.data);


    // STATE
    const [countDown, setCountDown] = useState(10);

    // HANDLE
    const navigate = useNavigate();
    /* useEffect(() => {
        const intervalCount = setInterval(() => {
            setCountDown(prev => prev - 1);
        }, 1000)
        return () => clearInterval(intervalCount);
    }, []) */
    if (countDown === 0) {
        navigate("/home");
    }
    return (
        <>
            {/*-- HOTEL PROGRESS -- */}
            <HotelProgress step="finish" />

            <div className="section padding-top-bottom z-bigger" style={{ paddingTop: "25px" }}>
                <div className="section z-bigger">
                    <div className="container">
                        <div className="col-lg-12">
                            <div className="row">
                                <Wrapper>
                                    <CheckCircleRounded style={{ fontSize: "6rem", color: "var(--color-success)", margin: "auto" }} />
                                    <span style={{ color: "var(--color-success)", fontSize: "1.5rem", fontWeight: "700", letterSpacing: "2px" }}>ĐẶT PHÒNG THÀNH CÔNG!!!</span>
                                    <H2>Cảm ơn bạn đã tin tưởng và lựa chọn <span style={{ color: "var(--color-primary)" }}>Hoàng Long Hotel &amp; Restaurant</span></H2>
                                    <Small className="text-muted">Thông tin đặt phòng của bạn đã được gửi vào email!</Small>
                                    <Link to="/home" style={{ textDecoration: "none" }}>
                                        <ButtonContainer>
                                            <Button><ArrowRightAltOutlined />   Quay về trang chủ sau {countDown} giây ...</Button>
                                        </ButtonContainer>
                                    </Link>
                                </Wrapper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Success