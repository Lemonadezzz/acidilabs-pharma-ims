import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { Button, Input, message, Spin } from "antd";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import {
  useLoginMutation,
  useInitializeAuthQuery,
  useSignupAdminMutation,
} from "../app/features/api/authApiSlice";
import { storeLoginData } from "../app/features/authSlice";
import { useState } from "react";

const Footer = () => {
  return (
    <footer className="bg-green-900 p-0.4 text-center fixed bottom-0 left-0 w-full text-white">
      <p>&copy; {new Date().getFullYear()} AcidiLabs Pharma IMS v1.0</p>
    </footer>
  );
};

const Login = () => {
  const {
    isLoading,
    isError,
    data: authInitializationInfo,
  } = useInitializeAuthQuery();
  const [login, result] = useLoginMutation();
  const [signupAdmin, signupResult] = useSignupAdminMutation();
  const auth = useSelector((state) => state.auth);

  // local states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputStatus, setInputStatus] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("Password");

  // instances
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );

  // if user is already logged in, redirect to dashboard
  if (auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  // check if caps lock is on
  const handleCapsLock = (e) => {
    // IF KEY IS NOT BACKSPACE THEN CHECK FOR CAPS LOCK
    if (e.keyCode !== 8) {
      const capsLock = e.getModifierState && e.getModifierState("CapsLock");
      if (capsLock) {
        setInputStatus("error");
        // setInputPlaceholder("Caps lock is on");
        message.warning("Caps lock is on!");
      } else {
        setInputStatus("");
        // setInputPlaceholder("Password");
      }
    }
  };

  const handleLoginClick = () => {
    if (!username || !password) {
      message.error("Please enter username and password!");
      return;
    }

    if (!isError && !isLoading && !authInitializationInfo?.adminExists) {
      // dispatching login api call
      signupAdmin({ username, password }).then((res) => {
        if (!res.data?.success) {
          message.error(`Something went wrong!`);
          return;
        }

        message.success(`New admin account created successfully!`);

        const userData = {
          token: res.data.token,
          user: res.data.user,
        };
        // store user data in redux store
        dispatch(storeLoginData(userData));

        // saving the token in local storage
        localStorage.setItem("JB__T__111A", res.data.token);
        localStorage.setItem(
          "JB__U__111A",
          JSON.stringify({
            username: res.data.user.username,
            role: res.data.user.role,
            profile_pic_url: res.data.user.profile_pic_url,
            permissions: res.data.user.permissions,
          })
        );
        navigate("/");
      });
    }

    // dispatching login api call
    login({ username, password }).then((res) => {
      if (!res.data?.success) {
        message.error(`Invalid credentials!`);
        return;
      }
      const userData = {
        token: res.data.token,
        username: res.data.user.username,
        role: res.data.user.role,
        profile_pic_url: res.data.user.profile_pic_url,
        permissions: res.data.user.permissions,
      };
      // store user data in redux store
      dispatch(storeLoginData(userData));

      // saving the token in local storage
      localStorage.setItem("JB__T__111A", res.data.token);
      localStorage.setItem(
        "JB__U__111A",
        JSON.stringify({
          username: res.data.user.username,
          role: res.data.user.role,
          profile_pic_url: res.data.user.profile_pic_url,
          permissions: res.data.user.permissions,
        })
      );
      navigate("/");
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="w-screen flex justify-end items-center">
        <div className="w-[50vh] sm:w-[450px] h-[100vh] bg-white p-4 sm:px-8 sm:py-10 rounded-md shadow-lg flex flex-col items-center justify-center ">
          <h3 className="text-primary text-center my-6 sm:mt-6 sm:mb-10">
            AcidiLabs Pharma IMS v1.0
          </h3>
          <Input
            placeholder="Username"
            type="text"
            className="my-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input.Password
            placeholder={inputPlaceholder}
            status={inputStatus}
            type="text"
            className="mt-3 mb-6"
            onKeyDown={handleCapsLock}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Button
            type="primary"
            loading={result.isLoading || signupResult.isLoading}
            onClick={handleLoginClick}
            icon={<LockClosedIcon className="sm:w-5 sm:h-5 w-4 h-4" />}
            className="flex justify-center items-center gap-1 font-bold sm:text-lg mx-auto w-[50%] mt-4"
          >
            {result.isLoading || signupResult.isLoading ? "Verifying..." : "Login"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>

  );
};

export default Login;
