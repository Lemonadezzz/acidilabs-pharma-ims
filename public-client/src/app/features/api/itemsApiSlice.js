import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../../../config/config";

export const itemsApiSlice = createApi({
  reducerPath: "itemsApiSlice",
  tagTypes: ["Items", "Categories", "Archives", "Warning"],

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
    // create item
    createItem: builder.mutation({
      query: (body) => ({
        url: "/api/items/create-item",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Items"],
    }),

    // get all items
    getItems: builder.query({
      query: ({ page, sortby, sortorder }) =>
        `/api/items?page=${page}&sortby=${sortby}&sortorder=${sortorder}`,
      providesTags: ["Items"],
    }),

    // delete item
    deleteItem: builder.mutation({
      query: (body) => ({
        url: "/api/items/delete-item",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Items"],
    }),

    // use item
    itemUse: builder.mutation({
      query: (body) => ({
        url: "/api/items/use-item",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Items", "Warning"],
    }),

    // update item
    updateItem: builder.mutation({
      query: (body) => ({
        url: "/api/items/update-item",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Items", "Warning"],
    }),

    // search items
    searchItems: builder.query({
      query: (q) => ({
        url: `/api/items/search?q=${q}`,
      }),
    }),

    // get all categories
    getCategories: builder.query({
      query: () => `/api/items/categories`,
      providesTags: ["Categories"],
    }),

    // add category
    addCategory: builder.mutation({
      query: (body) => ({
        url: "/api/items/add-category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    // get warning
    getWarning: builder.query({
      query: () => `/api/items/warning`,
      providesTags: ["Warning"],
    }),

    // // archive item
    // archiveItem: builder.mutation({
    //   query: (body) => ({
    //     url: "/api/items/archive-item",
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["Items", "Archives", "Warning"],
    // }),

    // // get archived items
    // getArchivedItems: builder.query({
    //   query: ({ page, sortby, sortorder }) =>
    //     `/api/items/archived?page=${page}&sortby=${sortby}&sortorder=${sortorder}`,
    //   providesTags: ["Archives"],
    // }),
  }),
});

export const {
  useCreateItemMutation,
  useGetItemsQuery,
  useDeleteItemMutation,
  useItemUseMutation,
  useUpdateItemMutation,
  useSearchItemsQuery,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useGetWarningQuery,
  // useArchiveItemMutation,
  // useGetArchivedItemsQuery,
} = itemsApiSlice;
