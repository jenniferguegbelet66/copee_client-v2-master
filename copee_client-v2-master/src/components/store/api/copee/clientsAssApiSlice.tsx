import { store } from "../..";
import { getToken } from "../../slices/firebaseSlice";
import {
  COPEE_APPLI_CLIENT_ASS,
  COPEE_APPLI_CLIENT_ASS_LIST,
  COPEE_APPLI_CLIENT_LIST,
  RequestArgs,
} from "../../types";
import { copeeApiSlice } from "../copeeApiSlice";

const injectEndpoints = copeeApiSlice.injectEndpoints;

export const clientsAssApi = injectEndpoints({
  endpoints: (builder) => ({
    fetchClientsAss: builder.query<
      COPEE_APPLI_CLIENT_LIST,
      { requestArgs: RequestArgs }
    >({
      query() {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/ass?token=${token}`;
      },
      providesTags: ["client_ass"],
    }),
    fetchClientAssByID: builder.query<
      COPEE_APPLI_CLIENT_ASS,
      { assId: string }
    >({
      query(queryO: { assId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/ass${queryO.assId}?token=${token}`;
      },
    }),
    fetchClientAssListByClient: builder.query<
      COPEE_APPLI_CLIENT_ASS_LIST,
      { clientId: string }
    >({
      query(queryO: { clientId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/${queryO.clientId}/ass?token=${token}`;
      },
    }),
    addNewClientAss: builder.mutation({
      query(queryO: { ass: COPEE_APPLI_CLIENT_ASS }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/ass?token=${token}`,
          method: "POST",
          body: JSON.stringify(queryO.ass),
        };
      },
    }),
    updateClientAss: builder.mutation({
      query(queryO: { ass: COPEE_APPLI_CLIENT_ASS; assId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/ass${queryO.assId}?token=${token}`,
          method: "PUT",
          body: JSON.stringify(queryO.ass),
        };
      },
    }),
    deleteClientAss: builder.mutation({
      query(queryO: { clientId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/ass${queryO.clientId}?token=${token}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useAddNewClientAssMutation,
  useDeleteClientAssMutation,
  useUpdateClientAssMutation,
  useFetchClientAssByIDQuery,
  useFetchClientsAssQuery,
  useFetchClientAssListByClientQuery,
} = clientsAssApi;
