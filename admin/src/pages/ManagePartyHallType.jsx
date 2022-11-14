import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import PartyHallTypeMain from '../components/ManagePartyHallType/PartyHallTypeMain';
import PartyHallTypeRight from '../components/ManagePartyHallType/PartyHallTypeRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManagePartyHallType = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo PartyHallTypeRight và PartyHallTypeMain thay đổi Effect
    return (
        <Container>
            <Aside active="managePartyHallType" />
            <PartyHallTypeMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <PartyHallTypeRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManagePartyHallType;