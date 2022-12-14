import { AccessibilityOutlined, DeleteSweepOutlined, DriveFileRenameOutlineOutlined, KeyboardArrowUpOutlined, PersonOffOutlined, PostAddOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import Toast from "../Toast";
import Modal from "./Modal";

// SERVICES
import * as SetMenuService from "../../service/SetMenuService";

const Container = styled.div`
    margin-top: 1.4rem;
`

// Recent Orders
const RecentOrders = styled.div`
    margin-top: 3.3rem;
`

const H2 = styled.h2`
    margin-bottom: 0.8rem;
`

const Table = styled.table`
    background: var(--color-white);
    width: 100%;
    border-radius: var(--card-border-radius);
    padding: var(--card-padding);
    text-align: center;
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
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

const A = styled.a`
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin: 1rem auto;
    color: var(--color-primary);
    cursor: pointer;
    font-weight: bold;
    letter-spacing: 2px;
`

// Tìm kiếm
const SearchWrapper = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 12%;
    left: 57%;
    box-shadow: var(--box-shadow);
    &.active {
        box-shadow: none;
    }
`

const InputHolder = styled.div`
    height: 50px;
    width: 50px;
    overflow: hidden;
    background: rgba(255,255,255,0);
    border-radius: 6px;
    position: relative;
    transition: all 0.3s ease-in-out;
    ${SearchWrapper}.active & {
        width:450px;
        border-radius: 50px;
        background: var(--color-light);
        transition: all .5s cubic-bezier(0.000, 0.105, 0.035, 1.570);
    }
`

const Input = styled.input`
    width: 100%;
    height: 30px;
    padding: 0px 50px 0 20px;
    opacity: 0;
    position: absolute;
    top: 0px;
    left: 0px;
    background: transparent;
    box-sizing: border-box;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    color: var(--color-dark);
    transform: translate(0, 60px);
    transition: all .3s cubic-bezier(0.000, 0.105, 0.035, 1.570);
    transition-delay: 0.3s;
    ${SearchWrapper}.active & {
        opacity: 1;
        transform: translate(0, 10px);
    }
`

const Button = styled.button`
    width: 50px;
    height: 50px;
    border:none;
    border-radius:6px;
    background: var(--color-primary);
    padding:0px;
    outline:none;
    position: relative;
    z-index: 2;
    float:right;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    ${SearchWrapper}.active & {
        width: 40px;
        height: 40px;
        margin: 5px;
        border-radius: 30px;
    }
`

const Span = styled.span`
    width:22px;
    height:22px;
    display: inline-block;
    vertical-align: middle;
    position:relative;
    transform: rotate(45deg);
    transition: all .4s cubic-bezier(0.650, -0.600, 0.240, 1.650);
    ${SearchWrapper}.active & {
        transform: rotate(-45deg);
    }
    &::before {
        position: absolute; 
        content:'';
        width: 4px;
        height: 11px;
        left: 9px;
        top: 18px;
        border-radius: 2px;
        background: var(--color-white);
    }
    &::after {
        position: absolute; 
        content:'';
        width: 14px;
        height: 14px;
        left: 0px;
        top: 0px;
        border-radius: 16px;
        border: 4px solid var(--color-white);
    }
    .search-wrapper .close {
        position: absolute;
        z-index: 1;
        top:24px;
        right:20px;
        width:25px;
        height:25px;
        cursor: pointer;
        transform: rotate(-180deg);
        transition: all .3s cubic-bezier(0.285, -0.450, 0.935, 0.110);
        transition-delay: 0.2s;
    }

`


const CloseSpan = styled.span`
    position: absolute;
    z-index: 1;
    top: 15px;
    right: 20px;
    width: 25px;
    height: 25px;
    cursor: pointer;
    transform: rotate(-180deg);
    transition: all .3s cubic-bezier(0.285, -0.450, 0.935, 0.110);
    transition-delay: 0.2s;
    &::before {
        position: absolute;
        content:'';
        background: var(--color-primary);
        border-radius: 2px;
        width: 5px;
        height: 25px;
        left: 10px;
        top: 0px;
    }
    &::after {
        position: absolute;
        content:'';
        background: var(--color-primary);
        border-radius: 2px;
        width: 25px;
        height: 5px;
        left: 0px;
        top: 10px;
    }
    ${SearchWrapper}.active & {
        right:-50px;
        transform: rotate(45deg);
        transition: all .6s cubic-bezier(0.000, 0.105, 0.035, 1.570);
        transition-delay: 0.5s;
    }
`

const ButtonFix = styled.button`
    width: 40px;
    height: 30px;
    border: 2px solid var(--color-warning);
    border-radius: var(--border-radius-2);
    color: var(--color-warnning);
    background: var(--color-white);
    padding:0px;
    outline:none;
    z-index: 2;
    cursor: pointer;
`

const ButtonDelete = styled.button`
    width: 40px;
    height: 30px;
    border: 2px solid var(--color-danger);
    border-radius: var(--border-radius-2);
    color: var(--color-danger);
    background: var(--color-white);
    padding:0px;
    outline:none;
    z-index: 2;
    cursor: pointer;
`

const ImgDanhMuc = styled.img`
    width: auto;
    height: 100%;
    object-fit: contain;
`

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

const ButtonInfo = styled.button`
    width: 40px;
    height: 30px;
    border: 2px solid var(--color-info);
    border-radius: var(--border-radius-2);
    color: var(--color-warnning);
    background: var(--color-white);
    padding:0px;
    outline:none;
    z-index: 2;
    cursor: pointer;
`

const SetMenuMain = ({ reRenderData, setReRenderData }) => {
    // Search
    const InputRef = useRef(null);
    const [isSearch, setIsSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [noResultFound, setNoResultFound] = useState(false);
    const handleSeach = (e) => {
        if (isSearch === false) {
            setIsSearch(!isSearch);
            e.preventDefault();
        } else {
            // Thực hiện tìm kiếm
            console.log(search);
            const findSetMenu = async () => {
                try {
                    const searchRes = await SetMenuService.findSetMenuByIdOrName(search);
                    if (searchRes.data.data.length === 0) {
                        setNoResultFound(true);
                        // Toast
                        const dataToast = { message: "Không tìm thấy kết quả phù hợp!", type: "warning" };
                        showToastFromOut(dataToast);
                        return;
                    }
                    setNoResultFound(false);
                    setSetMenuList(searchRes.data.data);
                    // Toast
                    const dataToast = { message: searchRes.data.message, type: "success" };
                    showToastFromOut(dataToast);
                } catch (err) {
                    // Toast
                    const dataToast = { message: err.response.data.message, type: "danger" };
                    showToastFromOut(dataToast);
                }
            }
            findSetMenu();
            handleLoading();
        }
    }
    const handleClose = () => {
        setIsSearch(false);
        setNoResultFound(false);
        InputRef.current.value = "";
        setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - SetMenuMain & DanhMucRight.jsx
    }

    // Lấy danh mục
    const [setMenuList, setSetMenuList] = useState([]);
    useEffect(() => {
        const getSetMenus = async () => {
            try {
                const setMenuRes = await SetMenuService.getAllSetMenus();
                setSetMenuList(setMenuRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy set menu: ", err);
            }
        }
        handleLoading();
        getSetMenus();
    }, [reRenderData]);
    console.log("setMenuList: ", setMenuList);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("")
    const [setMenuModal, setSetMenuModal] = useState(null);
    const [setMenuAddFoodModal, setSetMenuAddFoodModal] = useState(null);
    const openModal = (modal) => {
        setShowModal(prev => !prev);
        setTypeModal(modal.type);
        setSetMenuModal(modal.setMenu);
        setSetMenuAddFoodModal(modal.setMenu);
    }

    // ===== TOAST =====
    const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
    const toastRef = useRef(null);  // useRef có thể gọi các hàm bên trong của Toast
    // bằng các dom event, javascript, ...

    const showToastFromOut = (dataShow) => {
        console.log("showToastFromOut da chay", dataShow);
        setDataToast(dataShow);
        toastRef.current.show();
    }

    // Fake loading when fetch data
    const [isLoading, setIsLoading] = useState(false);
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

    // PHÂN TRANG
    const [pageNumber, setPageNumber] = useState(0);

    const setMenuPerPage = 12;
    const pageVisited = pageNumber * setMenuPerPage;

    const setMenuFiltered = setMenuList
        .slice(pageVisited, pageVisited + setMenuPerPage)
        .map((setMenu, key) => {
            return (
                <Tr>
                    <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}>{pageNumber * setMenuPerPage + (key + 1)}</Td>
                    <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}>{setMenu.set_menu_id}</Td>
                    <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}>{setMenu.set_menu_name}</Td>
                    <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}>{setMenu.set_menu_price}</Td>
                    <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ImgDanhMuc src={setMenu.set_menu_image} />
                    </Td>
                    <Td
                        onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}
                        style={{ backgroundColor: setMenu.set_menu_state === 0 ? "var(--color-info)" : setMenu.set_menu_state === 1 ? "var(--color-danger)" : null }}>
                        {setMenu.set_menu_state === 0 ? "Đang hoạt động" : setMenu.set_menu_state === 1 ? "Ngưng hoạt động" : null}
                    </Td>
                    <Td className="primary">
                        <ButtonInfo
                            onClick={() => openModal({ type: "addFoodToSetMenu", setMenu: setMenu })}
                        >
                            <PostAddOutlined style={{ color: "var(--color-info)" }} />
                        </ButtonInfo>
                    </Td>
                    <Td className="primary">
                        <ButtonDelete
                            onClick={() => openModal({ type: "disableSetMenu", setMenu: setMenu })}
                        >
                            <PersonOffOutlined />
                        </ButtonDelete>
                    </Td>
                    <Td className="primary">
                        <ButtonInfo
                            onClick={() => openModal({ type: "ableSetMenu", setMenu: setMenu })}
                        >
                            <AccessibilityOutlined style={{ color: "var(--color-info)" }} />
                        </ButtonInfo>
                    </Td>
                    <Td className="warning">
                        <ButtonFix
                            onClick={() => openModal({ type: "updateSetMenu", setMenu: setMenu })}
                        >
                            <DriveFileRenameOutlineOutlined />
                        </ButtonFix>
                    </Td>
                    <Td className="primary">
                        <ButtonDelete
                            onClick={() => openModal({ type: "deleteSetMenu", setMenu: setMenu })}
                        >
                            <DeleteSweepOutlined />
                        </ButtonDelete>
                    </Td>
                </Tr>
            );
        }
        );


    const pageCount = Math.ceil(setMenuList.length / setMenuPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    }
    return (
        <Container>
            <H2>Quản lý Set Menu - Khách sạn</H2>

            {/* Tìm kiếm */}
            <SearchWrapper className={isSearch ? "active" : null}>
                <InputHolder>
                    <Input ref={InputRef} type="text" placeHolder="Nhập vào mã danh mục" onChange={(e) => setSearch(e.target.value)} />
                    <Button onClick={(e) => { handleSeach(e) }}><Span></Span></Button>
                </InputHolder>
                <CloseSpan onClick={() => { handleClose() }}></CloseSpan>
            </SearchWrapper>

            <RecentOrders>
                <H2>Set Menu - Nhà hàng hiện tại</H2>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>STT</Th>
                            <Th>Mã menu</Th>
                            <Th>Tên menu</Th>
                            <Th>Giá tiền</Th>
                            <Th>Hình ảnh</Th>
                            <Th>Trạng thái</Th>
                            <Th>Thêm món ăn</Th>
                            <Th>Vô hiệu hóa</Th>
                            <Th>Mở khóa</Th>
                            <Th>Chỉnh sửa</Th>
                            <Th>Xóa</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {noResultFound ? (
                            <Tr>
                                <Td colSpan={11}>
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
                                        <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Không có kết quả tìm kiếm phù hợp</EmptyContent>
                                    </EmptyItem>
                                </Td>
                            </Tr>
                        )
                            : isLoading ? (
                                <Tr>
                                    <Td colSpan={11} style={{ width: "100%", height: "100px" }}>
                                        <div className="row" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <div
                                                class="spinner-border"
                                                style={{ color: '#41F1B6', scale: "1.5" }}
                                                role="status"
                                            >
                                                <span class="visually-hidden"></span>
                                            </div>
                                        </div>
                                    </Td>
                                </Tr>
                            ) :
                                setMenuList.length > 0
                                    ?
                                    setMenuFiltered
                                    :
                                    (setMenuList.slice(0, 12).map((setMenu, key) => {
                                        return (
                                            <Tr>
                                                <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}>{(key + 1)}</Td>
                                                <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}>{setMenu.set_menu_id}</Td>
                                                <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}>{setMenu.set_menu_name}</Td>
                                                <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}>{setMenu.set_menu_price}</Td>
                                                <Td onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <ImgDanhMuc src={setMenu.set_menu_image} />
                                                </Td>
                                                <Td
                                                    onClick={() => openModal({ type: "detailSetMenu", setMenu: setMenu })}
                                                    style={{ backgroundColor: setMenu.set_menu_state === 0 ? "var(--color-info)" : setMenu.set_menu_state === 1 ? "var(--color-danger)" : null }}>
                                                    {setMenu.set_menu_state === 0 ? "Đang hoạt động" : setMenu.set_menu_state === 1 ? "Ngưng hoạt động" : null}
                                                </Td>
                                                <Td className="primary">
                                                    <ButtonInfo
                                                        onClick={() => openModal({ type: "addFoodToSetMenu", setMenu: setMenu })}
                                                    >
                                                        <PostAddOutlined style={{ color: "var(--color-info)" }} />
                                                    </ButtonInfo>
                                                </Td>
                                                <Td className="primary">
                                                    <ButtonDelete
                                                        onClick={() => openModal({ type: "disableSetMenu", setMenu: setMenu })}
                                                    >
                                                        <PersonOffOutlined />
                                                    </ButtonDelete>
                                                </Td>
                                                <Td className="primary">
                                                    <ButtonInfo
                                                        onClick={() => openModal({ type: "ableSetMenu", setMenu: setMenu })}
                                                    >
                                                        <AccessibilityOutlined style={{ color: "var(--color-info)" }} />
                                                    </ButtonInfo>
                                                </Td>
                                                <Td className="warning">
                                                    <ButtonFix
                                                        onClick={() => openModal({ type: "updateSetMenu", setMenu: setMenu })}
                                                    >
                                                        <DriveFileRenameOutlineOutlined />
                                                    </ButtonFix>
                                                </Td>
                                                <Td className="primary">
                                                    <ButtonDelete
                                                        onClick={() => openModal({ type: "deleteSetMenu", setMenu: setMenu })}
                                                    >
                                                        <DeleteSweepOutlined />
                                                    </ButtonDelete>
                                                </Td>
                                            </Tr>
                                        );
                                    }))
                        }
                    </Tbody>
                </Table>
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
                    forcePage={pageNumber}
                />
                <A onClick={() => {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }}>
                    <KeyboardArrowUpOutlined /> Lên trên
                </A>

            </RecentOrders>
            <Modal
                showModal={showModal}   //state Đóng mở modal
                setShowModal={setShowModal} //Hàm Đóng mở modal
                type={typeModal}    //Loại modal
                setMenu={setMenuModal}  //Dữ liệu bên trong modal
                setMenuAddFood={setMenuAddFoodModal}  //Dữ liệu bên trong modal
                setReRenderData={setReRenderData}   //Hàm rerender khi dữ liệu thay đổi
                handleClose={handleClose}   //Đóng tìm kiếm
                showToastFromOut={showToastFromOut} //Hàm hiện toast
            />

            {/* === TOAST === */}
            <Toast
                ref={toastRef}
                dataToast={dataToast}   // Thông tin cần hiện lên: Đối tượng { message,type }
            />
        </Container>
    );
};



export default SetMenuMain;