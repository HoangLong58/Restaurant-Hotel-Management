import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import KhachHangMain from '../components/QuanLyKhachHang/KhachHangMain';
import KhachHangRight from '../components/QuanLyKhachHang/KhachHangRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const QuanLyKhachHang = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo KhachHangRight và KhachHangMain thay đổi Effect
    return (
        <Container>
            <Aside active="quanlykhachhang" />
            <KhachHangMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <KhachHangRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default QuanLyKhachHang;