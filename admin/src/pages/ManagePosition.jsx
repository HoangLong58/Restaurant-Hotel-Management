import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import PositionMain from '../components/ManagePosition/PositionMain';
import PositionRight from '../components/ManagePosition/PositionRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManagePosition = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo PositionRight và PositionMain thay đổi Effect
    return (
        <Container>
            <Aside active="managePosition" />
            <PositionMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <PositionRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManagePosition;