import React from 'react';
import styled from 'styled-components';
import Aside from "../components/Dashboard/Aside";
import Main from "../components/Dashboard/Main";
import Right from "../components/Dashboard/Right";

const Container = styled.div`
    display: grid;
    width: 96%;
    margin: auto;
    gap: 1.8rem;
    grid-template-columns: 14rem auto 23rem;
`

const Home = () => {
    return (
        <Container>
            <Aside active="dashboard"/>
            <Main />
            <Right />
        </Container>
    );
};

export default Home;
