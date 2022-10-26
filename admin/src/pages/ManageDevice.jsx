import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import DeviceMain from '../components/ManageDevice/DeviceMain';
import DeviceRight from '../components/ManageDevice/DeviceRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageDevice = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo DeviceRight và DeviceMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageDevice" />
            <DeviceMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <DeviceRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageDevice;