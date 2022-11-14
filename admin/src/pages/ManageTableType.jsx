import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import TableTypeMain from '../components/ManageTableType/TableTypeMain';
import TableTypeRight from '../components/ManageTableType/TableTypeRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageTableType = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo TableTypeRight và TableTypeMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageTableType" />
            <TableTypeMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <TableTypeRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageTableType;