import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import PartyBookingTypeMain from '../components/ManagePartyBookingType/PartyBookingTypeMain';
import PartyBookingTypeRight from '../components/ManagePartyBookingType/PartyBookingTypeRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManagePartyBookingType = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo PartyBookingTypeRight và PartyBookingTypeMain thay đổi Effect
    return (
        <Container>
            <Aside active="managePartyBookingType" />
            <PartyBookingTypeMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <PartyBookingTypeRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManagePartyBookingType;