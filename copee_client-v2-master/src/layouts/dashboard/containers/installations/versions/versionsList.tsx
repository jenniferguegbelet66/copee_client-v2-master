import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import { getColumns } from "./columns";
import { DataTable } from "./dataTable";
import { COPEE_APPLI_INSTALLATION_VERSION_LIST } from "@/components/store/types";
import { ContextType } from "../../../types";

type Props = {
  ivListData: COPEE_APPLI_INSTALLATION_VERSION_LIST;
  loader: ContextType;
};
const InstallationVersionList: React.FC<Props> = ({ ivListData, loader }) => {
  return ivListData?.length > 0 ? (
    <Container>
      <div id="iv-container">
        <Grid item xs={12}>
          <DataTable columns={getColumns()} data={ivListData} />
        </Grid>
      </div>
    </Container>
  ) : !loader.loader ? (
    <Container>
      <h1>Aucune version </h1>
    </Container>
  ) : (
    <>
      <Typography variant="body1">Chargement...</Typography>
      <CircularProgress />
    </>
  );
};

export default InstallationVersionList;
