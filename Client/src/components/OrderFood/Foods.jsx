import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
// Multi carousel
import 'react-multi-carousel/lib/styles.css';

import picture1 from '../../img/food1.jpg';
import picture2 from '../../img/food2.jpg';
import picture3 from '../../img/food3.jpg';
import picture4 from '../../img/food4.jpg';

// Date picker
import { useNavigate } from 'react-router-dom';

// Mini cart
import { Badge } from "@material-ui/core";
// import { useSelector } from 'react-redux';
import MiniCartImage from "./MiniCartImage";
import Modal from "./Modal";

import ReactPaginate from "react-paginate";
// SERVICES
import * as FoodTypeService from "../../service/FoodTypeService";
import * as FoodService from "../../service/FoodService";
import { format_money } from '../../utils/utils';
import Toast from '../Toast';
import { addFood, updateFood } from '../../redux/foodCartRedux';

const Info = styled.div`
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.2);
    z-index: 3;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    transition: all 0.5s ease;
    cursor: pointer;
`

const Circle = styled.div`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: white;
    position: absolute;
`

const Icon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    transition: all 0.5s ease;
    &:hover {
        background-color: #e9f5f5;
        transform: scale(1.1);
    }
`

const MealName = styled.h6`
    width: 250px;
    position: absolute;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; 
`
const MealDetail = styled.p`
    position: absolute;
`
const MealPrice = styled.h5`
    font-weight: bold;
    letter-spacing: 1px;
    font-size: 1.2rem;
    position: absolute;
`

const MealItem = styled.div`
    -ms-flex: 0 0 48%;
    flex: 0 0 48%;
    max-width: 47%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-top: 1.5rem !important;
    margin-left: 20px;
    padding-left: 0;
    &:hover ${Info} {
        opacity: 1;
    };
    &:hover ${MealName} {
        top: 80px;
        transition: top 0.18s;
    };
    &:hover ${MealDetail} {
        top: 80px;
        transition: top 0.18s;
    };
    &:hover ${MealPrice} {
        z-index: 4;
    };
`

const BookingNumberNiceSelect = styled.div``
const BookingNumberNiceSelectSpan = styled.span``
const BookingNumberNiceSelectUl = styled.ul``
const BookingNumberNiceSelectLi = styled.li``

// Button
const Button = styled.div``

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`

const ButtonClick = styled.button`
    min-width: 100px;
    border: none;
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
// Mini cart
const MenuItem = styled.div`
    font-size: 14px;
    cursor: pointer;
    margin-left: 25px;
`

// Minicart
const Container = styled.div`
    text-align: center;
    position: fixed; /* Fixed/sticky position */
    bottom: 100px; /* Place the button at the bottom of the page */
    right: 30px;

    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-primary);
    border-radius: 50%;
    transition: all 0.5s ease;
    &:hover {
        transform: scale(1.1);
    }
`;
const Wrapper = styled.div`
    position: relative;
    display: inline-block;
    padding: 0 12px;
    cursor: pointer;
`;

const MiniCartList = styled.div`
    position: absolute;
    bottom: calc(100% + 30px);
    right: 1px;
    background-color: white;
    width: 400px;
    border-radius: 2px;
    box-shadow: 0 1px 3.125rem 0 rgba(0, 0, 0, 0.2);
    animation: fadeIn ease-in 0.2s;
    cursor: default;
    display: none;
    z-index: 10;
    ${Wrapper}:hover &{
        display: block;
    }
    &::after {
        content: "";
        position: absolute;
        cursor: pointer;
        right: 4px;
        bottom: -28px;
        border-width: 16px 20px;
        border-style: solid;
        border-color: white transparent transparent transparent;
    }
`;
const NoCartImg = styled.img`
    width: 54%;
    display: none;
`;
const NoCartMsg = styled.span`
    display: none;
    font-size: 1.4rem;
    margin-bottom: 14px;
    color: black;
`;
const Heading = styled.h4`
    text-align: left;
    margin: 8px 0 8px 12px;
    font-size: 1.1rem;
    color: #999;
    font-weight: 400;
`;
const UlItem = styled.ul`
    padding-left: 0;
    list-style: none;
    max-height: 36vh;
    overflow-y: auto;
`;
const LiItem = styled.li`
    display: flex;
    align-items: center;
    position: relative;
    &:hover {
        background-color: #f5f5f5;
        margin-left: 10px;
        transition: all 0.5s ease;
        &::after{
            display: block;
        }
    }
    &::after {
        content: "";
        display: none;
        position: absolute;
        top: 0px;
        left: -10px;
        width: 10px;
        height: 79px;
        background-color: var(--color-primary);
    }
`;

const ItemInfo = styled.div`
    width: 100%;
    margin-right: 12px;
`;
const ItemHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const ItemName = styled.h5`
    font-size: 1.1rem;
    line-height: 1.2rem;
    max-height: 2.4rem;
    overflow: hidden;
    font-weight: 500;
    color: black;
    margin: 0;
    flex: 1;
    padding-right: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-align: left;
`;
const ItemPriceWrap = styled.div`
    display: flex;
`;
const ItemPrice = styled.span`
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--color-primary);
`;
const ItemMultiply = styled.span`
    font-size: 0.9rem;
    margin: 0 4px;
    color: #757575;
`;
const ItemQnt = styled.span`
    font-size: 1.1rem;
    color: #757575;
`;

const ItemBody = styled.div`
    display: flex;
    justify-content: space-between;
`;
const ItemDescription = styled.span`
    color: #757575;
    font-size: 1.1rem;
    font-weight: 300;
`;
const Remove = styled.div`
    color: #333;
    font-size: 1.1rem;
    border: none;
    &:hover {
        font-weight: 500;
        color: var(--color-primary);
        cursor: pointer;
    }
`;

const CartButtonContainer = styled.div`
    position: relative;
    float: right;
    margin: 0 22px 22px 0;
    &::after {
        content: "";
        border: 2px solid black;
        position: absolute;
        top: 5px;
        left: 5px;
        right: 20px;
        background-color: transperent;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
`

const CartButton = styled.button`
    padding: 10px;
    border: 2px solid black;
    background-color: black;
    color: white;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        background-color: var(--color-primary);
    }
    &:active {
        background-color: #333;
        transform: translate(5px, 5px);
        transition: transform 0.25s;
    }
`

const PictureNoResultFound = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 10%;
`;

const Img = styled.img`
    width: 400px;
    max-height: 600px;
    object-fit: cover;
`;

const H1NoResultFound = styled.h1`
    margin-top: 25px;
    letter-spacing: 2px;
    font-size: 1.4rem;
    color: var(--color-primary);
    font-weight: bold;
`;

// Empty item
const EmptyItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const EmptyItemSvg = styled.div``
const EmptyContent = styled.div`
    letter-spacing: 2px;
    font-size: 1.2rem;
    color: var(--color-primary);
    font-weight: bold;
`

const Foods = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const foodCart = useSelector(state => state.foodCart);
    // STATE
    const [isSelectAdults, setIsSelectAdults] = useState(false);

    // HANDLE
    // Modal
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("");
    const [danhMucModal, setDanhMucModal] = useState(null);

    const openModal = (modal) => {
        setShowModal(prev => !prev);
        setTypeModal(modal.type);
    };
    // Toast
    const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
    const toastRef = useRef(null);

    const showToastFromOut = (dataShow) => {
        setDataToast(dataShow);
        toastRef.current.show();
    };
    // =====================================
    const [isLoading, setIsLoading] = useState(false);
    const [foodTypeName, setFoodTypeName] = useState();
    // State from BE
    const [foodTypeList, setFoodTypeList] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [foodFilteredList, setFoodFilteredList] = useState([]);
    const [minFoodPrice, setMinFoodPrice] = useState();
    const [maxFoodPrice, setMaxFoodPrice] = useState();
    // State choose
    const [foodType, setFoodType] = useState();
    const [maxPriceChoose, setMaxPriceChoose] = useState(0);
    const [sort, setSort] = useState();
    useEffect(() => {
        const getFoodType = async () => {
            try {
                const foodTypeListRes = await FoodTypeService.getFoodType();
                setFoodTypeList(foodTypeListRes.data.data);
            } catch (err) {
                console.log("Err: ", err);
            }
        };
        getFoodType();
    }, []);

    useEffect(() => {
        const getFoodList = async () => {
            try {
                const foodListRes = await FoodService.getFoodByFoodTypeId({
                    foodTypeId: foodType.food_type_id
                });
                setFoodList(foodListRes.data.data);
            } catch (err) {
                console.log("Err: ", err);
            }
        };
        const getFoodMinMaxPrice = async () => {
            try {
                const foodPriceRes = await FoodService.getMinMaxFoodPrice({
                    foodTypeId: foodType.food_type_id
                });
                setMinFoodPrice(foodPriceRes.data.data.min_food_price);
                setMaxFoodPrice(foodPriceRes.data.data.max_food_price);
            } catch (err) {
                console.log("Err: ", err);
            }
        };
        if (foodType) {
            getFoodList();
            getFoodMinMaxPrice();
            setMaxPriceChoose(0);
        }
    }, [foodType]);

    // Sort
    const handleCheckSort = (e) => {
        const value = e.target.value;
        if (e.currentTarget.checked) {
            setSort(value);
        } else {
            return;
        }
    };
    const handleClickSearch = () => {
        handleLoading();
        if (!foodType) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn Loại món ăn!", type: "danger" };
            showToastFromOut(dataToast);
        }
        if (maxPriceChoose === 0) {
            // Toast
            const dataToast = { message: "Giá món ăn không hợp lệ!", type: "danger" };
            showToastFromOut(dataToast);
        }
        if (!sort) {
            // Toast
            const dataToast = { message: "Hãy chọn cách sắp sếp kết quả!", type: "danger" };
            showToastFromOut(dataToast);
        }
        if (foodList) {
            // SORT
            let filterResList = foodList.filter(prev => prev.food_price <= maxPriceChoose);
            if (sort === "decreasePrice") {
                filterResList.sort((a, b) => b.food_price - a.food_price);
            } else if (sort === "increasePrice") {
                filterResList.sort((a, b) => a.food_price - b.food_price);
            } else if (sort === "decreaseVote") {
                filterResList.sort((a, b) => b.food_vote - a.food_vote);
            } else {
                filterResList.sort((a, b) => a.food_vote - b.food_vote);
            }
            setFoodFilteredList(filterResList);
            setFoodTypeName(foodType.food_type_name);
        }
    };

    // PHÂN TRANG
    const [pageNumber, setPageNumber] = useState(0);

    const productPerPage = 10;
    const pageVisited = pageNumber * productPerPage;

    const displayProducts = foodFilteredList
        .slice(pageVisited, pageVisited + productPerPage)
        .map(food => {
            return (
                <MealItem>
                    <Circle />
                    <Info>
                        <Icon
                            onClick={() => handleAddFood(food)}
                        >
                            <ShoppingCartOutlined />
                        </Icon>
                        <Icon>
                            <SearchOutlined />
                        </Icon>
                    </Info>
                    <div class="restaurant-box">
                        <img src={food.food_image} alt="" style={{ width: "240px", height: "175px", objectFit: "cover" }} />
                        <MealName><span>{food.food_name}</span></MealName>
                        <MealDetail><span>{food.food_ingredient}</span></MealDetail>
                        <MealPrice><span>{format_money(food.food_price)}đ</span></MealPrice>
                    </div>
                </MealItem>
            );
        }
        );
    const pageCount = Math.ceil(foodFilteredList.length / productPerPage);
    const changePage = ({ selected }) => {
        // Scroll lên kết quả mới
        window.scrollTo({
            top: 300,
            behavior: "smooth"
        });
        setPageNumber(selected);
    };

    // Fake loading
    const handleLoading = () => {
        // Scroll lên kết quả mới
        window.scrollTo({
            top: 300,
            behavior: "smooth"
        });
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    };

    const handleAddFood = (food) => {
        dispatch(addFood({ ...food, foodQuantity: 1 }));
        const dataShow = { message: "Đã thêm món ăn vào giỏ hàng", type: "success" };
        showToastFromOut(dataShow); //Hiện toast thông báo
    };
    console.log(foodTypeList, foodList, minFoodPrice, maxFoodPrice, sort, foodFilteredList);
    return (
        <>
            <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "15px" }}>
                <div class="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {
                                isLoading ? (
                                    <div className="row">
                                        <div
                                            class="spinner-border"
                                            style={{ color: '#41F1B6', position: 'absolute', left: '50%', top: "25%", scale: "1.5" }}
                                            role="status"
                                        >
                                            <span class="visually-hidden"></span>
                                        </div>
                                    </div>
                                ) :
                                    foodFilteredList.length === 0 ? (
                                        <PictureNoResultFound id="No_Result_Found_Picture">
                                            <Img
                                                src="https://i.ibb.co/VW9RNpG/chef.png"
                                                alt="Not Found Result"
                                            />
                                            <H1NoResultFound>Mời bạn chọn món ăn!</H1NoResultFound>
                                        </PictureNoResultFound>
                                    ) : (
                                        <>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div class="row justify-content-center" style={{ marginTop: "25px" }}>
                                                        <div class="col-md-8 align-self-center">
                                                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                                                            <h3 class="text-center padding-bottom-small" style={{ paddingBottom: "20px" }}>{foodTypeName ? foodTypeName : "Danh sách món ăn"}</h3>
                                                        </div>
                                                        {
                                                            foodType
                                                                ?
                                                                displayProducts
                                                                : foodList.slice(0, 10).map(food => (
                                                                    <MealItem>
                                                                        <Circle />
                                                                        <Info>
                                                                            <Icon>
                                                                                <ShoppingCartOutlined />
                                                                            </Icon>
                                                                            <Icon>
                                                                                <SearchOutlined />
                                                                            </Icon>
                                                                        </Info>
                                                                        <div class="restaurant-box">
                                                                            <img src={food.food_image} alt="" style={{ width: "240px", height: "175px", objectFit: "cover" }} />
                                                                            <MealName><span>{food.food_name}</span></MealName>
                                                                            <MealDetail><span>{food.food_ingredient}</span></MealDetail>
                                                                            <MealPrice><span>{format_money(food.food_price)}đ</span></MealPrice>
                                                                        </div>
                                                                    </MealItem>
                                                                ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                {/* Phân trang */}
                                                <ReactPaginate
                                                    previousLabel={"PREVIOUS"}
                                                    nextLabel={"NEXT"}
                                                    pageCount={pageCount}
                                                    onPageChange={changePage}
                                                    containerClassName={"paginationBttns"}
                                                    previousLinkClassName={"previousBttn"}
                                                    nextLinkClassName={"nextBttn"}
                                                    disabledClassName={"paginationDisabled"}
                                                    activeClassName={"paginationActive"}
                                                    nextClassName={"nextClassName"}
                                                    pageLinkClassName={"pageLinkClassName"}
                                                />
                                            </div>
                                        </>
                                    )
                            }

                        </div>
                        <div className="col-lg-4 order-first order-lg-last mt-4">
                            <div className="section background-dark p-4">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 pt-4">
                                                <BookingNumberNiceSelect name="adults" className={isSelectAdults ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectAdults(prev => !prev)}>
                                                    <BookingNumberNiceSelectSpan className='current'>{foodType ? foodType.food_type_name : "Loại món ăn"}</BookingNumberNiceSelectSpan>
                                                    <BookingNumberNiceSelectUl className='list'>
                                                        <BookingNumberNiceSelectLi className='option focus selected'>Hãy chọn loại món ăn mà bạn thích</BookingNumberNiceSelectLi>
                                                        {
                                                            foodTypeList.length > 0 ?
                                                                foodTypeList.map((foodType, key) => {
                                                                    return (
                                                                        <BookingNumberNiceSelectLi className='option' onClick={() => setFoodType(foodType)}>{foodType.food_type_name}</BookingNumberNiceSelectLi>
                                                                    )
                                                                }) : null
                                                        }
                                                    </BookingNumberNiceSelectUl>
                                                </BookingNumberNiceSelect>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 pt-5">
                                        <h6 className="color-white mb-3">Giá món ăn từ:  </h6>
                                        <div className="selecteurPrix">
                                            <div className="range-slider">
                                                <input className="input-range" type="range" min={minFoodPrice} max={maxFoodPrice} value={maxPriceChoose} onChange={(e) => setMaxPriceChoose(parseInt(e.target.value))} />
                                                <div className="valeurPrix">
                                                    <span className="range-value"> {format_money(maxPriceChoose)}VNĐ</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-12 pt-5">
                                        <h6 className="color-white mb-3">Tìm kiếm theo:</h6>
                                        <ul className="list">
                                            <li className="list__item">
                                                <label className="label--checkbox">
                                                    <input type="radio" className="checkbox" value={"decreasePrice"} name='sort_food' onChange={(e) => handleCheckSort(e)} />
                                                    Giá giảm dần
                                                </label>
                                            </li>
                                            <li className="list__item">
                                                <label className="label--checkbox">
                                                    <input type="radio" className="checkbox" value={"increasePrice"} name='sort_food' onChange={(e) => handleCheckSort(e)} />
                                                    Giá tăng dần
                                                </label>
                                            </li>
                                            <li className="list__item">
                                                <label className="label--checkbox">
                                                    <input type="radio" className="checkbox" value={"decreaseVote"} name='sort_food' onChange={(e) => handleCheckSort(e)} />
                                                    Đánh giá giảm dần
                                                </label>
                                            </li>
                                            <li className="list__item">
                                                <label className="label--checkbox">
                                                    <input type="radio" className="checkbox" value={"increaseVote"} name='sort_food' onChange={(e) => handleCheckSort(e)} />
                                                    Đánh giá tăng dần
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-12 pt-5" style={{ padding: "0", margin: "0" }}>
                                        <Button className="row">
                                            <ButtonContainer>
                                                <ButtonClick onClick={() => handleClickSearch()}>
                                                    {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                    Tìm kiếm
                                                </ButtonClick>
                                            </ButtonContainer>
                                        </Button>
                                    </div>

                                    {/* Mini Cart */}
                                    <MenuItem >
                                        <Container>
                                            <Wrapper>
                                                <Badge badgeContent={foodCart.foodCartQuantity} color="primary">
                                                    <ShoppingCartOutlined style={{ color: "white" }} />
                                                </Badge>
                                                <MiniCartList>
                                                    <NoCartImg></NoCartImg>
                                                    <NoCartMsg>
                                                        Chưa có Món ăn
                                                    </NoCartMsg>
                                                    <Heading>Món ăn đã thêm</Heading>
                                                    <UlItem>
                                                        {
                                                            foodCart.foods.length > 0 ? (
                                                                foodCart.foods.map(food => {
                                                                    const handleRemove = (foodQuantityUpdate) => {
                                                                        dispatch(updateFood({ ...food, foodQuantityUpdate }));
                                                                        // Toast
                                                                        const dataToast = { message: "Đã xóa món ăn khỏi giỏ hàng!", type: "success" };
                                                                        showToastFromOut(dataToast);
                                                                    }
                                                                    return (
                                                                        <>
                                                                            <LiItem>
                                                                                <MiniCartImage image={food.food_image}></MiniCartImage>
                                                                                <ItemInfo>
                                                                                    <ItemHead>
                                                                                        <ItemName>{food.food_name}</ItemName>
                                                                                        <ItemPriceWrap>
                                                                                            <ItemPrice>{format_money(food.food_price)}đ</ItemPrice>
                                                                                            <ItemMultiply>x</ItemMultiply>
                                                                                            <ItemQnt>{food.foodQuantity}</ItemQnt>
                                                                                        </ItemPriceWrap>
                                                                                    </ItemHead>
                                                                                    <ItemBody>
                                                                                        <ItemDescription>
                                                                                            Phân loại: {food.food_type_name}
                                                                                        </ItemDescription>
                                                                                        <div onClick={() => handleRemove(0)}>
                                                                                            <Remove>Xóa</Remove>
                                                                                        </div>
                                                                                    </ItemBody>
                                                                                </ItemInfo>
                                                                            </LiItem>
                                                                        </>
                                                                    )
                                                                })
                                                            ) : (
                                                                <EmptyItem>
                                                                    <EmptyItemSvg>
                                                                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="EmptyStatestyles__StyledSvg-sc-qsuc29-0 cHfQrS">
                                                                            <path d="M186 63V140H43V177H200V63H186Z" fill="#D6DADC"></path>
                                                                            <path d="M170.5 45H13.5V159H170.5V45Z" fill="white"></path>
                                                                            <path d="M29.5 26V45H170.5V140H186.5V26H29.5Z" fill="#1952B3"></path>
                                                                            <path d="M175 155V42H167H121.5V44H15H11V84H15V64H161V60H15V48H121.5V50H167V155H31V163H175V155Z" fill="#232729"></path>
                                                                            <path d="M28 52H24V56H28V52Z" fill="#232729"></path>
                                                                            <path d="M35 52H31V56H35V52Z" fill="#232729"></path>
                                                                            <path d="M42 52H38V56H42V52Z" fill="#232729"></path>
                                                                            <path d="M120 76H30V106H120V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M153.5 76H126.5V142H153.5V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M120 112H30V142H120V112Z" fill="#F3F4F6"></path>
                                                                            <path d="M44 120.77H26.23V103H17.77V120.77H0V129.23H17.77V147H26.23V129.23H44V120.77Z" fill="#FF5100"></path>
                                                                            <path d="M60.0711 146.314L62.1924 144.192L55.1213 137.121L53 139.243L60.0711 146.314Z" fill="#232729"></path>
                                                                            <path d="M53.0711 105.071L55.1924 107.192L62.2634 100.121L60.1421 98L53.0711 105.071Z" fill="#232729"></path>
                                                                            <path d="M70.1924 124.192V121.192H59.1924V124.192H70.1924Z" fill="#232729"></path>
                                                                        </svg>
                                                                    </EmptyItemSvg>
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Chưa có món ăn nào được chọn!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                        }
                                                    </UlItem>
                                                    <CartButtonContainer>
                                                        <CartButton
                                                            onClick={() => openModal({ type: "showCartItems" })}
                                                        >Xem giỏ hàng</CartButton>
                                                    </CartButtonContainer>
                                                </MiniCartList>
                                            </Wrapper>
                                        </Container>
                                    </MenuItem>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                showModal={showModal}   //state Đóng mở modal
                setShowModal={setShowModal} //Hàm Đóng mở modal
                type={typeModal}    //Loại modal
            />

            {/* TOAST */}
            <Toast
                ref={toastRef}
                dataToast={dataToast}
            />
        </>
    )
}

export default Foods