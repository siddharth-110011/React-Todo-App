import { useAuthContextData } from "../auth/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

export const PrivateRoutes = () => {

    const authContextData = useAuthContextData();
    const { authenticated } = authContextData;

    // console.log(authContextData);

    let auth = {"authenticated": authenticated};
    return (
        auth.authenticated ? <Outlet /> : <Navigate to="/login" />
    );
}