import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import DeviceTypeMain from '../components/ManageDeviceType/DeviceTypeMain';
import DeviceTypeRight from '../components/ManageDeviceType/DeviceTypeRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageDeviceType = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo DeviceTypeRight và DeviceTypeMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageDeviceType" />
            <DeviceTypeMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <DeviceTypeRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageDeviceType;