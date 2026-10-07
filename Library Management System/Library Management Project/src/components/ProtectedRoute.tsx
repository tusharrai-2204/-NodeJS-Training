import { getAccessToken, useAuthStore } from "@/store/authStore"
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children } : { children : React.ReactNode }) => {

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = getAccessToken();

  if (!isAuthenticated || !token) {
    return <Navigate to='/login' replace />;
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute
