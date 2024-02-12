import { store } from "@/components/store";
import { clientsApi } from "@/components/store/api/copee/clientsApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import {
  ApiResponse,
  ClientsWithDependenciesApiResponse,
} from "@/layouts/types";

export const loader = async (
  clientId: string
): Promise<ClientsWithDependenciesApiResponse | undefined> => {
  const clientWithDepsApiRes: ClientsWithDependenciesApiResponse = {
    message: "",
    ok: false,
    clientWithDependencies: undefined,
  };

  try {
    const clientWithDepenciesRes = await store.dispatch(
      clientsApi.endpoints.fetchClientWithDependenciesByID.initiate({
        clientId,
      })
    );

    if (clientWithDepenciesRes.isError) {
      const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(
        clientWithDepenciesRes.error
      );
      clientWithDepsApiRes.message = apiResponse.message;
      clientWithDepsApiRes.ok = apiResponse.ok;
      clientWithDepsApiRes.status = apiResponse.status;
    }
    if (clientWithDepenciesRes.isSuccess) {
      clientWithDepsApiRes.ok = !clientWithDepenciesRes.isError;
      clientWithDepsApiRes.status = clientWithDepenciesRes.status;
      clientWithDepsApiRes.message = "Le client a bien été chargé";
      clientWithDepsApiRes.clientWithDependencies = clientWithDepenciesRes.data;
    }
    return clientWithDepsApiRes;
  } catch (e) {
    console.log(e);
    const clientWithDepsApiRes: ClientsWithDependenciesApiResponse = {
      message: `error: ${e}}`,
      ok: false,
      clientWithDependencies: undefined,
    };
    return clientWithDepsApiRes;
  }
};
