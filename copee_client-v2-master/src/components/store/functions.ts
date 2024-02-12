import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { ApiResponse } from "../../layouts/types";

export const isFetchBaseQueryError = (
  error: any
): error is FetchBaseQueryError => {
  return error?.status !== undefined;
};

// filterApiResponseFromReduxErrors sets ApiResponse Object from either FetchBaseQueryError
// or SerializedError both returned by redux
export const filterApiResponseFromReduxErrors = (
  error: FetchBaseQueryError | SerializedError | undefined
): ApiResponse => {
  const response: ApiResponse = {
    message: "",
    ok: false,
    status: "",
  };
  if (isFetchBaseQueryError(error)) {
    error = error as FetchBaseQueryError;
    if ("error" in error) {
      response.message = error.error;
      response.status = error.status;
    } else {
      // If an error is returned from backend, then
      // the data structure looks like this :
      // {data: {error: "message"}, status: number}
      if ("data" in error) {
        const data: any = error.data;
        if (data && typeof data === "object" && "error" in data) {
          response.message = data.error;
        } else {
          response.message = error.data as string;
        }
        response.status = String(error.status);
      }
    }
  } else {
    error = error as SerializedError;
    response.message = error.message ? error.message : "";
    response.status = error.code ? error.code : "";
  }

  return response;
};
