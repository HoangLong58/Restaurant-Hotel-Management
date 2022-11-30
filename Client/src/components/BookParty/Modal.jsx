import { ArrowDropDownOutlined, CloseOutlined, SearchOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SliderImage from "./SliderImage";

import { format_money } from '../../utils/utils';

//SERVICES
import { useDispatch } from "react-redux";
import { addFoodListBookingParty, addPartyHallBookingParty, addPartyServiceBookingParty, addSetMenuBookingParty } from "../../redux/partyBookingRedux";
import * as PartyHallService from "../../service/PartyHallService";
import * as PartyServiceTypeService from "../../service/PartyServiceTypeService";

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
        color: black;
        transform: scale(1.3);
        transition: all 200ms linear; 
    }
`

// Image Menu
const MenuRight = styled.div`
max-width: 48%;
margin: auto;
background-color: white;
display: flex;
justify-content: flex-start;
align-items: center;
flex-direction: column;
padding: 20px;
border-radius: var(--card-border-radius);
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
    padding: 0px 10px;
    position: relative;
    color: var(--color-dark);
    background-color: white;
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
    color: var(--color-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; 
    width: 235px;
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
    position: fixed;
    top: 15%;
    right: 5%;
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
    font-weight: bold;
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
    object-fit: cover;
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
    background-color: var(--color-white);
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
    background-color: var(--color-white);
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
const InfomationTitle = styled.div`
    font-size: 1.2rem;
    color: var(--color-dark);
`

const MenuOptionCol8 = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`

const CartItem = styled.div`
display: flex;
width: 100%;
font-size: 1.1rem;
background: #ddd;
margin-top: 10px;
padding: 10px 12px;
border-radius: 5px;
cursor: pointer;
border: 1px solid transparent;
`

const CircleService = styled.span`
height: 12px;
width: 12px;
background: #ccc;
border-radius: 50%;
margin-right: 15px;
border: 4px solid transparent;
display: inline-block;
`

const Course = styled.div`
width: 100%;
`

const Content = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`

const Modal = ({ showModal, setShowModal, type, setMenuModal, partyHallModal, showToastFromOut }) => {
    const dispatch = useDispatch();

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

    // Box
    const openSelectBox = (boxId) => {
        var checkList = document.getElementById(boxId);
        checkList.classList.add('active');
    }
    const closeSelectBox = (boxId) => {
        var checkList = document.getElementById(boxId);
        checkList.classList.remove('active');
        setSearch("");
    }
    // ================================================================
    // HANDLE
    const [partyServiceTypesAndPartyServices, setPartyServiceTypesAndPartyServices] = useState([]);
    const [serviceChooseList, setServiceChooseList] = useState([]);
    useEffect(() => {
        const getPartyServiceTypesAndPartyServices = async () => {
            try {
                const res = await PartyServiceTypeService.getPartyServiceTypesAndPartyServices();
                setPartyServiceTypesAndPartyServices(res.data.data);
            } catch (err) {
                console.log("Error: ", err);
            }
        };
        getPartyServiceTypesAndPartyServices();
    }, []);

    const [partyHall, setPartyHall] = useState();
    const [partyHallName, setPartyHallName] = useState();
    const [partyHallView, setPartyHallView] = useState();
    const [partyHallDescription, setPartyHallDescription] = useState();
    const [partyHallOccupancy, setPartyHallOccupancy] = useState();
    const [partyHallPrice, setPartyHallPrice] = useState();
    const [partyHallImages, setPartyHallImages] = useState([]);
    useEffect(() => {
        const getPartyHallAndImages = async () => {
            try {
                const res = await PartyHallService.getPartyHallAndImages({
                    partyHallId: partyHallModal.party_hall_id
                });
                const result = res.data.data;
                setPartyHall(result);
                setPartyHallName(result.party_hall_name);
                setPartyHallView(result.party_hall_view);
                setPartyHallDescription(result.party_hall_description);
                setPartyHallOccupancy(result.party_hall_occupancy);
                setPartyHallPrice(format_money(result.party_hall_price));
                setPartyHallImages(result.partyHallImages);
            } catch (err) {
                console.log("Error: ", err);
            }
        };
        if (partyHallModal) {
            getPartyHallAndImages();
        }
    }, [partyHallModal]);
    console.log("Party hall: ", partyHall);

    // Set Menu
    const [setMenu, setSetMenu] = useState();
    const [foodTypeAndFoods, setFoodTypeAndFoods] = useState([]);
    useEffect(() => {
        if (setMenuModal) {
            setSetMenu(setMenuModal.setMenu);
            setFoodTypeAndFoods(setMenuModal.foodTypeAndFoods);
        }
    }, [setMenuModal])
    console.log("Set menu: ", setMenu, foodTypeAndFoods);

    const handleServices = (service) => {
        const serviceId = service.party_service_id;
        let isFind = false;
        for (var i = 0; i < serviceChooseList.length; i++) {
            if (serviceChooseList[i].party_service_id === serviceId) {
                isFind = true;
                let listAfter = serviceChooseList.filter(prev => prev.party_service_id !== serviceId);
                setServiceChooseList(listAfter);
                break;
            }
        }
        if (!isFind) {
            setServiceChooseList([...serviceChooseList, service]);
        }
    };

    const handleChoosePartyHallAndService = () => {
        dispatch(addPartyHallBookingParty({
            partyHall: partyHallModal
        }));
        dispatch(addPartyServiceBookingParty({
            partyService: serviceChooseList
        }));
        setShowModal(false);
        // Use toast
        const dataShow = { message: "Chọn Sảnh & Dịch vụ thành công!", type: "success" };
        showToastFromOut(dataShow);
        setServiceChooseList([]);
    };

    // Search food
    const [search, setSearch] = useState("");
    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    // Choose food
    const [foodChooseList, setFoodChooseList] = useState([]);
    const handleChooseFood = (food) => {
        const foodTypeId = food.food_type_id;
        let isFind = false;
        for (var i = 0; i < foodChooseList.length; i++) {
            if (foodChooseList[i].food_type_id === foodTypeId) {
                isFind = true;
                let listAfter = foodChooseList.filter(prev => prev.food_type_id !== foodTypeId);
                listAfter.push(food);
                setFoodChooseList(listAfter);
                break;
            }
        }
        if (!isFind) {
            setFoodChooseList([...foodChooseList, food]);
        }
    };

    // Mai làm
    const handleChooseMenuAndFood = () => {
        if (foodTypeAndFoods.length !== foodChooseList.length) {
            // Use toast
            const dataShow = { message: "Bạn chưa chọn đủ loại trong menu!", type: "danger" };
            showToastFromOut(dataShow);
            return;
        }
        dispatch(addSetMenuBookingParty({
            setMenu: setMenu
        }));
        dispatch(addFoodListBookingParty({
            foodList: foodChooseList
        }));
        setShowModal(false);
        // Use toast
        const dataShow = { message: "Chọn Menu & Món ăn thành công!", type: "success" };
        showToastFromOut(dataShow);
        setFoodChooseList([]);
    };
    console.log("serviceChooseList: ", serviceChooseList, foodChooseList);
    // ================================================================
    // =============== Show Image Menu ===============
    if (type === "showImageMenu") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} className="row" style={{ paddingTop: "15px", paddingBottom: "15px", height: "98%", width: "93%", backgroundColor: "#181818" }}>

                            <MenuImage src={setMenu ? setMenu.set_menu_image : null} className="col-md-6" />
                            <MenuRight className="col-md-6">
                                <div className="col-md-12">
                                    <div className="row">
                                        <InfomationTitle>
                                            <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Lựa chọn Món ăn cụ thể cho Menu</p>
                                            <p style={{ fontSize: "1rem" }}>Dưới đây là những món ăn tương ứng với Menu của Quý khách.</p>
                                        </InfomationTitle>
                                    </div>
                                    {
                                        foodTypeAndFoods.length > 0 ? (
                                            foodTypeAndFoods.map((foodTypeAndFood, key) => {
                                                let foodArray = foodTypeAndFood.food;
                                                let foodArrayKey = key;
                                                let foodChooseName;
                                                foodChooseList.map((foodChoose, key) => {
                                                    if (foodChoose.food_type_id === foodTypeAndFood.foodType.food_type_id) {
                                                        foodChooseName = foodChoose.food_name;
                                                        return;
                                                    }
                                                })
                                                return (
                                                    <CartItem>
                                                        <CircleService />
                                                        <Course>
                                                            <Content>
                                                                <span style={{ width: "320px", fontWeight: "bold" }}> {foodTypeAndFood.foodType.food_type_name} </span>
                                                                <MenuOptionCol8 className="col-md-8">
                                                                    <Box id={"Box" + key}>

                                                                        <BoxSpan>{foodChooseName ? foodChooseName : "Hãy chọn " + foodTypeAndFood.foodType.food_type_name}</BoxSpan>
                                                                        <SearchOutlined
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={() => openSelectBox("Box" + key)}
                                                                        />
                                                                        <Wrapper>
                                                                            <BoxTitle>
                                                                                <BoxH2>Chọn {foodTypeAndFood.foodType.food_type_name}</BoxH2>
                                                                                <SearchContainer>
                                                                                    <Input
                                                                                        type="text" onChange={(e) => handleSearch(e)}
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
                                                                                        {
                                                                                            foodArray.length > 0 ? (
                                                                                                foodArray.map((food, key) => {
                                                                                                    if (search !== "") {
                                                                                                        if (food.food_name.toLowerCase().includes(search.toLowerCase())) {
                                                                                                            return (
                                                                                                                <Tr>
                                                                                                                    <Td style={{
                                                                                                                        border: 'none',
                                                                                                                        textAlign: "center",
                                                                                                                        fontSize: "1.5rem"
                                                                                                                    }}>
                                                                                                                        <InputRadio
                                                                                                                            type="radio"
                                                                                                                            name={"foodArray_" + foodArrayKey}
                                                                                                                            className="checkbox"
                                                                                                                            onChange={() => handleChooseFood(food)}
                                                                                                                        />
                                                                                                                    </Td>
                                                                                                                    <Td>
                                                                                                                        <MealImage src={food.food_image} />
                                                                                                                    </Td>
                                                                                                                    <Td>
                                                                                                                        {food.food_name}
                                                                                                                    </Td>
                                                                                                                    <Td>
                                                                                                                        {food.food_ingredient}
                                                                                                                    </Td>
                                                                                                                </Tr>
                                                                                                            )
                                                                                                        }
                                                                                                        return null;
                                                                                                    } else {
                                                                                                        return (
                                                                                                            <Tr>
                                                                                                                <Td style={{
                                                                                                                    border: 'none',
                                                                                                                    textAlign: "center",
                                                                                                                    fontSize: "1.5rem"
                                                                                                                }}>
                                                                                                                    <InputRadio
                                                                                                                        type="radio"
                                                                                                                        name={"foodArray_" + foodArrayKey}
                                                                                                                        className="checkbox"
                                                                                                                        onChange={() => handleChooseFood(food)}
                                                                                                                    />
                                                                                                                </Td>
                                                                                                                <Td>
                                                                                                                    <MealImage src={food.food_image} />
                                                                                                                </Td>
                                                                                                                <Td>
                                                                                                                    {food.food_name}
                                                                                                                </Td>
                                                                                                                <Td>
                                                                                                                    {food.food_ingredient}
                                                                                                                </Td>
                                                                                                            </Tr>
                                                                                                        )
                                                                                                    }
                                                                                                })
                                                                                            ) : null
                                                                                        }
                                                                                    </Tbody>
                                                                                </Table>
                                                                            </Option>
                                                                            <Button>
                                                                                <ButtonContainer>
                                                                                    <ButtonClick
                                                                                        onClick={() => {
                                                                                            closeSelectBox("Box" + key)
                                                                                        }}
                                                                                    >
                                                                                        Đồng ý
                                                                                    </ButtonClick>
                                                                                </ButtonContainer>
                                                                                {/* <ButtonContainer>
                                                                                    <ButtonClick
                                                                                        onClick={() => {
                                                                                            closeSelectBox("Box" + key)
                                                                                        }}
                                                                                    >Cancel</ButtonClick>
                                                                                </ButtonContainer> */}
                                                                            </Button>
                                                                        </Wrapper>
                                                                    </Box>
                                                                </MenuOptionCol8>
                                                            </Content>
                                                        </Course>
                                                    </CartItem>
                                                )
                                            })
                                        ) : null
                                    }
                                    <Button className="row">
                                        <ButtonContainer>
                                            <ButtonClick
                                                style={{ marginLeft: "70%" }}
                                                onClick={() => handleChooseMenuAndFood()}
                                            >
                                                {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                Tiếp tục
                                            </ButtonClick>
                                        </ButtonContainer>
                                    </Button>
                                </div>
                            </MenuRight>
                            <CloseModalButton
                                style={{ top: "40px", right: "35px" }}
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
                        <ModalWrapper showModal={showModal} className="row" style={{ paddingTop: "15px", paddingBottom: "15px", height: "98%", width: "93%", backgroundColor: "#f5f5f5" }}>

                            {/* <MenuImage src={imageView} className="col-md-6" /> */}
                            <ViewLeft className="col-md-6">
                                <ViewLeftRow className="row">
                                    <ImgContainer className="row">
                                        <MoreImage >
                                            <SliderImage image={partyHallImages} />
                                        </MoreImage>
                                    </ImgContainer>
                                    <ViewLeftDetailRow className="row">
                                        <TitleRow className="row">
                                            <TitleRowH6>{partyHallName} - {partyHallView}</TitleRowH6>
                                        </TitleRow>
                                        <DescriptionRow className="row">
                                            <DescriptionDetailRow className="col-md-2">
                                                Mô tả:
                                            </DescriptionDetailRow>
                                            <div className="col-md-10">
                                                {partyHallDescription}
                                            </div>
                                        </DescriptionRow>
                                        <QuantityRow className="row">
                                            <QuantityDetailRow className="col-md-2">
                                                Sức chứa:
                                            </QuantityDetailRow>
                                            <div className="col-md-10">
                                                {partyHallOccupancy} người
                                            </div>
                                        </QuantityRow>
                                        <PriceRow className="row">
                                            <PriceDetailRow className="col-md-2">
                                                Giá:
                                            </PriceDetailRow>
                                            <div className="col-md-10">
                                                {partyHallPrice} <b><u>đ</u></b>
                                            </div>
                                        </PriceRow>
                                    </ViewLeftDetailRow>
                                </ViewLeftRow>
                            </ViewLeft>
                            <ViewRight className="col-md-6">
                                <ViewRightContainer className="row">
                                    {
                                        partyServiceTypesAndPartyServices.length > 0 ? (
                                            partyServiceTypesAndPartyServices.map((partyServiceTypesAndPartyServicesItem, key) => {
                                                const serviceList = partyServiceTypesAndPartyServicesItem.partyServices;
                                                return (
                                                    <ViewRightItem className="col-12 col-md-6 col-lg-12 pt-5">
                                                        <ViewRightH6 className="color-white mb-3">
                                                            {partyServiceTypesAndPartyServicesItem.partyServiceType}:
                                                        </ViewRightH6>
                                                        <ViewRightUl className="list">
                                                            {
                                                                serviceList.map((service, key) => {
                                                                    return (
                                                                        <ViewRightLi className="list__item">
                                                                            <ViewRightLabel className="row label--checkbox">
                                                                                <ViewRightCol9 className="col-md-9">
                                                                                    <InputRadioService type="checkbox" className="checkbox" onChange={() => handleServices(service)} />
                                                                                    <ViewRightItemName>
                                                                                        {service.party_service_name}
                                                                                    </ViewRightItemName>
                                                                                </ViewRightCol9>
                                                                                <ViewRightCol3 className="col-md-3">
                                                                                    {format_money(service.party_service_price)} <b><u>đ</u></b>
                                                                                </ViewRightCol3>
                                                                            </ViewRightLabel>
                                                                        </ViewRightLi>
                                                                    )
                                                                })
                                                            }
                                                        </ViewRightUl>
                                                    </ViewRightItem>
                                                )
                                            })
                                        ) : null
                                    }
                                </ViewRightContainer>
                                <Button className="row" style={{ margin: "20px" }}>
                                    <ButtonContainer>
                                        <ButtonClick style={{ marginLeft: "70%" }}
                                            onClick={() => handleChoosePartyHallAndService()}
                                        >
                                            {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                            Đồng ý
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