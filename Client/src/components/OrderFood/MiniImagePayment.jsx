import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
    width: 100%;
    height: 290px;
    object-fit: cover;
`
const MiniImagePayment = (item) => {
    return (
        <Image src={item.image}></Image>
    )
}

export default MiniImagePayment