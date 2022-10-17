import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
    min-width: 55px;
    width: 55px;
    height: 55px;
    margin: 12px;
    border: 1px solid #E8E8E8;
    object-fit: cover;
    object-position: center;
`

const MiniCartImage = (item) => {
    return (
        <Image src={item.image} />
    );
};

export default MiniCartImage