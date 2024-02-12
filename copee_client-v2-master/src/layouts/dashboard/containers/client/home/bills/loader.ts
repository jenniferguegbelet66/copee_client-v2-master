import { store } from "@/components/store";
import { clientHomeBillsApi } from "@/components/store/api/copee/clientsHomeBillApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { ApiResponse, ClientHomeBillsApiResponse } from "@/layouts/types";

export const clientHomeBillsByHomeLoader = async (
  homeID: string
): Promise<ClientHomeBillsApiResponse | undefined> => {
  const clientHomeBillApiRes: ClientHomeBillsApiResponse = {
    message: "",
    ok: false,
    clientHomeBills: undefined,
  };

  try {
    const clientHomeRes = await store.dispatch(
      clientHomeBillsApi.endpoints.fetchClientHomeBillByHome.initiate({
        homeID,
      })
    );

    if (clientHomeRes.isError) {
      const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(
        clientHomeRes.error
      );
      clientHomeBillApiRes.message = apiResponse.message;
      clientHomeBillApiRes.ok = apiResponse.ok;
      clientHomeBillApiRes.status = apiResponse.status;
    }
    if (clientHomeRes.isSuccess) {
      clientHomeBillApiRes.ok = !clientHomeRes.isError;
      clientHomeBillApiRes.status = clientHomeRes.status;
      clientHomeBillApiRes.message =
        "Les factures du logement ont bien été chargées";
      clientHomeBillApiRes.clientHomeBills = clientHomeRes.data;
    }
    return clientHomeBillApiRes;
  } catch (e) {
    console.log(e);
    const clientHomeBillApiRes: ClientHomeBillsApiResponse = {
      message: `error: ${e}}`,
      ok: false,
      clientHomeBills: undefined,
    };
    return clientHomeBillApiRes;
  }
};
