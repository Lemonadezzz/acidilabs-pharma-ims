import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config/config";

export const returnsApiSlice = createApi({
  reducerPath: "returnsApiSlice",
  tagTypes: ["Returns"],

  // eslint-disable-next-line no-undef
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
    // create return
    createReturn: builder.mutation({
      query: (body) => ({
        url: "/api/returns/create-return",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Returns"],
    }),

    // get all returns
    getReturns: builder.query({
      query: () => `/api/returns`,
      providesTags: ["Returns"],
    }),

    // update return
    updateReturn: builder.mutation({
      query: (body) => ({
        url: "/api/returns/update-return",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Returns"],
    }),

    // delete return
    deleteReturn: builder.mutation({
      query: (body) => ({
        url: "/api/returns/delete-return",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Returns"],
    }),

    // change return status
    changeReturnStatus: builder.mutation({
      query: (body) => ({
        url: "/api/returns/change-return-status",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Returns"],
    }),

    // search returns
    searchReturns: builder.query({
      query: (q) => `/api/returns/search?q=${q}`,
    }),
  }),
});

export const {
  useCreateReturnMutation,
  useGetReturnsQuery,
  useUpdateReturnMutation,
  useDeleteReturnMutation,
  useChangeReturnStatusMutation,
  useSearchReturnsQuery,
} = returnsApiSlice;
