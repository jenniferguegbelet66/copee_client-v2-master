import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import { getColumns } from "./columns";
import { DataTable } from "./dataTable";
import { ContextType } from "../../types";
import { InstallationListData } from "./types";

type Props = {
  installationsListData: InstallationListData;
  loader: ContextType;
};
const InstallationList: React.FC<Props> = ({
  installationsListData,
  loader,
}) => {
  return installationsListData?.length > 0 ? (
    <Container>
      <div id="clients-container">
        <Grid item xs={12}>
          <DataTable columns={getColumns()} data={installationsListData} />
        </Grid>
      </div>
    </Container>
  ) : !loader.loader ? (
    <Container>
      <h1>Aucune installation</h1>
    </Container>
  ) : (
    <>
      <Typography variant="body1">Chargement...</Typography>
      <CircularProgress />
    </>
  );
};

export default InstallationList;
