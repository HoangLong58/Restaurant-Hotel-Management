import styled from "styled-components";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useRef } from 'react';
import { useSelector } from 'react-redux';

const Top = styled.div`
    display: flex;
    justify-content: end;
    gap: 2rem;
`

const Button = styled.button`
    display: none;
`

const ThemeToggler = styled.div`
    background: var(--color-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.6rem;
    width: 4.2rem;
    cursor: pointer;
    border-radius: var(--border-radius-1);
`

const LightSpan = styled.span`
    font-size: 1.2rem;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
        background: var(--color-primary);
        color: white;
        border-radius: var(--border-radius-1);
    }
`

const DarkSpan = styled.span`
    font-size: 1.2rem;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
        background: var(--color-primary);
        color: white;
        border-radius: var(--border-radius-1);
    }
`

const Profile = styled.div`
    display: flex;
    gap: 2rem;
    text-align: right;
`

const Info = styled.div`

`

const ProfilePhoto = styled.div`
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    overflow: hidden;
`

const Img = styled.img`
object-fit: cover;
width: 100%;
height: 100%;
`

const Small = styled.small`

`

const RightTop = () => {
    // Lấy admin từ Redux
    const admin = useSelector((state) => state.admin.currentAdmin);

    const light = useRef(null);
    const dark = useRef(null);
    const handleChangeTheme = () => {
        document.body.classList.toggle('dark-theme-variables');
        light.current.classList.toggle('active');
        dark.current.classList.toggle('active');
    }
    return (
        <Top>
            <Button>
                <DarkMode />
            </Button>
            <ThemeToggler onClick={handleChangeTheme}>
                {/* useRef() lấy phần tử span để thêm class */}
                <LightSpan ref={light} className="active">
                    <LightMode />
                </LightSpan>
                <DarkSpan ref={dark} className={null}>
                    <DarkMode />
                </DarkSpan>
            </ThemeToggler>
            <Profile>
                <Info>
                    <p>Hey, <b>{admin.employee_first_name + " " + admin.employee_last_name}</b></p>
                    <Small className="text-muted">{admin.position_name}</Small>
                </Info>
                <ProfilePhoto>
                    <Img src={admin.employee_image} />
                </ProfilePhoto>
            </Profile>
        </Top>
    );
};

export default RightTop;