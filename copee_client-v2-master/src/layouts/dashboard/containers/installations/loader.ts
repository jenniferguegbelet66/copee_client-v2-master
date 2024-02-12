import { store } from "@/components/store";
import { installationsApi } from "@/components/store/api/copee/installationsApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { InstallationsApiResponse, ApiResponse } from "@/layouts/types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const loader = async () => {
  const installationsApiRes: InstallationsApiResponse = {
    message: "",
    ok: false,
    status: "",
    installations: [],
  };

  try {
    const installationsRes = await store.dispatch(
      installationsApi.endpoints.fetchInstallations.initiate({
        requestArgs: {},
      })
    );
    if (installationsRes.data) {
      installationsApiRes.installations = installationsRes.data;
      installationsApiRes.ok = true;
      installationsApiRes.status = installationsRes.status;
      installationsApiRes.message = "La liste des installations a été chargée";

      return installationsApiRes;
    } else {
      const error: FetchBaseQueryError | SerializedError | undefined =
        installationsRes.error;
      const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(error);
      installationsApiRes.message = apiResponse.message;
      installationsApiRes.ok = apiResponse.ok;
      installationsApiRes.status = apiResponse.status ?? "";
      return installationsApiRes;
    }
  } catch (e: any) {
    return null;
  }
};
