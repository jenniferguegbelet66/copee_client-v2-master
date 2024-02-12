import { store } from "@/components/store";
import { clientsApi } from "@/components/store/api/copee/clientsApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { ClientsApiResponse, ApiResponse } from "@/layouts/types";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const clientsLoader = async () => {
  const clientsApiRes: ClientsApiResponse = {
    message: "",
    ok: false,
    status: "",
    clients: [],
  };

  try {
    const clientsRes = await store.dispatch(
      clientsApi.endpoints.fetchClients.initiate({ requestArgs: {} })
    );
    if (clientsRes.data) {
      clientsApiRes.clients = clientsRes.data;
      clientsApiRes.ok = true;
      clientsApiRes.status = clientsRes.status;
      clientsApiRes.message = "La liste de clients a été chargée";
      return clientsApiRes;
    } else {
      const error: FetchBaseQueryError | SerializedError | undefined =
        clientsRes.error;
      const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(error);
      clientsApiRes.message = apiResponse.message;
      clientsApiRes.ok = apiResponse.ok;
      clientsApiRes.status = apiResponse.status ?? "";
    }
    return clientsApiRes;
  } catch (e: any) {
    return null;
  }
};
