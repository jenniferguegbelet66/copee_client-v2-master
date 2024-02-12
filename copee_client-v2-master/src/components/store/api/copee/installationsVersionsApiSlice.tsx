import { store } from "../..";
import { getToken } from "../../slices/firebaseSlice";
import {
  COPEE_APPLI_INSTALLATION_VERSION,
  COPEE_APPLI_INSTALLATION_VERSION_LIST,
  RequestArgs,
} from "../../types";
import { copeeApiSlice } from "../copeeApiSlice";

const injectEndpoints = copeeApiSlice.injectEndpoints;

export const installationsVersionsApi = injectEndpoints({
  endpoints: (builder) => ({
    fetchInstallationsVersions: builder.query<
      COPEE_APPLI_INSTALLATION_VERSION_LIST,
      { requestArgs: RequestArgs }
    >({
      query({ requestArgs }) {
        const state = store.getState();
        const token: string = getToken(state);
        const queryParams = new URLSearchParams({
          token: token,
          ...requestArgs,
        });
        return `/clients/installations/versions?${queryParams.toString()}`;
      },
      providesTags: ["installations"],
    }),
    fetchInstallationsVersionsByInstallation: builder.query<
    COPEE_APPLI_INSTALLATION_VERSION_LIST,
    { installationId: string, requestArgs: RequestArgs }
  >({
    query({ installationId, requestArgs }) {
      const state = store.getState();
      const token: string = getToken(state);
      const queryParams:URLSearchParams = new URLSearchParams({
        token: token,
        ...requestArgs,
      });
      return `/clients/installations/${installationId}/versions?${queryParams.toString()}`;
    },
    providesTags: ["installations"],
  }),
    fetchInstallationVersionByID: builder.query<
      COPEE_APPLI_INSTALLATION_VERSION,
      { ivID: string }
    >({
      query(queryO: { ivID: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/installations/versions/${queryO.ivID}?token=${token}`;
      },
    }),
  }),
});

export const {
  useFetchInstallationsVersionsQuery,
  useFetchInstallationVersionByIDQuery,
  useFetchInstallationsVersionsByInstallationQuery,
} = installationsVersionsApi;
