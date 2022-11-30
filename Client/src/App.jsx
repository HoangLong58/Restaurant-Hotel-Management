import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "../src/handle/PrivateRoute";
import NotFound from "./handle/NotFound";
import BookParty from "./pages/BookParty";
import BookTable from "./pages/BookTable";
import Home from "./pages/Home";
import Hotel from "./pages/Hotel";
import HotelPayment from "./pages/HotelPayment";
import HotelSuccess from "./pages/HotelSuccess";
import LoginRegister from "./pages/LoginRegister";
import OrderFood from "./pages/OrderFood";
import Restaurant from "./pages/Restaurant";
import RoomDetail from "./pages/RoomDetail";

import { useSelector } from "react-redux";

function App() {
  const customer = useSelector((state) => state.customer.currentCustomer);
  return (
    <Router>
      <Routes>
        <Route path='/home' element={
          <Home />
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

        <Route path='/login' element={customer ? <Navigate to="/" /> : <LoginRegister />} />

        <Route path='*' element={
          <NotFound />
        } />
        <Route path='/' element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
