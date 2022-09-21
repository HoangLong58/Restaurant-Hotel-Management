import React, { useState } from 'react';
import styled from 'styled-components';

import picture4 from '../../img/food4.jpg';

const Image = styled.img`
    min-width: 55px;
    width: 55px;
    height: 55px;
    margin: 12px;
    border: 1px solid #E8E8E8;
`

const MiniCartImage = ({ item }) => {
    const [hinhanh, setHinhAnh] = useState(picture4);
    // const [hinhanh, setHinhAnh] = useState([]);
    // useEffect(() => {
    //     const getHinhAnh = async () => {
    //         try {
    //             const hinhanhthucung = await axios.post("http://localhost:3001/api/products/findImage/", {mathucung: item});
    //             setHinhAnh(hinhanhthucung.data[0].hinhanh);
    //             console.log(hinhanhthucung.data[0].hinhanh);
    //         } catch (err) {
    //             console.log("Lay hinh minicartimage that bai");
    //         }
    //     };
    //     getHinhAnh();
    // }, []);
    // console.log(hinhanh.data[0])
    return (
        <Image src={hinhanh}></Image>
    )
}

export default MiniCartImage