import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import PartyServiceMain from '../components/ManagePartyService/PartyServiceMain';
import PartyServiceRight from '../components/ManagePartyService/PartyServiceRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManagePartyService = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo PartyServiceRight và PartyServiceMain thay đổi Effect
    return (
        <Container>
            <Aside active="managePartyService" />
            <PartyServiceMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <PartyServiceRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManagePartyService;