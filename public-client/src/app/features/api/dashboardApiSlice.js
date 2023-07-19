import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config/config";

export const dashboardApiSlice = createApi({
  reducerPath: "dashboardApiSlice",
  tagTypes: ["Dashboard"],
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // get dashboard data
    getDashboardData: builder.query({
      query: () => `/api/dashboard`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApiSlice;
