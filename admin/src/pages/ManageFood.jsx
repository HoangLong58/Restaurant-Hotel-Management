import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import FoodMain from '../components/ManageFood/FoodMain';
import FoodRight from '../components/ManageFood/FoodRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageFood = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo FoodRight và FoodMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageFood" />
            <FoodMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <FoodRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageFood;