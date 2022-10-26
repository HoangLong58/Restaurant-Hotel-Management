import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import DiscountMain from '../components/ManageDiscount/DiscountMain';
import DiscountRight from '../components/ManageDiscount/DiscountRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageDiscount = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo DiscountRight và DiscountMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageDiscount" />
            <DiscountMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <DiscountRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageDiscount;