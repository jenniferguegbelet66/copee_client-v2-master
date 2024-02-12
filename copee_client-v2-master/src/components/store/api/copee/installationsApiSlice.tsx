import { store } from "../..";
import { getToken } from "../../slices/firebaseSlice";
import {
  COPEE_APPLI_INSTALLATION,
  COPEE_APPLI_INSTALLATION_LIST,
  RequestArgs,
} from "../../types";
import { copeeApiSlice } from "../copeeApiSlice";

const injectEndpoints = copeeApiSlice.injectEndpoints;

export const installationsApi = injectEndpoints({
  endpoints: (builder) => ({
    fetchInstallations: builder.query<
      COPEE_APPLI_INSTALLATION_LIST,
      { requestArgs: RequestArgs }
    >({
      query() {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/installations?token=${token}`;
      },
      providesTags: ["installations"],
    }),
    fetchInstallationByID: builder.query<
      COPEE_APPLI_INSTALLATION,
      { installationID: string }
    >({
      query(queryO: { installationID: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/installations/${queryO.installationID}?token=${token}`;
      },
      providesTags: ["installation"],
    }),
    addNewInstallation: builder.mutation({
      query(queryO: { install: COPEE_APPLI_INSTALLATION }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/installations?token=${token}`,
          method: "POST",
          body: JSON.stringify(queryO.install),
        };
      },
    }),
    updateInstallation: builder.mutation({
      query(queryO: { install: COPEE_APPLI_INSTALLATION; installId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes${queryO.installId}?token=${token}`,
          method: "PUT",
          body: JSON.stringify(queryO.install),
        };
      },
    }),
    deleteInstallation: builder.mutation({
      query(queryO: { installId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes${queryO.installId}?token=${token}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useFetchInstallationsQuery,
  useFetchInstallationByIDQuery,
  useAddNewInstallationMutation,
  useUpdateInstallationMutation,
  useDeleteInstallationMutation,
} = installationsApi;
