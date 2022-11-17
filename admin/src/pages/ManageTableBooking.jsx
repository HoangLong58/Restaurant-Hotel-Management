import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import TableBookingMain from '../components/ManageTableBooking/TableBookingMain';
import TableBookingRight from '../components/ManageTableBooking/TableBookingRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageTableBooking = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo TableBookingRight và TableBookingMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageTableBooking" />
            <TableBookingMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <TableBookingRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageTableBooking;