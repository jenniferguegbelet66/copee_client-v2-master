import { catalogueApi } from "@/components/store/api/copee/catalogApiSlice";
import { store } from "@/components/store";

export const catalogueLoader = async () => {
  const catalogueApiRes = {
    message: "",
    ok: false,
    status: "",
    catalog: {},
  };

  try {
    const catalogueRes = await store.dispatch(
      catalogueApi.endpoints.fetchCatalogWithDeps.initiate({
        requestArgs: {
          dependencies: "all",
        },
      })
    );
    if (catalogueRes.data) {
      catalogueApiRes.catalog = catalogueRes.data;
      catalogueApiRes.ok = true;
      catalogueApiRes.status = catalogueRes.status;
      catalogueApiRes.message = "Le catalogue a été chargé";
    }
    return catalogueApiRes;
  } catch (e: any) {
    return null;
  }
};
