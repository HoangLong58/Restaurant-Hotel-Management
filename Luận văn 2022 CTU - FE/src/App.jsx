import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import PrivateRoute from "../src/handle/PrivateRoute";
import NotFound from "./handle/NotFound";
import LoginRegister from "./pages/LoginRegister";
import Hotel from "./pages/Hotel";
import Restaurant from "./pages/Restaurant";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/home' element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path='/hotel' element={
          <PrivateRoute>
            <Hotel />
          </PrivateRoute>
        } />
        <Route path='/restaurant' element={
          <PrivateRoute>
            <Restaurant />
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
