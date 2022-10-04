import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const accessToken = useSelector((state) => state.customer.token);
    return accessToken ? children : <Navigate to="/login"/>;
};

export default PrivateRoute;
