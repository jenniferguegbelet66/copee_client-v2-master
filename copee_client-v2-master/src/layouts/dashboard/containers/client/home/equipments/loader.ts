import { store } from "@/components/store";
import { clientHomeEquipmentsApi } from "@/components/store/api/copee/clientsHomeEquipmentApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { ApiResponse, ClientHomeEquipmentsApiResponse } from "@/layouts/types";

export const clientHomeEquipmentsByHomeLoader = async (
  homeID: string
): Promise<ClientHomeEquipmentsApiResponse | undefined> => {
  const clientHomeEqmtApiRes: ClientHomeEquipmentsApiResponse = {
    message: "",
    ok: false,
    clientHomeEquipments: undefined,
  };

  try {
    const clientHomeEqmtRes = await store.dispatch(
      clientHomeEquipmentsApi.endpoints.fetchClientHomeEquipmentsByHome.initiate(
        {
          homeID,
        }
      )
    );

    if (clientHomeEqmtRes.isError) {
      const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(
        clientHomeEqmtRes.error
      );
      clientHomeEqmtApiRes.message = apiResponse.message;
      clientHomeEqmtApiRes.ok = apiResponse.ok;
      clientHomeEqmtApiRes.status = apiResponse.status;
    }
    if (clientHomeEqmtRes.isSuccess) {
      clientHomeEqmtApiRes.ok = !clientHomeEqmtRes.isError;
      clientHomeEqmtApiRes.status = clientHomeEqmtRes.status;
      clientHomeEqmtApiRes.message =
        "Les équipments du logement ont bien été chargés";
      clientHomeEqmtApiRes.clientHomeEquipments = clientHomeEqmtRes.data;
    }
    return clientHomeEqmtApiRes;
  } catch (e) {
    console.log(e);
    const clientHomeEqmtApiRes: ClientHomeEquipmentsApiResponse = {
      message: `error: ${e}}`,
      ok: false,
      clientHomeEquipments: undefined,
    };
    return clientHomeEqmtApiRes;
  }
};
