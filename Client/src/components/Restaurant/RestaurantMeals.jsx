import { Add, FavoriteBorderOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// Multi carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import picture1 from '../../img/food1.jpg';
import picture2 from '../../img/food2.jpg';
import picture3 from '../../img/food3.jpg';
import picture4 from '../../img/food4.jpg';

import menu1 from '../../img/menu1.jpg';
import menu2 from '../../img/menu2.jpg';
import menu3 from '../../img/menu3.jpg';
import menu4 from '../../img/menu4.jpg';
import menu5 from '../../img/menu5.jpg';
import menu6 from '../../img/menu6.jpg';
import menu7 from '../../img/menu7.jpg';
import menu8 from '../../img/menu8.jpg';

import view3 from '../../img/hoboi1.jpg';
import view5 from '../../img/lavender1.jpg';
import view2 from '../../img/lobby1.jpg';
import view4 from '../../img/santhuong1.jpg';
import view1 from '../../img/sanvuon1.jpg';

// SERVICES
import * as FoodTypeService from "../../service/FoodTypeService";
import { Link } from 'react-router-dom';
import { format_money } from '../../utils/utils';

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
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
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
    max-width: 48%;
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
        top: 135px;
        transition: top 0.18s;
    };
    &:hover ${MealDetail} {
        top: 135px;
        transition: top 0.18s;
    };
    &:hover ${MealPrice} {
        z-index: 4;
    };
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
    cursor: pointer;
    &:hover {
        background-color: #e9f5f5;
        transform: scale(1.1);
    }
`

const Circle = styled.div`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: white;
    position: absolute;
`

const AddToCart = styled.div`
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
    position: absolute;
    bottom: 10px;
    right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        background-color: black;
    }
`

const Like = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 5px;
    left: 5px;
`
const LikeNumber = styled.div`
    text-decoration: none;
    padding:  5px 9px;
    display: block;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    letter-spacing: 2px;
    color: #fff;
    transition: all 0.3s ease-out;
    background-color: #41f1b6;
`
// Menu slider
const MenuItem = styled.div`
    background-color: #fff;
    width: 350px;
    margin: 0px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
`

const MenuImage = styled.img`
    width: 90%;
    max-height: 100%;
`
const MenuInfo = styled.div`
    background-color: #323232;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    padding: 30px 35px 20px 35px;
`

const MenuTitle = styled.h3`
    width: 100%;
    text-transform: uppercase;
    color: #E4B576;    
    position: relative;
    font-size: 1.6rem;
    margin-bottom: 15px;
    letter-spacing: 2px;
    &::after {
        content: "";
        display: block;
        width: 80%;
        position: absolute;
        top: 120%;
        left: 10%;
        border-bottom: 2px solid #E4B576;
    }
`

const MenuDescription = styled.p`
    color: #fff;
`

// View slider
const ViewImage = styled.img`
    display: block;
    width: 90%;
    max-height: 100%;
    -webkit-transition: all 300ms linear;
	transition: all 300ms linear;
`

const ViewItem = styled.div`
    background-color: #333;
    width: 350px;
    margin: 0px 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding-top: 15px;
    height: 100%;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    &:hover ${ViewImage} {
        transform: scale(1.1);
    }
`

const ViewInfo = styled.div`
    background-color: #323232;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    padding: 30px 35px 20px 35px;
`

const ViewTitle = styled.h3`
    width: 100%;
    text-transform: uppercase;
    color: #E4B576;    
    position: relative;
    font-size: 1.6rem;
    margin-bottom: 15px;
    letter-spacing: 2px;
    &::after {
        content: "";
        display: block;
        width: 80%;
        position: absolute;
        top: 120%;
        left: 10%;
        border-bottom: 2px solid #E4B576;
    }
`

const ViewDescription = styled.p`
    color: #fff;
`

const RestaurantMeals = () => {
    // Responsive Multi Carousel
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };
    const [foodTypeAndFoodList, setFoodTypeAndFoodList] = useState([]);
    useEffect(() => {
        const getFoodTypeAndFoodList = async () => {
            try {
                const foodTypeAndFoodListRes = await FoodTypeService.getFoodTypeAndEachFoodOfThisType();
                setFoodTypeAndFoodList(foodTypeAndFoodListRes.data.data);
                console.log("foodTypeAndFoodListRes: ", foodTypeAndFoodListRes);
            } catch (err) {
                console.log("L???i l???y food type v?? list food");
            }
        }
        getFoodTypeAndFoodList();
    }, []);
    return (
        <>
            {/* Restaurant Menu */}
            <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "75px", paddingBottom: "55px", backgroundColor: "#323232" }}>
                <div class="container">
                    <div class="row justify-content-center">
                        <Carousel
                            swipeable={false}
                            draggable={false}
                            showDots={false}
                            responsive={responsive}
                            ssr={true} // means to render carousel on server-side.
                            infinite={true}
                            autoPlay={false}
                            autoPlaySpeed={1000}
                            keyBoardControl={true}
                            customTransition="transform 500ms ease 0s"
                            transitionDuration={1500}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            deviceType="desktop"
                            dotListClass="custom-dot-list-style"
                            itemClass="carousel-item-padding-40-px"
                            arrows={true}
                            rewindWithAnimation={true}
                        >
                            <MenuItem>
                                <MenuImage src={menu1} />
                                <MenuInfo>
                                    <MenuTitle>MENU 4.950.000</MenuTitle>
                                    <MenuDescription>
                                        B??n ti???c ti??u chu???n v???i ?????y ????? c??c m??n ngon, ?????m b???o ?????y ????? kh???u ph???n v?? s??? sang tr???ng.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem>
                                <MenuImage src={menu2} />
                                <MenuInfo>
                                    <MenuTitle>MENU 5.950.000</MenuTitle>
                                    <MenuDescription>
                                        B??n ti???c n??ng c???p cho b???a ti???c sang tr???ng v???i c??c m??n ngon ??a d???ng v?? th???nh so???n h??n.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem>
                                <MenuImage src={menu3} />
                                <MenuInfo>
                                    <MenuTitle>MENU 6.250.000</MenuTitle>
                                    <MenuDescription>
                                        B??n ti???c v???i nh???ng m??n ??n phong ph?? v?? sang tr???ng ??em ?????n cho qu?? kh??ch.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem>
                                <MenuImage src={menu4} />
                                <MenuInfo>
                                    <MenuTitle>Menu 6.950.000</MenuTitle>
                                    <MenuDescription>
                                        B??n ti???c th???nh so???n, ?????y ????? m??n ngon, h???p kh???u v??? ng?????i ch??u ?? s??? l?? ch???n l???a ho??n h???o...
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem>
                                <MenuImage src={menu5} />
                                <MenuInfo>
                                    <MenuTitle>Menu 7.550.000</MenuTitle>
                                    <MenuDescription>
                                        B??n ti???c sang tr???ng, gi?? tr??? nh???t v???i nh???ng m??n ngon phong ph?? v?? gi?? tr??? dinh d?????ng cao nh???t.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem>
                                <MenuImage src={menu6} />
                                <MenuInfo>
                                    <MenuTitle>Menu th???c u???ng</MenuTitle>
                                    <MenuDescription>
                                        Nh???ng th???c u???ng ??a d???ng, m???c gi?? h???p l?? t???o th??m ??i???m nh???n quan tr???ng cho b???a ti???c.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem>
                                <MenuImage src={menu7} />
                                <MenuInfo>
                                    <MenuTitle>B???ng gi?? d???ch v???</MenuTitle>
                                    <MenuDescription>
                                        Nh???ng d???ch v??? trang tr??, nghi th???c l??? v???i phi??n b???n n??ng c???p l??m t??ng gi?? tr??? c???a b???a ti???c.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem>
                                <MenuImage src={menu8} />
                                <MenuInfo>
                                    <MenuTitle>B???NG GI?? D???CH V???</MenuTitle>
                                    <MenuDescription>
                                        Nh???ng h???ng m???c ch????ng tr??nh gi???i tr?? v?? d???ch v??? ph??? tr??? gi??p b???a ti???c ho??n h???o h??n.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                        </Carousel>
                    </div>
                </div>
            </div>
            {/* Restaurant View */}
            <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "75px", paddingBottom: "55px", backgroundColor: "#FBFBFB" }}>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-8 align-self-center">
                            <div class="subtitle with-line text-center mb-4">Ho??ng Long Restaurant</div>
                            <h3 class="text-center padding-bottom-small">Kh??ng gian ti???c &amp; D???ch v???</h3>
                        </div>
                        <Carousel
                            swipeable={false}
                            draggable={false}
                            showDots={false}
                            responsive={responsive}
                            ssr={true} // means to render carousel on server-side.
                            infinite={true}
                            autoPlay={false}
                            autoPlaySpeed={1000}
                            keyBoardControl={true}
                            customTransition="transform 500ms ease 0s"
                            transitionDuration={1500}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            deviceType="desktop"
                            dotListClass="custom-dot-list-style"
                            itemClass="carousel-item-padding-40-px"
                            arrows={true}
                            rewindWithAnimation={true}
                        >
                            <ViewItem style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view1} />
                                <ViewInfo>
                                    <ViewTitle>S???NH IRIS &#8211; S??N V?????N</ViewTitle>
                                    <ViewDescription>
                                        Kh??ng gian ti???c ngo??i tr???i tho??ng ????ng, t????i m??t, r???ng r??i, s???c ch???a kho???ng 130-280 kh??ch.
                                    </ViewDescription>
                                </ViewInfo>
                            </ViewItem>
                            <ViewItem style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view2} />
                                <ViewInfo>
                                    <ViewTitle>S???NH DAISY &#8211; LOBBY</ViewTitle>
                                    <ViewDescription>
                                        Kh??ng gian ti???c trong nh?? phong c??ch Rustic l??ng m???n, duy??n d??ng, ???m c??ng, s???c ch???a kho???ng 120 kh??ch.
                                    </ViewDescription>
                                </ViewInfo>
                            </ViewItem>
                            <ViewItem style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view3} />
                                <ViewInfo>
                                    <ViewTitle>S???NH PEONY &#8211; H??? B??I</ViewTitle>
                                    <ViewDescription>
                                        Kh??ng gian ti???c ngo??i tr???i ?????c ????o, ???n t?????ng, xanh m??t, s???c ch???a ?????p nh???t kho???ng 120 kh??ch.
                                    </ViewDescription>
                                </ViewInfo>
                            </ViewItem>
                            <ViewItem style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view4} />
                                <ViewInfo>
                                    <ViewTitle>S???NH PANSEE &#8211; S??N TH?????NG</ViewTitle>
                                    <ViewDescription>
                                        Kh??ng gian ti???c ngo??i tr???i tr??n t???ng cao, tho??ng m??t, m???i l???, s???c ch???a t???i ??a kho???ng 70 kh??ch.
                                    </ViewDescription>
                                </ViewInfo>
                            </ViewItem>
                            <ViewItem style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view5} />
                                <ViewInfo>
                                    <ViewTitle>S???NH LAVENDER &#8211; ??P M??I</ViewTitle>
                                    <ViewDescription>
                                        Kh??ng gian ti???c trong nh?? nh??? xinh, ???m ??p, thanh l???ch, s???c ch???a kho???ng 50 kh??ch.
                                    </ViewDescription>
                                </ViewInfo>
                            </ViewItem>
                        </Carousel>
                    </div>
                </div>
            </div>
            {/* Restaurant Menu Item */}
            <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "75px" }}>
                <div class="container">
                    {
                        foodTypeAndFoodList.length > 0
                            ? (
                                foodTypeAndFoodList.map((foodTypeAndFoodListItem, key) => {
                                    const foodType = foodTypeAndFoodListItem.foodType;
                                    const foodList = foodTypeAndFoodListItem.foodList;
                                    return (
                                        <div class="row justify-content-center" style={{marginBottom: "50px"}}>
                                            <div class="col-md-8 align-self-center">
                                                <div class="subtitle with-line text-center mb-4">Ho??ng Long Restaurant</div>
                                                <h3 class="text-center padding-bottom-small">{foodType.food_type_name}</h3>
                                            </div>
                                            {
                                                foodList.map((food, key) => {
                                                    if (key > 3) return null;
                                                    return (
                                                        <MealItem>
                                                            <Circle />
                                                            <Info>
                                                                <Like>
                                                                    <Icon>
                                                                        <FavoriteBorderOutlined />
                                                                    </Icon>
                                                                    <LikeNumber>{food.food_vote}</LikeNumber>
                                                                </Like>
                                                                <Link to="/order-food">
                                                                    <AddToCart>
                                                                        <Add style={{ marginRight: "5px" }} />
                                                                        Th??m v??o th???c ????n
                                                                    </AddToCart>
                                                                </Link>
                                                            </Info>
                                                            <div class="restaurant-box">
                                                                <img style={{ width: "330px", height: "275px", objectFit: "cover" }} src={food.food_image} alt="" />
                                                                <MealName><span>{food.food_name}</span></MealName>
                                                                <MealDetail><span>{food.food_ingredient}</span></MealDetail>
                                                                <MealPrice><span>{format_money(food.food_price)} VN??</span></MealPrice>
                                                            </div>
                                                        </MealItem>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            ) : null
                    }
                </div>
            </div>
        </>
    )
}

export default RestaurantMeals