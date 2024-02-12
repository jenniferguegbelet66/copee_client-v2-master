import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import { getColumns } from "./columns";
import { DataTable } from "./dataTable";
import { COPEE_APPLI_CLIENT_LIST } from "@/components/store/types";
import { ContextType } from "../../types";

type Props = {
  clientsData: COPEE_APPLI_CLIENT_LIST;
  loader: ContextType;
};
const ClientsList: React.FC<Props> = ({ clientsData, loader }) => {
  return clientsData?.length > 0 ? (
    <Container>
      <div id="clients-container">
        <Grid item xs={12}>
          <DataTable columns={getColumns()} data={clientsData} />
        </Grid>
      </div>
    </Container>
  ) : !loader.loader ? (
    <Container>
      <h1>Aucun client</h1>
    </Container>
  ) : (
    <>
      <Typography variant="body1">Chargement...</Typography>
      <CircularProgress />
    </>
  );
};

export default ClientsList;
