import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { persistToken, persistUserData } from "./app/features/authSlice";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Items from "./Pages/Items";
import Orders from "./Pages/Orders";
import Returns from "./Pages/Returns";
import Vendors from "./Pages/Vendors";
import Logs from "./Pages/Logs";
import Users from "./Pages/Users";
import Archives from "./Pages/Archives";

const App = () => {
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  // instances
  const dispatch = useDispatch();

  // exctracting token from local storage
  useEffect(() => {
    const token = localStorage.getItem("JB__T__111A");
    const userData = localStorage.getItem("JB__U__111A");

    if (token) dispatch(persistToken(token));
    if (userData) dispatch(persistUserData(JSON.parse(userData)));

    setLoading(false);
  }, [dispatch]);

  if (loading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Spin size="large" />
      </div>
    );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={<ProtectedRoutes authenticated={auth.isAuthenticated} />}
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<Items />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
