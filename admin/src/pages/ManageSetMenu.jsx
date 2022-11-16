import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import SetMenuMain from '../components/ManageSetMenu/SetMenuMain';
import SetMenuRight from '../components/ManageSetMenu/SetMenuRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageSetMenu = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo SetMenuRight và SetMenuMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageSetMenu" />
            <SetMenuMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <SetMenuRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageSetMenu;