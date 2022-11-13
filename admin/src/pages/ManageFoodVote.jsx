import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import FoodVoteMain from '../components/ManageFoodVote/FoodVoteMain';
import FoodVoteRight from '../components/ManageFoodVote/FoodVoteRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageFoodVote = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo FoodVoteRight và FoodVoteMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageFoodVote" />
            <FoodVoteMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <FoodVoteRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageFoodVote;