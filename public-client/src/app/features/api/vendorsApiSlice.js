import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config/config";

export const vendorsApiSlice = createApi({
  reducerPath: "vendorsApiSlice",
  tagTypes: ["Vendors"],

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
    // create vendor
    createVendor: builder.mutation({
      query: (body) => ({
        url: "/api/vendors/create-vendor",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendors"],
    }),

    // get all vendors
    getVendors: builder.query({
      query: () => "/api/vendors",
      providesTags: ["Vendors"],
    }),

    // update vendor
    updateVendor: builder.mutation({
      query: (body) => ({
        url: "/api/vendors/update-vendor",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendors"],
    }),

    // delete vendor
    deleteVendor: builder.mutation({
      query: (body) => ({
        url: "/api/vendors/delete-vendor",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendors"],
    }),
  }),
});

export const {
  useCreateVendorMutation,
  useGetVendorsQuery,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorsApiSlice;
