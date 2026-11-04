import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {

    const autenticado = localStorage.getItem("authTeste") === "true";

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
