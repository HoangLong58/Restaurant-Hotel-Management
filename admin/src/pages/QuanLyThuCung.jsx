import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import ThuCungMain from '../components/QuanLyThuCung/ThuCungMain';
import ThuCungRight from '../components/QuanLyThuCung/ThuCungRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const QuanLyThuCung = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo ThuCungRight và ThuCungMain thay đổi Effect
    return (
        <Container>
            <Aside active="quanlythucung" />
            <ThuCungMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <ThuCungRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default QuanLyThuCung;