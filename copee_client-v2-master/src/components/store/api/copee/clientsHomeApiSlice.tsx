import { store } from "../..";
import { getToken } from "../../slices/firebaseSlice";
import {
  COPEE_APPLI_CLIENT_HOME,
  COPEE_APPLI_CLIENT_HOME_LIST,
  COPEE_APPLI_CLIENT_HOME_WITH_DEPENDENCIES,
  RequestArgs,
} from "../../types";
import { copeeApiSlice } from "../copeeApiSlice";

const injectEndpoints = copeeApiSlice.injectEndpoints;

export const clientHomesApi = injectEndpoints({
  endpoints: (builder) => ({
    fetchClientHomes: builder.query<
      COPEE_APPLI_CLIENT_HOME_LIST,
      { requestArgs: RequestArgs }
    >({
      query() {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/homes?token=${token}`;
      },
      providesTags: ["homes"],
    }),
    fetchClientHomeByID: builder.query<
      COPEE_APPLI_CLIENT_HOME,
      { homeId: string }
    >({
      query(queryO: { homeId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/homes${queryO.homeId}?token=${token}`;
      },
      providesTags: ["home"],
    }),
    fetchClientHomeByClient: builder.query<
      COPEE_APPLI_CLIENT_HOME,
      { clientId: string }
    >({
      query(queryO: { clientId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/${queryO.clientId}/home?token=${token}`;
      },
      providesTags: ["home"],
    }),
    fetchClientHomeWithDependenciesByClient: builder.query<
      COPEE_APPLI_CLIENT_HOME_WITH_DEPENDENCIES,
      { clientId: string }
    >({
      query(queryO: { clientId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/${queryO.clientId}/home?token=${token}&dependencies=all`;
      },
      providesTags: ["home"],
    }),
    addNewClientHome: builder.mutation({
      query(queryO: { home: COPEE_APPLI_CLIENT_HOME }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes?token=${token}`,
          method: "POST",
          body: JSON.stringify(queryO.home),
        };
      },
    }),
    updateClientHome: builder.mutation({
      query(queryO: { home: COPEE_APPLI_CLIENT_HOME; homeId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes${queryO.homeId}?token=${token}`,
          method: "PUT",
          body: JSON.stringify(queryO.home),
        };
      },
    }),
    deleteClientHome: builder.mutation({
      query(queryO: { homeId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes${queryO.homeId}?token=${token}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useFetchClientHomesQuery,
  useFetchClientHomeByIDQuery,
  useFetchClientHomeByClientQuery,
  useFetchClientHomeWithDependenciesByClientQuery,
} = clientHomesApi;
