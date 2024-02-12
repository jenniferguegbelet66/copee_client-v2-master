import { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { RootState, store } from "../../../../components/store";
import { useFetchClientsQuery } from "../../../../components/store/api/copee/clientsApiSlice";
import { COPEE_APPLI_CLIENT_LIST } from "../../../../components/store/types";
import { useLoaderData, useNavigate } from "react-router-dom";
import { usePageLoader } from "../../root";
import { ContextType } from "../../types";
import { ApiResponse, ClientsApiResponse } from "../../../types";
import { filterApiResponseFromReduxErrors } from "../../../../components/store/functions";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClientList from "./ClientList";
import { useSelector } from "react-redux";
import {
  StateMessage,
  deleteMessage,
  findStateMessage,
} from "@/components/store/slices/applicationSlice";
import dayjs from "dayjs";
import SnackbarAction from "@/components/ui/snackbar";

const Clients = () => {
  const [clientsData, setClientsData] = useState<COPEE_APPLI_CLIENT_LIST>([]);
  const clientsApiRes: ClientsApiResponse =
    useLoaderData() as ClientsApiResponse;
  const loader: ContextType = usePageLoader();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { refetch } = useFetchClientsQuery({ requestArgs: {} });
  const [actionData, setActionData] = useState<ApiResponse | undefined>();
  const token = useSelector((state: RootState) => state.auth.firebase.token);
  const messages = useSelector(
    (state: RootState) => state.application.messages
  );

  const handleSnackBarClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const refetchClients = async (refetchMessage: StateMessage | null) => {
    if (refetchMessage) {
      const clientsRes = await refetch();
      let apiResponse: ApiResponse | undefined;
      apiResponse = {
        message: refetchMessage.message,
        ok: true,
        status: "200",
      };
      if (clientsRes.error) {
        apiResponse = filterApiResponseFromReduxErrors(clientsRes.error);
      } 
      const deleteMessageAction: {
        payload: StateMessage;
        type: "application/deleteMessage";
      } = deleteMessage(refetchMessage);
      store.dispatch(deleteMessageAction);
      if (clientsRes.data) {
        setClientsData(clientsRes.data);
        clientsApiRes.clients = clientsRes.data;
      }
      setActionData(apiResponse);
      loader.toggleLoader(false);
    } else {
      setClientsData(clientsApiRes.clients);
      setActionData(clientsApiRes);
    }
  };

  const handleOnRefetch = async (refetchMessage: StateMessage | null) => {
    loader.toggleLoader(true);
    refetchClients(refetchMessage)
      .then(() => {
        loader.toggleLoader(false);
        setSnackbarOpen(true);
      })
      .catch((e) => {
        console.log(e);
        setSnackbarOpen(true);
      });
  };

  useEffect(() => {
    const refetchMessage: StateMessage | undefined = findStateMessage(
      messages,
      "client"
    );
    if (token === "") {
      loader.toggleLoader(true);
    }

    (async () => {
      if (token !== "") {
        await handleOnRefetch(refetchMessage ?? null);
      }
    })();
  }, [clientsApiRes, messages]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Grid container item xs={12}>
          <SnackbarAction
            snackbarOpen={snackbarOpen}
            actionData={actionData}
            handleSnackBarClose={handleSnackBarClose}
          />

          <Paper sx={{ width: "100%" }} elevation={0}>
            <Box sx={{ display: "flex", marginBottom: "50px" }}>
              <Grid item xs={2}>
                <Button
                  className="custom-button"
                  style={{
                    background: "rgb(59, 130, 246, 0.1)",
                  }}
                  onClick={async () => {
                    const message: StateMessage = {
                      date: String(dayjs()),
                      action: "update",
                      message: "la liste de clients a été mise à jour!",
                      component: "client",
                    };
                    await handleOnRefetch(message);
                  }}
                >
                  <RefreshIcon />
                </Button>
              </Grid>
              <Grid item xs={8}>
                <Typography
                  variant="h3"
                  gutterBottom
                  style={{
                    fontFamily: "lato",
                    marginTop: "10px",
                  }}
                >
                  Vos clients
                </Typography>
                <hr />
              </Grid>
              <Grid item xs={2}>
                <Button
                  className="custom-button"
                  style={{
                    background: "rgb(59, 130, 246, 0.1)",
                  }}
                  onClick={() => {
                    navigate("/dashboard/clients/new");
                  }}
                >
                  <PersonAddIcon />
                </Button>
              </Grid>
            </Box>
            {<ClientList clientsData={clientsData} loader={loader} />}
          </Paper>
        </Grid>
      </Box>
    </Container>
  );
};

export default Clients;
