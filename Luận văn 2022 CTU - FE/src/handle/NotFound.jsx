import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
display: flex;
width: 100%;
justify-content: center;
align-items: center;
`

const Img = styled.img`
width: 800px;
max-height: 600px;
object-fit: cover;
`

const NotFound = () => {
    return (
        <Container>
            <Img
                src="https://cdn5.vectorstock.com/i/1000x1000/73/49/404-error-page-not-found-miss-paper-with-white-vector-20577349.jpg"
                alt="Not Found Page" />
        </Container>
    )
}

export default NotFound