import { store } from "../..";
import { getToken } from "../../slices/firebaseSlice";
import {
  COPEE_APPLI_CLIENT,
  COPEE_APPLI_CLIENT_LIST,
  COPEE_APPLI_CLIENT_WITH_DEPENDENCIES,
  RequestArgs,
} from "../../types";
import { copeeApiSlice } from "../copeeApiSlice";

const injectEndpoints = copeeApiSlice.injectEndpoints;

export const clientsApi = injectEndpoints({
  endpoints: (builder) => ({
    fetchClients: builder.query<
      COPEE_APPLI_CLIENT_LIST,
      { requestArgs: RequestArgs }
    >({
      query() {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients?token=${token}`;
      },
      providesTags: ["clients"],
    }),
    fetchClientByID: builder.query<COPEE_APPLI_CLIENT, { clientId: string }>({
      query(queryO: { clientId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/${queryO.clientId}?token=${token}`;
      },
      providesTags: ["clients"],
    }),
    fetchClientWithDependenciesByID: builder.query<
      COPEE_APPLI_CLIENT_WITH_DEPENDENCIES,
      { clientId: string }
    >({
      query(queryO: { clientId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/${queryO.clientId}?token=${token}&dependencies=all`;
      },
      providesTags: ["clients"],
    }),
    addNewClient: builder.mutation({
      query(queryO: { client: COPEE_APPLI_CLIENT }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients?token=${token}`,
          method: "POST",
          body: JSON.stringify(queryO.client),
        };
      },
    }),
    updateClient: builder.mutation({
      query(queryO: { client: COPEE_APPLI_CLIENT; clientId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/${queryO.clientId}?token=${token}`,
          method: "PUT",
          body: JSON.stringify(queryO.client),
        };
      },
    }),
    deleteClient: builder.mutation({
      query(queryO: { clientId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/${queryO.clientId}?token=${token}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const { useFetchClientsQuery, useFetchClientByIDQuery, useFetchClientWithDependenciesByIDQuery } = clientsApi;
