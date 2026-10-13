import { useAuthStore } from "@/store/authStore"
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children } : { children : React.ReactNode }) => {

  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (user?.requiresPasswordChange && location.pathname !== '/change-password') {
    return <Navigate to='/change-password' replace />
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute
