import { store } from "@/components/store";
import { clientsAssApi } from "@/components/store/api/copee/clientsAssApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { ApiResponse, ClientAssApiResponse } from "@/layouts/types";

export const clientAssListByClientLoader = async (
  clientID: string
): Promise<ClientAssApiResponse | undefined> => {
  const clientAssApiRes: ClientAssApiResponse = {
    message: "",
    ok: false,
    clientAssList: undefined,
  };

  try {
    const clientAssRes = await store.dispatch(
      clientsAssApi.endpoints.fetchClientAssListByClient.initiate({
        clientId: clientID,
      })
    );

    if (clientAssRes.isError) {
      const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(
        clientAssRes.error
      );
      clientAssApiRes.message = apiResponse.message;
      clientAssApiRes.ok = apiResponse.ok;
      clientAssApiRes.status = apiResponse.status;
    }
    if (clientAssRes.isSuccess) {
      clientAssApiRes.ok = !clientAssRes.isError;
      clientAssApiRes.status = clientAssRes.status;
      clientAssApiRes.message = "Le(s) sav(s) ont bien été chargés";
      clientAssApiRes.clientAssList = clientAssRes.data;
    }
    return clientAssApiRes;
  } catch (e) {
    console.log(e);
    const clientAssApiRes: ClientAssApiResponse = {
      message: `error: ${e}}`,
      ok: false,
      clientAssList: undefined,
    };
    return clientAssApiRes;
  }
};
