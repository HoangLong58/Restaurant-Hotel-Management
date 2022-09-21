import React from 'react'
import styled from 'styled-components'

// Progress 
const SectionProgress = styled.div``
const SectionProgressBigger = styled.div``
const SectionProgressContainer = styled.div``
const SectionProgressRow = styled.div`
    margin: 0;
    height: 65px;
    background-color: black;
`
const SectionProgressCol4 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 1rem;
    font-weight: 300;
    letter-spacing: 1px;
    color: white;
    -webkit-transition : all 0.3s ease-out;
    -moz-transition : all 0.3s ease-out;
    -o-transition :all 0.3s ease-out;
    transition : all 0.3s ease-out;
    &.active {
        color: #333;
        background-color: var(--color-primary);
        &::after {
            content: "";
            display: block;
            position: absolute;
            top: 0px;
            right: -32px;
            width: 0; 
            height: 0; 
            border-top: 32px solid transparent;
            border-bottom: 32px solid transparent;
            border-left: 32px solid var(--color-primary);
        }
        &::before {
            content: "";
            display: block;
            position: absolute;
            top: 0px;
            left: 0px;
            width: 0; 
            height: 0; 
            border-top: 32px solid transparent;
            border-bottom: 32px solid transparent;
            border-left: 32px solid black;
        }
    }
    &:last-child {
        &::after {
            display: none;
        }
    }
    &:first-child {
        &::before {
            display: none;
        }
    }
`

const BookPartyProgress = (props) => {
    return (
        <SectionProgress className="section padding-top-bottom z-bigger" style={{ paddingTop: "30px", paddingBottom: "0" }}>
            <SectionProgressBigger className="section z-bigger">
                <SectionProgressContainer className="container">
                    <SectionProgressRow className="row">
                        <SectionProgressCol4 className={props.step === "findPlace" ? "col-lg-3 active" : "col-lg-3"}>1. Chọn Sảnh &amp; Dịch vụ</SectionProgressCol4>
                        <SectionProgressCol4 className={props.step === "findMenu" ? "col-lg-3 active" : "col-lg-3"}>2. Chọn Menu</SectionProgressCol4>
                        <SectionProgressCol4 className={props.step === "payment" ? "col-lg-3 active" : "col-lg-3"}>3. Thanh toán</SectionProgressCol4>
                        <SectionProgressCol4 className={props.step === "finish" ? "col-lg-3 active" : "col-lg-3"}>4. Hoàn thành</SectionProgressCol4>
                    </SectionProgressRow>
                </SectionProgressContainer>
            </SectionProgressBigger>
        </SectionProgress>
    )
}

export default BookPartyProgress