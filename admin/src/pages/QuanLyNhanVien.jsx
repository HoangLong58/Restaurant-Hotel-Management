import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import NhanVienMain from "../components/QuanLyNhanVien/NhanVienMain";
import NhanVienRight from "../components/QuanLyNhanVien/NhanVienRight";

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const QuanLyNhanVien = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo KhachHangRight và KhachHangMain thay đổi Effect
    return (
        <Container>
            <Aside active="quanlynhanvien" />
            <NhanVienMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <NhanVienRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default QuanLyNhanVien;