import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
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
    position: absolute;
`
const MealDetail = styled.p`
    position: absolute;
`
const MealPrice = styled.h5`
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
    max-height: 56vh;
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
const Foods = () => {
    const navigate = useNavigate();
    // STATE
    const [isSelectAdults, setIsSelectAdults] = useState(false);

    const [maxPrice, setMaxPrice] = useState();

    // HANDLE
    // Modal
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("");
    const [danhMucModal, setDanhMucModal] = useState(null);

    const openModal = (modal) => {
        setShowModal(prev => !prev);
        setTypeModal(modal.type);
    }
    // Sort
    const handleClickSearch = () => {

    }
    return (
        <>
            <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "15px" }}>
                <div class="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-md-12">
                                    <div class="row justify-content-center" style={{ marginTop: "25px" }}>
                                        <div class="col-md-8 align-self-center">
                                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                                            <h3 class="text-center padding-bottom-small" style={{ paddingBottom: "20px" }}>Cơm-Mì-Lẩu</h3>
                                        </div>
                                        <div class="section clearfix"></div>
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
                                                <img src={picture1} alt="" />
                                                <MealName><span>imported salmon steak</span></MealName>
                                                <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                                <MealPrice><span>$32</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture1} alt="" />
                                                <MealName><span>imported salmon steak</span></MealName>
                                                <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                                <MealPrice><span>$32</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture1} alt="" />
                                                <MealName><span>imported salmon steak</span></MealName>
                                                <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                                <MealPrice><span>$32</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture1} alt="" />
                                                <MealName><span>imported salmon steak</span></MealName>
                                                <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                                <MealPrice><span>$32</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture1} alt="" />
                                                <MealName><span>imported salmon steak</span></MealName>
                                                <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                                <MealPrice><span>$32</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture1} alt="" />
                                                <MealName><span>imported salmon steak</span></MealName>
                                                <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                                <MealPrice><span>$32</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture1} alt="" />
                                                <MealName><span>imported salmon steak</span></MealName>
                                                <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                                <MealPrice><span>$32</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture1} alt="" />
                                                <MealName><span>imported salmon steak</span></MealName>
                                                <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                                <MealPrice><span>$32</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture2} alt="" />
                                                <MealName><span>tuna roast source</span></MealName>
                                                <MealDetail><span>tuna / potatoes / rice</span></MealDetail>
                                                <MealPrice><span>$47</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture3} alt="" />
                                                <MealName><span>salted fried chicken</span></MealName>
                                                <MealDetail><span>chicken / olive oil / salt</span></MealDetail>
                                                <MealPrice><span>$26</span></MealPrice>
                                            </div>
                                        </MealItem>
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
                                                <img src={picture4} alt="" />
                                                <MealName><span>crab with curry sources</span></MealName>
                                                <MealDetail><span>crab / potatoes / rice</span></MealDetail>
                                                <MealPrice><span>$64</span></MealPrice>
                                            </div>
                                        </MealItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 order-first order-lg-last mt-4">
                            <div className="section background-dark p-4">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 pt-4">
                                                <BookingNumberNiceSelect name="adults" className={isSelectAdults ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectAdults(prev => !prev)}>
                                                    <BookingNumberNiceSelectSpan className='current'>Loại món ăn</BookingNumberNiceSelectSpan>
                                                    <BookingNumberNiceSelectUl className='list'>
                                                        <BookingNumberNiceSelectLi data-value="adults" data-display="adults" className='option focus selected'>Người lớn</BookingNumberNiceSelectLi>
                                                        <BookingNumberNiceSelectLi data-value="1" className='option'>1</BookingNumberNiceSelectLi>
                                                        <BookingNumberNiceSelectLi data-value="2" className='option'>2</BookingNumberNiceSelectLi>
                                                        <BookingNumberNiceSelectLi data-value="3" className='option'>3</BookingNumberNiceSelectLi>
                                                        <BookingNumberNiceSelectLi data-value="4" className='option'>4</BookingNumberNiceSelectLi>
                                                        <BookingNumberNiceSelectLi data-value="5" className='option'>5</BookingNumberNiceSelectLi>
                                                    </BookingNumberNiceSelectUl>
                                                </BookingNumberNiceSelect>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 pt-5">
                                        <h6 className="color-white mb-3">Max night price:</h6>
                                        <div className="selecteurPrix">
                                            <div className="range-slider">
                                                <input className="input-range" type="range" min="1" max="500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                                                <div className="valeurPrix">
                                                    <span className="range-value">{maxPrice} $</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-12 pt-5">
                                        <h6 className="color-white mb-3">Bộ lọc:</h6>
                                        <ul className="list">
                                            <li className="list__item">
                                                <label className="label--checkbox">
                                                    <input type="checkbox" className="checkbox" />
                                                    Giá giảm dần
                                                </label>
                                            </li>
                                            <li className="list__item">
                                                <label className="label--checkbox">
                                                    <input type="checkbox" className="checkbox" />
                                                    Giá tăng dần
                                                </label>
                                            </li>
                                            <li className="list__item">
                                                <label className="label--checkbox">
                                                    <input type="checkbox" className="checkbox" />
                                                    Sao giảm dần
                                                </label>
                                            </li>
                                            <li className="list__item">
                                                <label className="label--checkbox">
                                                    <input type="checkbox" className="checkbox" />
                                                    Sao tăng dần
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
                                                <Badge badgeContent={12} color="primary">
                                                    <ShoppingCartOutlined style={{ color: "white" }} />
                                                </Badge>
                                                <MiniCartList>
                                                    <NoCartImg></NoCartImg>
                                                    <NoCartMsg>
                                                        Chưa có Món ăn
                                                    </NoCartMsg>
                                                    <Heading>Món ăn đã thêm</Heading>
                                                    <UlItem>
                                                        {/* {cart.products.map(product => {
                            const handleRemove = (soluongcapnhat) => {
                                dispatch(capNhatSanPham({ ...product, soluongcapnhat }));
                            }
                            return (
                                <>
                                    <LiItem>
                                        <MiniCartImage item={product.data[0].mathucung}></MiniCartImage>
                                        <ItemInfo>
                                            <ItemHead>
                                                <ItemName>{product.data[0].tieude}</ItemName>
                                                <ItemPriceWrap>
                                                    <ItemPrice>{format_money(product.data[0].giamgia.toString())}</ItemPrice>
                                                    <ItemMultiply>x</ItemMultiply>
                                                    <ItemQnt>{product.soluongmua}</ItemQnt>
                                                </ItemPriceWrap>
                                            </ItemHead>
                                            <ItemBody>
                                                <ItemDescription>
                                                    Phân loại: {product.data[0].tendanhmuc}
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
                        } */}
                                                        <LiItem>
                                                            <MiniCartImage></MiniCartImage>
                                                            <ItemInfo>
                                                                <ItemHead>
                                                                    <ItemName>Gà rén</ItemName>
                                                                    <ItemPriceWrap>
                                                                        <ItemPrice>200.000 đ</ItemPrice>
                                                                        <ItemMultiply>x</ItemMultiply>
                                                                        <ItemQnt>2</ItemQnt>
                                                                    </ItemPriceWrap>
                                                                </ItemHead>
                                                                <ItemBody>
                                                                    <ItemDescription>
                                                                        Phân loại: Món chính
                                                                    </ItemDescription>
                                                                    <div>
                                                                        <Remove>Xóa</Remove>
                                                                    </div>
                                                                </ItemBody>
                                                            </ItemInfo>
                                                        </LiItem>
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
            <Modal
                showModal={showModal}   //state Đóng mở modal
                setShowModal={setShowModal} //Hàm Đóng mở modal
                type={typeModal}    //Loại modal
            />
        </>
    )
}

export default Foods