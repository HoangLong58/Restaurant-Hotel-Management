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
import ManageRoomType from "./pages/ManageRoomType";
import ManageRoom from "./pages/ManageRoom";

import QuanLyDonHang from "./pages/QuanLyDonHang";
import QuanLyKhachHang from "./pages/QuanLyKhachHang";
import QuanLyNhanVien from "./pages/QuanLyNhanVien";


const App = () => {
    // Lấy admin từ Redux
    const admin = useSelector((state) => state.admin.currentAdmin);
    return (
        <Router>
            <Routes>
                <Route path='/home' element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                } />
                {/* HOTEL */}
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



                <Route path='/quanlykhachhang' element={
                    <PrivateRoute>
                        <QuanLyKhachHang />
                    </PrivateRoute>
                } />
                <Route path='/quanlynhanvien' element={
                    <PrivateRoute>
                        <QuanLyNhanVien />
                    </PrivateRoute>
                } />
                <Route path='/quanlydonhang' element={
                    <PrivateRoute>
                        <QuanLyDonHang />
                    </PrivateRoute>
                } />

                <Route path='/login' element={admin ? <Navigate to="/" /> : <LoginAdmin />} />

                <Route path='*' element={
                    <NotFound />
                } />
                <Route path='/' element={<Navigate to="/home" replace />} />
            </Routes>
        </Router>
    );
};

export default App;