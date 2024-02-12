import { store } from "@/components/store";
import { installationsVersionsApi } from "@/components/store/api/copee/installationsVersionsApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { InstallationVersionApiVersion, ApiResponse } from "@/layouts/types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const versionsByInstallationLoader = async (installation_id: string) => {
    const ivApiRes: InstallationVersionApiVersion = {
      message: "",
      ok: false,
      status: "",
      installationsVersions: [],
    };
  
    try {
      const ivRes = await store.dispatch(
        installationsVersionsApi.endpoints.fetchInstallationsVersionsByInstallation.initiate({
          installationId: installation_id, requestArgs: {},
        })
      );
      if (ivRes.data) {
        ivApiRes.installationsVersions = ivRes.data;
        ivApiRes.ok = true;
        ivApiRes.status = ivRes.status;
        ivApiRes.message = "La liste des versions a été chargée";
      } else {
        const error: FetchBaseQueryError | SerializedError | undefined =
          ivRes.error;
        const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(error);
        ivApiRes.message = apiResponse.message;
        ivApiRes.ok = apiResponse.ok;
        ivApiRes.status = apiResponse.status ?? "";
      }
      return ivApiRes;
    } catch (e) {
      console.log(e);
      return null;
    }
  };