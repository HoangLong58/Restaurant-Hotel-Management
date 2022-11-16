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