import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import PartyHallMain from '../components/ManagePartyHall/PartyHallMain';
import PartyHallRight from '../components/ManagePartyHall/PartyHallRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManagePartyHall = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo PartyHallRight và PartyHallMain thay đổi Effect
    return (
        <Container>
            <Aside active="managePartyHall" />
            <PartyHallMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <PartyHallRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManagePartyHall;