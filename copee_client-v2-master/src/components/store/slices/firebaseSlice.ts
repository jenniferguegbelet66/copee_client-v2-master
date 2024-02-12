import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface AuthState {
  firebase: {
    token: string;
  };
}

export const initialState: AuthState = {
  firebase: {
    token: "",
  },
};

const firebaseSlice = createSlice({
  name: "firebase",
  initialState,
  reducers: {
    setToken(state, payload) {
      state.firebase.token = payload.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const getToken = (state: RootState) => state.auth.firebase.token;
export const { setToken, reset } = firebaseSlice.actions;
export default firebaseSlice.reducer;
