import React from 'react'
import styled from 'styled-components'

// Progress 
const SectionProgress = styled.div`
    position: absolute;
    top: 0;
`
const SectionProgressBigger = styled.div``
const SectionProgressContainer = styled.div``
const SectionProgressRow = styled.div`
    margin: 0;
    height: 65px;
    background-color: #DEF7E5;
    border-radius: 20px;
`
const SectionProgressCol4 = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 1px;
    color: var(--color-dark);
    -webkit-transition : all 0.3s ease-out;
    -moz-transition : all 0.3s ease-out;
    -o-transition :all 0.3s ease-out;
    transition : all 0.3s ease-out;
    &.active {
        color: white;
        background-color: var(--color-primary);
        &:first-child {
            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
        }
        &:last-child {
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
        }
        &::after {
            content: "";
            display: block;
            position: absolute;
            top: 0px;
            right: -20px;
            width: 0; 
            height: 0; 
            border-top: 32px solid transparent;
            border-bottom: 32px solid transparent;
            border-left: 20px solid var(--color-primary);
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
            border-left: 20px solid #DEF7E5;
        }
    }
    &:last-child {
        &::after {
            display: none;
        }
        /* &.active {

        } */
    }
    &:first-child {
        &::before {
            display: none;
        }
    }
`

const ChangePasswordProgress = (props) => {
    return (
        <SectionProgress className="section padding-top-bottom z-bigger" style={{ paddingTop: "30px", paddingBottom: "0" }}>
            <SectionProgressBigger className="section z-bigger">
                <SectionProgressContainer className="container">
                    <SectionProgressRow className="row">
                        <SectionProgressCol4 className={props.step === "findWay" ? "col-lg-3 active" : "col-lg-3"}>1. Chọn cách xác thực</SectionProgressCol4>
                        <SectionProgressCol4 className={props.step === "fillInfo" ? "col-lg-3 active" : "col-lg-3"}>2. Điền thông tin</SectionProgressCol4>
                        <SectionProgressCol4 className={props.step === "fillKey" ? "col-lg-3 active" : "col-lg-3"}>3. Nhập mã OTP</SectionProgressCol4>
                        <SectionProgressCol4 className={props.step === "finish" ? "col-lg-3 active" : "col-lg-3"}>4. Hoàn thành</SectionProgressCol4>
                    </SectionProgressRow>
                </SectionProgressContainer>
            </SectionProgressBigger>
        </SectionProgress>
    )
}

export default ChangePasswordProgress