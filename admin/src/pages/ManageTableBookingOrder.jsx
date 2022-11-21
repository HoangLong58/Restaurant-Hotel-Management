import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import TableBookingOrderMain from "../components/ManageTableBookingOrder/TableBookingOrderMain";
import TableBookingOrderRight from "../components/ManageTableBookingOrder/TableBookingOrderRight";

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageTableBookingOrder = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo KhachHangRight và KhachHangMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageTableBookingOrder" />
            <TableBookingOrderMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <TableBookingOrderRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageTableBookingOrder;