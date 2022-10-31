import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import CustomerMain from '../components/ManageCustomer/CustomerMain';
import CustomerRight from '../components/ManageCustomer/CustomerRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageCustomer = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo CustomerRight và CustomerMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageCustomer" />
            <CustomerMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <CustomerRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageCustomer;