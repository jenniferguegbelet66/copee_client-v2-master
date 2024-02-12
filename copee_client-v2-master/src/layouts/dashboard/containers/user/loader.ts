import { store } from "@/components/store";
import { usersApi } from "@/components/store/api/copee/usersApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { ApiResponse, UserApiResponse } from "@/layouts/types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const userLoader = async (user_id: string) => {
  const userApiRes: UserApiResponse = {
    message: "",
    ok: false,
    status: "",
    user: undefined,
  };

  try {
    const userRes = await store.dispatch(
      usersApi.endpoints.fetchUserByID.initiate({ userId: user_id })
    );
    if (userRes.data) {
      userApiRes.user = userRes.data;
      userApiRes.ok = true;
      userApiRes.status = userRes.status;
      userApiRes.message = "L'utilisateur a  été chargée";
      return userApiRes;
    } else {
      const error: FetchBaseQueryError | SerializedError | undefined =
        userRes.error;
      const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(error);
      userApiRes.message = apiResponse.message;
      userApiRes.ok = apiResponse.ok;
      userApiRes.status = apiResponse.status ?? "";
    }
    return userApiRes;
  } catch (e: any) {
    return null;
  }
};
