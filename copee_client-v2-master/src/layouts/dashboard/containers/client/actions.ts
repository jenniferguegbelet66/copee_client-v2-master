import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { redirect } from "react-router-dom";
import { store } from "../../../../components/store";
import { clientsApi } from "../../../../components/store/api/copee/clientsApiSlice";
import { filterApiResponseFromReduxErrors } from "../../../../components/store/functions";
import { COPEE_APPLI_CLIENT } from "../../../../components/store/types";
import { formatDateForBackend } from "../../../../lib/date";
import {
  FormDataValidator,
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
  validateFiscalYearIncome,
  ClientValidationErrors,
  validateDatas,
  // validateDate,
} from "../../../../lib/validation";
import { ClientApiResponse, ApiResponse } from "../../../types";
import {
  StateMessage,
  setMessage,
} from "@/components/store/slices/applicationSlice";
import dayjs from "dayjs";

export async function deleteClientAction({
  params,
}: {
  request: Request;
  params: any;
}) {
  const clientId: number = params.client_id;
  const res = await store.dispatch(
    clientsApi.endpoints.deleteClient.initiate({
      clientId: String(clientId),
    })
  );
  const clientMessage: StateMessage = {
    date: String(dayjs()),
    action: "delete",
    message: "le client a bien été supprimé",
    component: "client",
  };
  const installationMessage: StateMessage = {
    date: String(dayjs()),
    action: "delete",
    message: "l'installation a bien été supprimée",
    component: "installation",
  };
  return handleResponse(res, String(clientId), [
    clientMessage,
    installationMessage,
  ]);
}

export async function editClientAction({
  request,
  params,
}: {
  request: Request;
  params: any;
}) {
  const { formData, dataValidationErrors } = await handleFormData(request);
  clientApiResponse.clientValidationErrors = dataValidationErrors;
  const formDatas: ClientFormDataEntryValues = getFormDataEntryValue(formData);
  const client: COPEE_APPLI_CLIENT = setClient(formDatas);

  try {
    if (params && params.client_id) {
      const clientId: string = params.client_id;
      const updatedClientRes = await store.dispatch(
        clientsApi.endpoints.updateClient.initiate({
          client: client,
          clientId: clientId,
        })
      );
      const message: StateMessage = {
        date: String(dayjs()),
        action: "update",
        message: "le client a bien été mis à jour",
        component: "client",
      };
      return handleResponse(updatedClientRes, clientId, [message]);
    } else {
      const newClientRes:
        | {
            data: any;
          }
        | {
            error: FetchBaseQueryError | SerializedError;
          } = await store.dispatch(
        clientsApi.endpoints.addNewClient.initiate({
          client: client,
        })
      );
      const clientMessage: StateMessage = {
        date: String(dayjs()),
        action: "create",
        message: "Le client a bien été créé",
        component: "client",
      };
      const installationMessage: StateMessage = {
        date: String(dayjs()),
        action: "create",
        message: "l'installation a bien été créée",
        component: "installation",
      };
      return handleResponse(newClientRes, null, [
        clientMessage,
        installationMessage,
      ]);
    }
  } catch (e: any) {
    console.log("error:", e);
  }
  return null;
}

const setClient = (
  formDatas: ClientFormDataEntryValues
): COPEE_APPLI_CLIENT => {
  const client: COPEE_APPLI_CLIENT = {
    client_first_name: formDatas.firstName as string,
    client_last_name: formDatas.lastname as string,
    client_birthdate: `${formatDateForBackend(formDatas.birthdate as string)}`,
    client_phone: formDatas.phone as string,
    client_email: formDatas.email as string,
    client_fiscal_year_income: Number(formDatas.fiscalYearIncome as string),
  };
  return client;
};

const handleFormData = async (
  request: Request
): Promise<{
  formData: FormData;
  dataValidationErrors: ClientValidationErrors;
}> => {
  const formData: FormData = await request.formData();
  const dataValidationErrors: ClientValidationErrors = validateDatas(
    formData,
    formDataValidator
  );
  clientApiResponse.clientValidationErrors = dataValidationErrors;

  return { formData, dataValidationErrors };
};
const getFormDataEntryValue = (
  formData: FormData
): ClientFormDataEntryValues => {
  const firstName: FormDataEntryValue | null = formData.get("firstName");
  const lastname: FormDataEntryValue | null = formData.get("lastName");
  const email: FormDataEntryValue | null = formData.get("email");
  const phone: FormDataEntryValue | null = formData.get("phone");
  const fiscalYearIncome: FormDataEntryValue | null =
    formData.get("fiscalYearIncome");
  const birthdate: FormDataEntryValue | null = formData.get("birthdate");

  return { firstName, lastname, email, phone, fiscalYearIncome, birthdate };
};

const handleResponse = (
  clientRes:
    | {
        data: any;
      }
    | {
        error: FetchBaseQueryError | SerializedError;
      },
  clientId: string | null,
  messages?: StateMessage[]
) => {
  if ("error" in clientRes) {
    const apiResponse: ApiResponse = filterApiResponseFromReduxErrors(
      clientRes.error
    );
    clientApiResponse.apiresponse = apiResponse;
    return clientApiResponse;
  } else if ("data" in clientRes) {
    const clientIdInPath = clientId ? `client_id=${clientId}` : "";

    if (messages && messages.length > 0) {
      messages.forEach((message: StateMessage) => {
        const setMessageAction: {
          payload: StateMessage;
          type: "application/setMessage";
        } = setMessage(message);
        store.dispatch(setMessageAction);
      });
    }
    return redirect(`/dashboard/clients?${clientIdInPath}`);
  }
};

const formDataValidator: FormDataValidator[] = [
  {
    firstName: {
      dataValidatorFunc: validateFirstName,
      message: "Prénom incorrect",
    },
  },
  {
    lastName: {
      dataValidatorFunc: validateLastName,
      message: "Nom incorrect",
    },
  },
  { email: { dataValidatorFunc: validateEmail, message: "email incorrect" } },
  {
    phone: {
      dataValidatorFunc: validatePhone,
      message: "téléphone incorrect",
    },
  },
  {
    fiscalYearIncome: {
      dataValidatorFunc: validateFiscalYearIncome,
      message: "revenu incorrect",
    },
  },
  // {
  //   birthdate: {
  //     dataValidatorFunc: validateDate,
  //     message: "Date incorrecte",
  //   },
  // },
];

const clientApiResponse: ClientApiResponse = {
  clientValidationErrors: {},
  apiresponse: { message: "", ok: false, status: "" },
};

export type ClientFormDataEntryValues = {
  firstName: FormDataEntryValue | null;
  lastname: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  phone: FormDataEntryValue | null;
  fiscalYearIncome: FormDataEntryValue | null;
  birthdate: FormDataEntryValue | null;
};
