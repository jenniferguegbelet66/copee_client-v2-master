import { RootState, store } from "@/components/store";
import { useFetchInstallationsVersionsQuery } from "@/components/store/api/copee/installationsVersionsApiSlice";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { usePageLoader } from "@/layouts/dashboard/root";
import { ApiResponse, InstallationVersionApiVersion } from "@/layouts/types";
import { useEffect, useState } from "react";
import { ContextType } from "../../../types";
import {
  StateMessage,
  deleteMessage,
  findStateMessage,
  getMessages,
} from "@/components/store/slices/applicationSlice";
import { COPEE_APPLI_INSTALLATION_VERSION_LIST } from "@/components/store/types";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import dayjs from "dayjs";
import SnackbarAction from "@/components/ui/snackbar";
import InstallationVersionList from "./versionsList";
import { useSelector } from "react-redux";
import { AddBusiness } from "@mui/icons-material";

const InstallationsVersions = () => {
  const params = useParams();
  const loader: ContextType = usePageLoader();
  const [ivListData, setIvListData] =
    useState<COPEE_APPLI_INSTALLATION_VERSION_LIST>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const messages: StateMessage[] = getMessages(store.getState());
  const stateRefetchMessage: StateMessage | undefined = findStateMessage(
    messages,
    "installations_versions"
  );
  const [refetchMessage, setRefetchMessage] = useState<
    StateMessage | undefined
  >(stateRefetchMessage);
  const { refetch } = useFetchInstallationsVersionsQuery({
    requestArgs: { by_installation_id: String(params.installation_id) },
  });
  const ivApiRes: InstallationVersionApiVersion =
    useLoaderData() as InstallationVersionApiVersion;
  const [actionData, setActionData] = useState<ApiResponse | undefined>();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.firebase.token);

  const handleOnRefetch = async () => {
    loader.toggleLoader(true);
    refetchInstallationsVersions()
      .then(() => {
        loader.toggleLoader(false);
        setSnackbarOpen(true);
      })
      .catch((e) => {
        console.log(e);
        setSnackbarOpen(true);
      });
  };

  const refetchInstallationsVersions = async () => {
    if (refetchMessage) {
      let apiResponse: ApiResponse | undefined;
      const ivRes = await refetch();
      apiResponse = {
        message: refetchMessage.message,
        ok: true,
        status: "200",
      };
      if (ivRes.error) {
        apiResponse = filterApiResponseFromReduxErrors(ivRes.error);
      }
      const deleteMessageAction: {
        payload: StateMessage;
        type: "application/deleteMessage";
      } = deleteMessage(refetchMessage);
      store.dispatch(deleteMessageAction);
      if (ivRes.data) {
        setIvListData(ivRes.data);
        ivApiRes.installationsVersions = ivRes.data;
        setActionData(apiResponse);
      }
      loader.toggleLoader(false);
    } else {
      setIvListData(ivApiRes.installationsVersions);
      setActionData(ivApiRes);
    }
  };

  const handleSnackBarClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (token === "") {
      loader.toggleLoader(true);
    }

    (async () => {
      if (token !== "") {
        await handleOnRefetch();
      }
    })();
  }, [ivApiRes, location.search, refetchMessage]);

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
                      message: "la liste de a été mise à jour!",
                      component: "client",
                    };
                    setRefetchMessage(message);
                    await handleOnRefetch();
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
                  Dossier n° {params.installation_id}
                </Typography>
                <hr />
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{
                    fontFamily: "lato",
                    marginTop: "10px",
                  }}
                >
                  Versions
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Button
                  className="custom-button"
                  style={{
                    background: "rgb(59, 130, 246, 0.1)",
                  }}
                  onClick={() => {
                    const url = `/dossier/${params.installation_id}/version/new`;
                    navigate(url);
                  }}
                >
                  <AddBusiness />
                </Button>
              </Grid>
            </Box>
            {
              <InstallationVersionList
                ivListData={ivListData}
                loader={loader}
              />
            }
          </Paper>
        </Grid>
      </Box>
    </Container>
  );
};

export default InstallationsVersions;
