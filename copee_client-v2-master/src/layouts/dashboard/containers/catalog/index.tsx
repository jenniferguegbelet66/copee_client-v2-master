import { COPEE_CATALOG_WITH_DEPENDENCIES } from "@/components/store/types";
import { Pagination } from "@/components/ui/pagination";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

export default function Catalogue() {
  const params = {
    page_offset: "0",
    page_size: "5",
  };

  const catalogueApiRes: COPEE_CATALOG_WITH_DEPENDENCIES | undefined =
    useLoaderData() as COPEE_CATALOG_WITH_DEPENDENCIES;

  useEffect(() => {
    console.log(catalogueApiRes);
  }, [catalogueApiRes]);

  return (
    <>
      <Pagination />
    </>
  );
}
