import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from 'react-player';
import styled from "styled-components";

const Background = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99000;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    animation: fadeIn linear 0.1s;
`

const ModalWrapper = styled.div`
    width: 1230px;
    height: 690px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: #000000;
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    z-index: 99999;
    border-radius: 10px;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
`

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #141414;
`

const CloseModalButton = styled.span`
    cursor: pointer;
    color: #D0D0D0;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
    &:hover {
        color: white;
        transform: scale(1.3);
        transition: all 200ms linear; 
    }
`

const Box = styled.div`
    display: flex;
    width: 100%;
    max-width: 300px;
    height: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #c9c9c9;
    border-radius: 10px;
    margin: 5px 20px 15px 20px;
    padding: 0px 10px;
    position: relative;
    color: #fff;
    &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0px;
        left: 252px;
        width: 1px;
        height: 39px;
        background-color: #cecece;
    }
    .active & {
        display: none;
    }
    &:hover {
        border: 1px solid #41f1b6;
        box-shadow: #41f1b6 0px 1px 4px, #41f1b6 0px 0px 0px 3px;
}
`

const Modal = ({ showModal, setShowModal, type }) => {
    // Modal
    const modalRef = useRef();
    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            setShowModal(false);
        }
    }

    const keyPress = useCallback(
        (e) => {
            if (e.key === 'Escape' && showModal) {
                setShowModal(false);
            }
        },
        [setShowModal, showModal]
    );

    useEffect(
        () => {
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);
        },
        [keyPress]
    );
    // Player video
    const [playTime, setPlayTime] = useState(0);

    const handleProgress = (state) => {
        setPlayTime(state.playedSeconds);
    }

    // ================================================================
    // =============== Show video restaurant ===============
    if (type === "showVideoRestaurant") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal}>
                            <ModalContent>
                                <ReactPlayer
                                    url='https://www.youtube.com/watch?v=2h8PTketlDo'
                                    width="1100px"
                                    height="640px"
                                    playing={true}
                                    controls={true}
                                    onProgress={handleProgress}
                                />
                            </ModalContent>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => setShowModal(prev => !prev)}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    } else {
        return (
            <></>
        );
    }
};

export default Modal;