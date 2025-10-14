import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
    const { isLoggedIn, loading, isCheckingAuth, userRole } = useAuth();

    if (loading || isCheckingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;