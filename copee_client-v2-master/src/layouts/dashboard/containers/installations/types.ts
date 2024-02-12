import {
  COPEE_APPLI_INSTALLATION,
  COPEE_APPLI_CLIENT,
} from "@/components/store/types";

export type InstallationData =
  | (COPEE_APPLI_INSTALLATION & { full_client_name: string })
  | (COPEE_APPLI_CLIENT & { full_client_name: string })
  | undefined;
export type InstallationListData = InstallationData[];
