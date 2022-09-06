import { ArrowDropDownOutlined, CloseOutlined, SearchOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from 'react-player';
import styled from "styled-components";
import SliderImage from "../SliderImage";

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

// Image Menu
const MenuRight = styled.div`
`
const MenuRightRow = styled.div``
const MenuRightTitle = styled.h3`
    color: #fff;
    margin: 0px 0px 8px 8px;
`
const MenuImage = styled.img`
    height: 100%;
    width: auto;
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
const BoxSpan = styled.span`
    font-size: 1.1rem;
    color: #fff;
`

const Table = styled.table`
    background: var(--color-white);
    width: 100%;
    border-radius: var(--card-border-radius);
    padding: var(--card-padding);
    text-align: center;
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
    color: var(--color-dark);
    &:hover {
        box-shadow: none;
    }
`

const Thead = styled.thead`

`

const Tr = styled.tr`
    &:last-child td {
        border: none;
    }
    &:hover {
        background: var(--color-light);
    }
`

const Th = styled.th`

`

const Tbody = styled.tbody`

`

const Td = styled.td`
    height: 2.8rem;
    border-bottom: 1px solid var(--color-light);
`

const ThContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const ThSpan = styled.span``;

const ThSortIcon = styled.div``;

const Wrapper = styled.div`
    display: none;
    position: absolute;
    top: -250px;
    left: -5px;
    width: 650px;
    height: auto;
    background-color: #F5F5F5;
    border: 2px solid #333;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
    z-index: 10;
    border-radius: var(--card-border-radius);
    ${Box}.active & {
        display: block;
    }
`
const BoxTitle = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1.5rem 2rem;
    color: var(--color-dark);
`

const Option = styled.div`
    max-height: 400px; 
    overflow: auto;
`

const SearchContainer = styled.div`
    display: flex;
    border: 1px solid #dadada;
    border-radius: 5px;
`;

const SearchIcon = styled.div`
    border-left: 1px solid #dadada;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: auto;
`;

const Input = styled.input`
    width: 100%;
    height: 42px;
    padding: 0px 50px 0 20px;
    border-radius: 5px;
    background-color: #ffffff;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    color: var(--color-dark);
`;

const BoxH2 = styled.h2`
    text-align: center;
    color: var(--color-primary);
    font-size: 1.3rem;
    font-size: 1.4rem;
    font-weight: 400;
`

const Button = styled.div`
    margin-top: 30px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
`

const ButtonContainer = styled.div`
    /* position: relative; */
    float: right;
    margin: 0 22px 22px 0;
`

const ButtonClick = styled.button`
    min-width: 100px;
    border: none;
    margin-right: 20px;
    text-decoration: none;
    padding: 9px;
    display: block;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 13px;
    text-transform: uppercase;
    line-height: 20px;
    letter-spacing: 2px;
    color: #fff;
    transition: all 0.3s ease-out;
    background-color: #41f1b6;
    /* position: absolute;
    bottom: 10px;
    right: 15px; */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        background-color: black;
    }
`

const InputRadio = styled.input`
    margin-left: 10px;
    padding: 0px 10px;
    font-size: 2rem;
    cursor: pointer;
    accent-color: var(--color-primary);
    -ms-transform: scale(1.5);
    -webkit-transform: scale(1.5);
    transform: scale(1.3);
    color: black;
    &::before {
        border: 2px solid #333;
    }
`

const MealImage = styled.img`
    width: 60px;
    height: 60px;
`

// More Image
const ImgContainer = styled.div`
`
const MoreImage = styled.div`
    width: 100%;
`
// Modal view left
const ViewLeft = styled.div``
const ViewLeftRow = styled.div``
const ViewLeftDetailRow = styled.div`
    background-color: #f5f5f5;
    border-radius: var(--card-border-radius); 
    padding: 20px 20px;
    width: 98%;
    max-height: 90%; 
    margin: 10px;
`

const TitleRow = styled.div`
    margin-bottom: 10px;
`
const TitleRowH6 = styled.h6``
const DescriptionRow = styled.div``
const DescriptionDetailRow = styled.div`
    font-weight: bold;
`
const QuantityRow = styled.div``
const QuantityDetailRow = styled.div`
    font-weight: bold;
`
const PriceRow = styled.div``
const PriceDetailRow = styled.div`
    font-weight: bold;
`

// Modal view right
const ViewRight = styled.div`
    /* width: 90%; */
    height: 95%;
`

const ViewRightContainer = styled.div`
    height: 90%;
    overflow-y: scroll;

    margin: 20px auto auto auto;
    background-color: #f5f5f5;
    border-radius: var(--card-border-radius); 
    padding: 20px 20px;
    width: auto;
    /* max-height: 90%;  */
    /* margin: 10px; */
`

const InputRadioService = styled.input`
    padding: 0px 10px;
    font-size: 2rem;
    cursor: pointer;
    accent-color: var(--color-primary);
    -ms-transform: scale(1.5);
    -webkit-transform: scale(1.5);
    transform: scale(1.3);
    color: black;
    &::before {
        border: 2px solid #333;
    }
`
const ViewRightItem = styled.div``
const ViewRightItemName = styled.div`

`
const ViewRightH6 = styled.h6`
    color: #333;
`
const ViewRightUl = styled.ul``
const ViewRightLi = styled.li`
    margin-bottom: 10px;
`
const ViewRightLabel = styled.label`
    &:hover {
        background-color: #E9EAF5;
    }
`
const ViewRightCol9 = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #333;
`
const ViewRightCol3 = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #333;
`


const Modal = ({ showModal, setShowModal, type, imageMenu, imageView }) => {
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

    // Box 1
    const openSelectBox1 = () => {

        var checkList = document.getElementById('Box1');
        checkList.classList.add('active');
    }
    const closeSelectBox1 = (e) => {
        e.preventDefault();
        var checkList = document.getElementById('Box1');
        checkList.classList.remove('active');
    }
    // Box 2
    const openSelectBox2 = () => {

        var checkList = document.getElementById('Box2');
        checkList.classList.add('active');
    }
    const closeSelectBox2 = (e) => {
        e.preventDefault();
        var checkList = document.getElementById('Box2');
        checkList.classList.remove('active');
    }
    // Box 3
    const openSelectBox3 = () => {

        var checkList = document.getElementById('Box3');
        checkList.classList.add('active');
    }
    const closeSelectBox3 = (e) => {
        e.preventDefault();
        var checkList = document.getElementById('Box3');
        checkList.classList.remove('active');
    }
    // Box 4
    const openSelectBox4 = () => {

        var checkList = document.getElementById('Box4');
        checkList.classList.add('active');
    }
    const closeSelectBox4 = (e) => {
        e.preventDefault();
        var checkList = document.getElementById('Box4');
        checkList.classList.remove('active');
    }
    // Box 5
    const openSelectBox5 = () => {

        var checkList = document.getElementById('Box5');
        checkList.classList.add('active');
    }
    const closeSelectBox5 = (e) => {
        e.preventDefault();
        var checkList = document.getElementById('Box5');
        checkList.classList.remove('active');
    }
    // Box 6
    const openSelectBox6 = () => {

        var checkList = document.getElementById('Box6');
        checkList.classList.add('active');
    }
    const closeSelectBox6 = (e) => {
        e.preventDefault();
        var checkList = document.getElementById('Box6');
        checkList.classList.remove('active');
    }
    // Box 7
    const openSelectBox7 = () => {

        var checkList = document.getElementById('Box7');
        checkList.classList.add('active');
    }
    const closeSelectBox7 = (e) => {
        e.preventDefault();
        var checkList = document.getElementById('Box7');
        checkList.classList.remove('active');
    }
    // Box 8
    const openSelectBox8 = () => {

        var checkList = document.getElementById('Box8');
        checkList.classList.add('active');
    }

    const closeSelectBox8 = (e) => {
        e.preventDefault();
        var checkList = document.getElementById('Box8');
        checkList.classList.remove('active');
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
    }

    // =============== Show Image Menu ===============
    if (type === "showImageMenu") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} className="row" style={{ paddingTop: "15px", paddingBottom: "15px", height: "98%", width: "93%", backgroundColor: "#181818" }}>

                            <MenuImage src={imageMenu} className="col-md-6" />
                            <MenuRight className="col-md-6">
                                <MenuRightRow className="row">
                                    <MenuRightTitle>Chọn món cho Thực đơn</MenuRightTitle>
                                </MenuRightRow>
                                <div className="row">
                                    <Box id="Box1">
                                        <BoxSpan>Hãy chọn món Bánh Đầu Giờ</BoxSpan>
                                        <SearchOutlined
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openSelectBox1()}
                                        />
                                        <Wrapper style={{ top: "-100px" }}>
                                            <BoxTitle>
                                                <BoxH2>Chọn món Bánh Đầu Giờ</BoxH2>
                                                <SearchContainer>
                                                    <Input
                                                        type="text"
                                                    />
                                                    <SearchIcon>
                                                        <SearchOutlined />
                                                    </SearchIcon>
                                                </SearchContainer>
                                            </BoxTitle>
                                            <Option>
                                                <Table style={{ position: "relative" }}>
                                                    <Thead>
                                                        <Tr>
                                                            <Th style={{ border: "none", minWidth: "30px" }}></Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Hình ảnh</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortStaffCode ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Món ăn</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortFullName ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Thành phần</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortType ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                        </Tr>
                                                    </Thead>

                                                    <Tbody>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                    </Tbody>
                                                </Table>
                                            </Option>
                                            <Button>
                                                <ButtonContainer>
                                                    <ButtonClick>
                                                        Đồng ý
                                                    </ButtonClick>
                                                </ButtonContainer>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={(e) => {
                                                            closeSelectBox1(e)
                                                        }}
                                                    >Cancel</ButtonClick>
                                                </ButtonContainer>
                                            </Button>
                                        </Wrapper>
                                    </Box>
                                </div>
                                <div className="row">
                                    <Box id="Box2">
                                        <BoxSpan>Hãy chọn món Khai Vị</BoxSpan>
                                        <SearchOutlined
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openSelectBox2()}
                                        />
                                        <Wrapper style={{ top: "-160px" }}>
                                            <BoxTitle>
                                                <BoxH2>Chọn món Khai Vị</BoxH2>
                                                <SearchContainer>
                                                    <Input
                                                        type="text"
                                                    />
                                                    <SearchIcon>
                                                        <SearchOutlined />
                                                    </SearchIcon>
                                                </SearchContainer>
                                            </BoxTitle>
                                            <Option>
                                                <Table style={{ position: "relative" }}>
                                                    <Thead>
                                                        <Tr>
                                                            <Th style={{ border: "none", minWidth: "30px" }}></Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Hình ảnh</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortStaffCode ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Món ăn</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortFullName ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Thành phần</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortType ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                        </Tr>
                                                    </Thead>

                                                    <Tbody>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                    </Tbody>
                                                </Table>
                                            </Option>
                                            <Button>
                                                <ButtonContainer>
                                                    <ButtonClick>
                                                        Đồng ý
                                                    </ButtonClick>
                                                </ButtonContainer>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={(e) => {
                                                            closeSelectBox2(e)
                                                        }}
                                                    >Cancel</ButtonClick>
                                                </ButtonContainer>
                                            </Button>
                                        </Wrapper>
                                    </Box>
                                </div>
                                <div className="row">
                                    <Box id="Box3">
                                        <BoxSpan>Hãy chọn món Súp</BoxSpan>
                                        <SearchOutlined
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openSelectBox3()}
                                        />
                                        <Wrapper style={{ top: "-220px" }}>
                                            <BoxTitle>
                                                <BoxH2>Chọn món Súp</BoxH2>
                                                <SearchContainer>
                                                    <Input
                                                        type="text"
                                                    />
                                                    <SearchIcon>
                                                        <SearchOutlined />
                                                    </SearchIcon>
                                                </SearchContainer>
                                            </BoxTitle>
                                            <Option>
                                                <Table style={{ position: "relative" }}>
                                                    <Thead>
                                                        <Tr>
                                                            <Th style={{ border: "none", minWidth: "30px" }}></Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Hình ảnh</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortStaffCode ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Món ăn</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortFullName ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Thành phần</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortType ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                        </Tr>
                                                    </Thead>

                                                    <Tbody>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                    </Tbody>
                                                </Table>
                                            </Option>
                                            <Button>
                                                <ButtonContainer>
                                                    <ButtonClick>
                                                        Đồng ý
                                                    </ButtonClick>
                                                </ButtonContainer>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={(e) => {
                                                            closeSelectBox3(e)
                                                        }}
                                                    >Cancel</ButtonClick>
                                                </ButtonContainer>
                                            </Button>
                                        </Wrapper>
                                    </Box>
                                </div>
                                <div className="row">
                                    <Box id="Box4">
                                        <BoxSpan>Hãy chọn món Hải Sản</BoxSpan>
                                        <SearchOutlined
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openSelectBox4()}
                                        />
                                        <Wrapper style={{ top: "-280px" }}>
                                            <BoxTitle>
                                                <BoxH2>Chọn món Hải Sản</BoxH2>
                                                <SearchContainer>
                                                    <Input
                                                        type="text"
                                                    />
                                                    <SearchIcon>
                                                        <SearchOutlined />
                                                    </SearchIcon>
                                                </SearchContainer>
                                            </BoxTitle>
                                            <Option>
                                                <Table style={{ position: "relative" }}>
                                                    <Thead>
                                                        <Tr>
                                                            <Th style={{ border: "none", minWidth: "30px" }}></Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Hình ảnh</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortStaffCode ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Món ăn</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortFullName ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Thành phần</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortType ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                        </Tr>
                                                    </Thead>

                                                    <Tbody>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                    </Tbody>
                                                </Table>
                                            </Option>
                                            <Button>
                                                <ButtonContainer>
                                                    <ButtonClick>
                                                        Đồng ý
                                                    </ButtonClick>
                                                </ButtonContainer>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={(e) => {
                                                            closeSelectBox4(e)
                                                        }}
                                                    >Cancel</ButtonClick>
                                                </ButtonContainer>
                                            </Button>
                                        </Wrapper>
                                    </Box>
                                </div>
                                <div className="row">
                                    <Box id="Box5">
                                        <BoxSpan>Hãy chọn món Thịt</BoxSpan>
                                        <SearchOutlined
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openSelectBox5()}
                                        />
                                        <Wrapper style={{ top: "-340px" }}>
                                            <BoxTitle>
                                                <BoxH2>Chọn món Thịt</BoxH2>
                                                <SearchContainer>
                                                    <Input
                                                        type="text"
                                                    />
                                                    <SearchIcon>
                                                        <SearchOutlined />
                                                    </SearchIcon>
                                                </SearchContainer>
                                            </BoxTitle>
                                            <Option>
                                                <Table style={{ position: "relative" }}>
                                                    <Thead>
                                                        <Tr>
                                                            <Th style={{ border: "none", minWidth: "30px" }}></Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Hình ảnh</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortStaffCode ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Món ăn</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortFullName ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Thành phần</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortType ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                        </Tr>
                                                    </Thead>

                                                    <Tbody>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                    </Tbody>
                                                </Table>
                                            </Option>
                                            <Button>
                                                <ButtonContainer>
                                                    <ButtonClick>
                                                        Đồng ý
                                                    </ButtonClick>
                                                </ButtonContainer>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={(e) => {
                                                            closeSelectBox5(e)
                                                        }}
                                                    >Cancel</ButtonClick>
                                                </ButtonContainer>
                                            </Button>
                                        </Wrapper>
                                    </Box>
                                </div>
                                <div className="row">
                                    <Box id="Box6">
                                        <BoxSpan>Hãy chọn món Cơm-Mì-Lẩu</BoxSpan>
                                        <SearchOutlined
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openSelectBox6()}
                                        />
                                        <Wrapper style={{ top: "-400px" }}>
                                            <BoxTitle>
                                                <BoxH2>Chọn món Cơm-Mì-Lẩu</BoxH2>
                                                <SearchContainer>
                                                    <Input
                                                        type="text"
                                                    />
                                                    <SearchIcon>
                                                        <SearchOutlined />
                                                    </SearchIcon>
                                                </SearchContainer>
                                            </BoxTitle>
                                            <Option>
                                                <Table style={{ position: "relative" }}>
                                                    <Thead>
                                                        <Tr>
                                                            <Th style={{ border: "none", minWidth: "30px" }}></Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Hình ảnh</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortStaffCode ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Món ăn</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortFullName ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Thành phần</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortType ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                        </Tr>
                                                    </Thead>

                                                    <Tbody>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                    </Tbody>
                                                </Table>
                                            </Option>
                                            <Button>
                                                <ButtonContainer>
                                                    <ButtonClick>
                                                        Đồng ý
                                                    </ButtonClick>
                                                </ButtonContainer>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={(e) => {
                                                            closeSelectBox6(e)
                                                        }}
                                                    >Cancel</ButtonClick>
                                                </ButtonContainer>
                                            </Button>
                                        </Wrapper>
                                    </Box>
                                </div>
                                <div className="row">
                                    <Box id="Box7">
                                        <BoxSpan>Hãy chọn món Tráng Miệng</BoxSpan>
                                        <SearchOutlined
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openSelectBox7()}
                                        />
                                        <Wrapper style={{ top: "-460px" }}>
                                            <BoxTitle>
                                                <BoxH2>Chọn món Tráng Miệng</BoxH2>
                                                <SearchContainer>
                                                    <Input
                                                        type="text"
                                                    />
                                                    <SearchIcon>
                                                        <SearchOutlined />
                                                    </SearchIcon>
                                                </SearchContainer>
                                            </BoxTitle>
                                            <Option>
                                                <Table style={{ position: "relative" }}>
                                                    <Thead>
                                                        <Tr>
                                                            <Th style={{ border: "none", minWidth: "30px" }}></Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Hình ảnh</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortStaffCode ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Món ăn</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortFullName ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Thành phần</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortType ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                        </Tr>
                                                    </Thead>

                                                    <Tbody>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                    </Tbody>
                                                </Table>
                                            </Option>
                                            <Button>
                                                <ButtonContainer>
                                                    <ButtonClick>
                                                        Đồng ý
                                                    </ButtonClick>
                                                </ButtonContainer>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={(e) => {
                                                            closeSelectBox7(e)
                                                        }}
                                                    >Cancel</ButtonClick>
                                                </ButtonContainer>
                                            </Button>
                                        </Wrapper>
                                    </Box>
                                </div>
                                <div className="row">
                                    <Box id="Box8">
                                        <BoxSpan>Hãy chọn món Dịch vụ</BoxSpan>
                                        <SearchOutlined
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openSelectBox8()}
                                        />
                                        <Wrapper style={{ top: "-520px" }}>
                                            <BoxTitle>
                                                <BoxH2>Chọn món Súp</BoxH2>
                                                <SearchContainer>
                                                    <Input
                                                        type="text"
                                                    />
                                                    <SearchIcon>
                                                        <SearchOutlined />
                                                    </SearchIcon>
                                                </SearchContainer>
                                            </BoxTitle>
                                            <Option>
                                                <Table style={{ position: "relative" }}>
                                                    <Thead>
                                                        <Tr>
                                                            <Th style={{ border: "none", minWidth: "30px" }}></Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Hình ảnh</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortStaffCode ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Món ăn</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortFullName ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                            <Th>
                                                                <ThContainer>
                                                                    <ThSpan>Thành phần</ThSpan>
                                                                    <ThSortIcon>
                                                                        {/* {isSortType ? <ArrowDropUpOutlined /> :
                                                                            <ArrowDropDownOutlined />} */}
                                                                        <ArrowDropDownOutlined />
                                                                    </ThSortIcon>
                                                                </ThContainer>
                                                            </Th>
                                                        </Tr>
                                                    </Thead>

                                                    <Tbody>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                        <Tr>
                                                            <Td style={{
                                                                border: 'none',
                                                                textAlign: "center",
                                                                fontSize: "1.5rem"
                                                            }}>
                                                                <InputRadio
                                                                    type="radio"
                                                                    name="Radio_User"
                                                                    value=""
                                                                    className="checkbox"
                                                                />
                                                            </Td>
                                                            <Td>
                                                                <MealImage src={imageMenu} />
                                                            </Td>
                                                            <Td>
                                                                Thịt Sốt Trứng
                                                            </Td>
                                                            <Td>
                                                                Thịt/ Cá/ Trứng
                                                            </Td>
                                                        </Tr>
                                                    </Tbody>
                                                </Table>
                                            </Option>
                                            <Button>
                                                <ButtonContainer>
                                                    <ButtonClick>
                                                        Đồng ý
                                                    </ButtonClick>
                                                </ButtonContainer>
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={(e) => {
                                                            closeSelectBox8(e)
                                                        }}
                                                    >Cancel</ButtonClick>
                                                </ButtonContainer>
                                            </Button>
                                        </Wrapper>
                                    </Box>
                                </div>
                                <Button className="row">
                                    <ButtonContainer>
                                        <ButtonClick style={{ marginLeft: "70%" }} className="">
                                            {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                            Tiếp tục
                                        </ButtonClick>
                                    </ButtonContainer>
                                </Button>
                            </MenuRight>
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
    }

    // =============== Show Image View ===============
    if (type === "showImageView") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} className="row" style={{ paddingTop: "15px", paddingBottom: "15px", height: "98%", width: "93%", backgroundColor: "#181818" }}>

                            {/* <MenuImage src={imageView} className="col-md-6" /> */}
                            <ViewLeft className="col-md-6">
                                <ViewLeftRow className="row">
                                    <ImgContainer className="row">
                                        <MoreImage >
                                            <SliderImage image={[imageView, 'https://picsum.photos/id/1018/1000/600/', 'https://picsum.photos/id/1018/1000/600/', 'https://picsum.photos/id/1018/1000/600/']} />
                                        </MoreImage>
                                    </ImgContainer>
                                    <ViewLeftDetailRow className="row">
                                        <TitleRow className="row">
                                            <TitleRowH6>Sảnh Iris - Sân vườn</TitleRowH6>
                                        </TitleRow>
                                        <DescriptionRow className="row">
                                            <DescriptionDetailRow className="col-md-2">
                                                Mô tả:
                                            </DescriptionDetailRow>
                                            <div className="col-md-10">
                                                Không gian tiệc ngoài trời trên tầng cao, thoáng mát, mới lạ, sức chứa tối đa khoảng 70 khách.
                                            </div>
                                        </DescriptionRow>
                                        <QuantityRow className="row">
                                            <QuantityDetailRow className="col-md-2">
                                                Sức chứa:
                                            </QuantityDetailRow>
                                            <div className="col-md-10">
                                                120 người
                                            </div>
                                        </QuantityRow>
                                        <PriceRow className="row">
                                            <PriceDetailRow className="col-md-2">
                                                Giá:
                                            </PriceDetailRow>
                                            <div className="col-md-10">
                                                5.520.000 <b><u>đ</u></b>
                                            </div>
                                        </PriceRow>
                                    </ViewLeftDetailRow>
                                </ViewLeftRow>
                            </ViewLeft>
                            <ViewRight className="col-md-6">
                                <ViewRightContainer className="row">
                                    {/* ITEM Dịch vụ */}
                                    <ViewRightItem className="col-12 col-md-6 col-lg-12 pt-5">
                                        <ViewRightH6 className="color-white mb-3">Dịch vụ trang trí:</ViewRightH6>
                                        <ViewRightUl className="list">
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Cổng hoa đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Welcome tên CDCR
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        1.200.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Gallery đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>6 trụ hoa hướng lên sân khấu</ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">5.000.000 <b><u>đ</u></b></ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bánh cưới + Champagne (2 rượu + 1 bánh)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bàn tiệc
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi sân khấu
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bóng bay hồ bơi
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                        </ViewRightUl>
                                    </ViewRightItem>
                                    {/* ITEM Dịch vụ */}
                                    <ViewRightItem className="col-12 col-md-6 col-lg-12 pt-5">
                                        <ViewRightH6 className="color-white mb-3">Dịch vụ trang trí:</ViewRightH6>
                                        <ViewRightUl className="list">
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Cổng hoa đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Welcome tên CDCR
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        1.200.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Gallery đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>6 trụ hoa hướng lên sân khấu</ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">5.000.000 <b><u>đ</u></b></ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bánh cưới + Champagne (2 rượu + 1 bánh)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bàn tiệc
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi sân khấu
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bóng bay hồ bơi
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                        </ViewRightUl>
                                    </ViewRightItem>
                                    {/* ITEM Dịch vụ */}
                                    <ViewRightItem className="col-12 col-md-6 col-lg-12 pt-5">
                                        <ViewRightH6 className="color-white mb-3">Dịch vụ trang trí:</ViewRightH6>
                                        <ViewRightUl className="list">
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Cổng hoa đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Welcome tên CDCR
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        1.200.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Gallery đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>6 trụ hoa hướng lên sân khấu</ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">5.000.000 <b><u>đ</u></b></ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bánh cưới + Champagne (2 rượu + 1 bánh)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bàn tiệc
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi sân khấu
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bóng bay hồ bơi
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                        </ViewRightUl>
                                    </ViewRightItem>
                                    {/* ITEM Dịch vụ */}
                                    <ViewRightItem className="col-12 col-md-6 col-lg-12 pt-5">
                                        <ViewRightH6 className="color-white mb-3">Dịch vụ trang trí:</ViewRightH6>
                                        <ViewRightUl className="list">
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Cổng hoa đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Welcome tên CDCR
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        1.200.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Gallery đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>6 trụ hoa hướng lên sân khấu</ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">5.000.000 <b><u>đ</u></b></ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bánh cưới + Champagne (2 rượu + 1 bánh)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bàn tiệc
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi sân khấu
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bóng bay hồ bơi
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                        </ViewRightUl>
                                    </ViewRightItem>
                                    {/* ITEM Dịch vụ */}
                                    <ViewRightItem className="col-12 col-md-6 col-lg-12 pt-5">
                                        <ViewRightH6 className="color-white mb-3">Dịch vụ trang trí:</ViewRightH6>
                                        <ViewRightUl className="list">
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Cổng hoa đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Welcome tên CDCR
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        1.200.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Gallery đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>6 trụ hoa hướng lên sân khấu</ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">5.000.000 <b><u>đ</u></b></ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bánh cưới + Champagne (2 rượu + 1 bánh)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bàn tiệc
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi sân khấu
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bóng bay hồ bơi
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                        </ViewRightUl>
                                    </ViewRightItem>
                                    {/* ITEM Dịch vụ */}
                                    <ViewRightItem className="col-12 col-md-6 col-lg-12 pt-5">
                                        <ViewRightH6 className="color-white mb-3">Dịch vụ trang trí:</ViewRightH6>
                                        <ViewRightUl className="list">
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Cổng hoa đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Welcome tên CDCR
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        1.200.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Gallery đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>6 trụ hoa hướng lên sân khấu</ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">5.000.000 <b><u>đ</u></b></ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bánh cưới + Champagne (2 rượu + 1 bánh)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bàn tiệc
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi sân khấu
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bóng bay hồ bơi
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                        </ViewRightUl>
                                    </ViewRightItem>
                                    {/* ITEM Dịch vụ */}
                                    <ViewRightItem className="col-12 col-md-6 col-lg-12 pt-5">
                                        <ViewRightH6 className="color-white mb-3">Dịch vụ trang trí:</ViewRightH6>
                                        <ViewRightUl className="list">
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Cổng hoa đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Welcome tên CDCR
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        1.200.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bảng Gallery đón khách (Tùy mẫu)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>6 trụ hoa hướng lên sân khấu</ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">5.000.000 <b><u>đ</u></b></ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bánh cưới + Champagne (2 rượu + 1 bánh)
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi bàn tiệc
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        500.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Hoa tươi sân khấu
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        2.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                            <ViewRightLi className="list__item">
                                                <ViewRightLabel className="row label--checkbox">
                                                    <ViewRightCol9 className="col-md-9">
                                                        <InputRadioService type="checkbox" className="checkbox" />
                                                        <ViewRightItemName>
                                                            Bóng bay hồ bơi
                                                        </ViewRightItemName>
                                                    </ViewRightCol9>
                                                    <ViewRightCol3 className="col-md-3">
                                                        3.000.000 <b><u>đ</u></b>
                                                    </ViewRightCol3>
                                                </ViewRightLabel>
                                            </ViewRightLi>
                                        </ViewRightUl>
                                    </ViewRightItem>
                                </ViewRightContainer>
                                <Button className="row" style={{ margin: "20px" }}>
                                    <ButtonContainer>
                                        <ButtonClick style={{ marginLeft: "70%" }} className="">
                                            {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                            Tiếp tục
                                        </ButtonClick>
                                    </ButtonContainer>
                                </Button>
                            </ViewRight>
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