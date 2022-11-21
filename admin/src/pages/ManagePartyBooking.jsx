import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import PartyBookingMain from "../components/ManagePartyBooking/PartyBookingMain";
import PartyBookingRight from "../components/ManagePartyBooking/PartyBookingRight";

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManagePartyBooking = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo KhachHangRight và KhachHangMain thay đổi Effect
    return (
        <Container>
            <Aside active="managePartyBooking" />
            <PartyBookingMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <PartyBookingRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManagePartyBooking;