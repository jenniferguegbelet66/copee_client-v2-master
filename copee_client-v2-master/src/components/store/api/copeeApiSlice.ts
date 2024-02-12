import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const copeeApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8081/api/v1/",
    prepareHeaders(headers) {
      headers.set("Content-Type", "application/json; charset=utf-8");
      return headers;
    },
    mode: "cors",
  }),
  tagTypes: [
    "clients",
    "client",
    "installations",
    "installation",
    "users",
    "user",
    "homes",
    "home",
    "bills",
    "bill",
    "home_equipments",
    "home_equipment",
    "client_ass",
    "catalogue",
  ],
  endpoints: () => ({}),
});
