import { Navigate, Outlet } from "react-router-dom";
import TopBar from "./TopBar";

const ProtectedRoutes = ({ authenticated }) => {
  if (!authenticated) return <Navigate to="/login" />;
  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
};

export default ProtectedRoutes;
