import React, { useState } from 'react'
import styled from 'styled-components'
import { Add, FavoriteBorderOutlined } from '@mui/icons-material'
// Multi carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import picture1 from '../../img/food1.jpg'
import picture2 from '../../img/food2.jpg'
import picture3 from '../../img/food3.jpg'
import picture4 from '../../img/food4.jpg'

import menu1 from '../../img/menu1.jpg'
import menu2 from '../../img/menu2.jpg'
import menu3 from '../../img/menu3.jpg'
import menu4 from '../../img/menu4.jpg'
import menu5 from '../../img/menu5.jpg'
import menu6 from '../../img/menu6.jpg'
import menu7 from '../../img/menu7.jpg'
import menu8 from '../../img/menu8.jpg'
import Modal from './Modal';

import view1 from '../../img/sanvuon1.jpg'
import view2 from '../../img/lobby1.jpg'
import view3 from '../../img/hoboi1.jpg'
import view4 from '../../img/santhuong1.jpg'
import view5 from '../../img/lavender1.jpg'

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
    //State
    const [imageMenu, setImageMenu] = useState();
    const [imageView, setImageView] = useState();

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

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("")
    const [danhMucModal, setDanhMucModal] = useState(null);

    const openModal = (modal) => {
        setShowModal(prev => !prev);
        setTypeModal(modal.type);
    }

    //Handle
    const handleClickMenu = (image) => {
        setImageMenu(image);
        openModal({ type: "showImageMenu" })
    }

    const handleClickView = (image) => {
        setImageView(image);
        openModal({ type: "showImageView" })
    }

    return (
        <>
            {/* Restaurant Menu */}
            <div class="section padding-top-bottom z-bigger" style={{ marginTop: "75px", paddingTop: "75px", paddingBottom: "55px", backgroundColor: "#323232" }}>
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
                            <MenuItem onClick={() => handleClickMenu(menu1)}>
                                <MenuImage src={menu1} />
                                <MenuInfo>
                                    <MenuTitle>MENU 4.950.000</MenuTitle>
                                    <MenuDescription>
                                        Bàn tiệc tiêu chuẩn với đầy đủ các món ngon, đảm bảo đầy đủ khẩu phần và sự sang trọng.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem onClick={() => handleClickMenu(menu2)}>
                                <MenuImage src={menu2} />
                                <MenuInfo>
                                    <MenuTitle>MENU 5.950.000</MenuTitle>
                                    <MenuDescription>
                                        Bàn tiệc nâng cấp cho bữa tiệc sang trọng với các món ngon đa dạng và thịnh soạn hơn.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem onClick={() => handleClickMenu(menu3)}>
                                <MenuImage src={menu3} />
                                <MenuInfo>
                                    <MenuTitle>MENU 6.250.000</MenuTitle>
                                    <MenuDescription>
                                        Bàn tiệc với những món ăn phong phú và sang trọng đem đến cho quý khách.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem onClick={() => handleClickMenu(menu4)}>
                                <MenuImage src={menu4} />
                                <MenuInfo>
                                    <MenuTitle>Menu 6.950.000</MenuTitle>
                                    <MenuDescription>
                                        Bàn tiệc thịnh soạn, đầy đủ món ngon, hợp khẩu vị người châu Á sẽ là chọn lựa hoàn hảo...
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem onClick={() => handleClickMenu(menu5)}>
                                <MenuImage src={menu5} />
                                <MenuInfo>
                                    <MenuTitle>Menu 7.550.000</MenuTitle>
                                    <MenuDescription>
                                        Bàn tiệc sang trọng, giá trị nhất với những món ngon phong phú và giá trị dinh dưỡng cao nhất.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem onClick={() => handleClickMenu(menu6)}>
                                <MenuImage src={menu6} />
                                <MenuInfo>
                                    <MenuTitle>Menu thức uống</MenuTitle>
                                    <MenuDescription>
                                        Những thức uống đa dạng, mức giá hợp lý tạo thêm điểm nhấn quan trọng cho bữa tiệc.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem onClick={() => handleClickMenu(menu7)}>
                                <MenuImage src={menu7} />
                                <MenuInfo>
                                    <MenuTitle>Bảng giá dịch vụ</MenuTitle>
                                    <MenuDescription>
                                        Những dịch vụ trang trí, nghi thức lễ với phiên bản nâng cấp làm tăng giá trị của bữa tiệc.
                                    </MenuDescription>
                                </MenuInfo>
                            </MenuItem>
                            <MenuItem onClick={() => handleClickMenu(menu8)}>
                                <MenuImage src={menu8} />
                                <MenuInfo>
                                    <MenuTitle>BẢNG GIÁ DỊCH VỤ</MenuTitle>
                                    <MenuDescription>
                                        Những hạng mục chương trình giải trí và dịch vụ phụ trợ giúp bữa tiệc hoàn hảo hơn.
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
                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                            <h3 class="text-center padding-bottom-small">Không gian tiệc &amp; Dịch vụ</h3>
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
                            <ViewItem onClick={() => handleClickView(view1)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view1} />
                                <ViewInfo>
                                    <ViewTitle>SẢNH IRIS &#8211; SÂN VƯỜN</ViewTitle>
                                    <ViewDescription>
                                        Không gian tiệc ngoài trời thoáng đãng, tươi mát, rộng rãi, sức chứa khoảng 130-280 khách.
                                    </ViewDescription>
                                </ViewInfo>
                            </ViewItem>
                            <ViewItem onClick={() => handleClickView(view2)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view2} />
                                <ViewInfo>
                                    <ViewTitle>SẢNH DAISY &#8211; LOBBY</ViewTitle>
                                    <ViewDescription>
                                        Không gian tiệc trong nhà phong cách Rustic lãng mạn, duyên dáng, ấm cúng, sức chứa khoảng 120 khách.
                                    </ViewDescription>
                                </ViewInfo>
                            </ViewItem>
                            <ViewItem onClick={() => handleClickView(view3)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view3} />
                                <ViewInfo>
                                    <ViewTitle>SẢNH PEONY &#8211; HỒ BƠI</ViewTitle>
                                    <ViewDescription>
                                        Không gian tiệc ngoài trời độc đáo, ấn tượng, xanh mát, sức chứa đẹp nhất khoảng 120 khách.
                                    </ViewDescription>
                                </ViewInfo>
                            </ViewItem>
                            <ViewItem onClick={() => handleClickView(view4)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view4} />
                                <ViewInfo>
                                    <ViewTitle>SẢNH PANSEE &#8211; SÂN THƯỢNG</ViewTitle>
                                    <ViewDescription>
                                        Không gian tiệc ngoài trời trên tầng cao, thoáng mát, mới lạ, sức chứa tối đa khoảng 70 khách.
                                    </ViewDescription>
                                </ViewInfo>
                            </ViewItem>
                            <ViewItem onClick={() => handleClickView(view5)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                <ViewImage src={view5} />
                                <ViewInfo>
                                    <ViewTitle>SẢNH LAVENDER &#8211; ÁP MÁI</ViewTitle>
                                    <ViewDescription>
                                        Không gian tiệc trong nhà nhỏ xinh, ấm áp, thanh lịch, sức chứa khoảng 50 khách.
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
                    <div class="row justify-content-center">
                        <div class="col-md-8 align-self-center">
                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                            <h3 class="text-center padding-bottom-small">Bánh Đầu Giờ</h3>
                        </div>
                        <div class="section clearfix"></div>
                        <MealItem>
                            <Circle />
                            <Info>
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
                            </Info>
                            <div class="restaurant-box">
                                <img src={picture4} alt="" />
                                <MealName><span>crab with curry sources</span></MealName>
                                <MealDetail><span>crab / potatoes / rice</span></MealDetail>
                                <MealPrice><span>$64</span></MealPrice>
                            </div>
                        </MealItem>
                    </div>
                    <div class="row justify-content-center" style={{ marginTop: "70px" }}>
                        <div class="col-md-8 align-self-center">
                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                            <h3 class="text-center padding-bottom-small">Khai vị</h3>
                        </div>
                        <div class="section clearfix"></div>
                        <MealItem>
                            <Circle />
                            <Info>
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
                            </Info>
                            <div class="restaurant-box">
                                <img src={picture4} alt="" />
                                <MealName><span>crab with curry sources</span></MealName>
                                <MealDetail><span>crab / potatoes / rice</span></MealDetail>
                                <MealPrice><span>$64</span></MealPrice>
                            </div>
                        </MealItem>
                    </div>
                    <div class="row justify-content-center" style={{ marginTop: "70px" }}>
                        <div class="col-md-8 align-self-center">
                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                            <h3 class="text-center padding-bottom-small">Món Súp</h3>
                        </div>
                        <div class="section clearfix"></div>
                        <MealItem>
                            <Circle />
                            <Info>
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
                            </Info>
                            <div class="restaurant-box">
                                <img src={picture4} alt="" />
                                <MealName><span>crab with curry sources</span></MealName>
                                <MealDetail><span>crab / potatoes / rice</span></MealDetail>
                                <MealPrice><span>$64</span></MealPrice>
                            </div>
                        </MealItem>
                    </div>
                    <div class="row justify-content-center" style={{ marginTop: "70px" }}>
                        <div class="col-md-8 align-self-center">
                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                            <h3 class="text-center padding-bottom-small">Món Hải Sản</h3>
                        </div>
                        <div class="section clearfix"></div>
                        <MealItem>
                            <Circle />
                            <Info>
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
                            </Info>
                            <div class="restaurant-box">
                                <img src={picture4} alt="" />
                                <MealName><span>crab with curry sources</span></MealName>
                                <MealDetail><span>crab / potatoes / rice</span></MealDetail>
                                <MealPrice><span>$64</span></MealPrice>
                            </div>
                        </MealItem>
                    </div>
                    <div class="row justify-content-center" style={{ marginTop: "70px" }}>
                        <div class="col-md-8 align-self-center">
                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                            <h3 class="text-center padding-bottom-small">Món Thịt</h3>
                        </div>
                        <div class="section clearfix"></div>
                        <MealItem>
                            <Circle />
                            <Info>
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
                            </Info>
                            <div class="restaurant-box">
                                <img src={picture4} alt="" />
                                <MealName><span>crab with curry sources</span></MealName>
                                <MealDetail><span>crab / potatoes / rice</span></MealDetail>
                                <MealPrice><span>$64</span></MealPrice>
                            </div>
                        </MealItem>
                    </div>
                    <div class="row justify-content-center" style={{ marginTop: "70px" }}>
                        <div class="col-md-8 align-self-center">
                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                            <h3 class="text-center padding-bottom-small">Cơm-Mì-Lẩu</h3>
                        </div>
                        <div class="section clearfix"></div>
                        <MealItem>
                            <Circle />
                            <Info>
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
                            </Info>
                            <div class="restaurant-box">
                                <img src={picture4} alt="" />
                                <MealName><span>crab with curry sources</span></MealName>
                                <MealDetail><span>crab / potatoes / rice</span></MealDetail>
                                <MealPrice><span>$64</span></MealPrice>
                            </div>
                        </MealItem>
                    </div>
                    <div class="row justify-content-center" style={{ marginTop: "70px" }}>
                        <div class="col-md-8 align-self-center">
                            <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                            <h3 class="text-center padding-bottom-small">Tráng Miệng</h3>
                        </div>
                        <div class="section clearfix"></div>
                        <MealItem>
                            <Circle />
                            <Info>
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
                                <Like>
                                    <Icon>
                                        <FavoriteBorderOutlined />
                                    </Icon>
                                    <LikeNumber>5</LikeNumber>
                                </Like>
                                <AddToCart>
                                    <Add style={{ marginRight: "5px" }} />
                                    Thêm vào thực đơn
                                </AddToCart>
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
            <Modal
                showModal={showModal}   //state Đóng mở modal
                setShowModal={setShowModal} //Hàm Đóng mở modal
                type={typeModal}    //Loại modal
                imageMenu={imageMenu}   //Hình ảnh menu trong Modal
                imageView={imageView}   //Hình ảnh view trong Modal
            />
        </>
    )
}

export default RestaurantMeals