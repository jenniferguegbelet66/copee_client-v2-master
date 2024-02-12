import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { PAGE_OFFSET, PAGE_LIMIT } from "@/const";

export type StateMessage = {
  date: string;
  action: string;
  message: string;
  component: string;
};

interface ApplicationState {
  messages: StateMessage[];
  page_offset: number;
  page_limit: number;
}

export const initialState: ApplicationState = {
  messages: [],
  page_offset: PAGE_OFFSET,
  page_limit: PAGE_LIMIT,
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<StateMessage>) {
      state.messages.push(action.payload);
    },
    deleteMessage(state, action: PayloadAction<StateMessage>) {
      const messageToDelete: StateMessage = action.payload;
      const index: number = state.messages.findIndex(
        (message: StateMessage) => messageToDelete.message === message.message
      );
      if (index > -1) {
        state.messages.splice(index, 1);
      }
    },
    setPageOffset(state, action: PayloadAction<number>) {
      console.log("setPageOffset", action.payload);
      state.page_offset = action.payload;
    },
    setPageLimit(state, action: PayloadAction<number>) {
      state.page_limit = action.payload;
    },
  },
});

export const getMessages = (state: RootState) => state.application.messages;
export const findStateMessage = (
  messages: StateMessage[],
  component: string
): StateMessage | undefined => {
  return messages.find((message: StateMessage) => {
    return (
      message.component === component &&
      (message.action === "delete" ||
        message.action === "update" ||
        message.action === "create")
    );
  });
};
export const getPageOffset = (state: RootState) =>
  state.application.page_offset;
export const getPageLimit = (state: RootState) => state.application.page_limit;
export const { setMessage, deleteMessage, setPageOffset, setPageLimit } =
  applicationSlice.actions;
export default applicationSlice.reducer;
