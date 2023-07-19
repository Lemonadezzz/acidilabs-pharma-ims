import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config/config";

export const ordersApiSlice = createApi({
  reducerPath: "ordersApiSlice",
  tagTypes: ["Orders"],
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
    // create order
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/api/orders/create-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    // get all orders
    getOrders: builder.query({
      query: ({ page, sortby, sortorder }) =>
        `/api/orders?page=${page}&sortby=${sortby}&sortorder=${sortorder}`,
      providesTags: ["Orders"],
    }),

    // change order status
    changeOrderStatus: builder.mutation({
      query: (body) => ({
        url: "/api/orders/change-order-status",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    // delete order
    deleteOrder: builder.mutation({
      query: (body) => ({
        url: "/api/orders/delete-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    // search orders
    searchOrders: builder.query({
      query: (q) => `/api/orders/search?q=${q}`,
    }),

    // get archived orders
    getArchivedOrders: builder.query({
      query: ({ page, sortby, sortorder }) =>
        `/api/orders/archived?page=${page}&sortby=${sortby}&sortorder=${sortorder}`,
    }),

    // edit order
    editOrder: builder.mutation({
      query: (body) => ({
        url: "/api/orders/edit-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    // archive order
    archiveOrder: builder.mutation({
      query: (body) => ({
        url: "/api/orders/archive-order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useChangeOrderStatusMutation,
  useDeleteOrderMutation,
  useSearchOrdersQuery,
  useGetArchivedOrdersQuery,
  useEditOrderMutation,
  useArchiveOrderMutation,
} = ordersApiSlice;
