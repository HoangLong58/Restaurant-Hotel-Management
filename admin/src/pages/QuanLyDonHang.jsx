import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import DonHangMain from "../components/QuanLyDonHang/DonHangMain";
import DonHangRight from "../components/QuanLyDonHang/DonHangRight";

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const QuanLyDonHang = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo KhachHangRight và KhachHangMain thay đổi Effect
    return (
        <Container>
            <Aside active="quanlydonhang" />
            <DonHangMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <DonHangRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default QuanLyDonHang;