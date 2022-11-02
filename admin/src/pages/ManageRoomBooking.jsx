import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import RoomBookingMain from "../components/ManageRoomBooking/RoomBookingMain";
import RoomBookingRight from "../components/ManageRoomBooking/RoomBookingRight";

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageRoomBooking = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo KhachHangRight và KhachHangMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageRoomBooking" />
            <RoomBookingMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <RoomBookingRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageRoomBooking;