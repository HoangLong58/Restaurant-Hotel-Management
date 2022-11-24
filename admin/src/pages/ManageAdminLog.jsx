import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import AdminLogMain from '../components/ManageAdminLog/AdminLogMain';
import AdminLogRight from '../components/ManageAdminLog/AdminLogRight';

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageAdminLog = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo AdminLogRight và AdminLogMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageAdminLog" />
            <AdminLogMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <AdminLogRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageAdminLog;