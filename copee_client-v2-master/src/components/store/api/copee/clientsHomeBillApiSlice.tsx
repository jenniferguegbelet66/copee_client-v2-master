import { store } from "../..";
import { getToken } from "../../slices/firebaseSlice";
import {
  COPEE_APPLI_CLIENT_HOME_BILLS,
  COPEE_APPLI_CLIENT_HOME_BILLS_LIST,
  RequestArgs,
} from "../../types";
import { copeeApiSlice } from "../copeeApiSlice";

const injectEndpoints = copeeApiSlice.injectEndpoints;

export const clientHomeBillsApi = injectEndpoints({
  endpoints: (builder) => ({
    fetchClientHomeBills: builder.query<
      COPEE_APPLI_CLIENT_HOME_BILLS_LIST,
      { requestArgs: RequestArgs }
    >({
      query() {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/homes/bills?token=${token}`;
      },
      providesTags: ["bills"],
    }),
    fetchClientHomeBillByID: builder.query<
      COPEE_APPLI_CLIENT_HOME_BILLS,
      { billId: string }
    >({
      query(queryO: { billId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/homes/bills/${queryO.billId}?token=${token}`;
      },
      providesTags: ["bill"],
    }),
    fetchClientHomeBillByHome: builder.query<
      COPEE_APPLI_CLIENT_HOME_BILLS,
      { homeID: string }
    >({
      query(queryO: { homeID: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/clients/homes/${queryO.homeID}/bills?token=${token}`;
      },
      providesTags: ["bill"],
    }),
    addNewClientHomeBill: builder.mutation({
      query(queryO: { bill: COPEE_APPLI_CLIENT_HOME_BILLS }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes/bills?token=${token}`,
          method: "POST",
          body: JSON.stringify(queryO.bill),
        };
      },
    }),
    updateClientHomeBill: builder.mutation({
      query(queryO: { bill: COPEE_APPLI_CLIENT_HOME_BILLS; billId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes/bills${queryO.billId}?token=${token}`,
          method: "PUT",
          body: JSON.stringify(queryO.bill),
        };
      },
    }),
    deleteClientHomeBill: builder.mutation({
      query(queryO: { billId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return {
          url: `/clients/homes/bills${queryO.billId}?token=${token}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useFetchClientHomeBillsQuery,
  useFetchClientHomeBillByIDQuery,
  useFetchClientHomeBillByHomeQuery,
} = clientHomeBillsApi;
