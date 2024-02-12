import { store } from "../..";
import { getToken } from "../../slices/firebaseSlice";
import {
  COPEE_APPLI_USER,
  COPEE_APPLI_USER_LIST,
  RequestArgs,
} from "../../types";
import { copeeApiSlice } from "../copeeApiSlice";

const injectEndpoints = copeeApiSlice.injectEndpoints;

export const usersApi = injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query<
      COPEE_APPLI_USER_LIST,
      { requestArgs: RequestArgs }
    >({
      query() {
        const state = store.getState();
        const token: string = getToken(state);
        return `/users?token=${token}`;
      },
      providesTags: ["users"],
    }),
    fetchUserByID: builder.query<COPEE_APPLI_USER, { userId: string }>({
      query(queryO: { userId: string }) {
        const state = store.getState();
        const token: string = getToken(state);
        return `/users/${queryO.userId}?token=${token}`;
      },
      providesTags: ["user"],
    }),
  }),
});

export const { useFetchUsersQuery, useFetchUserByIDQuery } = usersApi;
