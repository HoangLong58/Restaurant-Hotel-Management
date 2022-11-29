import { useSelector } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./handle/NotFound";
import PrivateRoute from "./handle/PrivateRoute";
import Home from "./pages/Home";
import LoginAdmin from "./pages/LoginAdmin";
import ManageDevice from "./pages/ManageDevice";
import ManageDeviceType from "./pages/ManageDeviceType";
import ManageDiscount from "./pages/ManageDiscount";
import ManageFloor from "./pages/ManageFloor";
import ManageService from "./pages/ManageService";
import ManageRoomType from "./pages/ManageRoomType";
import ManageRoom from "./pages/ManageRoom";
import ManageCustomer from "./pages/ManageCustomer";
import ManageEmployee from "./pages/ManageEmployee";
import ManagePosition from "./pages/ManagePosition";
import ManageRoomBooking from "./pages/ManageRoomBooking";
import ManageFoodType from "./pages/ManageFoodType";
import ManageFood from "./pages/ManageFood";
import ManageFoodVote from "./pages/ManageFoodVote";
import ManagePartyBookingType from "./pages/ManagePartyBookingType";
import ManagePartyHallType from "./pages/ManagePartyHallType";
import ManagePartyServiceType from "./pages/ManagePartyServiceType";
import ManageTableType from "./pages/ManageTableType";
import ManageSetMenu from "./pages/ManageSetMenu";
import ManagePartyService from "./pages/ManagePartyService";
import ManagePartyHall from "./pages/ManagePartyHall";
import ManageTableBooking from "./pages/ManageTableBooking";
import ManagePartyBooking from "./pages/ManagePartyBooking";
import ManageTableBookingOrder from "./pages/ManageTableBookingOrder";
import ManageAdminLog from "./pages/ManageAdminLog";

const App = () => {
    // Lấy admin từ Redux
    const admin = useSelector((state) => state.admin.currentAdmin);
    // Phân quyền
    const authorizationAdmin = (admin) => {
        if (!admin) {
            return (
                // Không đăng nhập
                <>
                    {/* Dashboard */}
                    <Route path='/home' element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />

                    <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                    <Route path='*' element={
                        <NotFound />
                    } />
                    <Route path='/' element={<Navigate to="/home" replace />} />
                </>
            )
        }
        const positionId = admin.position_id;
        switch (positionId) {
            case 1:
                // Quản trị viên
                return (
                    <>
                        {/* Dashboard */}
                        <Route path='/home' element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Thiết bị - Khách sạn */}
                        <Route path='/manageDevice' element={
                            <PrivateRoute>
                                <ManageDevice />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại thiết bị - Khách sạn */}
                        <Route path='/manageDeviceType' element={
                            <PrivateRoute>
                                <ManageDeviceType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Mã giảm giá */}
                        <Route path='/manageDiscount' element={
                            <PrivateRoute>
                                <ManageDiscount />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Tầng */}
                        <Route path='/manageFloor' element={
                            <PrivateRoute>
                                <ManageFloor />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ - Khách sạn */}
                        <Route path='/manageService' element={
                            <PrivateRoute>
                                <ManageService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại phòng - Khách sạn */}
                        <Route path='/manageRoomType' element={
                            <PrivateRoute>
                                <ManageRoomType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Phòng - Khách sạn */}
                        <Route path='/manageRoom' element={
                            <PrivateRoute>
                                <ManageRoom />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Khách hàng */}
                        <Route path='/manageCustomer' element={
                            <PrivateRoute>
                                <ManageCustomer />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Chức vụ nhân viên */}
                        <Route path='/managePosition' element={
                            <PrivateRoute>
                                <ManagePosition />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Nhân viên */}
                        <Route path='/manageEmployee' element={
                            <PrivateRoute>
                                <ManageEmployee />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt phòng */}
                        <Route path='/manageRoomBooking' element={
                            <PrivateRoute>
                                <ManageRoomBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại món ăn - Nhà hàng */}
                        <Route path='/manageFoodType' element={
                            <PrivateRoute>
                                <ManageFoodType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Món ăn - Nhà hàng */}
                        <Route path='/manageFood' element={
                            <PrivateRoute>
                                <ManageFood />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Bình luận - Đánh giá Món ăn */}
                        <Route path='/manageFoodVote' element={
                            <PrivateRoute>
                                <ManageFoodVote />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại Đặt tiệc - Nhà hàng */}
                        <Route path='/managePartyBookingType' element={
                            <PrivateRoute>
                                <ManagePartyBookingType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại Sảnh tiệc - Nhà hàng */}
                        <Route path='/managePartyHallType' element={
                            <PrivateRoute>
                                <ManagePartyHallType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Sảnh tiệc - Nhà hàng */}
                        <Route path='/managePartyHall' element={
                            <PrivateRoute>
                                <ManagePartyHall />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại Dịch vụ tiệc - Nhà hàng */}
                        <Route path='/managePartyServiceType' element={
                            <PrivateRoute>
                                <ManagePartyServiceType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ Tiệc - Nhà hàng */}
                        <Route path='/managePartyService' element={
                            <PrivateRoute>
                                <ManagePartyService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Set Menu - Nhà hàng */}
                        <Route path='/manageSetMenu' element={
                            <PrivateRoute>
                                <ManageSetMenu />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại bàn ăn - Nhà hàng */}
                        <Route path='/manageTableType' element={
                            <PrivateRoute>
                                <ManageTableType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Bàn ăn - Nhà hàng */}
                        <Route path='/manageTableBooking' element={
                            <PrivateRoute>
                                <ManageTableBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt tiệc - Nhà hàng */}
                        <Route path='/managePartyBooking' element={
                            <PrivateRoute>
                                <ManagePartyBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt bàn - Nhà hàng */}
                        <Route path='/manageTableBookingOrder' element={
                            <PrivateRoute>
                                <ManageTableBookingOrder />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Nhật ký hoạt động */}
                        <Route path='/manageAdminLog' element={
                            <PrivateRoute>
                                <ManageAdminLog />
                            </PrivateRoute>
                        } />

                        <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                        <Route path='*' element={
                            <NotFound />
                        } />
                        <Route path='/' element={<Navigate to="/home" replace />} />
                    </>
                );
            case 11:
                // Giám đốc
                return (
                    <>
                        {/* Dashboard */}
                        <Route path='/home' element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Thiết bị - Khách sạn */}
                        <Route path='/manageDevice' element={
                            <PrivateRoute>
                                <ManageDevice />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại thiết bị - Khách sạn */}
                        <Route path='/manageDeviceType' element={
                            <PrivateRoute>
                                <ManageDeviceType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Mã giảm giá */}
                        <Route path='/manageDiscount' element={
                            <PrivateRoute>
                                <ManageDiscount />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Tầng */}
                        <Route path='/manageFloor' element={
                            <PrivateRoute>
                                <ManageFloor />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ - Khách sạn */}
                        <Route path='/manageService' element={
                            <PrivateRoute>
                                <ManageService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại phòng - Khách sạn */}
                        <Route path='/manageRoomType' element={
                            <PrivateRoute>
                                <ManageRoomType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Phòng - Khách sạn */}
                        <Route path='/manageRoom' element={
                            <PrivateRoute>
                                <ManageRoom />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Khách hàng */}
                        <Route path='/manageCustomer' element={
                            <PrivateRoute>
                                <ManageCustomer />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Chức vụ nhân viên */}
                        <Route path='/managePosition' element={
                            <PrivateRoute>
                                <ManagePosition />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Nhân viên */}
                        <Route path='/manageEmployee' element={
                            <PrivateRoute>
                                <ManageEmployee />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt phòng */}
                        <Route path='/manageRoomBooking' element={
                            <PrivateRoute>
                                <ManageRoomBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại món ăn - Nhà hàng */}
                        <Route path='/manageFoodType' element={
                            <PrivateRoute>
                                <ManageFoodType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Món ăn - Nhà hàng */}
                        <Route path='/manageFood' element={
                            <PrivateRoute>
                                <ManageFood />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Bình luận - Đánh giá Món ăn */}
                        <Route path='/manageFoodVote' element={
                            <PrivateRoute>
                                <ManageFoodVote />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại Đặt tiệc - Nhà hàng */}
                        <Route path='/managePartyBookingType' element={
                            <PrivateRoute>
                                <ManagePartyBookingType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại Sảnh tiệc - Nhà hàng */}
                        <Route path='/managePartyHallType' element={
                            <PrivateRoute>
                                <ManagePartyHallType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Sảnh tiệc - Nhà hàng */}
                        <Route path='/managePartyHall' element={
                            <PrivateRoute>
                                <ManagePartyHall />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại Dịch vụ tiệc - Nhà hàng */}
                        <Route path='/managePartyServiceType' element={
                            <PrivateRoute>
                                <ManagePartyServiceType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ Tiệc - Nhà hàng */}
                        <Route path='/managePartyService' element={
                            <PrivateRoute>
                                <ManagePartyService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Set Menu - Nhà hàng */}
                        <Route path='/manageSetMenu' element={
                            <PrivateRoute>
                                <ManageSetMenu />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Loại bàn ăn - Nhà hàng */}
                        <Route path='/manageTableType' element={
                            <PrivateRoute>
                                <ManageTableType />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Bàn ăn - Nhà hàng */}
                        <Route path='/manageTableBooking' element={
                            <PrivateRoute>
                                <ManageTableBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt tiệc - Nhà hàng */}
                        <Route path='/managePartyBooking' element={
                            <PrivateRoute>
                                <ManagePartyBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt bàn - Nhà hàng */}
                        <Route path='/manageTableBookingOrder' element={
                            <PrivateRoute>
                                <ManageTableBookingOrder />
                            </PrivateRoute>
                        } />

                        <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                        <Route path='*' element={
                            <NotFound />
                        } />
                        <Route path='/' element={<Navigate to="/home" replace />} />
                    </>
                );
            case 6:
                // Quản lý Nhà hàng
                return (
                    <>
                        {/* Dashboard */}
                        <Route path='/home' element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Khách hàng */}
                        <Route path='/manageCustomer' element={
                            <PrivateRoute>
                                <ManageCustomer />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Nhân viên */}
                        <Route path='/manageEmployee' element={
                            <PrivateRoute>
                                <ManageEmployee />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Món ăn - Nhà hàng */}
                        <Route path='/manageFood' element={
                            <PrivateRoute>
                                <ManageFood />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Bình luận - Đánh giá Món ăn */}
                        <Route path='/manageFoodVote' element={
                            <PrivateRoute>
                                <ManageFoodVote />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Sảnh tiệc - Nhà hàng */}
                        <Route path='/managePartyHall' element={
                            <PrivateRoute>
                                <ManagePartyHall />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ Tiệc - Nhà hàng */}
                        <Route path='/managePartyService' element={
                            <PrivateRoute>
                                <ManagePartyService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Set Menu - Nhà hàng */}
                        <Route path='/manageSetMenu' element={
                            <PrivateRoute>
                                <ManageSetMenu />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Bàn ăn - Nhà hàng */}
                        <Route path='/manageTableBooking' element={
                            <PrivateRoute>
                                <ManageTableBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt tiệc - Nhà hàng */}
                        <Route path='/managePartyBooking' element={
                            <PrivateRoute>
                                <ManagePartyBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt bàn - Nhà hàng */}
                        <Route path='/manageTableBookingOrder' element={
                            <PrivateRoute>
                                <ManageTableBookingOrder />
                            </PrivateRoute>
                        } />

                        <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                        <Route path='*' element={
                            <NotFound />
                        } />
                        <Route path='/' element={<Navigate to="/home" replace />} />
                    </>
                );
            case 8:
                // Lễ tân Nhà hàng
                return (
                    <>
                        {/* Dashboard */}
                        <Route path='/home' element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Khách hàng */}
                        <Route path='/manageCustomer' element={
                            <PrivateRoute>
                                <ManageCustomer />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Món ăn - Nhà hàng */}
                        <Route path='/manageFood' element={
                            <PrivateRoute>
                                <ManageFood />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Bình luận - Đánh giá Món ăn */}
                        <Route path='/manageFoodVote' element={
                            <PrivateRoute>
                                <ManageFoodVote />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Sảnh tiệc - Nhà hàng */}
                        <Route path='/managePartyHall' element={
                            <PrivateRoute>
                                <ManagePartyHall />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ Tiệc - Nhà hàng */}
                        <Route path='/managePartyService' element={
                            <PrivateRoute>
                                <ManagePartyService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Set Menu - Nhà hàng */}
                        <Route path='/manageSetMenu' element={
                            <PrivateRoute>
                                <ManageSetMenu />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Bàn ăn - Nhà hàng */}
                        <Route path='/manageTableBooking' element={
                            <PrivateRoute>
                                <ManageTableBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt tiệc - Nhà hàng */}
                        <Route path='/managePartyBooking' element={
                            <PrivateRoute>
                                <ManagePartyBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt bàn - Nhà hàng */}
                        <Route path='/manageTableBookingOrder' element={
                            <PrivateRoute>
                                <ManageTableBookingOrder />
                            </PrivateRoute>
                        } />

                        <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                        <Route path='*' element={
                            <NotFound />
                        } />
                        <Route path='/' element={<Navigate to="/home" replace />} />
                    </>
                );
            case 10:
                // Phục vụ Bàn
                return (
                    <>
                        {/* Dashboard */}
                        <Route path='/home' element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Món ăn - Nhà hàng */}
                        <Route path='/manageFood' element={
                            <PrivateRoute>
                                <ManageFood />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Sảnh tiệc - Nhà hàng */}
                        <Route path='/managePartyHall' element={
                            <PrivateRoute>
                                <ManagePartyHall />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ Tiệc - Nhà hàng */}
                        <Route path='/managePartyService' element={
                            <PrivateRoute>
                                <ManagePartyService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Set Menu - Nhà hàng */}
                        <Route path='/manageSetMenu' element={
                            <PrivateRoute>
                                <ManageSetMenu />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Bàn ăn - Nhà hàng */}
                        <Route path='/manageTableBooking' element={
                            <PrivateRoute>
                                <ManageTableBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt tiệc - Nhà hàng */}
                        <Route path='/managePartyBooking' element={
                            <PrivateRoute>
                                <ManagePartyBooking />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt bàn - Nhà hàng */}
                        <Route path='/manageTableBookingOrder' element={
                            <PrivateRoute>
                                <ManageTableBookingOrder />
                            </PrivateRoute>
                        } />

                        <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                        <Route path='*' element={
                            <NotFound />
                        } />
                        <Route path='/' element={<Navigate to="/home" replace />} />
                    </>
                );
            case 7:
                // Quản lý Khách sạn
                return (
                    <>
                        {/* Dashboard */}
                        <Route path='/home' element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Thiết bị - Khách sạn */}
                        <Route path='/manageDevice' element={
                            <PrivateRoute>
                                <ManageDevice />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ - Khách sạn */}
                        <Route path='/manageService' element={
                            <PrivateRoute>
                                <ManageService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Phòng - Khách sạn */}
                        <Route path='/manageRoom' element={
                            <PrivateRoute>
                                <ManageRoom />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Khách hàng */}
                        <Route path='/manageCustomer' element={
                            <PrivateRoute>
                                <ManageCustomer />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Nhân viên */}
                        <Route path='/manageEmployee' element={
                            <PrivateRoute>
                                <ManageEmployee />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt phòng */}
                        <Route path='/manageRoomBooking' element={
                            <PrivateRoute>
                                <ManageRoomBooking />
                            </PrivateRoute>
                        } />

                        <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                        <Route path='*' element={
                            <NotFound />
                        } />
                        <Route path='/' element={<Navigate to="/home" replace />} />
                    </>
                );
            case 9:
                // Lễ tân Khách sạn
                return (
                    <>
                        {/* Dashboard */}
                        <Route path='/home' element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Thiết bị - Khách sạn */}
                        <Route path='/manageDevice' element={
                            <PrivateRoute>
                                <ManageDevice />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ - Khách sạn */}
                        <Route path='/manageService' element={
                            <PrivateRoute>
                                <ManageService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Phòng - Khách sạn */}
                        <Route path='/manageRoom' element={
                            <PrivateRoute>
                                <ManageRoom />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Khách hàng */}
                        <Route path='/manageCustomer' element={
                            <PrivateRoute>
                                <ManageCustomer />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt phòng */}
                        <Route path='/manageRoomBooking' element={
                            <PrivateRoute>
                                <ManageRoomBooking />
                            </PrivateRoute>
                        } />

                        <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                        <Route path='*' element={
                            <NotFound />
                        } />
                        <Route path='/' element={<Navigate to="/home" replace />} />
                    </>
                );
            case 2:
                // Phục vụ Phòng
                return (
                    <>
                        {/* Dashboard */}
                        <Route path='/home' element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Thiết bị - Khách sạn */}
                        <Route path='/manageDevice' element={
                            <PrivateRoute>
                                <ManageDevice />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Dịch vụ - Khách sạn */}
                        <Route path='/manageService' element={
                            <PrivateRoute>
                                <ManageService />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Phòng - Khách sạn */}
                        <Route path='/manageRoom' element={
                            <PrivateRoute>
                                <ManageRoom />
                            </PrivateRoute>
                        } />
                        {/* Quản lý Đặt phòng */}
                        <Route path='/manageRoomBooking' element={
                            <PrivateRoute>
                                <ManageRoomBooking />
                            </PrivateRoute>
                        } />

                        <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                        <Route path='*' element={
                            <NotFound />
                        } />
                        <Route path='/' element={<Navigate to="/home" replace />} />
                    </>
                );
            default:
                // Không được phân quyền
                return (
                    <>
                        <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                        <Route path='*' element={
                            <NotFound />
                        } />
                        <Route path='/' element={<Navigate to="/home" replace />} />
                    </>
                );
        }
    }
    return (
        <Router>
            <Routes>

                {authorizationAdmin(admin)}

                {/* <Route path='/home' element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                } />
                <Route path='/manageDevice' element={
                    <PrivateRoute>
                        <ManageDevice />
                    </PrivateRoute>
                } />
                <Route path='/manageDeviceType' element={
                    <PrivateRoute>
                        <ManageDeviceType />
                    </PrivateRoute>
                } />
                <Route path='/manageDiscount' element={
                    <PrivateRoute>
                        <ManageDiscount />
                    </PrivateRoute>
                } />
                <Route path='/manageFloor' element={
                    <PrivateRoute>
                        <ManageFloor />
                    </PrivateRoute>
                } />
                <Route path='/manageService' element={
                    <PrivateRoute>
                        <ManageService />
                    </PrivateRoute>
                } />
                <Route path='/manageRoomType' element={
                    <PrivateRoute>
                        <ManageRoomType />
                    </PrivateRoute>
                } />
                <Route path='/manageRoom' element={
                    <PrivateRoute>
                        <ManageRoom />
                    </PrivateRoute>
                } />
                <Route path='/manageCustomer' element={
                    <PrivateRoute>
                        <ManageCustomer />
                    </PrivateRoute>
                } />
                <Route path='/manageEmployee' element={
                    <PrivateRoute>
                        <ManageEmployee />
                    </PrivateRoute>
                } />
                <Route path='/managePosition' element={
                    <PrivateRoute>
                        <ManagePosition />
                    </PrivateRoute>
                } />
                <Route path='/manageRoomBooking' element={
                    <PrivateRoute>
                        <ManageRoomBooking />
                    </PrivateRoute>
                } />
                <Route path='/manageFoodType' element={
                    <PrivateRoute>
                        <ManageFoodType />
                    </PrivateRoute>
                } />
                <Route path='/manageFood' element={
                    <PrivateRoute>
                        <ManageFood />
                    </PrivateRoute>
                } />
                <Route path='/manageFoodVote' element={
                    <PrivateRoute>
                        <ManageFoodVote />
                    </PrivateRoute>
                } />
                <Route path='/managePartyBookingType' element={
                    <PrivateRoute>
                        <ManagePartyBookingType />
                    </PrivateRoute>
                } />
                <Route path='/managePartyHallType' element={
                    <PrivateRoute>
                        <ManagePartyHallType />
                    </PrivateRoute>
                } />
                <Route path='/managePartyServiceType' element={
                    <PrivateRoute>
                        <ManagePartyServiceType />
                    </PrivateRoute>
                } />
                <Route path='/manageTableType' element={
                    <PrivateRoute>
                        <ManageTableType />
                    </PrivateRoute>
                } />
                <Route path='/manageSetMenu' element={
                    <PrivateRoute>
                        <ManageSetMenu />
                    </PrivateRoute>
                } />
                <Route path='/managePartyService' element={
                    <PrivateRoute>
                        <ManagePartyService />
                    </PrivateRoute>
                } />
                <Route path='/managePartyHall' element={
                    <PrivateRoute>
                        <ManagePartyHall />
                    </PrivateRoute>
                } />
                <Route path='/manageTableBooking' element={
                    <PrivateRoute>
                        <ManageTableBooking />
                    </PrivateRoute>
                } />
                <Route path='/managePartyBooking' element={
                    <PrivateRoute>
                        <ManagePartyBooking />
                    </PrivateRoute>
                } />
                <Route path='/manageTableBookingOrder' element={
                    <PrivateRoute>
                        <ManageTableBookingOrder />
                    </PrivateRoute>
                } />
                <Route path='/manageAdminLog' element={
                    <PrivateRoute>
                        <ManageAdminLog />
                    </PrivateRoute>
                } />

                <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                <Route path='*' element={
                    <NotFound />
                } />
                <Route path='/' element={<Navigate to="/home" replace />} /> */}
            </Routes>
        </Router>
    );
};

export default App;