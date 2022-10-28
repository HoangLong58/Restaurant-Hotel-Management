import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import ServiceMain from '../components/ManageService/ServiceMain';
import ServiceRight from '../components/ManageService/ServiceRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageService = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo ServiceRight và ServiceMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageService" />
            <ServiceMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <ServiceRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageService;