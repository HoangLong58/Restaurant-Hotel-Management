import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PrivateRoute from "../src/handle/PrivateRoute";
import NotFound from "./handle/NotFound";
import LoginRegister from "./pages/LoginRegister";
import Hotel from "./pages/Hotel";
import Restaurant from "./pages/Restaurant";
import RoomDetail from "./pages/RoomDetail";
import HotelPayment from "./pages/HotelPayment";
import HotelSuccess from "./pages/HotelSuccess";
import OrderFood from "./pages/OrderFood";
import BookTable from "./pages/BookTable";
import BookParty from "./pages/BookParty";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        {/* HOTEL */}
        <Route path='/hotel' element={
          <PrivateRoute>
            <Hotel />
          </PrivateRoute>
        } />
        <Route path='/room-detail' element={
          <PrivateRoute>
            <RoomDetail />
          </PrivateRoute>
        } />
        <Route path='/hotel-payment' element={
          <PrivateRoute>
            <HotelPayment />
          </PrivateRoute>
        } />
        <Route path='/hotel-success' element={
          <PrivateRoute>
            <HotelSuccess />
          </PrivateRoute>
        } />
        {/* RESTAURANT */}
        <Route path='/restaurant' element={
          <PrivateRoute>
            <Restaurant />
          </PrivateRoute>
        } />
        <Route path='/order-food' element={
          <PrivateRoute>
            <OrderFood />
          </PrivateRoute>
        } />
        <Route path='/book-table' element={
          <PrivateRoute>
            <BookTable />
          </PrivateRoute>
        } />
        <Route path='/book-party' element={
          <PrivateRoute>
            <BookParty />
          </PrivateRoute>
        } />
        {/* <Route path='/login' element={
          <PrivateRoute>
            <LoginRegister />
          </PrivateRoute>
        } /> */}
        <Route path='*' element={
          <NotFound />
        } />
        <Route path='/' element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
