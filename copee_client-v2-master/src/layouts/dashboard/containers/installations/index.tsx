import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { RootState, store } from "../../../../components/store";
import {
  COPEE_APPLI_CLIENT,
  COPEE_APPLI_INSTALLATION,
} from "../../../../components/store/types";
import { useLoaderData, useNavigate } from "react-router-dom";
import { usePageLoader } from "../../root";
import { ContextType } from "../../types";
import { ApiResponse, InstallationsApiResponse } from "../../../types";
import { filterApiResponseFromReduxErrors } from "../../../../components/store/functions";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSelector } from "react-redux";
import {
  StateMessage,
  deleteMessage,
  findStateMessage,
} from "@/components/store/slices/applicationSlice";
import { useFetchInstallationsQuery } from "@/components/store/api/copee/installationsApiSlice";
import InstallationList from "./InstallationList";
import dayjs from "dayjs";
import { InstallationListData } from "./types";
import { clientsLoader } from "../clients/loader";
import { Clients } from "@/lib/Clients";

const Installations = () => {
  const [installationListData, setInstallationListData] =
    useState<InstallationListData>([]);
  const installationsApiRes: InstallationsApiResponse =
    useLoaderData() as InstallationsApiResponse;
  const loader: ContextType = usePageLoader();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { refetch } = useFetchInstallationsQuery({ requestArgs: {} });
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

  const refetchInstallations = async (refetchMessage: StateMessage | null) => {
    // buildInstallationData sets an InstallationData object (see types in installations folder)
    // This object can then be send to the InstallationList component correctly with all
    // the needed properties to be displayed in the data table ("nom client for instance").
    const buildInstallationData = async () => {
      const newInstallationListData = installationsApiRes.installations.map(
        (install: COPEE_APPLI_INSTALLATION) => {
          return { ...install, full_client_name: "" };
        }
      );
      const clientsRes = await clientsLoader();
      if (clientsRes?.ok) {
        const clients: Clients = new Clients(clientsRes.clients);
        const newInstallationListWithClients = newInstallationListData.map(
          (installData: COPEE_APPLI_INSTALLATION) => {
            const client: COPEE_APPLI_CLIENT | undefined =
              clients.findClientById(installData.ci_client_id);
            if (client) {
              return {
                ...installData,
                ...client,
                full_client_name: `${client.client_first_name} ${client.client_last_name}`,
              };
            }
          }
        );
        if (newInstallationListWithClients) {
          setInstallationListData(newInstallationListWithClients);
        }
        // CLIENT PART
      } else {
        setInstallationListData(newInstallationListData);
      }
    };

    if (refetchMessage) {
      let apiResponse: ApiResponse | undefined;
      const installationsRes = await refetch();
      apiResponse = {
        message: refetchMessage.message,
        ok: true,
        status: "200",
      };
      if (installationsRes.error) {
        apiResponse = filterApiResponseFromReduxErrors(installationsRes.error);
      } 
      const deleteMessageAction: {
        payload: StateMessage;
        type: "application/deleteMessage";
      } = deleteMessage(refetchMessage);
      store.dispatch(deleteMessageAction);
      if (installationsRes.data) {
        buildInstallationData();
        installationsApiRes.installations = installationsRes.data;
      }
      setActionData(apiResponse);
      loader.toggleLoader(false);
    } else {
      buildInstallationData();
      setActionData(installationsApiRes);
    }
  };

  const handleOnRefetch = async (refetchMessage: StateMessage | null) => {
    loader.toggleLoader(true);
    refetchInstallations(refetchMessage ?? null)
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
      "installation"
    );

    if (token === "") {
      loader.toggleLoader(true);
    }

    (async () => {
      if (token !== "") {
        await handleOnRefetch(refetchMessage ?? null);
      }
    })();
  }, [installationsApiRes, location.search, messages]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Grid container item xs={12}>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            message={actionData ? actionData.message : ""}
            onClose={handleSnackBarClose}
          >
            <Alert
              onClose={handleSnackBarClose}
              severity={
                actionData ? (actionData.ok ? "success" : "error") : "info"
              }
              sx={{ width: "100%" }}
            >
              {actionData ? actionData.message : ""}
            </Alert>
          </Snackbar>

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
                      message: "la liste des installations a été mise à jour!",
                      component: "installation",
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
                  Vos dossiers
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
                    navigate("/client/new");
                  }}
                >
                  <AddBusinessIcon />
                </Button>
              </Grid>
            </Box>
            {
              <InstallationList
                installationsListData={installationListData}
                loader={loader}
              />
            }
          </Paper>
        </Grid>
      </Box>
    </Container>
  );
};

export default Installations;
