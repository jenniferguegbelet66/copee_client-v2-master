import { turnObjectPropsToUrlParams } from "@/lib/objects";
import { store } from "../..";
import { getToken } from "../../slices/firebaseSlice";
import { COPEE_CATALOG_WITH_DEPENDENCIES, RequestArgs } from "../../types";
import { copeeApiSlice } from "../copeeApiSlice";
import { getPageLimit, getPageOffset } from "../../slices/applicationSlice";

const injectEndpoints = copeeApiSlice.injectEndpoints;

export const catalogueApi = injectEndpoints({
  endpoints: (builder) => ({
    fetchCatalogWithDeps: builder.query<
      COPEE_CATALOG_WITH_DEPENDENCIES,
      { requestArgs: RequestArgs }
    >({
      query(queryobj: { requestArgs: RequestArgs }) {
        const state = store.getState();
        const token: string = getToken(state);
        const pageOffset: number = getPageOffset(state);
        const pageLimit: number = getPageLimit(state);
        const extraUrlparams = turnObjectPropsToUrlParams(queryobj.requestArgs);
        return `/equipments/catalogue?token=${token}&page_offset=${pageOffset}&page_limit=${pageLimit}${extraUrlparams}`;
      },
      providesTags: ["catalogue"],
    }),
  }),
});

export const { useFetchCatalogWithDepsQuery } = catalogueApi;
