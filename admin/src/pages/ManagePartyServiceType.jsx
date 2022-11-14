import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import PartyServiceTypeMain from '../components/ManagePartyServiceType/PartyServiceTypeMain';
import PartyServiceTypeRight from '../components/ManagePartyServiceType/PartyServiceTypeRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManagePartyServiceType = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo PartyServiceTypeRight và PartyServiceTypeMain thay đổi Effect
    return (
        <Container>
            <Aside active="managePartyServiceType" />
            <PartyServiceTypeMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <PartyServiceTypeRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManagePartyServiceType;