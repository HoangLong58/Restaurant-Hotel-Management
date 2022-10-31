import React, { useState } from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import EmployeeMain from "../components/ManageEmployee/EmployeeMain";
import EmployeeRight from "../components/ManageEmployee/EmployeeRight";

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const ManageEmployee = () => {
    const [reRenderData, setReRenderData] = useState(true);   // State để Compo KhachHangRight và KhachHangMain thay đổi Effect
    return (
        <Container>
            <Aside active="manageEmployee" />
            <EmployeeMain reRenderData={reRenderData} setReRenderData={setReRenderData} />
            <EmployeeRight reRenderData={reRenderData} setReRenderData={setReRenderData} />
        </Container>
    )
}

export default ManageEmployee;