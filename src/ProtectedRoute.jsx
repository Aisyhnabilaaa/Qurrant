import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ الأدوار_المسموح_بها, دور_المستخدم }) => {
    const الدور = دور_المستخدم || localStorage.getItem("role"); 

    console.log("🔍 Role user saat akses halaman:", الدور);
    console.log("🛑 Role yang diizinkan:", الأدوار_المسموح_بها);

    return الدور && الأدوار_المسموح_بها.includes(الدور.toLowerCase()) ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
