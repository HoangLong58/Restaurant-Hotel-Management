import React from 'react'
import styled from 'styled-components';

const Container = styled.div`

`

const NavbarWrapper = styled.nav`

`

// Navbar Top
const NavbarTop = styled.div`

`

const NavbarTopContainer = styled.div`

`

const NavbarTopRow = styled.div`

`

const NavbarTopLeft = styled.div`


`

const NavbarPhoneSpan = styled.span`

`

const NavbarPhoneA = styled.a`

`

const NavbarTopRight = styled.div`

`

const NavbarTopRightA = styled.a`

`

const NavbarTopRightLanguage = styled.div`

`

const NavbarTopRightLanguageUl = styled.ul`

`

const NavbarTopRightLanguageLi = styled.li`

` 

const NavbarTopRightLanguageLiA = styled.a`

` 

// Navbar Bottom
const NavbarBottom = styled.div`

`

const NavbarBottomA = styled.a`
`

const NavbarBottomLogo = styled.div`

`

const NavbarBottomLogoImg = styled.img`

`

const NavbarBottomUl = styled.ul`

`

const NavbarBottomItem = styled.li`

`

const NavbarBottomItemA = styled.a`

`

const NavbarBottomItemUl = styled.ul`

`

const NavbarBottomItemLi = styled.li`

`

const NavbarBottomItemLiA = styled.a`

`



const Navbar = () => {
    return (
        <Container>
            <NavbarWrapper id="menu-wrap" className="menu-back cbp-af-header">
                <NavbarTop className="menu-top background-black">
                    <NavbarTopContainer className="container">
                        <NavbarTopRow className="row">
                            <NavbarTopLeft className="col-6 px-0 px-md-3 pl-1 py-3">
                                <NavbarPhoneSpan className="call-top">Call us:</NavbarPhoneSpan>
                                <NavbarPhoneA href="#" className="call-top">(+84)929 4411 58</NavbarPhoneA>
                            </NavbarTopLeft>
                            <NavbarTopRight className="col-6 px-0 px-md-3 py-3 text-right">
                                <NavbarTopRightA href="#" className="social-top">FB</NavbarTopRightA>
                                <NavbarTopRightA href="#" className="social-top">TW</NavbarTopRightA>
                                <NavbarTopRightLanguage className="lang-wrap">
                                    ENG
                                    <NavbarTopRightLanguageUl>
                                        <NavbarTopRightLanguageLi>
                                            <NavbarTopRightLanguageLiA href="#">GER</NavbarTopRightLanguageLiA>
                                            <NavbarTopRightLanguageLiA href="#">RUS</NavbarTopRightLanguageLiA>
                                            <NavbarTopRightLanguageLiA href="#">CN</NavbarTopRightLanguageLiA>
                                        </NavbarTopRightLanguageLi>
                                    </NavbarTopRightLanguageUl>
                                </NavbarTopRightLanguage>
                            </NavbarTopRight>
                        </NavbarTopRow>
                    </NavbarTopContainer>
                </NavbarTop>
                <NavbarBottom className="menu">
                    <NavbarBottomA href="index.html">
                        <NavbarBottomLogo className="logo">
                            <NavbarBottomLogoImg src='https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMXgzRXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--9747b4e82941b47df75157048a404fc195fd1a40/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBPZ2wzWldKd09oSnlaWE5wZW1WZmRHOWZabWwwV3dkcEFhb3ciLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--a364054a300021d6ece7f71365132a9777e89a21/logo.jpg' />
                        </NavbarBottomLogo>
                    </NavbarBottomA>
                    <NavbarBottomUl>
                        <NavbarBottomItem>
                            <NavbarBottomItemA className="curent-page" href="#">Home</NavbarBottomItemA>
                            <NavbarBottomItemUl>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA className="curent-page" href="index.html">Flip Slider</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                            </NavbarBottomItemUl>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="#">Rooms</NavbarBottomItemA>
                            <NavbarBottomItemUl>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="rooms.html">Our Rooms</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="rooms-gallery.html">Room Gallery</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="rooms-video.html">Room Video</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                            </NavbarBottomItemUl>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="#">Pages</NavbarBottomItemA>
                            <NavbarBottomItemUl>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="explore.html">Explore</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="search.html">Search</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="tandc.html">Terms &amp; Condition</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="services.html">Services</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="restaurant.html">Restaurant</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="testimonials.html">Testimonials</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                                <NavbarBottomItemLi>
                                    <NavbarBottomItemLiA href="gallery.html">Gallery</NavbarBottomItemLiA>
                                </NavbarBottomItemLi>
                            </NavbarBottomItemUl>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="about.html">About us</NavbarBottomItemA>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="blog.html">News</NavbarBottomItemA>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="contact.html">Contact</NavbarBottomItemA>
                        </NavbarBottomItem>

                        <NavbarBottomItem>
                            <NavbarBottomItemA href="search.html"><span>Book now</span></NavbarBottomItemA>
                        </NavbarBottomItem>
                    </NavbarBottomUl>
                </NavbarBottom>
            </NavbarWrapper>
        </Container>
    )
}

export default Navbar