import { useAuth } from "@/contexts/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const AuthRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default AuthRedirect;
