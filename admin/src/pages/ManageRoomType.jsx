import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import RoomTypeMain from '../components/ManageRoomType/RoomTypeMain';
import RoomTypeRight from '../components/ManageRoomType/RoomTypeRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageRoomType = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo RoomTypeRight và RoomTypeMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageRoomType" />
            <RoomTypeMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <RoomTypeRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageRoomType;