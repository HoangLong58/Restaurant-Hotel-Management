import React, { useState, forwardRef, useImperativeHandle } from "react";
import "../../css/main.css";
import styled from "styled-components";
import { DoneOutlined, ErrorOutlineOutlined, CloseOutlined } from '@mui/icons-material';

const Container = styled.div`
    position: fixed;
    right: 1%;
    bottom: 5%;
    width: 330px;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    text-align: center;
`
const Icon = styled.div`
    flex: 20%;
`
const Message = styled.div`
    flex: 80%;
    text-align: start;
    font-weight: bold;
`
const Toast = forwardRef((props, ref) => {
    const [showToast, setShowToast] = useState(false);

    useImperativeHandle(ref, () => ({
        show() {
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        },
    }));
    return (
        <Container
            id={showToast ? "showToast" : "hideToast"}
            style={{
                backgroundColor: props.dataToast.type === "success" ? "var(--color-success)" : "var(--color-danger)",
                color: props.dataToast.type === "success" ? "var(--color-black)" : "var(--color-white)",
            }}
        >
            <Icon>
                {props.dataToast.type === "success" ? <h1><DoneOutlined/></h1> : <h1><ErrorOutlineOutlined/></h1>}
            </Icon>
            <Message>{props.dataToast.message}</Message>
        </Container>
    );
});

export default Toast;