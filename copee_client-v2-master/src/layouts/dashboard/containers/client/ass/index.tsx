import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import { ApiResponse, ClientAssApiResponse } from "@/layouts/types";
import { useEffect, useState } from "react";
import {
  COPEE_APPLI_CLIENT_ASS,
  COPEE_APPLI_CLIENT_ASS_LIST,
} from "@/components/store/types";
import {
  StateMessage,
  deleteMessage,
  findStateMessage,
} from "@/components/store/slices/applicationSlice";
import RefreshIcon from "@mui/icons-material/Refresh";
import { usePageLoader } from "@/layouts/dashboard/root";
import { ContextType } from "@/layouts/dashboard/types";
import { filterApiResponseFromReduxErrors } from "@/components/store/functions";
import { RootState, store } from "@/components/store";
import SnackbarAction from "@/components/ui/snackbar";
import { useSelector } from "react-redux";
import { useFetchClientAssListByClientQuery } from "@/components/store/api/copee/clientsAssApiSlice";
import React from "react";

export default function ClientAss() {
  const clientAssApiRes: ClientAssApiResponse | undefined =
    useLoaderData() as ClientAssApiResponse;
  const [clientAssList, setClientAssList] =
    useState<COPEE_APPLI_CLIENT_ASS_LIST>();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const loader: ContextType = usePageLoader();
  const { refetch } = useFetchClientAssListByClientQuery({
    clientId: params.client_id ?? "",
  });
  const [actionData, setActionData] = useState<ApiResponse | undefined>();
  const token = useSelector((state: RootState) => state.auth.firebase.token);
  const messages = useSelector(
    (state: RootState) => state.application.messages
  );

  const refetchClientAss = async (refetchMessage: StateMessage | null) => {
    if (refetchMessage) {
      const clientAssRes = await refetch();
      let apiResponse: ApiResponse | undefined;
      apiResponse = {
        message: refetchMessage.message,
        ok: true,
        status: "200",
      };
      if (clientAssRes.error) {
        apiResponse = filterApiResponseFromReduxErrors(clientAssRes.error);
      }
      const deleteMessageAction: {
        payload: StateMessage;
        type: "application/deleteMessage";
      } = deleteMessage(refetchMessage);
      store.dispatch(deleteMessageAction);
      if (clientAssRes.data) {
        setClientAssList(clientAssRes.data);
        clientAssApiRes.clientAssList = clientAssApiRes.clientAssList;
      }
      setActionData(apiResponse);
      loader.toggleLoader(false);
    } else {
      setClientAssList(clientAssApiRes.clientAssList);
      setActionData(clientAssApiRes);
    }
  };

  const handleOnRefetch = async (refetchMessage: StateMessage | null) => {
    loader.toggleLoader(true);
    refetchClientAss(refetchMessage)
      .then(() => {
        loader.toggleLoader(false);
        setSnackbarOpen(true);
      })
      .catch((e) => {
        console.log(e);
        setSnackbarOpen(true);
      });
  };

  const handleSnackBarClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const refetchMessage: StateMessage | undefined = findStateMessage(
      messages,
      "home"
    );
    if (token === "") {
      loader.toggleLoader(true);
    }

    (async () => {
      if (token !== "") {
        await handleOnRefetch(refetchMessage ?? null);
      }
    })();
  }, [clientAssApiRes, messages]);

  const renderClientAssList = () => {
    if (clientAssList && clientAssList.length > 0) {
      return clientAssList?.map((clientAss: COPEE_APPLI_CLIENT_ASS) => {
        return (
          <List
            sx={{
              bgcolor: "background.paper",
            }}
            key={clientAss.ca_id}
          >
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="SAV N°"
                sx={{ textAlign: "center", fontWeight: "bold" }}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="h4"
                      color="text.primary"
                    >
                      {clientAss.ca_id}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Résolu"
                sx={{ textAlign: "center" }}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {clientAss.ca_is_resolved ? "oui" : "non"}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Raison"
                sx={{ textAlign: "center" }}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {clientAss.ca_call_reason}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Commentaire"
                sx={{ textAlign: "center" }}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {clientAss.ca_comment}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Date d'appel"
                sx={{ textAlign: "center" }}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {dayjs(clientAss.ca_call_date).format(
                        "dddd, D MMMM YYYY"
                      )}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Date d'intervention"
                sx={{ textAlign: "center" }}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {dayjs(clientAss.ca_intervention_date).format(
                        "dddd, D MMMM YYYY"
                      )}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            {clientAssList.length > 0 ? <hr /> : <></>}
          </List>
        );
      });
    }

    return <></>;
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <SnackbarAction
          snackbarOpen={snackbarOpen}
          actionData={actionData}
          handleSnackBarClose={handleSnackBarClose}
        />
        <div className="client-home-container space-y-6">
          <div style={{ marginBottom: "50px", borderBottom: "1px solid" }}>
            <Button
              className="custom-button"
              style={{
                background: "rgb(59, 130, 246, 0.1)",
              }}
              onClick={async () => {
                const message: StateMessage = {
                  date: String(dayjs()),
                  action: "update",
                  message: "Le sav(s) ont été rechargés",
                  component: "home",
                };
                await handleOnRefetch(message);
              }}
            >
              <RefreshIcon />
            </Button>
            <Typography
              variant="h3"
              gutterBottom
              style={{
                fontFamily: "lato",
                marginTop: "10px",
              }}
            >
              SAV
            </Typography>
            <Button
              onClick={() => {
                navigate(`cl`);
              }}
            >
              Editer
            </Button>
          </div>
          {renderClientAssList()}
        </div>
      </Box>
    </Container>
  );
}
