import { useAuthContextData } from "../auth/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

export const PrivateRoutes = () => {

    const authContextData = useAuthContextData();
    const { authenticated } = authContextData;

    // console.log(authContextData);

    let auth = {"authenticated": authenticated};
    console.log(auth);

    if(auth.authenticated === null) {
        return <Outlet />;
    }

    return (
        auth.authenticated ? <Outlet /> : <Navigate to="/login" />
    );
}