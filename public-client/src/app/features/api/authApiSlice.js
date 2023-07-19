import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config/config";

export const authApiSlice = createApi({
  reducerPath: "authApiSlice",
  tagTypes: ["Users"],
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
    // initialize auth
    initializeAuth: builder.query({
      query: () => "/api/auth",
    }),

    // signup admin
    signupAdmin: builder.mutation({
      query: (body) => ({
        url: "/api/auth/signup-admin",
        method: "POST",
        body,
      }),
    }),

    // login
    login: builder.mutation({
      query: (body) => ({
        url: "/api/auth/login",
        method: "POST",
        body,
      }),
    }),

    // fetch auth info
    fetchAuthInfo: builder.query({
      query: () => "/api/auth/info",
    }),

    // create user
    createUser: builder.mutation({
      query: (body) => ({
        url: "/api/auth/create-user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // update user
    updateUser: builder.mutation({
      query: (body) => ({
        url: "/api/auth/update-user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // get users
    getUsers: builder.query({
      query: () => "/api/auth/get-users",
      providesTags: ["Users"],
    }),

    // delete user
    deleteUser: builder.mutation({
      query: (body) => ({
        url: "/api/auth/delete-user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useFetchAuthInfoQuery,
  useInitializeAuthQuery,
  useSignupAdminMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
} = authApiSlice;
