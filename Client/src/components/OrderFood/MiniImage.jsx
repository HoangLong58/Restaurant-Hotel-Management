import React from 'react';
import styled from 'styled-components';

const Image = styled.img`
    width: 200px;
    height: 200px;
    object-fit: cover;
`
const MiniImage = (item) => {
    return (
        <Image src={item.image}></Image>
    )
}

export default MiniImage