import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import rootReducer from "./features/rootSlice";
import { authApiSlice } from "./features/api/authApiSlice";
import { itemsApiSlice } from "./features/api/itemsApiSlice";
import { ordersApiSlice } from "./features/api/ordersApiSlice";
import { returnsApiSlice } from "./features/api/returnsApiSlice";
import { vendorsApiSlice } from "./features/api/vendorsApiSlice";
import { logsApiSlice } from "./features/api/logsApiSlice";
import { dashboardApiSlice } from "./features/api/dashboardApiSlice";

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [itemsApiSlice.reducerPath]: itemsApiSlice.reducer,
    [ordersApiSlice.reducerPath]: ordersApiSlice.reducer,
    [returnsApiSlice.reducerPath]: returnsApiSlice.reducer,
    [vendorsApiSlice.reducerPath]: vendorsApiSlice.reducer,
    [logsApiSlice.reducerPath]: logsApiSlice.reducer,
    [dashboardApiSlice.reducerPath]: dashboardApiSlice.reducer,
    auth: authReducer,
    root: rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApiSlice.middleware)
      .concat(itemsApiSlice.middleware)
      .concat(ordersApiSlice.middleware)
      .concat(returnsApiSlice.middleware)
      .concat(vendorsApiSlice.middleware)
      .concat(logsApiSlice.middleware)
      .concat(dashboardApiSlice.middleware),
});
