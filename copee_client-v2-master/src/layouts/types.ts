import {
  COPEE_APPLI_CLIENT_ASS_LIST,
  COPEE_APPLI_CLIENT_HOME,
  COPEE_APPLI_CLIENT_HOME_BILLS,
  COPEE_APPLI_CLIENT_HOME_EQUIPMENT_LIST,
  COPEE_APPLI_CLIENT_HOME_WITH_DEPENDENCIES,
  COPEE_APPLI_CLIENT_LIST,
  COPEE_APPLI_CLIENT_WITH_DEPENDENCIES,
  COPEE_APPLI_GEO,
  COPEE_APPLI_INSTALLATION_LIST,
  COPEE_APPLI_INSTALLATION_VERSION_LIST,
  COPEE_APPLI_USER,
} from "../components/store/types";
import { ClientValidationErrors } from "../lib/validation";

export type ApiResponse = {
  message: string;
  ok: boolean;
  status?: string;
};

export type ClientsApiResponse = ApiResponse & {
  clients: COPEE_APPLI_CLIENT_LIST;
};

export type UserApiResponse = ApiResponse & {
  user: COPEE_APPLI_USER | undefined;
};

export type ClientApiResponse = ApiResponse & {
  clientValidationErrors: ClientValidationErrors;
};

export type ClientHomeApiResponse = ApiResponse & {
  clientHome: COPEE_APPLI_CLIENT_HOME | undefined;
};

export type ClientHomeBillsApiResponse = ApiResponse & {
  clientHomeBills: COPEE_APPLI_CLIENT_HOME_BILLS | undefined;
};

export type ClientHomeEquipmentsApiResponse = ApiResponse & {
  clientHomeEquipments: COPEE_APPLI_CLIENT_HOME_EQUIPMENT_LIST | undefined;
};

export type ClientHomeWithDependenciesApiResponse = ApiResponse & {
  clientHome: COPEE_APPLI_CLIENT_HOME_WITH_DEPENDENCIES | undefined;
  geo: COPEE_APPLI_GEO | undefined;
};

export type ClientAssApiResponse = ApiResponse & {
  clientAssList: COPEE_APPLI_CLIENT_ASS_LIST | undefined;
};

export type GeneralApiResponse = {
  errors: {};
  apiresponse: ApiResponse;
  data: any;
};

export type InstallationVersionApiVersion = ApiResponse & {
  installationsVersions: COPEE_APPLI_INSTALLATION_VERSION_LIST;
};

export type InstallationsApiResponse = {
  message: string;
  ok: boolean;
  status: string;
  installations: COPEE_APPLI_INSTALLATION_LIST;
};

export type ClientsWithDependenciesApiResponse = ApiResponse & {
  clientWithDependencies: COPEE_APPLI_CLIENT_WITH_DEPENDENCIES | undefined;
};
