import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import FloorMain from '../components/ManageFloor/FloorMain';
import FloorRight from '../components/ManageFloor/FloorRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageFloor = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo FloorRight và FloorMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageFloor" />
            <FloorMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <FloorRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageFloor;