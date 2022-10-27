import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import RoomMain from '../components/ManageRoom/RoomMain';
import RoomRight from '../components/ManageRoom/RoomRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageRoom = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo RoomRight và RoomMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageRoom" />
            <RoomMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <RoomRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageRoom;