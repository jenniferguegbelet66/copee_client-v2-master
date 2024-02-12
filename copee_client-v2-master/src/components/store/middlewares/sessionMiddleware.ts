import {
  Middleware,
  MiddlewareAPI,
  Dispatch,
  AnyAction,
} from "@reduxjs/toolkit";
import { getToken, setToken } from "../slices/firebaseSlice";
import localforage from "localforage";

const customMiddleware: Middleware =
  (store: MiddlewareAPI) => (next: Dispatch) => async (action: AnyAction) => {
    const currentToken = getToken(store.getState());
    const token = await localforage.getItem("token");
    if (token && currentToken != token) {
      const firebaseTokenAction: {
        payload: any;
        type: string;
      } = setToken(token);
      store.dispatch(firebaseTokenAction);
    }

    return next(action);
  };

export default customMiddleware;
