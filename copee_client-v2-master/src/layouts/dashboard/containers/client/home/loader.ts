import { store } from "@/components/store";
import { clientHomesApi } from "@/components/store/api/copee/clientsHomeApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import {
  ApiResponse,
  ClientHomeWithDependenciesApiResponse,
} from "@/layouts/types";

export const clientHomeByClientLoader = async (
  clientId: string
): Promise<ClientHomeWithDependenciesApiResponse | undefined>  => {
  const clientHomeApiRes:ClientHomeWithDependenciesApiResponse  = {
    message: "",
    ok: false,
    clientHome: undefined,
    geo: undefined,
  };

  try {
    const clientHomeRes = await store.dispatch(
        clientHomesApi.endpoints.fetchClientHomeWithDependenciesByClient.initiate(
        { clientId }
      )
    );

    if (clientHomeRes.isError) {
      const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(
        clientHomeRes.error
      );
      clientHomeApiRes.message = apiResponse.message;
      clientHomeApiRes.ok = apiResponse.ok;
      clientHomeApiRes.status = apiResponse.status;
    }
    if (clientHomeRes.isSuccess) {
      clientHomeApiRes.ok = !clientHomeRes.isError;
      clientHomeApiRes.status = clientHomeRes.status;
      clientHomeApiRes.message = "Le logement a bien été chargé";
      clientHomeApiRes.clientHome = clientHomeRes.data;
    }
    return clientHomeApiRes;
  } catch (e) {
    console.log(e);
    const clientHomeApiRes: ClientHomeWithDependenciesApiResponse = {
      message: `error: ${e}}`,
      ok: false,
      clientHome: undefined,
      geo: undefined,

    };
    return clientHomeApiRes;
  }
};
