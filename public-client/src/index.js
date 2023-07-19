import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "./app/store";
import App from "./App";
import "./index.css";

// ant design theme customization
const theme = {
  token: {
    colorPrimary: "#fb5607",
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </Provider>
);
