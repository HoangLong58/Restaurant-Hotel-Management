import { CloseOutlined, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import styled from 'styled-components';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../redux/callsAPI";
import Modal from "../components/LoginRegister/Modal";

const SignIn = styled.div`
    width: 95%;
    height: 95%;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #f8f8f8;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 1;
`

const MainPage = styled.div`
    width: 100%;
    height: 100%;
    background-image: url("https://i.pinimg.com/originals/6c/63/82/6c638291a66ddc93b86bf4f43c337701.jpg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat; 
    position: relative;

    height: 100%;
    border-radius: 0px;
    box-shadow: 2px 6px 12px #d1d9e6;

    ${SignIn}.active-sign-in & {
        height: 55%;
        border-radius: 0% 0% 50% 50%/0% 0% 20% 20%;
        animation: main 0.3s linear;
    }
    ${SignIn}.active-sign-up & {
        height: 55%;
        border-radius: 0% 0% 50% 50%/0% 0% 20% 20%;
        animation: main 0.3s linear;
    }
`

const TopBar = styled.div`
    width: 220px;
    height: 20px;
    background-color: #ffffff;
    position: absolute;
    left: 50%;
    top: 0px;
    transform: translateX(-50%);
    border-radius: 0px 0px 20px 20px;
`

const Title = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`

const H1 = styled.h1`
    font-size: 3rem;
    color: var(--color-white);
    margin: 0px;
    letter-spacing: 2px;
`

const P = styled.p`
    color: var(--color-white);
    font-size: 1.2rem;
`

const FormChucNang = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 50%;
    bottom: 60px;
    transform: translateX(-50%);
    text-align: center;
    ${SignIn}.active-sign-in & {
        display: none;
    }
    
    ${SignIn}.active-sign-up & {
        display: none;
    }
`

const SignInBtn = styled.button`
    width: 230px;
    height: 42px;
    margin: 5px 0px;
    border: none;
    outline: none;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 700;
    box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    color: #171717;
    background-color: #ffffff;

    &:active {
        transform: scale(1.05);
    }
`

const Cancel = styled.div`
    position: absolute;
    left: 50%;
    bottom: -25px;
    transform: translateX(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #f8f8f8;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    box-shadow: 2px 6px 20px rgba(0, 0, 0, 0.12);
    display: none;
    ${SignIn}.active-sign-in & {
        display: flex;
    }
    ${SignIn}.active-sign-up & {
        display: flex;
    }
`

const Icon = styled.a`
    color: #111111;
    animation: cancel 0.5s;
`

const SignInPage = styled.div`
    display: none;
    width: 100%;
    height: 45%;
    ${SignIn}.active-sign-in & {
        display: flex;
}
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`

const Input = styled.input`
    width: 220px;
    height: 40px;
    margin: 5px 0px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    outline: none;
    color: #191919;
    border-radius: 10px;
    padding: 0px 10px;
    box-sizing: border-box;
    &::placeholder {
        letter-spacing: 2px;

        font-size: 15px;
    }
    &:focus {
        box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
    }
`

const Button = styled.button`
    width: 220px;
    height: 40px;
    margin: 10px 0px;
    border: none;
    outline: none;
    border-radius: 20px;
    background-color: #ffffff;
    box-shadow: 12px 12px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &:active {
        transform: scale(1.05);
    }
    &:hover {
        background-color: var(--color-primary);
        color: #ffffff;
        transition: all ease 0.3s;
    }
`

const SignUpPage = styled.div`
    display: none;
    width: 100%;
    height: 45%;
    ${SignIn}.active-sign-up & {
        display: flex;
    }
    `

const BgCurcule = styled.div`
    width: 500px;
    height: 500px;
    position: absolute;
    top: -40%;
    height: 60%;
    transform: translateX(-60%);
    background-color: #ecf0f3;
    border-radius: 50%;
`
const Error = styled.span`
    color: red;
`
const Eye = styled.div`
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 13px;
    display: flex;
    z-index: 10;
`

const Label = styled.label`
    position: relative;
`
const Link = styled.a`
    margin: 5px 0px;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
`

const LoginAdmin = () => {
    // Modal
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("");
    const [danhMucModal, setDanhMucModal] = useState(null);

    const openModal = (modal) => {
        setShowModal(prev => !prev);
        setTypeModal(modal.type);
    };
    // Giao di???n
    const [isSignIn, setIsSignIn] = useState(false);
    const handleClose = () => {
        setIsSignIn(false);
    }
    const handleDangNhap = () => {
        setIsSignIn(true);
    }

    // --X??? l??--
    // ????ng nh???p
    const [emailLogin, setEmailLogin] = useState();
    const [passwordLogin, setPasswordLogin] = useState();
    const [errorLogin, setErrorLogin] = useState();
    const dispatch = useDispatch();
    const { isFetching, error } = useSelector((state) => state.admin);

    // G???i h??m ????ng nh???p - callAPI.js-redux
    const handleClickLogin = (e) => {
        e.preventDefault();
        login(dispatch, { email: emailLogin, password: passwordLogin, setErrorLogin: setErrorLogin });
    }

    const handleChangeEmailLogin = (e) => {
        // ???????c nh???p @ v?? . nh??ng k?? t??? ??b kh??c th?? kh??ng
        const resultEmailLogin = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setEmailLogin(resultEmailLogin);
        setErrorLogin(false);
    }
    const handleChangePasswordLogin = (e) => {
        setPasswordLogin(e.target.value);
        setErrorLogin(false);
    }
    // --Show/ hide password login
    const [passwordLoginType, setPasswordLoginType] = useState("password");
    const togglePasswordLogin = () => {
        if (passwordLoginType === "password") {
            setPasswordLoginType("text")
            return;
        }
        setPasswordLoginType("password")
    }

    return (
        <>
            <SignIn className={isSignIn ? "active-sign-in" : null}>
                <MainPage>
                    <TopBar />
                    {/* Ti??u ????? */}
                    <Title>
                        <H1>Long Pets - ADMIN</H1>
                        <P>Ch??o m???ng b???n ?????n v???i trang web b??n th?? c??ng h??ng ?????u Vi???t Nam</P>
                    </Title>
                    {/* C??c n??t ch???c n??ng */}
                    <FormChucNang>
                        <SignInBtn onClick={handleDangNhap}>????ng nh???p</SignInBtn>
                    </FormChucNang>
                    {/* N??t ????ng */}
                    <Cancel onClick={handleClose}>
                        <Icon><CloseOutlined /></Icon>
                    </Cancel>
                </MainPage>
                {/* Trang ????ng nh???p */}
                <SignInPage>
                    <Form>
                        <Input type="email" placeholder="Email/ S??? ??i???n tho???i c???a b???n"
                            maxLength={128}
                            value={emailLogin}
                            onChange={(e) => handleChangeEmailLogin(e)}
                        />
                        <Label>
                            <Input type={passwordLoginType} placeholder="M???t kh???u c???a b???n"
                                onChange={(e) => handleChangePasswordLogin(e)}
                            />
                            {
                                passwordLoginType === "password" ?
                                    <Eye onClick={() => togglePasswordLogin()}>
                                        <VisibilityOutlined />
                                    </Eye>
                                    :
                                    <Eye onClick={() => togglePasswordLogin()}>
                                        <VisibilityOffOutlined />
                                    </Eye>
                            }
                        </Label>
                        {/* <Button onClick={handleClickLogin} disabled={isFetching} >????ng nh???p</Button>
                    {error && <Error>Something went wrong...</Error>} */}
                        <Button onClick={handleClickLogin} disabled={isFetching} >????ng nh???p</Button>
                        {error && <Error>{errorLogin}</Error>}
                        <Link onClick={() => openModal({ type: "forgetPassword" })}>DO NOT YOU REMEMBER THE PASSWORD?</Link>
                    </Form>
                </SignInPage>
            </SignIn>

            {/* Modal */}
            <Modal
                showModal={showModal}   //state ????ng m??? modal
                setShowModal={setShowModal} //H??m ????ng m??? modal
                type={typeModal}    //Lo???i modal
            />
        </>
    );
};

export default LoginAdmin;