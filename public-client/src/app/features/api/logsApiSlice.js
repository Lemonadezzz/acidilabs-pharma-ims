import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config/config";

export const logsApiSlice = createApi({
  reducerPath: "logsApiSlice",
  tagTypes: ["Logs"],
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
    // get all logs
    getLogs: builder.query({
      query: ({ page, limit, type, status }) =>
        `/api/logs?page=${page}&limit=${limit}&type=${type}&status=${status}`,
      providesTags: ["Logs"],
    }),

    // mark a log as read
    markLogAsRead: builder.mutation({
      query: (body) => ({
        url: "/api/logs/mark-as-read",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Logs"],
    }),

    // delete a log
    deleteLog: builder.mutation({
      query: (body) => ({
        url: "/api/logs/delete-log",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Logs"],
    }),

    // delete all read logs
    deleteReadLogs: builder.mutation({
      query: () => ({
        url: "/api/logs/delete-read-logs",
        method: "POST",
      }),
      invalidatesTags: ["Logs"],
    }),
  }),
});

export const {
  useGetLogsQuery,
  useMarkLogAsReadMutation,
  useDeleteLogMutation,
  useDeleteReadLogsMutation,
} = logsApiSlice;
