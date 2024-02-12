import { configureStore } from "@reduxjs/toolkit";
import firebaseSlice from "./slices/firebaseSlice";
import applicationSlice from "./slices/applicationSlice";
import { copeeApiSlice } from "./api/copeeApiSlice";

export const store = configureStore({
  reducer: {
    auth: firebaseSlice,
    application: applicationSlice,
    [copeeApiSlice.reducerPath]: copeeApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      copeeApiSlice.middleware,
      // sessionMiddleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
