import { store } from "@/components/store";
import { installationsApi } from "@/components/store/api/copee/installationsApiSlice";
import { COPEE_APPLI_INSTALLATION } from "@/components/store/types";

export const loader = async (
  installationID: string
): Promise<COPEE_APPLI_INSTALLATION | null> => {
  try {
    const installRes = await store.dispatch(
      installationsApi.endpoints.fetchInstallationByID.initiate({
        installationID,
      })
    );
    return installRes.data ?? null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
