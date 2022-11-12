import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import FoodTypeMain from '../components/ManageFoodType/FoodTypeMain';
import FoodTypeRight from '../components/ManageFoodType/FoodTypeRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageFoodType = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo FoodTypeRight và FoodTypeMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageFoodType" />
            <FoodTypeMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <FoodTypeRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageFoodType;