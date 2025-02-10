import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("jwt_token");

    return token ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;